import Link from "next/link"
import { redirect } from "next/navigation"
import { Award } from "lucide-react"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { suiviFormations } from "@/lib/formations/suivi.server"
import { DownloadCertificatButton } from "@/components/modules/formations/DownloadCertificatButtonLazy"
import { EmptyState } from "@/components/ui/EmptyState"
import { buttonVariants } from "@/components/ui/Button"

export const metadata = { title: "Mes certificats" }

export default async function MesCertificatsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const [profil, suivis] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, userId), columns: { nom: true, prenom: true } }),
    suiviFormations(userId),
  ])

  // Un certificat existe pour chaque formation terminée : parcours en leçons dont toutes les leçons sont validées,
  // ou session (présentiel / classe virtuelle) marquée « terminée ».
  const certifiees = suivis.filter((s) => s.terminee)
  const enCours = suivis.filter((s) => !s.terminee && s.statut !== "annule" && s.total > 0)

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      <header>
        <h1 className="text-xl md:text-2xl font-bold text-on-surface font-heading">Mes certificats</h1>
        <p className="mt-1 text-xs text-on-surface-muted">Chaque formation terminée donne droit à un certificat à télécharger.</p>
      </header>

      {certifiees.length === 0 ? (
        <EmptyState
          arche
          title="Aucun certificat pour le moment"
          description={
            enCours.length > 0
              ? "Terminez toutes les leçons d'une formation pour obtenir votre premier certificat."
              : "Inscrivez-vous à une formation et menez-la jusqu'au bout pour obtenir votre premier certificat."
          }
          action={
            <Link
              href={enCours.length > 0 ? "/membres/formations" : "/membres/formations/catalogue"}
              className={buttonVariants({ variant: "tonal" })}
            >
              {enCours.length > 0 ? "Reprendre une formation" : "Parcourir le catalogue"}
            </Link>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {certifiees.map((s) => {
            const date = s.session?.dateDebut ?? s.termineeLe
            return (
              <li key={s.inscriptionId} className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
                    <Award className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-on-surface">{s.titre}</h2>
                    {date && <p className="mt-0.5 text-xs text-on-surface-muted">Terminée le {new Date(date).toLocaleDateString("fr-FR")}</p>}
                  </div>
                </div>
                {profil?.nom && profil?.prenom && date ? (
                  <DownloadCertificatButton
                    nom={profil.nom}
                    prenom={profil.prenom}
                    formationTitre={s.titre}
                    dateDebut={date}
                    inscriptionId={s.inscriptionId}
                  />
                ) : (
                  <p className="text-xs text-on-surface-muted">
                    Complétez votre nom et votre prénom dans <Link href="/membres/profil/modifier" className="font-bold text-primary underline-offset-2 hover:underline">votre profil</Link> pour générer le certificat.
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
