'use client'

import { useSyncExternalStore } from 'react'

/**
 * État d'installation de l'application (PWA), partagé entre la bannière d'invitation et les cadres qui la proposent.
 * - Android / Chrome : l'événement `beforeinstallprompt` n'est émis que si l'application N'EST PAS installée. S'il arrive,
 *   on peut donc (re)proposer l'installation, y compris à quelqu'un qui l'a désinstallée : on ne garde jamais en mémoire
 *   « déjà installée » d'une visite à l'autre.
 * - iOS : pas d'invite programmable, on explique « Partager, puis Sur l'écran d'accueil » ; l'application installée se
 *   reconnaît à `navigator.standalone`.
 */
interface InvitePrompt extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export interface EtatInstallation {
  /** Invite du navigateur disponible : le bouton « Installer » fonctionne. */
  invite: InvitePrompt | null
  /** iPhone / iPad : installation à la main. */
  ios: boolean
  /** Ouverte depuis l'écran d'accueil, ou installée pendant cette visite. */
  installee: boolean
}

const VIDE: EtatInstallation = { invite: null, ios: false, installee: false }
let etat: EtatInstallation = VIDE
let pret = false
const abonnes = new Set<() => void>()
const publier = (suite: Partial<EtatInstallation>) => {
  etat = { ...etat, ...suite }
  abonnes.forEach((f) => f())
}

function demarrer() {
  if (pret || typeof window === 'undefined') return
  pret = true
  const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  etat = { ...etat, installee: standalone, ios: ios && !standalone }
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    publier({ invite: e as InvitePrompt })
  })
  window.addEventListener('appinstalled', () => publier({ installee: true, invite: null }))
}

function abonner(f: () => void) {
  demarrer()
  abonnes.add(f)
  return () => {
    abonnes.delete(f)
  }
}

export function useInstallation(): EtatInstallation & { peutProposer: boolean; installer: () => Promise<boolean> } {
  const e = useSyncExternalStore(abonner, () => etat, () => VIDE)
  const installer = async () => {
    if (!e.invite) return false
    try {
      await e.invite.prompt()
      const { outcome } = await e.invite.userChoice
      publier({ invite: null, installee: outcome === 'accepted' })
      return outcome === 'accepted'
    } catch {
      return false
    }
  }
  return { ...e, peutProposer: !e.installee && (!!e.invite || e.ios), installer }
}
