import React from "react"
import Link from "next/link"
import { Briefcase, MapPin, FolderOpen } from "lucide-react"
import { Badge, type BadgeVariant } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { EmptyState } from "@/components/ui/EmptyState"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
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

export interface OpportunitiesWidgetProps {
  opportunities: OpportunityItem[]
  title?: string
  viewAllHref?: string
  className?: string
}

function contractVariant(contractType?: string | null): BadgeVariant {
  const lower = (contractType || "").toLowerCase()
  if (lower.includes("cdi")) return "success"
  if (lower.includes("stage") || lower.includes("internship")) return "info"
  if (lower.includes("mission") || lower.includes("consultant") || lower.includes("consultation") || lower.includes("freelance")) return "warning"
  return "neutral"
}

export function OpportunitiesWidget({
  opportunities,
  title = "Dernières opportunités & missions",
  viewAllHref = "/membres/opportunites",
  className,
}: OpportunitiesWidgetProps) {
  return (
    <Widget className={className ? `flex-1 ${className}` : "flex-1"}>
      <WidgetHeader title={title} count={opportunities.length} tone="primary" href={viewAllHref} linkLabel="Toutes les offres" />

      {opportunities.length > 0 ? (
        <Table density="compact" wrapperClassName="custom-scrollbar min-h-0 flex-1 overflow-y-auto rounded-none border-0">
          <TableCaption className="sr-only">{title}</TableCaption>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead className="px-5">Poste / mission & organisation</TableHead>
              <TableHead className="hidden sm:table-cell">Localisation</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="px-5 text-right">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opp) => {
              const displayCompany = opp.organisation || opp.entreprise || "agrolide"
              const displayLocation = opp.pays || opp.localisation || "Afrique (multi-pays)"
              const displayType = opp.type_opp || opp.type || "Offre"
              const formattedDate = opp.created_at
                ? new Date(opp.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                : "—"

              return (
                <TableRow key={opp.id} className="group">
                  <TableCell className="px-5">
                    <Link href="/membres/opportunites" className="block rounded-tag">
                      <p className="line-clamp-1 text-title-sm text-on-surface group-hover:text-primary">{opp.titre}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-body-sm text-on-surface-muted">
                        <Briefcase className="size-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{displayCompany}</span>
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden text-body-sm text-on-surface-variant sm:table-cell">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3 shrink-0 text-on-surface-muted" aria-hidden="true" />
                      <span className="truncate">{displayLocation}</span>
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-body-sm tabular-nums text-on-surface-muted md:table-cell">{formattedDate}</TableCell>
                  <TableCell className="px-5 text-right">
                    <Badge variant={contractVariant(displayType)} className="uppercase tracking-wider">{displayType}</Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          className="m-4 flex-1 border-0 bg-transparent"
          icon={<FolderOpen />}
          title="Aucune opportunité récente"
          description="Les nouvelles offres d'emploi, de stages et d'appels à projets agricoles apparaîtront ici."
          action={<Button href="/membres/opportunites" variant="text" size="sm">Consulter les opportunités archivées</Button>}
        />
      )}
    </Widget>
  )
}
