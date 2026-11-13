import { redirect } from "next/navigation"
import Link from "next/link"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { parseList, type MemberSummary } from "@/lib/reseau/profil"
import { carteDepuis } from "@/lib/reseau/carte-publique"
import { fetchMembresBloques } from "@/lib/reseau/blocage.server"
import { MembresBloquesListe } from "@/components/modules/reseau/MembresBloquesListe"
import { buttonVariants } from "@/components/ui/Button"
import { ConfidentialiteForm } from "./ConfidentialiteForm"

import { ChevronLeft } from "@/components/ui/icons"
export const metadata = { title: "Confidentialité du profil", robots: { index: false, follow: false } }

export default async function ConfidentialitePage() {
  const { userId } = await auth()
  if (!userId) redirect("/login?next=/membres/profil/confidentialite")

  const [row] = await db
    .select({
      id: users.id,
      prenom: users.prenom,
      nom: users.nom,
      photo_url: users.photo_url,
      specialite: users.specialite,
      organisation: users.organisation,
      pays: users.pays,
      ville: users.ville,
      categorie: users.categorie,
      secteurs_expertise: users.secteurs_expertise,
      annuaire_visible: users.annuaire_visible,
      ouvert_contact: users.ouvert_contact,
      profil_public: users.profil_public,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  if (!row) redirect("/login")
  const bloques = await fetchMembresBloques(userId).catch(() => [])

  // Carte telle que les autres membres la voient : mêmes champs que dans l'annuaire, jamais d'e-mail ni de téléphone.
  const apercu: MemberSummary = {
    id: row.id,
    prenom: row.prenom,
    nom: row.nom,
    photo_url: row.photo_url,
    specialite: row.specialite,
    organisation: row.organisation,
    pays: row.pays,
    ville: row.ville,
    categorie: row.categorie,
    thematiques: parseList(row.secteurs_expertise),
    ouvert_contact: row.ouvert_contact,
    state: "none",
    connectionId: null,
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <Link href="/membres/profil" className={buttonVariants({ variant: "text", className: "-ml-3" })}>
          <ChevronLeft className="size-5" aria-hidden />
          Mon profil
        </Link>
        <h1 className="text-headline-md text-on-surface">Confidentialité du profil</h1>
        <p className="text-body-md text-on-surface-variant">
          Choisissez comment les autres membres peuvent vous trouver et vous contacter. Votre e-mail et votre téléphone ne sont jamais affichés aux autres membres.
        </p>
      </header>

      <ConfidentialiteForm
        initial={{ annuaireVisible: row.annuaire_visible !== false, ouvertContact: row.ouvert_contact !== false, profilPublic: row.profil_public === true }}
        apercu={apercu}
        carte={carteDepuis(row)}
      />

      <MembresBloquesListe initial={bloques} />
    </div>
  )
}
