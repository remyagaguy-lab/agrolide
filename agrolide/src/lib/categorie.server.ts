import 'server-only'
import { and, eq, inArray, sql } from 'drizzle-orm'
import { db } from '@/db'
import { cotisations, demandes_categorie, users } from '@/db/schema'
import { formaterDate, formaterFcfa, libelleCategorie, type CategorieAdhesion } from '@/lib/adhesion'
import { evaluerChangement, type EvaluationChangement } from '@/lib/categorie'
import { notifier } from '@/lib/notifications.server'

/** Fin de la cotisation payée en cours (la plus lointaine parmi les cotisations validées), ou null. */
export async function finCotisationPayee(userId: string): Promise<string | null> {
  const [ligne] = await db
    .select({ fin: sql<string | null>`max(${cotisations.date_fin})` })
    .from(cotisations)
    .where(and(eq(cotisations.membre_id, userId), eq(cotisations.statut, 'valide')))
  return ligne?.fin ?? null
}

/** Message au membre pour un changement (le même texte sert à la notification et à la confirmation à l'écran). */
export function messageChangement(ev: EvaluationChangement, demandee: CategorieAdhesion): string {
  const nom = `« ${libelleCategorie(demandee)} »`
  switch (ev.mode) {
    case 'identique':
      return `Vous êtes déjà dans la catégorie ${nom}.`
    case 'validation':
      return `Votre demande de passage en ${nom} a été transmise. Un administrateur l'examine et vous serez prévenu(e) de sa décision.`
    case 'prochaine_echeance':
      return `Votre passage en ${nom} prendra effet le ${formaterDate(ev.effetLe ?? '')}, à la fin de votre cotisation en cours.`
    default:
      return ev.regularisationFcfa > 0
        ? `Votre catégorie est désormais ${nom}. Une régularisation de ${formaterFcfa(ev.regularisationFcfa)} est à régler dans « Ma cotisation ».`
        : `Votre catégorie est désormais ${nom}.`
  }
}

export interface ResultatApplication extends EvaluationChangement {
  message: string
}

/** Exécute une opération de journalisation sans jamais faire échouer le changement lui-même (table absente avant migration, etc.). */
async function tolerant(operation: () => Promise<unknown>) {
  try {
    await operation()
  } catch (e) {
    console.error('[categorie] journal des demandes indisponible :', e)
  }
}

/**
 * Applique (ou enregistre) un changement de catégorie selon les règles de `@/lib/categorie`.
 *  - `demandeId` : demande existante à traiter (validation par un administrateur) au lieu d'en créer une.
 *  - `dejaValide` : la validation de l'administrateur est acquise.
 * Lève une erreur si une demande doit être enregistrée et que la base refuse (migration non appliquée, par exemple).
 */
export async function appliquerChangement(
  userId: string,
  demandee: CategorieAdhesion,
  options: { demandeId?: string; dejaValide?: boolean; traitePar?: string } = {},
): Promise<ResultatApplication> {
  const [membre] = await db.select({ categorie: users.categorie }).from(users).where(eq(users.id, userId)).limit(1)
  if (!membre) throw new Error('Membre introuvable.')

  const ev = evaluerChangement({
    actuelle: membre.categorie,
    demandee,
    finCotisationPayee: await finCotisationPayee(userId),
    dejaValide: options.dejaValide,
  })
  const message = messageChangement(ev, demandee)
  if (ev.mode === 'identique') return { ...ev, message }

  const maintenant = new Date().toISOString()
  const ouvertes = and(eq(demandes_categorie.user_id, userId), inArray(demandes_categorie.statut, ['en_attente', 'programmee']))

  if (ev.mode === 'immediat') {
    await db.update(users).set({ categorie: demandee, updated_at: maintenant }).where(eq(users.id, userId))
    await tolerant(async () => {
      // Une demande ouverte plus ancienne n'a plus lieu d'être ; la demande traitée est conservée comme historique.
      if (options.demandeId) {
        await db.update(demandes_categorie).set({ statut: 'annulee', traite_le: maintenant }).where(and(ouvertes, sql`${demandes_categorie.id} <> ${options.demandeId}`))
        await db.update(demandes_categorie).set({ statut: 'acceptee', traite_le: maintenant, traite_par: options.traitePar ?? null, regularisation_fcfa: ev.regularisationFcfa || null }).where(eq(demandes_categorie.id, options.demandeId))
      } else {
        await db.update(demandes_categorie).set({ statut: 'annulee', traite_le: maintenant }).where(ouvertes)
        await db.insert(demandes_categorie).values({
          user_id: userId,
          categorie_avant: membre.categorie,
          categorie_demandee: demandee,
          statut: 'acceptee',
          regularisation_fcfa: ev.regularisationFcfa || null,
          created_at: maintenant,
          traite_le: maintenant,
        })
      }
    })
    return { ...ev, message }
  }

  // validation ou prochaine_echeance : la demande doit être enregistrée.
  const statut = ev.mode === 'validation' ? 'en_attente' : 'programmee'
  if (options.demandeId) {
    await db.update(demandes_categorie).set({ statut: 'annulee', traite_le: maintenant }).where(and(ouvertes, sql`${demandes_categorie.id} <> ${options.demandeId}`))
    await db.update(demandes_categorie).set({ statut, effet_le: ev.effetLe, traite_le: maintenant, traite_par: options.traitePar ?? null }).where(eq(demandes_categorie.id, options.demandeId))
  } else {
    await db.update(demandes_categorie).set({ statut: 'annulee', traite_le: maintenant }).where(ouvertes)
    await db.insert(demandes_categorie).values({
      user_id: userId,
      categorie_avant: membre.categorie,
      categorie_demandee: demandee,
      statut,
      effet_le: ev.effetLe,
      created_at: maintenant,
    })
  }
  return { ...ev, message }
}

/** Prévient les administrateurs qu'une demande de catégorie attend leur décision. */
export async function notifierAdminsDemandeCategorie(contenu: string): Promise<void> {
  try {
    const admins = await db
      .select({ id: users.id })
      .from(users)
      .where(inArray(users.role_plateforme, ['admin', 'admin_content', 'super_admin']))
    await Promise.all(admins.map((a) => notifier(a.id, { type: 'cotisation', contenu, lien: '/admin/membres/demandes-categorie' })))
  } catch (e) {
    console.error('[categorie] administrateurs non prévenus :', e)
  }
}
