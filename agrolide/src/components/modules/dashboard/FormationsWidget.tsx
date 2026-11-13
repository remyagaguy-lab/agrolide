import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Widget, WidgetHeader } from "./Widget"

import { NotebookPen, PlayCircle, ArrowRight } from "@/components/ui/icons"
export interface FormationEnCours {
  formationId: string
  titre: string
  /** Leçons validées / total (0 / 0 pour une formation sans parcours en leçons). */
  faites: number
  total: number
  pourcent: number
  prochaineLeconId: string | null
}

export interface FormationCatalogue {
  id: string
  titre: string
  niveau: string
  gratuite: boolean
}

/**
 * Bloc Formations. Avec une formation commencée : « Ma formation » (progression réelle, bouton Reprendre, qui porte
 * le bouton orange de la page). Sans : une vitrine de trois formations du catalogue.
 */
export function FormationsWidget({ formation, catalogue }: { formation: FormationEnCours | null; catalogue: FormationCatalogue[] }) {
  if (!formation) {
    return (
      <Widget>
        <WidgetHeader title="Formations à découvrir" tone="soleil" icon={<NotebookPen />} href="/membres/formations/catalogue" linkLabel="Catalogue" />
        {catalogue.length > 0 ? (
          <ul className="flex flex-col p-3 pt-1">
            {catalogue.map((f) => (
              <li key={f.id}>
                <Link href={`/membres/formations/${f.id}`} className="ag-state group flex min-h-14 items-center gap-3 rounded-control px-2.5 py-1.5">
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block text-title-sm text-on-surface group-hover:text-primary">{f.titre}</span>
                    {f.niveau && <span className="block text-label-md text-on-surface-muted">{f.niveau}</span>}
                  </span>
                  {f.gratuite && <Badge variant="success" className="shrink-0">Gratuite</Badge>}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-5 pt-2 text-body-md text-on-surface-variant">Les parcours de formation arrivent bientôt.</p>
        )}
      </Widget>
    )
  }

  return (
    <Widget>
      <WidgetHeader title="Ma formation" tone="soleil" icon={<NotebookPen />} href="/membres/formations" linkLabel="Mon parcours" />
      <div className="flex flex-1 flex-col gap-4 p-5 pt-3">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
            <PlayCircle className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-label-md text-on-surface-variant">{formation.faites > 0 ? "À reprendre" : "À commencer"}</p>
            <h3 className="line-clamp-2 text-title-md text-on-surface">{formation.titre}</h3>
          </div>
        </div>

        {formation.total > 0 && (
          <div>
            <div className="mb-1 flex justify-between text-label-md text-on-surface-variant">
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
          variant="primary"
          size="sm"
          fullWidth
          className="mt-auto min-h-11"
        >
          {formation.faites > 0 ? "Reprendre" : "Commencer"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </Widget>
  )
}
