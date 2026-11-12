import React from "react"
import { ArrowRight, ShieldCheck, CreditCard } from "lucide-react"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Anneau } from "@/components/brand"
import { cn } from "@/lib/utils/formatters"
import { Widget } from "./Widget"
import { DATE_FIN_GRATUITE_LISIBLE, categorieSansCotisation, gratuiteEnCours } from "@/lib/adhesion"

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
  /** Valeur réelle de `annuaire_visible` (vide = visible, comme dans l’annuaire). */
  annuaireVisible?: boolean | null
  /** Part du profil renseignée (0 à 100) : dessine l'anneau de progression autour de l'avatar. */
  completion?: number
}

export function ProfileSummaryWidget({
  prenom,
  nom,
  photo_url,
  specialite,
  organisation,
  pays,
  categorie,
  isAdhesionActive = false,
  joursRestants = 0,
  annuaireVisible,
  completion,
}: ProfileSummaryWidgetProps) {
  const displayName = prenom ? `${prenom}${nom ? ` ${nom}` : ""}` : "Membre"
  // Pendant l'année gratuite (ou pour un profil Passionné), un membre sans cotisation payée n'a rien à régler.
  const gratuit = !isAdhesionActive && (categorieSansCotisation(categorie) || gratuiteEnCours())
  const adhesionOk = isAdhesionActive || gratuit
  const hasValidPhoto = Boolean(photo_url && (photo_url.startsWith("http") || photo_url.startsWith("/")))

  return (
    <Widget className="shrink-0 p-5">
      <div className="mb-4 flex items-center gap-3.5">
        {completion === undefined ? (
          <Avatar src={hasValidPhoto ? photo_url : null} name={prenom ? displayName : undefined} size="lg" className="rounded-card" />
        ) : (
          /* Anneau de progression de l'emblème (ouvert en bas à gauche) autour de l'avatar. */
          <span className="relative flex size-[4.5rem] shrink-0 items-center justify-center">
            <Anneau mode="progression" valeur={completion / 100} label={`Profil complété à ${completion} %`} className="absolute inset-0 size-full text-primary" />
            <Avatar src={hasValidPhoto ? photo_url : null} name={prenom ? displayName : undefined} size="lg" />
          </span>
        )}
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
          adhesionOk ? "bg-success-container text-on-success-container" : "bg-warning-container text-on-warning-container",
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-title-sm">
            <CreditCard className="size-4" aria-hidden="true" />
            Adhésion annuelle
          </p>
          <Badge variant={adhesionOk ? "success" : "warning"} className="bg-surface-container-lowest">
            {isAdhesionActive ? "Active" : gratuit ? "Gratuite" : "En attente"}
          </Badge>
        </div>
        <p className="mb-3 flex items-center justify-between gap-2 text-body-sm">
          <span>
            {isAdhesionActive
              ? `${joursRestants} jours restants`
              : gratuit
                ? categorieSansCotisation(categorie) ? "Gratuite, sans limite de durée" : `Gratuite jusqu'au ${DATE_FIN_GRATUITE_LISIBLE}`
                : "Cotisation annuelle requise"}
          </span>
          <span className="shrink-0 font-semibold">{adhesionOk ? "À jour" : "À régulariser"}</span>
        </p>
        <Button href="/membres/cotisation" variant={adhesionOk ? "outline" : "secondary"} size="sm" fullWidth className={adhesionOk ? "bg-surface-container-lowest" : undefined}>
          {isAdhesionActive ? "Gérer ma cotisation" : gratuit ? "Voir mon adhésion" : "Régler ma cotisation"}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>

      {/* Visibilité dans l'annuaire */}
      <div className="mb-3.5 flex items-center justify-between rounded-card bg-surface-container p-3 text-body-sm">
        <span className="flex items-center gap-2 font-semibold text-on-surface">
          <span aria-hidden="true" className={cn("size-2 rounded-full", annuaireVisible === false ? "bg-outline" : "bg-accent-leaf")} />
          Annuaire des pairs
        </span>
        <Badge variant={annuaireVisible === false ? "neutral" : "success"}>{annuaireVisible === false ? "Masqué" : "Visible"}</Badge>
      </div>

      <Button href="/membres/profil/confidentialite" variant="text" size="sm" fullWidth className="mb-1">
        Gérer ma visibilité
      </Button>

      <Button href="/membres/profil" variant="tonal" size="sm" fullWidth>
        Modifier mon profil
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Button>
    </Widget>
  )
}
