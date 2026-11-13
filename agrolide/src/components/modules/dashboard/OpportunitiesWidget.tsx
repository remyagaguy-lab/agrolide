import React from "react"
import Link from "next/link"
import { Compass, Rocket, ArrowRight } from "lucide-react"
import { Badge, type BadgeVariant } from "@/components/ui/Badge"
import { Widget, WidgetHeader } from "./Widget"

export interface OpportunityItem {
  id: string | number
  titre: string
  organisation?: string | null
  entreprise?: string | null
  pays?: string | null
  localisation?: string | null
  type_opp?: string | null
  type?: string | null
  created_at?: string | Date | null
}

function contractVariant(contractType?: string | null): BadgeVariant {
  const lower = (contractType || "").toLowerCase()
  if (lower.includes("cdi")) return "success"
  if (lower.includes("stage") || lower.includes("internship")) return "info"
  if (lower.includes("mission") || lower.includes("consultant") || lower.includes("consultation") || lower.includes("freelance")) return "warning"
  return "neutral"
}

/** Dernières offres, en lignes (titre, organisation et lieu, type) : lisible à demi-largeur comme sur téléphone. */
export function OpportunitiesWidget({ opportunities }: { opportunities: OpportunityItem[] }) {
  return (
    <Widget>
      <WidgetHeader title="Dernières opportunités" tone="info" icon={<Compass />} href="/membres/opportunites" linkLabel="Toutes les offres" />
      {opportunities.length > 0 ? (
        <ul className="flex flex-col p-3 pt-1">
          {opportunities.map((opp) => {
            const organisation = opp.organisation || opp.entreprise || "agrolide"
            const lieu = opp.pays || opp.localisation || "Afrique (multi-pays)"
            const type = opp.type_opp || opp.type || "Offre"
            return (
              <li key={opp.id}>
                <Link href="/membres/opportunites" className="ag-state group flex min-h-14 items-center gap-3 rounded-control px-2.5 py-1.5">
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-1 block text-title-sm text-on-surface group-hover:text-primary">{opp.titre}</span>
                    <span className="line-clamp-1 block text-label-md text-on-surface-muted">{organisation} · {lieu}</span>
                  </span>
                  <Badge variant={contractVariant(type)} className="shrink-0">{type}</Badge>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="p-5 pt-2 text-body-md text-on-surface-variant">Les nouvelles offres d'emploi, de stage et d'appels à projets agricoles seront publiées ici.</p>
      )}
    </Widget>
  )
}

/** Encart vers la rubrique Entreprendre (incubation, accompagnement). */
export function EntreprendreEncart() {
  return (
    <Widget data-visite="entreprendre">
      <WidgetHeader title="Entreprendre" tone="feuille" icon={<Rocket />} />
      <div className="flex flex-1 flex-col gap-3 p-5 pt-2">
        <p className="text-body-md text-on-surface-variant">
          Une idée de projet agricole ? Candidatez à l'incubation ou demandez un accompagnement sur mesure.
        </p>
        <Link href="/membres/opportunites/entreprendre" className="ag-state mt-auto inline-flex min-h-11 items-center gap-1.5 self-start rounded-control text-label-lg text-primary">
          Découvrir
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </Widget>
  )
}
