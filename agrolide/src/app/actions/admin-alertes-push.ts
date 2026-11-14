'use server'

import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { evenements, opportunites, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { clesVapid } from '@/lib/push/webpush'
import { annoncerPublication } from '@/lib/suivi/annonce.server'
import { AGROLIDE_ID } from '@/lib/suivi/organisation'

/**
 * Alerte push manuelle, pour un contenu déjà publié (inséré en base ou publié sans passer par le formulaire).
 * Réservée aux admins ; même message, même catégorie et même tag que l'envoi automatique, donc une alerte déjà reçue
 * est remplacée sur l'appareil au lieu de s'empiler.
 */
async function verifierAdmin() {
  const { userId } = await auth()
  if (!userId) throw new Error('Non autorisé')
  const profil = await db.query.users.findFirst({ columns: { role_plateforme: true }, where: eq(users.id, userId) })
  if (!profil || (profil.role_plateforme !== 'admin' && profil.role_plateforme !== 'super_admin')) throw new Error('Privilèges insuffisants')
}

export interface ResultatAlerte {
  ok: boolean
  envoyes?: number
  message: string
}

export async function envoyerAlertePush(type: 'evenement' | 'opportunite', id: string): Promise<ResultatAlerte> {
  await verifierAdmin()
  if (!clesVapid()) return { ok: false, message: "Clés VAPID absentes ou invalides sur ce serveur : aucune alerte envoyée." }

  if (type === 'evenement') {
    const e = await db.query.evenements.findFirst({ columns: { titre: true, publie: true, date_debut: true, date_fin: true }, where: eq(evenements.id, id) })
    if (!e) return { ok: false, message: 'Événement introuvable.' }
    if (!e.publie) return { ok: false, message: "L'événement n'est pas publié." }
    const fin = new Date(e.date_fin || e.date_debut).getTime()
    if (!(fin > Date.now())) return { ok: false, message: "L'événement est terminé : l'alerte n'a plus d'intérêt." }
    const n = await annoncerPublication({ auteurId: AGROLIDE_ID, type: 'evenement', categorie: 'activite', titreAlerte: 'Nouvel événement', titre: e.titre, lien: `/membres/evenements/${id}`, tag: `evenement-${id}`, cloche: false })
    return { ok: true, envoyes: n, message: `Alerte envoyée à ${n} appareil${n > 1 ? 's' : ''}.` }
  }

  const o = await db.query.opportunites.findFirst({ columns: { titre: true, statut: true, poste_par: true }, where: eq(opportunites.id, id) })
  if (!o) return { ok: false, message: 'Opportunité introuvable.' }
  if (o.statut !== 'publie') return { ok: false, message: "L'opportunité n'est pas publiée." }
  const n = await annoncerPublication({ auteurId: o.poste_par, type: 'opportunite', categorie: 'opportunites', titreAlerte: 'Nouvelle opportunité', titre: o.titre, lien: '/membres/opportunites', tag: `opportunite-${id}`, cloche: false })
  return { ok: true, envoyes: n, message: `Alerte envoyée à ${n} appareil${n > 1 ? 's' : ''}.` }
}
