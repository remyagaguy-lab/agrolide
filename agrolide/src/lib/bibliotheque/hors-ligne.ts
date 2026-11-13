/**
 * Lecture hors ligne : un document gardé « pour plus tard » est rangé dans le stockage interne du navigateur
 * (IndexedDB), jamais comme un fichier : il ne se rouvre que dans la liseuse de l'application. La copie est liée au
 * compte, expire au bout de 30 jours et est effacée à la déconnexion.
 * Tout est protégé par try/catch : sans stockage (navigation privée…), la liseuse fonctionne comme avant.
 */
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

export interface DocumentHorsLigne {
  id: string
  titre: string
  membreId: string
  taille: number
  enregistreLe: number
  expireLe: number
  fichier: Blob
}
export type ResumeHorsLigne = Omit<DocumentHorsLigne, 'fichier'>

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
export async function lireHorsLigne(id: string, membreId?: string | null): Promise<DocumentHorsLigne | null> {
  try {
    const doc = await transaction<DocumentHorsLigne | undefined>('readonly', (t) => t.get(id))
    if (!doc) return null
    if (doc.expireLe < Date.now()) {
      void supprimerHorsLigne(id)
      return null
    }
    if (membreId && doc.membreId !== membreId) return null
    return doc
  } catch {
    return null
  }
}

export async function enregistrerHorsLigne(doc: { id: string; titre: string; membreId: string; fichier: Blob }): Promise<boolean> {
  try {
    const maintenant = Date.now()
    const entree: DocumentHorsLigne = {
      ...doc,
      taille: doc.fichier.size,
      enregistreLe: maintenant,
      expireLe: maintenant + DUREE_JOURS * 86_400_000,
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
    const tous = await transaction<DocumentHorsLigne[]>('readonly', (t) => t.getAll())
    const maintenant = Date.now()
    return tous
      .filter((d) => d.expireLe >= maintenant && (!membreId || d.membreId === membreId))
      .map(({ fichier: _f, ...resume }) => resume)
      .sort((a, b) => b.enregistreLe - a.enregistreLe)
  } catch {
    return []
  }
}

/** À la déconnexion : plus aucune copie ne reste sur l'appareil. */
export async function viderHorsLigne(): Promise<void> {
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith(REPERE)) localStorage.removeItem(k)
  } catch {}
  try {
    await transaction('readwrite', (t) => t.clear())
  } catch {}
}
