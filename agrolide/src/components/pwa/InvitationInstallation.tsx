'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Check, Share2, Smartphone, X } from '@/components/ui/icons'
import { useInstallation } from '@/lib/pwa-installation'

const CLE = 'ag-pwa-invitation'
/** « Plus tard » : on repropose au bout de 3 jours. */
const REPOS_MS = 3 * 86_400_000
/** Laisse la page s'afficher avant de proposer. */
const DELAI_MS = 4_000

/** Avantages de l'application installée (uniquement ce qu'elle fait réellement). */
export const AVANTAGES_APPLICATION = [
  "Un accès direct depuis l'écran d'accueil, en plein écran",
  'Vos documents enregistrés, lisibles sans connexion',
  'Vos formations, vos messages et les opportunités en un geste',
  'Être alerté des nouvelles opportunités et de vos messages',
]

function enRepos(): boolean {
  try {
    const v = Number(localStorage.getItem(CLE))
    return !!v && Date.now() - v < REPOS_MS
  } catch {
    return false
  }
}
/** Le choix sur les cookies est fait : la bannière des cookies ne se superpose pas à celle-ci. */
function cookiesTranches(): boolean {
  try {
    return localStorage.getItem('cookie-consent') !== null
  } catch {
    return true
  }
}

/** Pages de lecture ou de conversation : l'invitation ne gêne pas. */
const PAGES_CALMES = [/\/lire(\/|$)/, /\/suivre(\/|$)/, /^\/membres\/messages/, /^\/hors-ligne/]

/**
 * Invitation à installer l'application, sur toutes les pages, surtout sur mobile.
 * Android / Chrome : bouton « Installer » ; iPhone : « Partager, puis Sur l'écran d'accueil ».
 * « Plus tard » la ferme pour 3 jours. Elle revient si l'application a été désinstallée (le navigateur ne rend l'invite
 * disponible que si elle n'est pas installée). Rien n'est affiché dans l'application installée.
 */
export function InvitationInstallation() {
  const { peutProposer, invite, installer } = useInstallation()
  const pathname = usePathname() ?? ''
  const [pret, setPret] = useState(false)
  const [ferme, setFerme] = useState(false)

  useEffect(() => {
    if (!peutProposer || enRepos()) return
    let minuteur: ReturnType<typeof setTimeout> | undefined
    const verifier = setInterval(() => {
      if (!cookiesTranches()) return
      clearInterval(verifier)
      minuteur = setTimeout(() => setPret(true), DELAI_MS)
    }, 1500)
    return () => {
      clearInterval(verifier)
      clearTimeout(minuteur)
    }
  }, [peutProposer])

  const plusTard = () => {
    try {
      localStorage.setItem(CLE, String(Date.now()))
    } catch {}
    setFerme(true)
  }

  if (!peutProposer || !pret || ferme || PAGES_CALMES.some((re) => re.test(pathname))) return null

  const membre = pathname.startsWith('/membres')
  return (
    <section
      aria-label="Installer l'application"
      className={`fixed inset-x-3 z-40 rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-elev-4 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[420px] ${membre ? 'bottom-24' : 'bottom-3'}`}
    >
      <div className="flex items-start gap-3">
        <Smartphone className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-title-sm text-on-surface">Installez agrolide sur votre téléphone</p>
          <ul className="mt-2 space-y-1.5">
            {AVANTAGES_APPLICATION.map((a) => (
              <li key={a} className="flex items-start gap-2 text-body-md text-on-surface-variant">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {a}
              </li>
            ))}
          </ul>
        </div>
        <IconButton label="Plus tard" onClick={plusTard} className="-mr-2 -mt-2">
          <X className="size-5" aria-hidden />
        </IconButton>
      </div>
      {invite ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" size="md" onClick={installer}>
            Installer l&apos;application
          </Button>
          <Button variant="text" size="md" onClick={plusTard}>
            Plus tard
          </Button>
        </div>
      ) : (
        <p className="mt-3 rounded-control bg-surface-container-low p-3 text-body-md text-on-surface-variant">
          Touchez <Share2 className="inline size-4 align-text-bottom" aria-hidden />
          <span className="font-medium text-on-surface"> Partager</span>, puis{' '}
          <span className="font-medium text-on-surface">Sur l&apos;écran d&apos;accueil</span>.
        </p>
      )}
    </section>
  )
}
