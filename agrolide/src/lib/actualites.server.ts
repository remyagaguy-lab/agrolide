import 'server-only'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { evenements, opportunites } from '@/db/schema'

export type TypeActualites = 'evenements' | 'opportunites' | 'tout'

/**
 * Événements et opportunités publiés, au format attendu par la page Agenda (`AgendaClient`).
 * Lu côté serveur par les pages publiques (le contenu arrive déjà dans le HTML) et par l'action `getActualites`
 * (bouton « Réessayer », rafraîchissement). Les deux requêtes sont indépendantes : elles partent ensemble.
 */
export async function chargerActualites(types: TypeActualites = 'tout') {
  const [eventsData, oppsData] = await Promise.all([
    types === 'opportunites'
      ? []
      : db.query.evenements.findMany({ where: eq(evenements.publie, true) }),
    types === 'evenements'
      ? []
      : db.query.opportunites.findMany({ where: eq(opportunites.statut, 'publie') }),
  ])

  const events = eventsData.map((e) => ({ ...e, _itemType: 'evenement' as const }))
  const opps = oppsData.map((o) => ({ ...o, _itemType: 'opportunite' as const }))

  const combined: Array<(typeof events)[number] | (typeof opps)[number]> = [...events, ...opps]

  combined.sort((a, b) => {
    const dateA = a._itemType === 'evenement' ? new Date(a.date_debut).getTime() : new Date(a.created_at ?? 0).getTime()
    const dateB = b._itemType === 'evenement' ? new Date(b.date_debut).getTime() : new Date(b.created_at ?? 0).getTime()
    return dateB - dateA
  })

  return combined
}
