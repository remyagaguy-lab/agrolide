import { redirect } from "next/navigation"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { parseList } from "@/lib/reseau/profil"
import { buttonVariants } from "@/components/ui/Button"
import { ProfilForm } from "./ProfilForm"

export const metadata = { title: "Modifier mon profil" }

export default async function ProfilModifierPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login?next=/membres/profil/modifier")

  const [row] = await db
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
      langues: users.langues,
      linkedin_url: users.linkedin_url,
      site_web_url: users.site_web_url,
      photo_url: users.photo_url,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  if (!row) redirect("/login")

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-headline-md text-on-surface">Modifier mon profil</h1>
        <p className="text-body-md text-on-surface-variant">
          Ces informations s’affichent sur votre carte dans l’annuaire des membres.
        </p>
        <Link href="/membres/profil/confidentialite" className={buttonVariants({ variant: "text", size: "sm" })}>
          <ShieldCheck className="size-5" aria-hidden />
          Gérer la confidentialité de mon profil
        </Link>
      </header>

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
