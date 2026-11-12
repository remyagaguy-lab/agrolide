'use client'

import * as React from 'react'
import { Alert } from '@/components/ui/Alert'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { debloquerMembre } from '@/app/actions/blocages'
import type { MembreBloque } from '@/lib/reseau/blocage.server'

/** Liste des membres que j'ai bloqués, avec « Débloquer ». Le déblocage ne rétablit pas le lien supprimé. */
export function MembresBloquesListe({ initial }: { initial: MembreBloque[] }) {
  const [membres, setMembres] = React.useState(initial)
  const [enCours, setEnCours] = React.useState<string | null>(null)
  const [erreur, setErreur] = React.useState<string | null>(null)
  const [pending, start] = React.useTransition()
  const { toast } = useToast()

  const debloquer = (m: MembreBloque) => {
    setErreur(null)
    setEnCours(m.id)
    start(async () => {
      const res = await debloquerMembre(m.id)
      if (res.success) {
        setMembres((l) => l.filter((x) => x.id !== m.id))
        toast({ title: `${m.nom} est débloqué(e).`, description: 'Vous pouvez de nouveau vous inviter.', variant: 'success' })
      } else setErreur(res.error)
    })
  }

  return (
    <div role="group" aria-labelledby="bloques-titre" className="space-y-3">
      <h2 id="bloques-titre" className="text-title-md text-on-surface">Membres bloqués</h2>
      <p className="text-body-sm text-on-surface-variant">
        Un membre bloqué ne vous voit plus et ne peut plus vous inviter ni vous écrire. Débloquer ne rétablit pas la relation : il faudra vous inviter de nouveau.
      </p>
      <div aria-live="polite">{erreur && <Alert variant="error">{erreur}</Alert>}</div>
      {membres.length === 0 ? (
        <p className="rounded-card border border-outline-variant bg-surface-container-lowest p-4 text-body-md text-on-surface-variant">Vous n’avez bloqué aucun membre.</p>
      ) : (
        <ul className="space-y-2">
          {membres.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-3">
              <Avatar src={m.photo_url} name={m.nom} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-title-sm text-on-surface">{m.nom}</p>
                {m.specialite && <p className="truncate text-body-sm text-on-surface-variant">{m.specialite}</p>}
              </div>
              <Button variant="outline" onClick={() => debloquer(m)} loading={pending && enCours === m.id} disabled={pending} aria-label={`Débloquer ${m.nom}`}>
                Débloquer
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
