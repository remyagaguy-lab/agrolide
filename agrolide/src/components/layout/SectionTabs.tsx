"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/formatters"
import { useMembresBadges } from "./MembresBadges"
import { afficherNombre, labelInvitations, labelMessages, rubriqueParCle, type MembresRubrique } from "./membres-nav"

/**
 * Barre d'onglets d'une rubrique de l'espace membre (navigation par liens : chaque onglet est une vraie page).
 * Elle ne s'affiche que sur les pages d'onglet elles-mêmes ; les pages de détail (une formation, un document…)
 * gardent leur propre lien de retour.
 */
export function SectionTabs({ rubrique }: { rubrique: MembresRubrique["key"] }) {
  const pathname = usePathname()
  const badges = useMembresBadges()
  const { label, onglets } = rubriqueParCle(rubrique)

  const chemin = pathname && pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname
  if (!onglets.some((o) => o.href === chemin)) return null

  return (
    <nav aria-label={`Rubrique ${label}`} className="mx-auto w-full max-w-[1200px] px-2 pt-2 md:px-4">
      <ul className="flex gap-1 overflow-x-auto border-b border-outline-variant [scrollbar-width:none]">
        {onglets.map((o) => {
          const actif = o.href === chemin
          const n = o.badge === "invitations" ? badges.invitations : o.badge === "messages" ? badges.messages : 0
          return (
            <li key={o.href} className="shrink-0">
              <Link
                href={o.href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "ag-state relative -mb-px inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-t-control border-b-2 px-4 text-label-lg transition-colors duration-150 ease-standard",
                  actif ? "border-primary font-bold text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface",
                )}
              >
                {o.label}
                {n > 0 ? (
                  <span className="rounded-full bg-error px-2 py-0.5 text-label-sm text-on-error">
                    <span className="sr-only">{(o.badge === "invitations" ? labelInvitations : labelMessages)(n)} — </span>
                    <span aria-hidden>{afficherNombre(n)}</span>
                  </span>
                ) : null}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
