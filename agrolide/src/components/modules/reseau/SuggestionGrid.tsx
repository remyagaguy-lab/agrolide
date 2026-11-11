'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import type { MemberSummary } from '@/lib/reseau/profil'
import { MemberCard } from './MemberCard'

/** Clé de stockage dans le navigateur : « Ignorer » n'enregistre rien côté serveur. */
const CLE = 'agrolide-reseau-suggestions-ignorees'

function lire(): string[] {
  try {
    const brut = window.localStorage.getItem(CLE)
    const liste = brut ? JSON.parse(brut) : []
    return Array.isArray(liste) ? liste.filter((x): x is string => typeof x === 'string').slice(-500) : []
  } catch {
    return []
  }
}

function ecrire(ids: string[]) {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(ids.slice(-500)))
  } catch {
    // stockage indisponible (navigation privée, données bloquées) : l'ignorance ne vaut que pour cette page
  }
}

/**
 * Résultats du tri « pertinence » : « Suggestions pour vous » (avec la raison de chaque suggestion et un bouton
 * « Ignorer ») puis « Nouveaux membres ». Les suggestions ignorées sont mémorisées dans ce navigateur et réaffichables.
 */
export function SuggestionGrid({ members }: { members: MemberSummary[] }) {
  const [ignores, setIgnores] = React.useState<string[]>([])
  const [annonce, setAnnonce] = React.useState('')

  React.useEffect(() => setIgnores(lire()), [])

  const ignorer = (m: MemberSummary, nom: string) => {
    const next = [...ignores.filter((id) => id !== m.id), m.id]
    setIgnores(next)
    ecrire(next)
    setAnnonce(`Suggestion ignorée : ${nom}.`)
  }
  const reafficher = () => {
    setIgnores([])
    ecrire([])
    setAnnonce('Les suggestions ignorées sont de nouveau affichées.')
  }

  const masquees = members.filter((m) => m.suggere && ignores.includes(m.id)).length
  const suggeres = members.filter((m) => m.suggere && !ignores.includes(m.id))
  const nouveaux = members.filter((m) => !m.suggere)

  const grille = (liste: MemberSummary[], avecIgnorer: boolean) => (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {liste.map((m) => (
        <li key={m.id}>
          <MemberCard
            member={m}
            onIgnore={avecIgnorer ? () => ignorer(m, `${m.prenom ?? ''} ${m.nom ?? ''}`.trim() || 'ce membre') : undefined}
          />
        </li>
      ))}
    </ul>
  )

  return (
    <div className="space-y-8">
      <p role="status" className="sr-only">{annonce}</p>

      {(suggeres.length > 0 || masquees > 0) && (
        <div role="region" aria-labelledby="titre-suggestions" className="space-y-4">
          <h2 id="titre-suggestions" className="text-title-lg text-on-surface">Suggestions pour vous</h2>
          {suggeres.length > 0 && grille(suggeres, true)}
          {masquees > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-card bg-surface-container-low p-3 text-body-sm text-on-surface-variant">
              <p>
                {masquees} {masquees > 1 ? 'suggestions ignorées' : 'suggestion ignorée'} sur cette page, mémorisées dans ce navigateur.
              </p>
              <Button variant="outline" onClick={reafficher}>Afficher les suggestions ignorées</Button>
            </div>
          )}
        </div>
      )}

      {nouveaux.length > 0 && (
        <div role="region" aria-labelledby="titre-nouveaux" className="space-y-4">
          <div>
            <h2 id="titre-nouveaux" className="text-title-lg text-on-surface">Nouveaux membres</h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Pas de point commun marqué avec votre profil pour le moment. Du plus récent au plus ancien.
            </p>
          </div>
          {grille(nouveaux, false)}
        </div>
      )}
    </div>
  )
}
