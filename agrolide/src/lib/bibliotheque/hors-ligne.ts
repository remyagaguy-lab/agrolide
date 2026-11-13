/**
 * Lecture hors ligne : un document gardé « pour plus tard » est rangé dans le stockage interne du navigateur
 * (IndexedDB), jamais comme un fichier : il ne se rouvre que dans la liseuse de l'application. La copie est liée au
 * compte, expire au bout de 30 jours et est effacée à la déconnexion.
 * Le contenu est chiffré (AES-GCM) avec une clé non exportable propre à chaque document : le stockage ne contient jamais
 * le PDF en clair, et la clé ne peut être ni lue ni copiée vers un autre appareil. Cela empêche l'extraction simple d'une
 * copie ; cela n'est pas un DRM absolu (le code de la liseuse, lui, peut déchiffrer pour afficher).
 * Tout est protégé par try/catch : sans stockage (navigation privée…), la liseuse fonctionne comme avant.
 */
import { desabonnerCetAppareil } from '@/lib/push/client'

const BASE = 'agrolide-hors-ligne'
const TABLE = 'documents'
export const DUREE_JOURS = 30
/**
 * Repère léger (localStorage) « ce document est gardé sur l'appareil » : la page sait, avant même de charger son code,
 * si elle doit demander le PDF au réseau ou l'ouvrir depuis l'appareil.
 */
const REPERE = 'ag-hl:'
const repere = (id: string, present: boolean) => {
  try {
    if (present) localStorage.setItem(REPERE + id, '1')
    else localStorage.removeItem(REPERE + id)
  } catch {}
}

export interface ResumeHorsLigne {
  id: string
  titre: string
  membreId: string
  taille: number
  enregistreLe: number
  expireLe: number
}
export interface DocumentHorsLigne extends ResumeHorsLigne {
  fichier: Blob
}
/** Ce qui est réellement rangé : le contenu chiffré et sa clé non exportable. */
interface Entree extends ResumeHorsLigne {
  cle: CryptoKey
  iv: Uint8Array<ArrayBuffer>
  donnees: ArrayBuffer
}

function ouvrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('indisponible'))
    const req = indexedDB.open(BASE, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(TABLE, { keyPath: 'id' })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function transaction<T>(mode: IDBTransactionMode, action: (t: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await ouvrir()
  try {
    return await new Promise<T>((resolve, reject) => {
      const req = action(db.transaction(TABLE, mode).objectStore(TABLE))
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  } finally {
    db.close()
  }
}

/** Copie locale valable (non expirée, et du bon compte si on le connaît) ; sinon null. Les copies expirées sont supprimées. */
async function entreeValable(id: string, membreId?: string | null): Promise<Entree | null> {
  const doc = await transaction<Entree | undefined>('readonly', (t) => t.get(id))
  if (!doc || !doc.donnees || !doc.cle) return null
  if (doc.expireLe < Date.now()) {
    void supprimerHorsLigne(id)
    return null
  }
  if (membreId && doc.membreId !== membreId) return null
  return doc
}

/** Y a-t-il une copie valable ? (sans déchiffrer) */
export async function existeHorsLigne(id: string, membreId?: string | null): Promise<boolean> {
  try {
    return !!(await entreeValable(id, membreId))
  } catch {
    return false
  }
}

/** Copie locale déchiffrée, ou null. */
export async function lireHorsLigne(id: string, membreId?: string | null): Promise<DocumentHorsLigne | null> {
  try {
    const doc = await entreeValable(id, membreId)
    if (!doc) return null
    const clair = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: doc.iv }, doc.cle, doc.donnees)
    const { cle: _c, iv: _i, donnees: _d, ...resume } = doc
    return { ...resume, fichier: new Blob([clair], { type: 'application/pdf' }) }
  } catch {
    return null
  }
}

export async function enregistrerHorsLigne(doc: { id: string; titre: string; membreId: string; fichier: Blob }): Promise<boolean> {
  try {
    const cle = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const donnees = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cle, await doc.fichier.arrayBuffer())
    const maintenant = Date.now()
    const entree: Entree = {
      id: doc.id,
      titre: doc.titre,
      membreId: doc.membreId,
      taille: doc.fichier.size,
      enregistreLe: maintenant,
      expireLe: maintenant + DUREE_JOURS * 86_400_000,
      cle,
      iv,
      donnees,
    }
    await transaction('readwrite', (t) => t.put(entree))
    repere(doc.id, true)
    return true
  } catch {
    return false
  }
}

export async function supprimerHorsLigne(id: string): Promise<void> {
  repere(id, false)
  try {
    await transaction('readwrite', (t) => t.delete(id))
  } catch {}
}

/** Liste des documents gardés (sans les fichiers), pour le compte donné, les plus récents d'abord. */
export async function listerHorsLigne(membreId?: string | null): Promise<ResumeHorsLigne[]> {
  try {
    const tous = await transaction<Entree[]>('readonly', (t) => t.getAll())
    const maintenant = Date.now()
    return tous
      .filter((d) => d.donnees && d.expireLe >= maintenant && (!membreId || d.membreId === membreId))
      .map(({ cle: _c, iv: _i, donnees: _d, ...resume }) => resume)
      .sort((a, b) => b.enregistreLe - a.enregistreLe)
  } catch {
    return []
  }
}

/** À la déconnexion : plus aucune copie ne reste sur l'appareil (documents chiffrés et pages gardées par le service worker). */
export async function viderHorsLigne(): Promise<void> {
  // L'appareil ne reçoit plus les alertes de ce compte (le serveur est joint tant que la session est encore ouverte).
  await desabonnerCetAppareil()
  try {
    for (const nom of await caches.keys()) if (nom.startsWith('ag-pages-') || nom === 'ag-images') await caches.delete(nom)
  } catch {}
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith(REPERE)) localStorage.removeItem(k)
  } catch {}
  try {
    await transaction('readwrite', (t) => t.clear())
  } catch {}
}
