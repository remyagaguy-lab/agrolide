/**
 * Alertes push côté navigateur. Rien ici ne s'exécute au chargement d'une page : la permission n'est demandée que
 * par `activerPush`, appelée depuis un bouton (geste explicite du membre).
 */
import { TOUTES_CATEGORIES, type CategoriePush } from './categories'

export type EtatPush =
  | { etat: 'indisponible'; raison: 'navigateur' | 'ios-installer' }
  | { etat: 'refuse' } // permission bloquée dans les réglages du navigateur
  | { etat: 'inactif' }
  | { etat: 'actif'; categories: CategoriePush[]; endpoint: string }

export class ErreurPush extends Error {}

const aServiceWorker = () => typeof navigator !== 'undefined' && 'serviceWorker' in navigator
const estIos = () => typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)
const estInstallee = () =>
  typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true)

export function pushPrisEnCharge(): boolean {
  return aServiceWorker() && 'PushManager' in window && 'Notification' in window
}

async function registration() {
  // Le service worker n'est enregistré qu'en production : sans lui, `ready` ne se résoudrait jamais.
  const existante = await navigator.serviceWorker.getRegistration('/')
  if (!existante) throw new ErreurPush('Le service worker n’est pas actif sur cet appareil. Rechargez la page puis réessayez.')
  return navigator.serviceWorker.ready
}

async function api(methode: 'GET' | 'POST' | 'PUT' | 'DELETE', corps?: object, requete = '') {
  const res = await fetch('/api/push/abonnement' + requete, {
    method: methode,
    credentials: 'same-origin',
    cache: 'no-store',
    headers: corps ? { 'Content-Type': 'application/json' } : undefined,
    body: corps ? JSON.stringify(corps) : undefined,
  })
  const donnees = await res.json().catch(() => ({}))
  if (!res.ok) throw new ErreurPush(donnees.error || 'Le serveur n’a pas pu enregistrer ce réglage. Réessayez.')
  return donnees as { actif: boolean; categories: CategoriePush[] }
}

/** État de cet appareil : pris en charge ? autorisé ? abonné ? (aucune demande de permission). */
export async function lireEtatPush(): Promise<EtatPush> {
  if (!pushPrisEnCharge()) {
    // Sur iPhone, les alertes n'existent que dans l'application installée sur l'écran d'accueil.
    return { etat: 'indisponible', raison: estIos() && !estInstallee() ? 'ios-installer' : 'navigateur' }
  }
  if (Notification.permission === 'denied') return { etat: 'refuse' }
  try {
    const sub = await (await registration()).pushManager.getSubscription()
    if (!sub) return { etat: 'inactif' }
    // Le serveur est la référence : un abonnement purgé (périmé) ou d'un autre compte compte comme inactif.
    const serveur = await api('GET', undefined, `?endpoint=${encodeURIComponent(sub.endpoint)}`)
    return serveur.actif ? { etat: 'actif', categories: serveur.categories, endpoint: sub.endpoint } : { etat: 'inactif' }
  } catch {
    return { etat: 'inactif' }
  }
}

const cleEnOctets = (b64u: string) => {
  const b64 = (b64u + '='.repeat((4 - (b64u.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}

/** À appeler depuis un clic : demande la permission, abonne l'appareil, l'enregistre sur le serveur. */
export async function activerPush(categories: CategoriePush[] = TOUTES_CATEGORIES): Promise<EtatPush> {
  if (!pushPrisEnCharge()) throw new ErreurPush('Ce navigateur ne permet pas les alertes.')
  const reg = await registration()
  const cleRes = await fetch('/api/push/cle', { credentials: 'same-origin', cache: 'no-store' })
  if (cleRes.status === 503) throw new ErreurPush('Les alertes ne sont pas encore disponibles. Réessayez bientôt.')
  if (!cleRes.ok) throw new ErreurPush('Impossible de préparer les alertes. Vérifiez votre connexion et réessayez.')
  const { cle } = (await cleRes.json()) as { cle: string }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new ErreurPush(
      permission === 'denied'
        ? 'Les alertes sont bloquées pour ce site. Autorisez-les dans les réglages de votre navigateur, puis réessayez.'
        : 'Vous n’avez pas autorisé les alertes. Vous pouvez réessayer quand vous voulez.',
    )
  }
  // Un ancien abonnement fait avec d'autres clés serait refusé : on repart d'un abonnement propre.
  let sub = await reg.pushManager.getSubscription()
  if (sub) {
    const actuelle = sub.options.applicationServerKey ? btoa(String.fromCharCode(...new Uint8Array(sub.options.applicationServerKey))) : ''
    const voulue = btoa(String.fromCharCode(...cleEnOctets(cle)))
    if (actuelle !== voulue) {
      await sub.unsubscribe()
      sub = null
    }
  }
  sub ??= await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: cleEnOctets(cle) })
  const r = await api('POST', { subscription: sub.toJSON(), categories })
  return { etat: 'actif', categories: r.categories, endpoint: sub.endpoint }
}

/** Désactive les alertes sur cet appareil (navigateur et serveur). */
export async function desactiverPush(): Promise<void> {
  if (!pushPrisEnCharge()) return
  const sub = await (await registration()).pushManager.getSubscription()
  if (!sub) return
  const endpoint = sub.endpoint
  await api('DELETE', { endpoint }).catch(() => {})
  await sub.unsubscribe()
}

export async function changerCategoriesPush(endpoint: string, categories: CategoriePush[]): Promise<CategoriePush[]> {
  return (await api('PUT', { endpoint, categories })).categories
}

/** Déconnexion : l'appareil ne doit plus recevoir les alertes de ce compte. Ne lève jamais d'erreur. */
export async function desabonnerCetAppareil(): Promise<void> {
  try {
    if (pushPrisEnCharge()) await desactiverPush()
  } catch {}
}
