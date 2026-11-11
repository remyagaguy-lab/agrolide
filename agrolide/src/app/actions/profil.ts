'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { LANGUES, PAYS, PAYS_AUTRE, THEMATIQUES, parseList } from '@/lib/reseau/profil'
import { profilSchema } from '@/lib/reseau/profil-schema'

export type ResultatProfil =
  | { success: true }
  | { success: false; error: string; champs?: Record<string, string> }

const vide = (v: string) => (v ? v : null)

/**
 * Enregistre le profil. Toute la validation est refaite ici (le formulaire n'est qu'un confort) :
 * liens https uniquement, choix limités aux listes proposées (les valeurs déjà enregistrées restent acceptées,
 * pour ne rien perdre des profils existants).
 */
export async function updateProfil(payload: unknown): Promise<ResultatProfil> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Votre session a expiré. Reconnectez-vous pour enregistrer votre profil.' }

  const parsed = profilSchema.safeParse(payload)
  if (!parsed.success) {
    const champs: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const cle = String(issue.path[0] ?? '')
      if (cle && !champs[cle]) champs[cle] = issue.message
    }
    return { success: false, error: 'Certains champs sont à corriger.', champs }
  }
  const v = parsed.data

  const [actuel] = await db
    .select({ pays: users.pays, secteurs_expertise: users.secteurs_expertise, langues: users.langues })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  if (!actuel) return { success: false, error: 'Profil introuvable.' }

  const champs: Record<string, string> = {}
  const paysOk = !v.pays || v.pays === PAYS_AUTRE || (PAYS as readonly string[]).includes(v.pays) || v.pays === actuel.pays
  if (!paysOk) champs.pays = 'Choisissez un pays dans la liste.'
  const themesAutorises = new Set<string>([...THEMATIQUES, ...parseList(actuel.secteurs_expertise)])
  if (v.thematiques.some((t) => !themesAutorises.has(t))) champs.thematiques = 'Choisissez des thématiques dans la liste.'
  const languesAutorisees = new Set<string>([...LANGUES, ...parseList(actuel.langues)])
  if (v.langues.some((l) => !languesAutorisees.has(l))) champs.langues = 'Choisissez des langues dans la liste.'
  if (Object.keys(champs).length > 0) return { success: false, error: 'Certains champs sont à corriger.', champs }

  await db
    .update(users)
    .set({
      prenom: v.prenom,
      nom: v.nom,
      organisation: vide(v.organisation),
      specialite: vide(v.specialite),
      pays: vide(v.pays),
      ville: vide(v.ville),
      niveau_etudes: vide(v.niveau_etudes),
      biographie: vide(v.biographie),
      secteurs_expertise: v.thematiques.length ? JSON.stringify(v.thematiques) : null,
      langues: v.langues.length ? JSON.stringify(v.langues) : null,
      linkedin_url: vide(v.linkedin_url),
      site_web_url: vide(v.site_web_url),
      updated_at: new Date().toISOString(),
    })
    .where(eq(users.id, userId))

  revalidatePath('/membres/profil')
  revalidatePath('/membres/dashboard')
  revalidatePath('/membres/annuaire')
  return { success: true }
}

const confidentialiteSchema = z.object({ annuaire_visible: z.boolean(), ouvert_contact: z.boolean() })

/** Réglages de confidentialité : présence dans l'annuaire et les suggestions, ouverture aux invitations. */
export async function updateConfidentialite(payload: unknown): Promise<ResultatProfil> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Votre session a expiré. Reconnectez-vous pour enregistrer vos choix.' }
  const parsed = confidentialiteSchema.safeParse(payload)
  if (!parsed.success) return { success: false, error: 'Réglage invalide.' }

  await db
    .update(users)
    .set({
      annuaire_visible: parsed.data.annuaire_visible,
      ouvert_contact: parsed.data.ouvert_contact,
      updated_at: new Date().toISOString(),
    })
    .where(eq(users.id, userId))

  revalidatePath('/membres/profil/confidentialite')
  revalidatePath('/membres/dashboard')
  revalidatePath('/membres/annuaire')
  return { success: true }
}

export async function updateAvatarUrl(url: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Non autorisé")
  }

  await db.update(users).set({
    photo_url: url,
    updated_at: new Date().toISOString()
  }).where(eq(users.id, userId))

  revalidatePath('/membres/profil')
}

export async function getCurrentUserCategory() {
  const { userId } = await auth();
  if (!userId) return null;
  const userRows = await db.select({
    categorie: users.categorie
  })
  .from(users)
  .where(eq(users.id, userId))
  .limit(1);
  return userRows[0]?.categorie || 'professionnel';
}
