'use server'

import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { opportunites, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { nettoyerTextes } from "@/lib/utils/sans-emoji"

/** Les opportunités publiées, les plus récentes d'abord. */
export async function getOpportunites() {
  const data = await db.query.opportunites.findMany({
    where: eq(opportunites.statut, 'publie'),
    orderBy: (opportunites, { desc }) => [desc(opportunites.created_at)]
  })
  
  return data
}

const TYPES_OPPORTUNITE = ['emploi', 'stage', 'formation', 'bourse', 'appel', 'partenariat', 'financement', 'autre']
const texte = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/**
 * Propose une opportunité. Le statut est décidé ICI, côté serveur : seule une personne dont le rôle de plateforme est
 * admin ou super_admin publie directement ; toute autre proposition attend la validation d'un administrateur.
 * Seuls les champs connus sont retenus (le navigateur ne peut imposer ni le statut, ni l'identifiant, ni l'auteur).
 */
export async function submitOpportunity(formData: Record<string, unknown>) {
  const { userId } = await auth()
  if (!userId) throw new Error("Vous devez être connecté pour soumettre une opportunité.")

  const profil = await db.query.users.findFirst({ columns: { role_plateforme: true }, where: eq(users.id, userId) })
  const estAdmin = profil?.role_plateforme === 'admin' || profil?.role_plateforme === 'super_admin'

  const nettoye = nettoyerTextes(formData) as Record<string, unknown>
  const titre = texte(nettoye.titre, 200)
  if (!titre) throw new Error("Le titre est obligatoire.")
  const type = texte(nettoye.type_opp, 40)
  const lien = texte(nettoye.lien_externe, 500)
  if (lien && !/^https:\/\//i.test(lien)) throw new Error("Le lien doit commencer par https://")
  const limite = texte(nettoye.date_limite, 40)
  const dateLimite = limite && !Number.isNaN(new Date(limite).getTime()) ? new Date(limite).toISOString() : null

  await db.insert(opportunites).values({
    titre,
    description: texte(nettoye.description, 5000) || null,
    type_opp: TYPES_OPPORTUNITE.includes(type) ? type : 'autre',
    pays: texte(nettoye.lieu, 120) || null,
    lien_externe: lien || null,
    date_limite: dateLimite,
    poste_par: userId,
    statut: estAdmin ? 'publie' : 'en_attente',
    created_at: new Date().toISOString(),
  })

  return { success: true, publie: estAdmin }
}
