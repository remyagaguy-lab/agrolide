import { redirect } from "next/navigation"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { and, desc, eq, inArray } from "drizzle-orm"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { demandes_categorie, users } from "@/db/schema"
import { parseList } from "@/lib/reseau/profil"
import { buttonVariants } from "@/components/ui/Button"
import { finCotisationPayee } from "@/lib/categorie.server"
import { CategorieSection, type DemandeOuverte } from "./CategorieSection"
import { ProfilForm } from "./ProfilForm"

export const metadata = { title: "Modifier mon profil" }

export default async function ProfilModifierPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login?next=/membres/profil/modifier")

  // Demande de catégorie en cours et cotisation payée : la table peut manquer avant la migration, on affiche alors la page sans demande.
  const lireDemandeOuverte = async (): Promise<DemandeOuverte | null> => {
    try {
      const [d] = await db
        .select({ categorie: demandes_categorie.categorie_demandee, statut: demandes_categorie.statut, effetLe: demandes_categorie.effet_le })
        .from(demandes_categorie)
        .where(and(eq(demandes_categorie.user_id, userId), inArray(demandes_categorie.statut, ["en_attente", "programmee"])))
        .orderBy(desc(demandes_categorie.created_at))
        .limit(1)
      return d ? { categorie: d.categorie, statut: d.statut as DemandeOuverte["statut"], effetLe: d.effetLe } : null
    } catch (e) {
      console.error("[profil/modifier] demandes de catégorie indisponibles :", e)
      return null
    }
  }
  const lireFinCotisation = async (): Promise<string | null> => {
    try {
      return await finCotisationPayee(userId)
    } catch (e) {
      console.error("[profil/modifier] cotisation illisible :", e)
      return null
    }
  }

  // Les trois lectures sont indépendantes : elles partent ensemble (un aller-retour D1 au lieu de trois).
  const [[row], demandeOuverte, finCotisation] = await Promise.all([
    db
    .select({
      prenom: users.prenom,
      nom: users.nom,
      organisation: users.organisation,
      specialite: users.specialite,
      pays: users.pays,
      ville: users.ville,
      niveau_etudes: users.niveau_etudes,
      biographie: users.biographie,
      secteurs_expertise: users.secteurs_expertise,
      centres_interet: users.centres_interet,
      langues: users.langues,
      linkedin_url: users.linkedin_url,
      site_web_url: users.site_web_url,
      photo_url: users.photo_url,
      categorie: users.categorie,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1),
    lireDemandeOuverte(),
    lireFinCotisation(),
  ])
  if (!row) redirect("/login")

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-headline-md text-on-surface">Modifier mon profil</h1>
        <p className="text-body-md text-on-surface-variant">
          Ces informations s’affichent sur votre carte dans l’annuaire des membres.
        </p>
        <Link href="/membres/profil/confidentialite" className={buttonVariants({ variant: "text" })}>
          <ShieldCheck className="size-5" aria-hidden />
          Gérer la confidentialité de mon profil
        </Link>
      </header>

      <CategorieSection actuelle={row.categorie} finCotisationPayee={finCotisation} demandeOuverte={demandeOuverte} />

      <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
        <ProfilForm
          initial={{
            prenom: row.prenom ?? "",
            nom: row.nom ?? "",
            organisation: row.organisation ?? "",
            specialite: row.specialite ?? "",
            pays: row.pays ?? "",
            ville: row.ville ?? "",
            niveau_etudes: row.niveau_etudes ?? "",
            biographie: row.biographie ?? "",
            thematiques: parseList(row.secteurs_expertise),
            centres_interet: parseList(row.centres_interet),
            langues: parseList(row.langues),
            linkedin_url: row.linkedin_url ?? "",
            site_web_url: row.site_web_url ?? "",
            photo_url: row.photo_url ?? "",
          }}
        />
      </div>
    </div>
  )
}
