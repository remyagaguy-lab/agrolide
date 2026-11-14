import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Anneau } from "@/components/brand"
import { Widget, WidgetHeader } from "./Widget"
import { DATE_FIN_GRATUITE_LISIBLE, categorieSansCotisation, gratuiteEnCours } from "@/lib/adhesion"

import { ArrowRight, ChevronRight, CreditCard, Eye, UserRound } from "@/components/ui/icons"
interface ProfileSummaryWidgetProps {
  categorie?: string | null
  /** Compte du réseau : jamais de cotisation. */
  estOrganisation?: boolean | null
  isAdhesionActive?: boolean
  joursRestants?: number
  /** Valeur réelle de `annuaire_visible` (vide = visible, comme dans l’annuaire). */
  annuaireVisible?: boolean | null
  /** Part du profil renseignée (0 à 100). */
  completion: number
  /** Libellés des champs encore vides. */
  manquants?: string[]
  /** Ce bloc porte-t-il le bouton orange de la page ? (membre neuf au profil incomplet.) */
  boutonPrincipal?: boolean
}

/**
 * « Mon compte » : ce qu'il reste à compléter, l'adhésion, la visibilité. L'identité (avatar, nom) est dans le bandeau
 * et la barre latérale : plus de doublon ici, un seul bouton.
 */
export function ProfileSummaryWidget({
  categorie,
  estOrganisation,
  isAdhesionActive = false,
  joursRestants = 0,
  annuaireVisible,
  completion,
  manquants = [],
  boutonPrincipal = false,
}: ProfileSummaryWidgetProps) {
  // Pendant l'année gratuite (ou pour un profil Passionné), un membre sans cotisation payée n'a rien à régler.
  const gratuit = !isAdhesionActive && (categorieSansCotisation(categorie, estOrganisation) || gratuiteEnCours())
  const adhesionOk = isAdhesionActive || gratuit
  const complet = completion >= 100
  const visible = annuaireVisible !== false

  const detailAdhesion = isAdhesionActive
    ? `${joursRestants} jours restants`
    : gratuit
      ? categorieSansCotisation(categorie, estOrganisation) ? "Gratuite, sans limite de durée" : `Gratuite jusqu'au ${DATE_FIN_GRATUITE_LISIBLE}`
      : "Cotisation annuelle requise"

  return (
    <Widget data-visite="compte">
      <WidgetHeader title="Mon compte" icon={<UserRound />} />

      <div className="flex flex-col gap-4 p-5 pt-3">
        <div className="flex items-center gap-4">
          <span className="relative flex size-16 shrink-0 items-center justify-center">
            <Anneau mode="progression" valeur={completion / 100} label={`Profil complété à ${completion} %`} className="absolute inset-0 size-full text-primary" />
            <span className="text-title-sm tabular-nums text-on-surface">{completion} %</span>
          </span>
          <div className="min-w-0">
            <p className="text-title-sm text-on-surface">{complet ? "Profil complet" : `Profil complété à ${completion} %`}</p>
            <p className="text-body-sm text-on-surface-variant">
              {complet
                ? "Vous êtes bien référencé dans l'annuaire."
                : manquants.length > 0
                  ? `À ajouter : ${manquants.slice(0, 3).join(", ")}${manquants.length > 3 ? "…" : ""}`
                  : "Plus il est complet, mieux vous êtes suggéré."}
            </p>
          </div>
        </div>

        <div className="border-t border-outline-variant pt-3">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-title-sm text-on-surface">
              <CreditCard className="size-4 text-on-surface-muted" aria-hidden="true" />
              Adhésion
            </p>
            <Badge variant={adhesionOk ? "success" : "warning"}>
              {adhesionOk ? "À jour" : "À régulariser"}
            </Badge>
          </div>
          <p className="mt-1 text-body-sm text-on-surface-variant">{detailAdhesion}</p>
          {(!adhesionOk || isAdhesionActive) && (
            <Button href="/membres/cotisation" variant={adhesionOk ? "text" : "secondary"} size="sm" className="mt-2 min-h-11">
              {isAdhesionActive ? "Gérer ma cotisation" : "Régler ma cotisation"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        <Link
          href="/membres/profil/confidentialite"
          className="ag-state flex min-h-12 items-center justify-between gap-3 rounded-control border-t border-outline-variant pt-3"
        >
          <span className="flex items-center gap-2 text-body-md text-on-surface">
            <Eye className="size-4 text-on-surface-muted" aria-hidden="true" />
            {visible ? "Visible dans l'annuaire" : "Masqué dans l'annuaire"}
          </span>
          <span className="flex items-center gap-0.5 text-label-md text-primary">
            Gérer
            <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        </Link>

        {complet ? (
          <Button href="/membres/profil" variant="text" size="sm" className="min-h-11 self-start">
            Modifier mon profil
          </Button>
        ) : (
          <Button href="/membres/profil" variant={boutonPrincipal ? "primary" : "tonal"} size="sm" fullWidth className="min-h-11">
            Compléter mon profil
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </Widget>
  )
}
