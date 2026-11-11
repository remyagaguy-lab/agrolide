import React from "react"
import Link from "next/link"
import { BookOpen, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { EmptyState } from "@/components/ui/EmptyState"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Widget, WidgetHeader } from "./Widget"

export interface FormationItem {
  id: string
  titre: string
  thematique?: string | null
  niveau?: string | null
  modalite?: string | null
  source_externe?: string | null
  created_at?: string | Date | null
}

export interface FormationsWidgetProps {
  formations: FormationItem[]
  title?: string
  viewAllHref?: string
  className?: string
}

export function FormationsWidget({
  formations,
  title = "Formations & cours",
  viewAllHref = "/formations",
  className,
}: FormationsWidgetProps) {
  return (
    <Widget className={className ? `flex-1 ${className}` : "flex-1"}>
      <WidgetHeader title={title} count={formations.length} tone="tertiary" href={viewAllHref} linkLabel="Catalogue complet" />

      {formations.length > 0 ? (
        <Table density="compact" wrapperClassName="custom-scrollbar min-h-0 flex-1 overflow-y-auto rounded-none border-0">
          <TableCaption className="sr-only">{title}</TableCaption>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead className="px-5">Titre & source</TableHead>
              <TableHead className="hidden sm:table-cell">Thématique</TableHead>
              <TableHead className="hidden md:table-cell">Niveau</TableHead>
              <TableHead className="px-5 text-right">Modalité</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formations.map((form) => (
              <TableRow key={form.id} className="group">
                <TableCell className="px-5">
                  <Link href={`/formations/${form.id}`} className="block rounded-tag">
                    <p className="line-clamp-1 text-title-sm text-on-surface group-hover:text-primary">{form.titre}</p>
                    <p className="mt-0.5 text-body-sm text-on-surface-muted">Source : {form.source_externe || "agrolide"}</p>
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="category">{form.thematique || "Général"}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                    <GraduationCap className="size-3.5 text-on-surface-muted" aria-hidden="true" />
                    {form.niveau || "Tous niveaux"}
                  </span>
                </TableCell>
                <TableCell className="px-5 text-right">
                  <Badge variant="neutral" className="uppercase tracking-wider">{form.modalite || "En ligne"}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          className="m-4 flex-1 border-0 bg-transparent"
          icon={<BookOpen />}
          title="Aucune formation disponible"
          description="De nouveaux cours seront publiés prochainement."
        />
      )}
    </Widget>
  )
}
