import React from "react"
import { Calendar as CalendarIcon, MapPin, ArrowRight, Video } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils/formatters"

interface EventData {
  id: string | number
  titre: string
  date_debut: string | Date
  date_fin?: string | Date | null
  lieu?: string | null
  type_evt?: string | null
  type?: string | null
}

interface EventWidgetProps {
  event: EventData | null
}

/** Mise en avant du prochain événement : bandeau vert de marque, texte clair (contrastes ≥ 7:1). */
export function EventWidget({ event }: EventWidgetProps) {
  if (!event) {
    return (
      <div className="shrink-0 rounded-card bg-surface-brand p-5 text-on-surface-brand">
        <div className="mb-2 flex items-center gap-2">
          <CalendarIcon className="size-4" aria-hidden="true" />
          <h2 className="text-label-sm uppercase tracking-wider">Mon prochain événement</h2>
        </div>
        <p className="mb-1 text-title-md">Aucune inscription à venir</p>
        <p className="mb-4 text-body-sm text-on-surface-brand/85">
          Ateliers, webinaires techniques et rencontres du réseau : inscrivez-vous, l'événement apparaîtra ici.
        </p>
        <Button href="/membres/evenements" variant="ghost-dark" size="sm" fullWidth>
          Voir les événements
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    )
  }

  const startDate = new Date(event.date_debut)
  const isUpcoming = startDate.getTime() > Date.now()

  const formattedDay = startDate.getDate()
  const formattedMonth = startDate.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()
  const formattedTime = startDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  const formattedFullDate = startDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })

  const lieu = event.lieu?.toLowerCase() ?? ""
  const isOnline = lieu.includes("ligne") || lieu.includes("webinar") || lieu.includes("zoom") || lieu.includes("meet")
  const PlaceIcon = isOnline ? Video : MapPin

  return (
    <div className="relative shrink-0 overflow-hidden rounded-card bg-surface-brand p-5 text-on-surface-brand">
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4" aria-hidden="true" />
          <h2 className="text-label-sm uppercase tracking-wider">Mon prochain événement</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-on-surface-brand/15 px-2.5 py-0.5 text-label-sm uppercase tracking-wider">
          <span
            aria-hidden="true"
            className={cn("size-1.5 rounded-full", isUpcoming ? "bg-accent-leaf motion-safe:animate-pulse" : "bg-accent-sun")}
          />
          {isUpcoming ? "Bientôt" : "En cours"}
        </span>
      </div>

      <div className="mb-4 flex items-start gap-3.5">
        <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-control bg-on-surface-brand/15 p-2 text-center">
          <span className="text-label-sm tracking-wider">{formattedMonth}</span>
          <span className="text-title-lg tabular-nums leading-tight">{formattedDay}</span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-title-md" style={{ textWrap: "balance" }}>
            {event.titre}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-body-sm capitalize text-on-surface-brand/90">
            <span>{formattedFullDate}</span>
            <span aria-hidden="true">•</span>
            <span className="tabular-nums font-semibold">{formattedTime}</span>
          </p>
          {event.lieu && (
            <p className="mt-1 flex items-center gap-1.5 text-body-sm text-on-surface-brand/90">
              <PlaceIcon className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{event.lieu}</span>
            </p>
          )}
        </div>
      </div>

      <Button href={`/membres/evenements/${event.id}`} variant="tonal" size="sm" fullWidth>
        Voir les détails
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Button>
    </div>
  )
}
