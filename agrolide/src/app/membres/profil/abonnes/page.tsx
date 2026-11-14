import { notFound, redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { Avatar } from "@/components/ui/Avatar"
import { AGROLIDE_ID, estOrganisation } from "@/lib/suivi/organisation"
import { abonnesDe } from "@/lib/suivi/suivis.server"

export const metadata = { title: "Mes abonnés", robots: { index: false, follow: false } }

/**
 * Abonnés d'une organisation : visibles par l'organisation seule (et par les administrateurs pour le compte agrolide).
 * Aucun autre membre ne voit ni cette liste ni son nombre.
 */
export default async function AbonnesPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login?next=/membres/profil/abonnes")

  const moi = await db.query.users.findFirst({ columns: { id: true, categorie: true, role_plateforme: true }, where: eq(users.id, userId) })
  if (!moi) redirect("/login")

  const admin = moi.role_plateforme === "admin" || moi.role_plateforme === "super_admin"
  const organisationId = estOrganisation(moi.id, moi.categorie) ? moi.id : admin ? AGROLIDE_ID : null
  if (!organisationId) notFound()

  const { total, abonnes } = await abonnesDe(organisationId)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-headline-sm font-bold text-on-surface">Mes abonnés</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {total === 0 ? "Personne ne vous suit pour l’instant." : `${total} membre${total > 1 ? "s" : ""} ${total > 1 ? "suivent" : "suit"} vos publications.`}{" "}
          Cette liste n’est visible que de vous.
        </p>
      </header>
      {abonnes.length > 0 && (
        <ul className="divide-y divide-outline-variant rounded-card border border-outline-variant bg-surface-container-lowest">
          {abonnes.map((a) => {
            const nom = `${a.prenom ?? ""} ${a.nom ?? ""}`.trim() || "Membre"
            return (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar src={a.photo_url} name={nom} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-label-lg font-bold text-on-surface">{nom}</p>
                  <p className="truncate text-body-sm text-on-surface-variant">
                    {[a.pays, a.depuis ? `abonné depuis le ${new Date(a.depuis).toLocaleDateString("fr-FR")}` : null].filter(Boolean).join(" · ")}
                  </p>
                </div>
                {!a.notifier && <span className="text-label-sm text-on-surface-muted">Alertes coupées</span>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
