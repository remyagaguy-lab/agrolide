'use server'

import { db } from '@/db'
import { demandes_categorie, users } from '@/db/schema'
import { and, eq, inArray } from 'drizzle-orm'
import { auth } from '@/lib/auth/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { PAYS, PAYS_AUTRE, THEMATIQUES, ecrireLangues, parseList } from '@/lib/reseau/profil'
import { profilSchema } from '@/lib/reseau/profil-schema'
import { CATEGORIES_ADHESION, libelleCategorie, type CategorieAdhesion } from '@/lib/adhesion'
import type { ModeChangement } from '@/lib/categorie'
import { appliquerChangement, notifierAdminsDemandeCategorie } from '@/lib/categorie.server'
import { notifier } from '@/lib/notifications.server'
import { nettoyerTextes } from "@/lib/utils/sans-emoji"

export type ResultatProfil =
  | { success: true }
  | { success: false; error: string; champs?: Record<string, string> }

const vide = (v: string) => (v ? v : null)

/**
 * Enregistre le profil. Toute la validation est refaite ici (le formulaire n'est qu'un confort) :
 * liens https uniquement, spécialités limitées à la liste proposée (les valeurs déjà enregistrées restent acceptées),
 * centres d'intérêt et langues : liste ou ajout libre court.
 */
export async function updateProfil(payload: unknown): Promise<ResultatProfil> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Votre session a expiré. Reconnectez-vous pour enregistrer votre profil.' }

  const parsed = profilSchema.safeParse(nettoyerTextes(payload))
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
    .select({ pays: users.pays, secteurs_expertise: users.secteurs_expertise })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  if (!actuel) return { success: false, error: 'Profil introuvable.' }

  const champs: Record<string, string> = {}
  const paysOk = !v.pays || v.pays === PAYS_AUTRE || (PAYS as readonly string[]).includes(v.pays) || v.pays === actuel.pays
  if (!paysOk) champs.pays = 'Choisissez un pays dans la liste.'
  const themesAutorises = new Set<string>([...THEMATIQUES, ...parseList(actuel.secteurs_expertise)])
  if (v.thematiques.some((t) => !themesAutorises.has(t))) champs.thematiques = 'Choisissez des thématiques dans la liste.'
  // Centres d'intérêt et langues : liste proposée ou ajout libre (validé par le schéma : texte court, sans emoji).
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
      centres_interet: v.centres_interet.length ? JSON.stringify(v.centres_interet) : null,
      langues: (() => { const l = ecrireLangues(v.langue_maternelle, v.langues); return l.length ? JSON.stringify(l) : null })(),
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

const confidentialiteSchema = z.object({ annuaire_visible: z.boolean(), ouvert_contact: z.boolean(), profil_public: z.boolean() })

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
      // Masquer son profil de l'annuaire coupe aussi la carte publique : jamais de carte sans présence dans l'annuaire.
      profil_public: parsed.data.annuaire_visible ? parsed.data.profil_public : false,
      updated_at: new Date().toISOString(),
    })
    .where(eq(users.id, userId))

  revalidatePath('/membres/profil/confidentialite')
  revalidatePath('/membres/dashboard')
  revalidatePath('/membres/annuaire')
  return { success: true }
}

const categorieSchema = z.object({ categorie: z.enum(CATEGORIES_ADHESION as [CategorieAdhesion, ...CategorieAdhesion[]]) })

export type ResultatCategorie =
  | { success: true; mode: ModeChangement; message: string }
  | { success: false; error: string }

const rafraichirCategorie = () => {
  for (const chemin of ['/membres/profil', '/membres/profil/modifier', '/membres/dashboard', '/membres/annuaire', '/membres/cotisation']) {
    revalidatePath(chemin)
  }
}

/**
 * Changement de catégorie en libre-service. Les règles (libre, validation administrateur pour Partenaire et Sénior,
 * régularisation / prochaine échéance une fois le paiement actif) sont dans `@/lib/categorie`, le client les rejoue seulement pour prévenir.
 */
export async function changerCategorie(payload: unknown): Promise<ResultatCategorie> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Votre session a expiré. Reconnectez-vous pour changer de catégorie.' }
  const parsed = categorieSchema.safeParse(payload)
  if (!parsed.success) return { success: false, error: 'Catégorie invalide.' }

  const [membre] = await db.select({ categorie: users.categorie, prenom: users.prenom, nom: users.nom }).from(users).where(eq(users.id, userId)).limit(1)
  if (!membre) return { success: false, error: 'Profil introuvable.' }
  if (!membre.categorie) return { success: false, error: 'Terminez d’abord votre inscription pour choisir une catégorie.' }

  let resultat
  try {
    resultat = await appliquerChangement(userId, parsed.data.categorie)
  } catch (e) {
    console.error('Erreur changerCategorie:', e)
    return { success: false, error: 'Le changement n’a pas pu être enregistré. Réessayez dans un instant.' }
  }
  if (resultat.mode === 'identique') return { success: true, mode: resultat.mode, message: resultat.message }

  await notifier(userId, { type: 'cotisation', contenu: resultat.message, lien: resultat.regularisationFcfa > 0 ? '/membres/cotisation' : '/membres/profil/modifier' })
  if (resultat.mode === 'validation') {
    const nomMembre = `${membre.prenom ?? ''} ${membre.nom ?? ''}`.trim() || 'Un membre'
    await notifierAdminsDemandeCategorie(`${nomMembre} demande le profil « ${libelleCategorie(parsed.data.categorie)} » (actuellement « ${libelleCategorie(membre.categorie)} »).`)
  }
  rafraichirCategorie()
  return { success: true, mode: resultat.mode, message: resultat.message }
}

/** Annule la demande de catégorie en cours (validation en attente ou changement programmé). */
export async function annulerDemandeCategorie(): Promise<{ success: true } | { success: false; error: string }> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Votre session a expiré. Reconnectez-vous.' }
  try {
    await db
      .update(demandes_categorie)
      .set({ statut: 'annulee', traite_le: new Date().toISOString() })
      .where(and(eq(demandes_categorie.user_id, userId), inArray(demandes_categorie.statut, ['en_attente', 'programmee'])))
  } catch (e) {
    console.error('Erreur annulerDemandeCategorie:', e)
    return { success: false, error: 'La demande n’a pas pu être annulée.' }
  }
  rafraichirCategorie()
  return { success: true }
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
