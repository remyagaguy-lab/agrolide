'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Share2, Smartphone, X } from '@/components/ui/icons'

/** Événement Chrome / Android : l'invite d'installation, gardée pour être déclenchée par notre propre bouton. */
interface InvitePrompt extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const CLE = 'ag-pwa-invitation'
/** Après un refus, on ne redemande qu'au bout de 30 jours. */
const REPOS_MS = 30 * 86_400_000
/** Le temps de laisser la page et la bannière des cookies se poser. */
const DELAI_MS = 20_000

function repos(): boolean {
  try {
    const v = localStorage.getItem(CLE)
    if (v === 'installee') return true
    return !!v && Date.now() - Number(v) < REPOS_MS
  } catch {
    return false
  }
}
function memoriser(valeur: string) {
  try {
    localStorage.setItem(CLE, valeur)
  } catch {}
}

const dejaInstallee = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true

const surIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

/**
 * Invitation à installer l'application, discrète et fermable.
 * Android / Chrome : bouton « Installer » (événement beforeinstallprompt) ; iOS : explication « Partager, puis Sur l'écran
 * d'accueil » (Safari n'a pas d'invite programmable). Rien n'est affiché si l'application est déjà installée ou si
 * l'invitation a été fermée (mémorisé 30 jours).
 */
export function InvitationInstallation() {
  const [invite, setInvite] = useState<InvitePrompt | null>(null)
  const [ios, setIos] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (dejaInstallee() || repos()) return
    let minuteur: ReturnType<typeof setTimeout> | undefined
    const apres = () => {
      clearTimeout(minuteur)
      minuteur = setTimeout(() => setVisible(true), DELAI_MS)
    }
    const surPrompt = (e: Event) => {
      e.preventDefault()
      setInvite(e as InvitePrompt)
      apres()
    }
    const surInstallee = () => {
      memoriser('installee')
      setVisible(false)
    }
    window.addEventListener('beforeinstallprompt', surPrompt)
    window.addEventListener('appinstalled', surInstallee)
    if (surIos()) {
      setIos(true)
      apres()
    }
    return () => {
      clearTimeout(minuteur)
      window.removeEventListener('beforeinstallprompt', surPrompt)
      window.removeEventListener('appinstalled', surInstallee)
    }
  }, [])

  const fermer = useCallback(() => {
    memoriser(String(Date.now()))
    setVisible(false)
  }, [])

  const installer = useCallback(async () => {
    if (!invite) return
    setVisible(false)
    try {
      await invite.prompt()
      const { outcome } = await invite.userChoice
      memoriser(outcome === 'accepted' ? 'installee' : String(Date.now()))
    } catch {
      memoriser(String(Date.now()))
    }
    setInvite(null)
  }, [invite])

  if (!visible || (!invite && !ios)) return null

  return (
    <section
      aria-label="Installer l'application"
      className="fixed inset-x-3 bottom-24 z-40 flex items-start gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-4 shadow-elev-4 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[420px]"
    >
      <Smartphone className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-title-sm text-on-surface">Installer agrolide sur votre appareil</p>
        {invite ? (
          <>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Un accès direct depuis l&apos;écran d&apos;accueil, et vos documents gardés lisibles sans connexion.
            </p>
            <Button variant="secondary" size="md" className="mt-3" onClick={installer}>
              Installer
            </Button>
          </>
        ) : (
          <p className="mt-1 text-body-md text-on-surface-variant">
            Touchez <Share2 className="inline size-4 align-text-bottom" aria-hidden />
            <span className="font-medium text-on-surface"> Partager</span>, puis{' '}
            <span className="font-medium text-on-surface">Sur l&apos;écran d&apos;accueil</span>.
          </p>
        )}
      </div>
      <IconButton label="Fermer" onClick={fermer} className="-mr-2 -mt-2">
        <X className="size-5" aria-hidden />
      </IconButton>
    </section>
  )
}
