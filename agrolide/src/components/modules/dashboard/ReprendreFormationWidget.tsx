import React from "react"
import { BookOpen, PlayCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Widget, WidgetHeader } from "./Widget"

export interface FormationEnCours {
  formationId: string
  titre: string
  /** Leçons validées / total (0 / 0 pour une formation sans parcours en leçons). */
  faites: number
  total: number
  pourcent: number
  prochaineLeconId: string | null
}

/** « Reprendre là où j'en étais » : la formation commencée le plus récemment, avec sa progression réelle. */
export function ReprendreFormationWidget({ formation, className }: { formation: FormationEnCours | null; className?: string }) {
  return (
    <Widget className={className}>
      <WidgetHeader title="Ma formation" tone="tertiary" href="/membres/formations" linkLabel="Mon parcours" />

      {formation ? (
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
              <PlayCircle className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-label-sm uppercase tracking-wider text-on-surface-muted">{formation.faites > 0 ? "À reprendre" : "À commencer"}</p>
              <h3 className="line-clamp-2 text-title-md text-on-surface">{formation.titre}</h3>
            </div>
          </div>

          {formation.total > 0 && (
            <div>
              <div className="mb-1 flex justify-between text-label-sm text-on-surface-variant">
                <span>{formation.faites} / {formation.total} leçon{formation.total > 1 ? "s" : ""}</span>
                <span className="tabular-nums">{formation.pourcent} %</span>
              </div>
              <div
                role="progressbar"
                aria-label={`Progression dans « ${formation.titre} »`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={formation.pourcent}
                className="h-2 w-full overflow-hidden rounded-full bg-surface-container"
              >
                <div className="h-full rounded-full bg-primary" style={{ width: `${formation.pourcent}%` }} />
              </div>
            </div>
          )}

          <Button
            href={formation.prochaineLeconId ? `/membres/formations/${formation.formationId}/suivre/${formation.prochaineLeconId}` : `/membres/formations/${formation.formationId}`}
            variant="secondary"
            size="sm"
            fullWidth
            className="mt-auto"
          >
            {formation.faites > 0 ? "Reprendre" : "Commencer"}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-start gap-3 p-5">
          <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-control bg-surface-container text-on-surface-muted">
            <BookOpen className="size-5" />
          </span>
          <p className="text-title-sm text-on-surface">Aucune formation en cours</p>
          <p className="text-body-sm text-on-surface-variant">Choisissez un parcours dans le catalogue : votre progression sera enregistrée ici.</p>
          <Button href="/membres/formations/catalogue" variant="tonal" size="sm" className="mt-auto">
            Parcourir le catalogue
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      )}
    </Widget>
  )
}
