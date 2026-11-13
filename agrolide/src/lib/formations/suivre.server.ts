import 'server-only'
import { cache } from 'react'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { formations, progression_lecons } from '@/db/schema'

/**
 * Lectures partagées par le lecteur de cours : le layout (sommaire) et la page (leçon) les demandent
 * dans la même requête. `cache` de React les fait partir UNE seule fois par affichage de page
 * (un aller-retour D1 de moins chacune).
 */

/** Sommaire d'une formation : modules et leçons dans l'ordre (sans le contenu des leçons). */
export const structureFormation = cache((formationId: string) =>
  db.query.formations.findFirst({
    where: eq(formations.id, formationId),
    columns: { id: true, titre: true },
    with: {
      modules: {
        columns: { id: true, titre: true, ordre: true },
        orderBy: (modules, { asc }) => [asc(modules.ordre)],
        with: {
          lecons: {
            columns: { id: true, titre: true, ordre: true, module_id: true },
            orderBy: (lecons, { asc }) => [asc(lecons.ordre)],
          },
        },
      },
    },
  }),
)

/** Identifiants des leçons validées par le membre. */
export const leconsTerminees = cache((membreId: string) =>
  db.query.progression_lecons.findMany({
    columns: { lecon_id: true },
    where: eq(progression_lecons.membre_id, membreId),
  }),
)
