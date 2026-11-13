'use server'

import { desc, eq, isNull, and } from 'drizzle-orm'
import { db } from '@/db'
import { codes_acces_formation, formations, users } from '@/db/schema'
import { requireAdmin } from '@/lib/auth/admin'
import { genererCode } from '@/lib/formations/acces.server'
import { nettoyerTextes } from '@/lib/utils/sans-emoji'

export interface CodeAcces {
  id: string
  code: string
  lot: string | null
  formationId: string | null
  formationTitre: string | null
  expireLe: string | null
  utilisePar: string | null
  utiliseLe: string | null
  creeLe: string | null
}

async function exigerAdmin() {
  const a = await requireAdmin()
  if (!a.ok) throw new Error('Privilèges insuffisants')
}

/** Formations Agrolide (hors formations externes) pour lesquelles un code a un sens. */
export async function formationsPourCodes() {
  await exigerAdmin()
  const toutes = await db.select({ id: formations.id, titre: formations.titre, lien: formations.lien_externe }).from(formations)
  return toutes.filter((f) => !f.lien).map((f) => ({ id: f.id, titre: f.titre }))
}

export async function listerCodes(): Promise<CodeAcces[]> {
  await exigerAdmin()
  const lignes = await db
    .select({
      id: codes_acces_formation.id,
      code: codes_acces_formation.code,
      lot: codes_acces_formation.lot,
      formationId: codes_acces_formation.formation_id,
      formationTitre: formations.titre,
      expireLe: codes_acces_formation.expire_le,
      utilisePar: codes_acces_formation.utilise_par,
      utiliseLe: codes_acces_formation.utilise_le,
      creeLe: codes_acces_formation.created_at,
      prenom: users.prenom,
      nom: users.nom,
    })
    .from(codes_acces_formation)
    .leftJoin(formations, eq(codes_acces_formation.formation_id, formations.id))
    .leftJoin(users, eq(codes_acces_formation.utilise_par, users.id))
    .orderBy(desc(codes_acces_formation.created_at))
    .limit(1000)
  return lignes.map((l) => ({
    id: l.id,
    code: l.code,
    lot: l.lot,
    formationId: l.formationId,
    formationTitre: l.formationTitre,
    expireLe: l.expireLe,
    utilisePar: l.utilisePar ? [l.prenom, l.nom].filter(Boolean).join(' ') || 'Membre' : null,
    utiliseLe: l.utiliseLe,
    creeLe: l.creeLe,
  }))
}

/** Génère un lot de codes à usage unique pour un challenge. */
export async function genererLot(entree: { lot: string; formationId: string | null; nombre: number; expireLe: string | null }) {
  await exigerAdmin()
  const { lot } = nettoyerTextes({ lot: entree.lot.trim() })
  if (!lot) throw new Error('Donnez un nom au challenge.')
  const nombre = Math.floor(entree.nombre)
  if (!(nombre >= 1 && nombre <= 200)) throw new Error('Le nombre de codes doit être compris entre 1 et 200.')
  const expireLe = entree.expireLe ? new Date(`${entree.expireLe}T23:59:59`).toISOString() : null

  const codes = new Set<string>()
  while (codes.size < nombre) codes.add(genererCode())
  const maintenant = new Date().toISOString()
  // Par paquets : D1 limite le nombre de paramètres par requête.
  const liste = [...codes]
  for (let i = 0; i < liste.length; i += 10) {
    await db.insert(codes_acces_formation).values(
      liste.slice(i, i + 10).map((code) => ({ code, lot, formation_id: entree.formationId, expire_le: expireLe, created_at: maintenant })),
    )
  }
  return { nombre }
}

/** Supprime un code qui n'a pas encore servi. */
export async function supprimerCode(id: string) {
  await exigerAdmin()
  await db.delete(codes_acces_formation).where(and(eq(codes_acces_formation.id, id), isNull(codes_acces_formation.utilise_par)))
}
