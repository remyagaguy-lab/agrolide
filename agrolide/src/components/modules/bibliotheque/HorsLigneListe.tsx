'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/client'
import { buttonVariants } from '@/components/ui/Button'
import { listerHorsLigne, supprimerHorsLigne, DUREE_JOURS, type ResumeHorsLigne } from '@/lib/bibliotheque/hors-ligne'
import { FileText, Library, Trash2 } from '@/components/ui/icons'

const taille = (octets: number) => (octets >= 1e6 ? `${(octets / 1e6).toFixed(1)} Mo` : `${Math.max(1, Math.round(octets / 1e3))} Ko`)
const joursRestants = (expireLe: number) => Math.max(0, Math.ceil((expireLe - Date.now()) / 86_400_000))

/** Documents gardés sur cet appareil : lisibles sans connexion, uniquement dans la liseuse de l'application. */
export function HorsLigneListe() {
  const { userId, isLoaded } = useAuth()
  const [docs, setDocs] = useState<ResumeHorsLigne[] | null>(null)

  useEffect(() => {
    if (!isLoaded && typeof navigator !== 'undefined' && navigator.onLine) return
    let actif = true
    listerHorsLigne(userId).then((liste) => {
      if (actif) setDocs(liste)
    })
    return () => {
      actif = false
    }
  }, [userId, isLoaded])

  const retirer = async (id: string) => {
    await supprimerHorsLigne(id)
    setDocs((d) => (d ? d.filter((x) => x.id !== id) : d))
  }

  if (docs === null) return <p className="text-body-md text-on-surface-variant">Chargement…</p>

  if (docs.length === 0) {
    return (
      <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-8 text-center">
        <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
          <Library className="size-6" aria-hidden />
        </span>
        <h2 className="text-title-md font-bold text-on-surface">Aucun document gardé sur cet appareil</h2>
        <p className="mx-auto mt-1 max-w-md text-body-md text-on-surface-variant">
          Ouvrez un document dans la bibliothèque puis choisissez « Garder hors ligne » dans la barre de la liseuse : vous pourrez le relire sans connexion.
        </p>
        <Link href="/membres/bibliotheque" className={buttonVariants({ variant: 'tonal', size: 'sm', className: 'mt-5' })}>
          Parcourir la bibliothèque
        </Link>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {docs.map((d) => (
        <li key={d.id} className="flex items-center gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
            <FileText className="size-5" aria-hidden />
          </span>
          <Link href={`/membres/bibliotheque/${d.id}/lire`} className="ag-state min-w-0 flex-1 rounded-control">
            <span className="line-clamp-2 block text-label-lg font-bold text-on-surface">{d.titre}</span>
            <span className="block text-label-md text-on-surface-variant">
              {taille(d.taille)} · encore {joursRestants(d.expireLe)} j sur {DUREE_JOURS}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => retirer(d.id)}
            aria-label={`Retirer « ${d.titre} » de cet appareil`}
            title="Retirer de cet appareil"
            className="ag-state inline-flex size-11 shrink-0 items-center justify-center rounded-control text-on-surface-variant hover:bg-surface-container hover:text-error"
          >
            <Trash2 className="size-5" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  )
}
