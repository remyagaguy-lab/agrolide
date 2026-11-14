import type { ReactNode } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Card } from '@/components/ui/Card'
import AfficheEvenement, { listeAffiches } from '@/components/modules/evenements/AfficheEvenement'
import { CalendarDays, Clock, Globe, MapPin, Users, CheckCircle2 } from '@/components/ui/icons'

type Evenement = {
  titre: string
  date_debut: string
  date_fin: string | null
  en_ligne: boolean | null
  lieu: string | null
  pays: string | null
  places_max: number | null
  image_url: string | null
  affiches_supplementaires?: string | null
  inscription_requise: boolean | null
}

function Point({ Icone, libelle, children }: { Icone: typeof Clock; libelle: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-body-sm text-on-surface-variant">{libelle}</p>
        <p className="text-title-md text-on-surface">{children}</p>
      </div>
    </div>
  )
}

/** Points essentiels : date, heure, lieu (et accès si utile). Toujours en tête de la colonne de droite. */
function PointsEssentiels({ event }: { event: Evenement }) {
  const debut = new Date(event.date_debut)
  return (
    <Card variant="filled" className="space-y-5">
      <Point Icone={CalendarDays} libelle="Date"><span className="capitalize">{format(debut, 'EEEE d MMMM yyyy', { locale: fr })}</span></Point>
      <Point Icone={Clock} libelle="Heure">
        {format(debut, 'HH:mm')}
        {event.date_fin && ` - ${format(new Date(event.date_fin), 'HH:mm')}`}
      </Point>
      {event.en_ligne ? (
        <Point Icone={Globe} libelle="Format">En ligne</Point>
      ) : event.lieu ? (
        <Point Icone={MapPin} libelle="Lieu">{[event.lieu, event.pays].filter(Boolean).join(', ')}</Point>
      ) : null}
      {event.inscription_requise === false ? (
        <Point Icone={CheckCircle2} libelle="Accès">Entrée libre</Point>
      ) : event.places_max ? (
        <Point Icone={Users} libelle="Places">{event.places_max} places</Point>
      ) : null}
    </Card>
  )
}

/**
 * Page de lecture d'un événement ou d'un webinaire : le CENTRE est réservé au texte ; la colonne de DROITE porte
 * d'abord les points essentiels, puis l'affiche, puis les actions (inscription, replay, documents).
 * Largeurs : 3/5 pour le texte, 2/5 pour la colonne de droite. Plusieurs affiches s'empilent dans cette colonne.
 * Sur téléphone : points essentiels, texte, puis affiche et actions.
 */
export default function MiseEnPageEvenement({ event, children, actions }: { event: Evenement; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
      <div className="min-w-0 space-y-6">
        <div className="lg:hidden">
          <PointsEssentiels event={event} />
        </div>
        {children}
      </div>
      <aside className="space-y-6 lg:self-start">
        <div className="hidden lg:block">
          <PointsEssentiels event={event} />
        </div>
        {listeAffiches(event).map((src) => (
          <AfficheEvenement key={src} src={src} titre={event.titre} />
        ))}
        {actions}
      </aside>
    </div>
  )
}
