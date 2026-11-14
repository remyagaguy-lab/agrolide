import 'server-only'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import type { CategoriePush } from '@/lib/push/categories'
import { diffuserPush } from '@/lib/push/envoyer.server'
import { AGROLIDE_ID, estOrganisation } from './organisation'

export interface Publication {
  /** Qui publie : `poste_par` d'une opportunité ; le compte agrolide pour un événement publié depuis l'administration. */
  auteurId: string | null | undefined
  type: 'evenement' | 'opportunite'
  categorie: CategoriePush
  /** Message d'alerte d'intérêt général (inchangé pour les publications d'un simple membre). */
  titreAlerte: string
  titre: string
  lien: string
  tag: string
  /** Faux : pas de nouvelle ligne dans la cloche (renvoi manuel d'une alerte déjà annoncée). */
  cloche?: boolean
  /** Vrai : rien n'est envoyé si l'auteur n'est pas une organisation (pas de diffusion générale nouvelle). */
  seulementOrganisation?: boolean
}

async function organisation(auteurId: string | null | undefined) {
  if (!auteurId) return null
  const u = await db.query.users.findFirst({ columns: { id: true, prenom: true, nom: true, organisation: true, categorie: true }, where: eq(users.id, auteurId) })
  if (!u || !estOrganisation(u.id, u.categorie)) return null
  const nom = u.organisation?.trim() || `${u.prenom ?? ''} ${u.nom ?? ''}`.trim() || 'agrolide'
  return { id: u.id, nom }
}

/**
 * Annonce une publication.
 * - Auteur = organisation (compte agrolide, profil Partenaire) : seuls ses abonnés qui ont gardé les alertes reçoivent
 *   une notification dans la cloche et, selon leurs réglages de catégorie, une alerte push. Un abonné qui ne suit plus
 *   l'organisation ne reçoit rien.
 * - Autre auteur : alerte push d'intérêt général à tous les appareils qui ont activé la catégorie (comportement d'origine).
 * Ne lève jamais d'erreur. Renvoie le nombre d'appareils joints.
 */
export async function annoncerPublication(p: Publication): Promise<number> {
  try {
    const org = await organisation(p.auteurId ?? (p.type === 'evenement' ? AGROLIDE_ID : null))
    if (!org && p.seulementOrganisation) return 0
    if (!org) return await diffuserPush(p.categorie, { titre: p.titreAlerte, corps: p.titre, lien: p.lien, tag: p.tag }, [p.auteurId])

    if (p.cloche !== false) {
      const contenu = `${org.nom} a publié : « ${p.titre} »`.slice(0, 300)
      await db.run(sql`
        INSERT INTO notifications (id, user_id, type, contenu, lien, lu, created_at)
        SELECT lower(hex(randomblob(16))), s.suiveur_id, ${p.type}, ${contenu}, ${p.lien}, 0, ${new Date().toISOString()}
        FROM suivis_organisations s
        WHERE s.organisation_id = ${org.id} AND s.notifier = 1 AND s.suiveur_id <> ${org.id}
      `)
    }
    return await diffuserPush(
      p.categorie,
      { titre: org.nom, corps: `${p.titreAlerte} : ${p.titre}`, lien: p.lien, tag: p.tag },
      [org.id],
      { abonnesDe: org.id },
    )
  } catch (e) {
    console.error('[suivi] annonce de publication impossible :', e)
    return 0
  }
}
