import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * Notification telle que l'affichent la cloche et la page « Notifications ».
 * La table n'a pas de colonne `titre` : le texte vient de `contenu`, la rubrique de `type`.
 */
export interface NotificationItem {
  id: string
  type: string
  contenu: string
  lien: string | null
  lu: boolean
  created_at: string | null
}

/**
 * Types qui ne passent pas par la cloche : les messages ont leur propre pastille dans la barre de navigation.
 * (Les anciennes lignes `message` restent en base ; on ne les affiche plus.)
 */
export const TYPES_HORS_CLOCHE = ['message']

const LIBELLES: Record<string, string> = {
  connexion: 'Réseau',
  evenement: 'Événement',
  formation: 'Formation',
  cotisation: 'Adhésion',
  forum: 'Forum',
  opportunite: 'Opportunité',
  document: 'Bibliothèque',
}

/** Rubrique affichée au-dessus du texte d'une notification. */
export function libelleType(type: string | null | undefined): string {
  return (type && LIBELLES[type]) || 'Notification'
}

/** N'accepte que les chemins internes : un lien externe ou protocol-relative retombe sur la page des notifications. */
export function lienSur(lien: string | null | undefined): string {
  if (lien && lien.startsWith('/') && !lien.startsWith('//')) return lien
  return '/membres/notifications'
}

/** « il y a 2 heures » ; chaîne vide si la date est absente ou invalide (anciennes lignes sans created_at). */
export function depuis(date: string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  return formatDistanceToNow(d, { addSuffix: true, locale: fr })
}

/**
 * Cycle de vie : une notification LUE disparaît de la liste et de la cloche au bout de 30 jours (elle reste en base,
 * rien n'est supprimé). Une notification non lue reste affichée tant qu'elle n'est pas lue.
 */
export const JOURS_AVANT_MASQUAGE_LUES = 30

/** Date limite (ISO) : les notifications lues créées avant sont masquées. */
export function limiteMasquageLues(maintenant: Date = new Date()): string {
  return new Date(maintenant.getTime() - JOURS_AVANT_MASQUAGE_LUES * 86_400_000).toISOString()
}

/** Vrai si la notification doit être masquée (lue et plus ancienne que la limite ; sans date : jamais masquée). */
export function estMasquee(n: Pick<NotificationItem, 'lu' | 'created_at'>, maintenant: Date = new Date()): boolean {
  if (!n.lu || !n.created_at) return false
  return n.created_at < limiteMasquageLues(maintenant)
}

/** Clé de jour locale (AAAA-MM-JJ) d'une date ISO ; vide si la date est absente ou invalide. */
function cleJour(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** « Aujourd'hui », « Hier » ou « 12 novembre 2026 » ; « Plus ancien » sans date. */
export function libelleJour(iso: string | null | undefined, maintenant: Date = new Date()): string {
  const cle = cleJour(iso)
  if (!cle) return 'Plus ancien'
  if (cle === cleJour(maintenant.toISOString())) return "Aujourd'hui"
  const hier = new Date(maintenant.getTime() - 86_400_000)
  if (cle === cleJour(hier.toISOString())) return 'Hier'
  return new Date(iso as string).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Regroupe les notifications par jour, dans l'ordre de la liste reçue (la plus récente d'abord). */
export function grouperParJour<T extends { created_at: string | null }>(items: T[], maintenant: Date = new Date()): Array<{ jour: string; items: T[] }> {
  const groupes: Array<{ cle: string; jour: string; items: T[] }> = []
  for (const it of items) {
    const cle = cleJour(it.created_at)
    const dernier = groupes[groupes.length - 1]
    if (dernier && dernier.cle === cle) dernier.items.push(it)
    else groupes.push({ cle, jour: libelleJour(it.created_at, maintenant), items: [it] })
  }
  return groupes.map(({ jour, items }) => ({ jour, items }))
}
