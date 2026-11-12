import 'server-only'
import { and, desc, eq, or, sql, type SQL } from 'drizzle-orm'
import type { AnyColumn } from 'drizzle-orm'
import { db } from '@/db'
import { user_blocks, users } from '@/db/schema'

/**
 * Condition SQL « aucun blocage, dans un sens ou dans l'autre, entre le membre connecté et `colonne` ».
 * Le blocage rend les deux membres invisibles l'un pour l'autre (annuaire, suggestions, fiche) : une seule règle, appliquée partout.
 */
export const sansBloques = (viewerId: string, colonne: AnyColumn | SQL): SQL =>
  sql`not exists (select 1 from user_blocks ub where (ub.blocker_id = ${viewerId} and ub.blocked_id = ${colonne}) or (ub.blocked_id = ${viewerId} and ub.blocker_id = ${colonne}))`

/** `true` si l'un des deux membres a bloqué l'autre. */
export async function existeBlocage(a: string, b: string): Promise<boolean> {
  const [row] = await db
    .select({ id: user_blocks.id })
    .from(user_blocks)
    .where(
      or(
        and(eq(user_blocks.blocker_id, a), eq(user_blocks.blocked_id, b)),
        and(eq(user_blocks.blocker_id, b), eq(user_blocks.blocked_id, a)),
      ),
    )
    .limit(1)
  return Boolean(row)
}

export interface MembreBloque {
  id: string
  nom: string
  photo_url: string | null
  specialite: string | null
  depuis: string
}

/** Les membres que j'ai bloqués (200 au plus) : nom, photo et spécialité, jamais d'e-mail ni de téléphone. */
export async function fetchMembresBloques(viewerId: string): Promise<MembreBloque[]> {
  const rows = await db
    .select({
      id: users.id,
      prenom: users.prenom,
      nom: users.nom,
      photo_url: users.photo_url,
      specialite: users.specialite,
      depuis: user_blocks.created_at,
    })
    .from(user_blocks)
    .innerJoin(users, eq(users.id, user_blocks.blocked_id))
    .where(eq(user_blocks.blocker_id, viewerId))
    .orderBy(desc(user_blocks.created_at))
    .limit(200)
  return rows.map((r) => ({
    id: r.id,
    nom: `${r.prenom ?? ''} ${r.nom ?? ''}`.trim() || 'Membre agrolide',
    photo_url: r.photo_url,
    specialite: r.specialite,
    depuis: r.depuis,
  }))
}
