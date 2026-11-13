import { lireHorsLigne } from '@/lib/bibliotheque/hors-ligne'

/**
 * Préchargement du PDF : la copie gardée hors ligne si elle existe, sinon la requête réseau, lancée dès que la page
 * est affichée, pendant que le code de la liseuse (lourd) se télécharge encore.
 */
export type SourcePdf = { source: 'local'; fichier: Blob } | { source: 'reseau'; reponse: Response }

const enCours = new Map<string, Promise<SourcePdf>>()

function demander(documentId: string): Promise<SourcePdf> {
  // Requête déjà lancée par la page elle-même (script en tête de page, voir LectureDocumentView) : on la reprend.
  const tot = (window as unknown as { __agPdf?: Record<string, Promise<Response>> }).__agPdf?.[documentId]
  if (tot) return tot.then((reponse): SourcePdf => ({ source: 'reseau', reponse }))
  return lireHorsLigne(documentId).then(async (copie): Promise<SourcePdf> => {
    if (copie) return { source: 'local', fichier: copie.fichier }
    return { source: 'reseau', reponse: await fetch(`/api/bibliotheque/download/${documentId}`, { credentials: 'same-origin' }) }
  })
}

export function precharger(documentId: string) {
  if (enCours.has(documentId)) return
  const requete = demander(documentId)
  requete.catch(() => {})
  enCours.set(documentId, requete)
}

/** Source préchargée (à usage unique), ou une nouvelle demande si rien n'a été lancé. */
export function obtenirPdf(documentId: string): Promise<SourcePdf> {
  const prete = enCours.get(documentId)
  enCours.delete(documentId)
  return prete ?? demander(documentId)
}
