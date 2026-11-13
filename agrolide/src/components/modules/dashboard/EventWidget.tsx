import React from "react"
import Link from "next/link"
import { Calendar as CalendarIcon, MapPin, ArrowRight, Video } from "lucide-react"
import { ArcheBadge } from "@/components/brand"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Widget, WidgetHeader } from "./Widget"

export interface EventData {
  id: string | number
  titre: string
  date_debut: string | Date
  date_fin?: string | Date | null
  lieu?: string | null
  type_evt?: string | null
}

interface EventWidgetProps {
  /** Événements auxquels je suis inscrit, à venir, du plus proche au plus lointain (le premier est « mon prochain »). */
  mesEvenements: EventData[]
  /** Prochains événements ouverts à tous : vitrine quand je ne suis inscrit à rien. */
  aVenir: EventData[]
}

function ligneDate(d: string | Date) {
  const date = new Date(d)
  return {
    jour: String(date.getDate()),
    mois: date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""),
    long: date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
    heure: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  }
}

function enLigne(lieu?: string | null) {
  const l = lieu?.toLowerCase() ?? ""
  return l.includes("ligne") || l.includes("webinar") || l.includes("zoom") || l.includes("meet")
}

/**
 * Bloc Événements : « Mon prochain événement » (date dans le dôme, puis les deux suivants) si je suis inscrit,
 * sinon une vitrine des trois prochains événements ouverts. Carte blanche à bordure fine, comme les autres.
 */
export function EventWidget({ mesEvenements, aVenir }: EventWidgetProps) {
  const prochain = mesEvenements[0] ?? null

  if (!prochain) {
    return (
      <Widget>
        <WidgetHeader title="Prochains événements" tone="orange" icon={<CalendarIcon />} href="/membres/evenements" linkLabel="Agenda" />
        {aVenir.length > 0 ? (
          <ul className="flex flex-col p-3 pt-1">
            {aVenir.map((e) => {
              const d = ligneDate(e.date_debut)
              return (
                <li key={e.id}>
                  <Link href={`/membres/evenements/${e.id}`} className="ag-state group flex min-h-14 items-center gap-3 rounded-control px-2.5 py-1.5">
                    <span className="flex w-11 shrink-0 flex-col items-center">
                      <ArcheBadge className="w-10">{d.jour}</ArcheBadge>
                      <span className="mt-0.5 text-label-sm uppercase text-on-surface-muted">{d.mois}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 block text-title-sm text-on-surface group-hover:text-primary">{e.titre}</span>
                      <span className="block text-label-md text-on-surface-muted">
                        {d.heure}{e.lieu && !enLigne(e.lieu) ? ` · ${e.lieu}` : ""}
                      </span>
                    </span>
                    {e.lieu && <Badge variant={enLigne(e.lieu) ? "info" : "neutral"} className="shrink-0">{enLigne(e.lieu) ? "En ligne" : "Sur place"}</Badge>}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="p-5 pt-2 text-body-md text-on-surface-variant">Les prochains ateliers, webinaires et rencontres du réseau seront annoncés ici.</p>
        )}
      </Widget>
    )
  }

  const d = ligneDate(prochain.date_debut)
  const PlaceIcon = enLigne(prochain.lieu) ? Video : MapPin
  const suivants = mesEvenements.slice(1, 3)

  return (
    <Widget>
      <WidgetHeader title="Mon prochain événement" tone="orange" icon={<CalendarIcon />} href="/membres/evenements" linkLabel="Agenda" />
      <div className="flex flex-1 flex-col gap-4 p-5 pt-3">
        <div className="flex items-start gap-4">
          <span className="flex w-14 shrink-0 flex-col items-center">
            <ArcheBadge className="w-14">{d.jour}</ArcheBadge>
            <span className="mt-1 text-label-md uppercase text-on-surface-variant">{d.mois}</span>
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-title-md text-on-surface">{prochain.titre}</h3>
            <p className="mt-1 text-body-md capitalize text-on-surface-variant">
              {d.long} · <span className="tabular-nums">{d.heure}</span>
            </p>
            {prochain.lieu && (
              <p className="mt-1 flex items-center gap-1.5 text-body-md text-on-surface-variant">
                <PlaceIcon className="size-4 shrink-0" aria-hidden="true" />
                <span>{prochain.lieu}</span>
              </p>
            )}
          </div>
        </div>

        {suivants.length > 0 && (
          <div className="border-t border-outline-variant pt-3">
            <h3 className="mb-1 text-label-md text-on-surface-variant">Ensuite</h3>
            <ul>
              {suivants.map((e) => (
                <li key={e.id}>
                  <Link href={`/membres/evenements/${e.id}`} className="ag-state group flex min-h-11 items-center justify-between gap-3 rounded-control px-1">
                    <span className="line-clamp-1 text-body-md text-on-surface group-hover:text-primary">{e.titre}</span>
                    <span className="shrink-0 text-label-md tabular-nums text-on-surface-muted">
                      {new Date(e.date_debut).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button href={`/membres/evenements/${prochain.id}`} variant="tonal" size="sm" fullWidth className="mt-auto min-h-11">
          Voir les détails
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </Widget>
  )
}
