'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { changerStatutSignalement } from '@/app/actions/signalements-admin'
import type { StatutSignalement } from '@/lib/reseau/signalements'

const ACTIONS: Record<StatutSignalement, { vers: StatutSignalement; label: string }[]> = {
  nouveau: [{ vers: 'en_cours', label: 'Prendre en charge' }, { vers: 'traite', label: 'Marquer comme traité' }],
  en_cours: [{ vers: 'traite', label: 'Marquer comme traité' }, { vers: 'nouveau', label: 'Remettre en nouveau' }],
  traite: [{ vers: 'en_cours', label: 'Rouvrir' }],
}

export function SignalementActions({ id, statut, nom }: { id: string; statut: StatutSignalement; nom: string }) {
  const router = useRouter()
  const [pending, start] = React.useTransition()
  const [enCours, setEnCours] = React.useState<StatutSignalement | null>(null)
  const [erreur, setErreur] = React.useState<string | null>(null)

  const changer = (vers: StatutSignalement) => {
    setErreur(null)
    setEnCours(vers)
    start(async () => {
      const res = await changerStatutSignalement(id, vers)
      if (res.success) router.refresh()
      else setErreur(res.error)
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {ACTIONS[statut].map((a, i) => (
          <Button
            key={a.vers}
            variant={i === 0 ? 'secondary' : 'outline'}
            loading={pending && enCours === a.vers}
            disabled={pending}
            onClick={() => changer(a.vers)}
            aria-label={`${a.label} : signalement concernant ${nom}`}
          >
            {a.label}
          </Button>
        ))}
      </div>
      <div aria-live="polite">{erreur && <Alert variant="error">{erreur}</Alert>}</div>
    </div>
  )
}
