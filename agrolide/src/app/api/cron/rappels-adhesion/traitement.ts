import "server-only"
import { and, eq, inArray, isNotNull, isNull, lte, ne, or, sql } from "drizzle-orm"
import { Resend } from "resend"
import { db } from "@/db"
import { cotisations, demandes_categorie, rappels_adhesion, users } from "@/db/schema"
import {
  FIN_ADHESION_GRATUITE,
  categorieSansCotisation,
  joursAvant,
  libelleCategorie,
  paiementOuvert,
} from "@/lib/adhesion"
import { notifier } from "@/lib/notifications.server"
import { construireRappel, type TypeRappel } from "./email"

/** Plafond d'e-mails par exécution : Resend limite le débit (2 requêtes par seconde) et une fonction a une durée maximale. */
const MAX_EMAILS_PAR_EXECUTION = 40
const PAUSE_ENTRE_EMAILS_MS = 600
const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms))

export interface RapportRappels {
  date: string
  expires: number
  categoriesAppliquees: number
  rappelsEnvoyes: Record<TypeRappel, number>
  rappelsEnAttente: number
  erreurs: string[]
}

interface Candidat {
  id: string
  email: string
  prenom: string | null
  categorie: string | null
  statut: string
  origine: "gratuite" | "payante"
  echeance: string
  jours: number
}

/** Palier du jour : le plus proche non dépassé. Permet de rattraper un jour manqué sans jamais renvoyer un palier déjà envoyé. */
export function palierDuJour(jours: number): TypeRappel | null {
  if (jours === 0) return "j0"
  if (jours >= 1 && jours <= 7) return "j7"
  if (jours >= 8 && jours <= 30) return "j30"
  return null
}

const PRIORITE: Record<TypeRappel, number> = { j0: 0, j7: 1, j30: 2 }

/**
 * Tâche quotidienne des adhésions :
 *  1. applique les changements de catégorie programmés arrivés à échéance ;
 *  2. passe à « expire » les adhésions dont l'échéance est dépassée ;
 *  3. envoie (e-mail + cloche) les rappels J-30, J-7 et jour J, une seule fois chacun.
 *
 * Échéance d'un membre : fin de sa dernière cotisation payée si elle court encore, sinon fin de l'année gratuite.
 * Les profils Passionné (gratuits sans limite) et les membres suspendus sont ignorés.
 */
export async function executerRappelsAdhesion(maintenant: Date = new Date()): Promise<RapportRappels> {
  const aujourdhui = maintenant.toISOString().slice(0, 10)
  const rapport: RapportRappels = {
    date: aujourdhui,
    expires: 0,
    categoriesAppliquees: 0,
    rappelsEnvoyes: { j30: 0, j7: 0, j0: 0 },
    rappelsEnAttente: 0,
    erreurs: [],
  }

  // 1. Changements de catégorie programmés (baisse à la prochaine échéance)
  try {
    const dues = await db
      .select({ id: demandes_categorie.id, user_id: demandes_categorie.user_id, categorie: demandes_categorie.categorie_demandee })
      .from(demandes_categorie)
      .where(and(eq(demandes_categorie.statut, "programmee"), isNotNull(demandes_categorie.effet_le), lte(demandes_categorie.effet_le, aujourdhui)))
    for (const d of dues) {
      await db.update(users).set({ categorie: d.categorie, updated_at: maintenant.toISOString() }).where(eq(users.id, d.user_id))
      await db.update(demandes_categorie).set({ statut: "acceptee", traite_le: maintenant.toISOString() }).where(eq(demandes_categorie.id, d.id))
      await notifier(d.user_id, { type: "cotisation", contenu: `Votre catégorie est désormais « ${libelleCategorie(d.categorie)} », comme prévu.`, lien: "/membres/profil/modifier" })
      rapport.categoriesAppliquees++
    }
  } catch (e) {
    rapport.erreurs.push(`catégories programmées : ${(e as Error).message}`)
  }

  // 2. Échéances de chaque membre
  const membres = await db
    .select({ id: users.id, email: users.email, prenom: users.prenom, categorie: users.categorie, statut: users.statut_adhesion })
    .from(users)
    .where(and(inArray(users.statut_adhesion, ["gratuit", "actif"]), isNotNull(users.categorie), ne(users.categorie, "passionne"), or(isNull(users.est_organisation), eq(users.est_organisation, false))))
  const payees = await db
    .select({ membre_id: cotisations.membre_id, fin: sql<string | null>`max(${cotisations.date_fin})` })
    .from(cotisations)
    .where(eq(cotisations.statut, "valide"))
    .groupBy(cotisations.membre_id)
  const finPayee = new Map(payees.map((p) => [p.membre_id, p.fin ? p.fin.slice(0, 10) : null]))

  const candidats: Candidat[] = []
  for (const m of membres) {
    const statut = m.statut ?? "gratuit"
    if (categorieSansCotisation(m.categorie)) continue
    const fin = finPayee.get(m.id) ?? null
    let origine: Candidat["origine"]
    let echeance: string
    if (fin && (statut === "actif" || joursAvant(fin, maintenant) >= 0)) {
      origine = "payante"
      echeance = fin
    } else if (statut === "gratuit") {
      origine = "gratuite"
      echeance = FIN_ADHESION_GRATUITE
    } else {
      continue // « actif » posé à la main par un administrateur, sans date : rien d'automatique
    }
    candidats.push({ id: m.id, email: m.email, prenom: m.prenom, categorie: m.categorie, statut, origine, echeance, jours: joursAvant(echeance, maintenant) })
  }

  // 2b. Échéance dépassée : l'adhésion expire
  for (const c of candidats.filter((x) => x.jours < 0)) {
    try {
      await db.update(users).set({ statut_adhesion: "expire", updated_at: maintenant.toISOString() }).where(and(eq(users.id, c.id), eq(users.statut_adhesion, c.statut)))
      await notifier(c.id, {
        type: "cotisation",
        contenu: c.origine === "gratuite"
          ? "Votre année d'adhésion gratuite est terminée. Réglez votre cotisation pour retrouver tous les services."
          : "Votre adhésion a expiré. Renouvelez votre cotisation pour retrouver tous les services.",
        lien: "/membres/cotisation",
      })
      rapport.expires++
    } catch (e) {
      rapport.erreurs.push(`expiration ${c.id} : ${(e as Error).message}`)
    }
  }

  // 3. Rappels
  const aRappeler = candidats
    .map((c) => ({ c, type: palierDuJour(c.jours) }))
    .filter((x): x is { c: Candidat; type: TypeRappel } => x.type !== null)
  if (aRappeler.length === 0) return rapport

  if (!process.env.RESEND_API_KEY) {
    rapport.erreurs.push("RESEND_API_KEY absente : aucun rappel envoyé")
    rapport.rappelsEnAttente = aRappeler.length
    return rapport
  }
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Rappels déjà envoyés pour ces échéances (lecture groupée ; l'unicité en base reste le vrai garde-fou).
  const echeances = [...new Set(aRappeler.map((x) => x.c.echeance))]
  const dejaEnvoyes = await db
    .select({ user_id: rappels_adhesion.user_id, type: rappels_adhesion.type, echeance: rappels_adhesion.echeance })
    .from(rappels_adhesion)
    .where(inArray(rappels_adhesion.echeance, echeances))
  const vus = new Set(dejaEnvoyes.map((r) => `${r.user_id}|${r.type}|${r.echeance}`))

  const file = aRappeler
    .filter((x) => !vus.has(`${x.c.id}|${x.type}|${x.c.echeance}`))
    .sort((a, b) => PRIORITE[a.type] - PRIORITE[b.type] || a.c.jours - b.c.jours)

  let envoyes = 0
  for (const { c, type } of file) {
    if (envoyes >= MAX_EMAILS_PAR_EXECUTION) {
      rapport.rappelsEnAttente++
      continue
    }
    // 1) réserver le rappel (clé unique : si une autre exécution l'a déjà pris, l'insertion échoue et on passe)
    try {
      await db.insert(rappels_adhesion).values({ user_id: c.id, type, echeance: c.echeance, envoye_le: maintenant.toISOString() })
    } catch {
      continue
    }
    // 2) envoyer l'e-mail ; en cas d'échec on libère la réservation pour retenter à la prochaine exécution
    const texte = construireRappel({
      prenom: c.prenom,
      categorie: c.categorie,
      type,
      jours: c.jours,
      echeance: c.echeance,
      origine: c.origine,
      paiementOuvert: paiementOuvert(maintenant),
    })
    try {
      const { error } = await resend.emails.send({ from: "agrolide <noreply@agrolide.org>", to: c.email, subject: texte.sujet, html: texte.html })
      if (error) throw new Error(error.message)
    } catch (e) {
      rapport.erreurs.push(`e-mail ${c.id} (${type}) : ${(e as Error).message}`)
      await db.delete(rappels_adhesion).where(and(eq(rappels_adhesion.user_id, c.id), eq(rappels_adhesion.type, type), eq(rappels_adhesion.echeance, c.echeance))).catch(() => {})
      continue
    }
    // 3) notification dans la cloche (ne lève jamais d'erreur)
    await notifier(c.id, { type: "cotisation", contenu: texte.notification, lien: "/membres/cotisation" })
    rapport.rappelsEnvoyes[type]++
    envoyes++
    await dormir(PAUSE_ENTRE_EMAILS_MS)
  }

  return rapport
}
