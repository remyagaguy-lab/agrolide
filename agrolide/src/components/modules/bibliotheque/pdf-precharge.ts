/**
 * Préchargement du PDF : la requête part dès que la page est affichée, pendant que le code de la liseuse (lourd)
 * se télécharge encore. La liseuse récupère ensuite la réponse déjà en route au lieu de la demander à son tour.
 */
const enCours = new Map<string, Promise<Response>>()

export function precharger(documentId: string) {
  if (enCours.has(documentId)) return
  const requete = fetch(`/api/bibliotheque/download/${documentId}`, { credentials: 'same-origin' })
  requete.catch(() => {})
  enCours.set(documentId, requete)
}

/** Réponse préchargée (à usage unique), ou une nouvelle requête si rien n'a été lancé. */
export function obtenirPdf(documentId: string): Promise<Response> {
  const prete = enCours.get(documentId)
  enCours.delete(documentId)
  return prete ?? fetch(`/api/bibliotheque/download/${documentId}`, { credentials: 'same-origin' })
}
