import Link from "next/link"
import { desc, eq, ne } from "drizzle-orm"
import { ArrowLeft, UserCog } from "lucide-react"
import { db } from "@/db"
import { demandes_categorie, users } from "@/db/schema"
import { Badge } from "@/components/ui/Badge"
import { formaterDate, libelleCategorie } from "@/lib/adhesion"
import { DecisionDemande } from "./DecisionDemande"

export const metadata = { title: "Demandes de changement de catégorie" }
export const dynamic = "force-dynamic"

const LIBELLE_STATUT: Record<string, string> = {
  en_attente: "En attente",
  programmee: "Programmée",
  acceptee: "Acceptée",
  refusee: "Refusée",
  annulee: "Annulée",
}

export default async function DemandesCategoriePage() {
  const colonnes = {
    id: demandes_categorie.id,
    statut: demandes_categorie.statut,
    avant: demandes_categorie.categorie_avant,
    demandee: demandes_categorie.categorie_demandee,
    effet_le: demandes_categorie.effet_le,
    created_at: demandes_categorie.created_at,
    traite_le: demandes_categorie.traite_le,
    motif_refus: demandes_categorie.motif_refus,
    prenom: users.prenom,
    nom: users.nom,
    email: users.email,
  }

  let attente: Array<{ [K in keyof typeof colonnes]: string | null }> = []
  let historique: typeof attente = []
  let indisponible = false
  try {
    attente = await db.select(colonnes).from(demandes_categorie).innerJoin(users, eq(users.id, demandes_categorie.user_id))
      .where(eq(demandes_categorie.statut, "en_attente")).orderBy(demandes_categorie.created_at) as typeof attente
    historique = await db.select(colonnes).from(demandes_categorie).innerJoin(users, eq(users.id, demandes_categorie.user_id))
      .where(ne(demandes_categorie.statut, "en_attente")).orderBy(desc(demandes_categorie.created_at)).limit(30) as typeof historique
  } catch (e) {
    console.error("Erreur lecture des demandes de catégorie:", e)
    indisponible = true
  }

  const nomMembre = (d: { prenom: string | null; nom: string | null; email: string | null }) =>
    `${d.prenom ?? ""} ${d.nom ?? ""}`.trim() || d.email || "Membre"

  return (
    <div className="space-y-6 pb-10">
      <div>
        <Link href="/admin/membres" className="inline-flex min-h-11 items-center gap-1.5 text-body-sm text-primary hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" /> Retour aux membres
        </Link>
        <div className="mt-1 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-success-container text-success">
            <UserCog size={20} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Demandes de changement de catégorie</h1>
            <p className="text-sm text-on-surface-muted">Les passages en Partenaire et en Sénior doivent être validés ici.</p>
          </div>
        </div>
      </div>

      {indisponible && (
        <p role="alert" className="rounded-card border border-error/30 bg-error-container p-4 text-body-sm text-error">
          Les demandes ne peuvent pas être lues. La migration « 0007_demandes_categorie.sql » est-elle appliquée à la base ?
        </p>
      )}

      <section aria-labelledby="attente-titre" className="overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest">
        <h2 id="attente-titre" className="border-b border-outline-variant px-5 py-4 text-title-sm text-on-surface">
          À traiter ({attente.length})
        </h2>
        {attente.length === 0 ? (
          <p className="p-6 text-center text-body-sm text-on-surface-muted">Aucune demande en attente.</p>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {attente.map((d) => (
              <li key={d.id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-title-sm text-on-surface">{nomMembre(d)}</p>
                  <p className="text-body-sm text-on-surface-muted">{d.email}</p>
                  <p className="flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant">
                    <Badge variant="neutral">{libelleCategorie(d.avant)}</Badge> vers <Badge variant="category">{libelleCategorie(d.demandee)}</Badge>
                    <span>demandé le {d.created_at ? formaterDate(d.created_at) : ""}</span>
                  </p>
                </div>
                <DecisionDemande id={d.id!} libelleMembre={nomMembre(d)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {historique.length > 0 && (
        <section aria-labelledby="histo-titre" className="overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest">
          <h2 id="histo-titre" className="border-b border-outline-variant px-5 py-4 text-title-sm text-on-surface">Dernières décisions</h2>
          <ul className="divide-y divide-outline-variant">
            {historique.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-body-sm">
                <span className="text-on-surface">{nomMembre(d)} : {libelleCategorie(d.avant)} vers {libelleCategorie(d.demandee)}</span>
                <span className="text-on-surface-muted">
                  {LIBELLE_STATUT[d.statut ?? ""] ?? d.statut}
                  {d.statut === "programmee" && d.effet_le ? ` (effet le ${formaterDate(d.effet_le)})` : ""}
                  {d.traite_le ? ` · ${formaterDate(d.traite_le)}` : ""}
                  {d.motif_refus ? ` · ${d.motif_refus}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
