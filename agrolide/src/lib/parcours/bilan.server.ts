import 'server-only'
import { and, count, eq, or } from 'drizzle-orm'
import { db } from '@/db'
import { certificats_formation, evenements, inscriptions_evenement, livrables_formation, telechargements, tentatives_examen, user_connections } from '@/db/schema'
import { repartirEvenements, resumerExamens, resumerLivrables } from './bilan'

/**
 * Bilan d'activité d'un membre, calculé uniquement à partir de lignes existantes (examens, livrables, certificats,
 * inscriptions aux événements, connexions, téléchargements). Une rubrique dont la table est absente (migration
 * non appliquée) vaut zéro : la page ne casse jamais pour un chiffre.
 */
export async function bilanParcours(userId: string) {
  async function sur<T>(tache: () => Promise<T>, defaut: T): Promise<T> {
    try {
      return await tache()
    } catch (e) {
      console.error('Bilan de parcours : rubrique indisponible', e)
      return defaut
    }
  }

  const [tentatives, livrables, certificats, inscrits, connexions, dl] = await Promise.all([
    sur(
      () =>
        db
          .select({ fin_le: tentatives_examen.fin_le, pourcent: tentatives_examen.pourcent, reussi: tentatives_examen.reussi })
          .from(tentatives_examen)
          .where(eq(tentatives_examen.membre_id, userId)),
      [],
    ),
    sur(() => db.select({ statut: livrables_formation.statut, note: livrables_formation.note }).from(livrables_formation).where(eq(livrables_formation.membre_id, userId)), []),
    sur(() => db.select({ niveau: certificats_formation.niveau }).from(certificats_formation).where(eq(certificats_formation.membre_id, userId)), []),
    sur(
      () =>
        db
          .select({ id: evenements.id, titre: evenements.titre, type_evt: evenements.type_evt, date_debut: evenements.date_debut })
          .from(inscriptions_evenement)
          .innerJoin(evenements, eq(evenements.id, inscriptions_evenement.evenement_id))
          .where(eq(inscriptions_evenement.membre_id, userId)),
      [],
    ),
    sur(async () => {
      const [r] = await db
        .select({ n: count() })
        .from(user_connections)
        .where(and(eq(user_connections.status, 'accepted'), or(eq(user_connections.requester_id, userId), eq(user_connections.receiver_id, userId))))
      return Number(r?.n ?? 0)
    }, 0),
    sur(async () => {
      const [r] = await db.select({ n: count() }).from(telechargements).where(eq(telechargements.membre_id, userId))
      return Number(r?.n ?? 0)
    }, 0),
  ])

  return {
    examens: resumerExamens(tentatives),
    livrables: resumerLivrables(livrables),
    certificats: {
      participation: certificats.filter((c) => c.niveau === 'participation').length,
      reussite: certificats.filter((c) => c.niveau === 'reussite').length,
    },
    evenements: repartirEvenements(inscrits),
    connexions,
    telechargements: dl,
  }
}

export type BilanParcours = Awaited<ReturnType<typeof bilanParcours>>
