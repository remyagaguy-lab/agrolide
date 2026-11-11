import React from "react"
import { Calendar as CalendarIcon, UserCheck, ArrowUpRight } from "lucide-react"
import { Badge, type BadgeVariant } from "@/components/ui/Badge"
import { buttonVariants } from "@/components/ui/Button"
import Link from "next/link"

interface DashboardHeaderProps {
  prenom?: string | null
  nom?: string | null
  categorie?: string | null
  specialite?: string | null
  organisation?: string | null
  pays?: string | null
  ville?: string | null
}

function categoryBadge(cat?: string | null): { label: string; variant: BadgeVariant } | null {
  if (!cat) return null
  const lower = cat.toLowerCase()
  if (lower.includes("professionnel")) return { label: "Membre professionnel", variant: "professionnel" }
  if (lower.includes("junior") || lower.includes("etudiant") || lower.includes("étudiant")) return { label: "Membre junior", variant: "junior" }
  if (lower.includes("partenaire")) return { label: "Partenaire", variant: "partenaire" }
  if (lower.includes("senior") || lower.includes("expert")) return { label: "Membre sénior", variant: "senior" }
  return { label: cat, variant: "junior" }
}

export function DashboardHeader({ prenom, nom, categorie, specialite, organisation, pays, ville }: DashboardHeaderProps) {
  const displayName = prenom ? `${prenom}${nom ? ` ${nom}` : ""}` : "Membre"

  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  const badge = categoryBadge(categorie)
  const metaItems = [specialite, organisation, ville && pays ? `${ville}, ${pays}` : pays || ville].filter(Boolean)

  return (
    <div className="shrink-0 rounded-card border border-outline-variant bg-surface-container-lowest p-5 shadow-elev-1 md:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-headline-sm text-on-surface" style={{ textWrap: "balance" }}>
              Bonjour, {displayName}
            </h1>
            {badge && (
              <Badge variant={badge.variant} className="rounded-full px-3 uppercase tracking-wider">
                <UserCheck className="size-3" aria-hidden="true" />
                {badge.label}
              </Badge>
            )}
          </div>

          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-body-sm text-on-surface-variant">
            {metaItems.length > 0 ? (
              metaItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span aria-hidden="true" className="text-outline">•</span>}
                  <span className="truncate">{item}</span>
                </React.Fragment>
              ))
            ) : (
              <span>Espace membre officiel agrolide • Réseau panafricain des professionnels du secteur agricole</span>
            )}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2.5 border-t border-outline-variant pt-3 lg:border-t-0 lg:pt-0">
          <span className="inline-flex min-h-10 items-center gap-2 rounded-control bg-surface-container px-3.5 text-label-md tabular-nums text-on-surface-variant">
            <CalendarIcon className="size-4 text-primary" aria-hidden="true" />
            {capitalizedDate}
          </span>
          <Link href="/membres/annuaire" className={buttonVariants({ variant: "tonal", size: "sm" })}>
            Annuaire des pairs
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
