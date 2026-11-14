"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth/server"
import { revalidatePath } from "next/cache"
import { estCategorie, libelleCategorie } from "@/lib/adhesion"
import { demandeValidation } from "@/lib/categorie"
import { appliquerChangement, notifierAdminsDemandeCategorie } from "@/lib/categorie.server"
import { notifier } from "@/lib/notifications.server"
import { typeOrganisationSchema } from "@/lib/reseau/profil-schema"

export async function submitOnboarding(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Non autorisé." }
    }

    // La catégorie ne se choisit qu'une fois ici : ensuite elle se change depuis « Modifier mon profil »
    // (avec validation administrateur pour Partenaire et Sénior), sans contourner ces règles par cette action.
    const [existant] = await db.select({ categorie: users.categorie }).from(users).where(eq(users.id, userId)).limit(1)
    if (existant?.categorie) {
      return { success: false, error: "Votre profil est déjà complété. Pour changer de catégorie, rendez-vous dans « Modifier mon profil »." }
    }

    const categorie = formData.get("categorie") as string
    const biographie = formData.get("biographie") as string
    const specialite = formData.get("specialite") as string
    const pays = formData.get("pays") as string
    const ville = formData.get("ville") as string

    if (!categorie || !['passionne', 'junior', 'professionnel', 'partenaire', 'senior'].includes(categorie)) {
      return { success: false, error: "Catégorie invalide." }
    }
    
    // Partenaire : le type d'organisation est demandé (liste proposée ou saisie libre) ; les autres catégories n'en ont pas.
    let typeOrganisation: string | null = null
    let nomOrganisation: string | null = null
    if (categorie === 'partenaire') {
      nomOrganisation = String(formData.get("nom_organisation") ?? "").trim()
      if (nomOrganisation.length < 2 || nomOrganisation.length > 120) {
        return { success: false, error: "Indiquez le nom de votre organisation (2 à 120 caractères)." }
      }
      const saisi = String(formData.get("type_organisation") ?? "").trim()
      const ok = typeOrganisationSchema.safeParse(saisi)
      if (!ok.success) {
        return { success: false, error: saisi ? "Type d'organisation : " + ok.error.issues[0].message : "Choisissez le type de votre organisation (association, ONG, coopérative, autre…)." }
      }
      typeOrganisation = ok.data
    }

    if (!pays || !ville) {
      return { success: false, error: "Le pays et la ville sont obligatoires." }
    }

    await db.update(users)
      .set({
        // Partenaire et Sénior demandent la validation d'un administrateur : en attendant, le membre est Professionnel.
        categorie: estCategorie(categorie) && demandeValidation(categorie) ? "professionnel" : categorie,
        biographie: biographie || null,
        specialite: specialite || null,
        type_organisation: typeOrganisation,
        // Une organisation s'inscrit sous son nom : pas de prénom.
        ...(nomOrganisation ? { prenom: null, nom: nomOrganisation, name: nomOrganisation, organisation: nomOrganisation } : {}),
        pays: pays,
        ville: ville,
        updated_at: new Date().toISOString()
      })
      .where(eq(users.id, userId))

    if (estCategorie(categorie) && demandeValidation(categorie)) {
      try {
        const res = await appliquerChangement(userId, categorie)
        await notifier(userId, { type: "cotisation", contenu: res.message, lien: "/membres/profil/modifier" })
        await notifierAdminsDemandeCategorie(`Un nouveau membre demande le profil « ${libelleCategorie(categorie)} » à l'inscription.`)
      } catch (e) {
        console.error("Demande de catégorie à l'inscription non enregistrée:", e)
      }
    }

    revalidatePath("/membres/dashboard")
    revalidatePath("/annuaire")
    
    return { success: true }
  } catch (err: any) {
    console.error("Erreur submitOnboarding:", err)
    return { success: false, error: err.message || "Une erreur s'est produite." }
  }
}
