import React from "react"
import { ArrowRight, ShieldCheck, CreditCard } from "lucide-react"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils/formatters"
import { Widget } from "./Widget"

interface ProfileSummaryWidgetProps {
  prenom?: string | null
  nom?: string | null
  photo_url?: string | null
  specialite?: string | null
  organisation?: string | null
  pays?: string | null
  ville?: string | null
  categorie?: string | null
  isAdhesionActive?: boolean
  joursRestants?: number
}

export function ProfileSummaryWidget({
  prenom,
  nom,
  photo_url,
  specialite,
  organisation,
  pays,
  isAdhesionActive = false,
  joursRestants = 0,
}: ProfileSummaryWidgetProps) {
  const displayName = prenom ? `${prenom}${nom ? ` ${nom}` : ""}` : "Membre"
  const isProfileComplete = Boolean(specialite && organisation && pays)
  const hasValidPhoto = Boolean(photo_url && (photo_url.startsWith("http") || photo_url.startsWith("/")))

  return (
    <Widget className="shrink-0 p-5">
      <div className="mb-4 flex items-center gap-3.5">
        <Avatar src={hasValidPhoto ? photo_url : null} name={prenom ? displayName : undefined} size="lg" className="rounded-card" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-title-md text-on-surface">{displayName}</h2>
            <ShieldCheck className="size-4 shrink-0 text-success" aria-label="Profil vérifié" role="img" />
          </div>
          <p className="truncate text-body-sm text-on-surface-muted">{specialite || organisation || "Expertise agricole"}</p>
        </div>
      </div>

      {/* Adhésion et cotisation */}
      <div
        className={cn(
          "mb-3.5 rounded-card p-3.5",
          isAdhesionActive ? "bg-success-container text-on-success-container" : "bg-warning-container text-on-warning-container",
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-title-sm">
            <CreditCard className="size-4" aria-hidden="true" />
            Adhésion annuelle
          </p>
          <Badge variant={isAdhesionActive ? "success" : "warning"} className="bg-surface-container-lowest">
            {isAdhesionActive ? "Active" : "En attente"}
          </Badge>
        </div>
        <p className="mb-3 flex items-center justify-between text-body-sm">
          <span>{isAdhesionActive ? `${joursRestants} jours restants` : "Cotisation annuelle requise"}</span>
          <span className="font-semibold">{isAdhesionActive ? "À jour" : "À régulariser"}</span>
        </p>
        <Button href="/membres/cotisation" variant={isAdhesionActive ? "outline" : "secondary"} size="sm" fullWidth className={isAdhesionActive ? "bg-surface-container-lowest" : undefined}>
          {isAdhesionActive ? "Gérer ma cotisation" : "Régler ma cotisation"}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>

      {/* Visibilité dans l'annuaire */}
      <div className="mb-3.5 flex items-center justify-between rounded-card bg-surface-container p-3 text-body-sm">
        <span className="flex items-center gap-2 font-semibold text-on-surface">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent-leaf" />
          Annuaire des pairs
        </span>
        <Badge variant="junior">{isProfileComplete ? "Profil complet" : "Visibilité active"}</Badge>
      </div>

      <Button href="/membres/profil" variant="tonal" size="sm" fullWidth>
        Modifier mon profil
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Button>
    </Widget>
  )
}
