/** Adresse affichable d'une affiche (les fichiers du stockage privé passent par le relais). */
export const urlAffiche = (url: string) =>
  url.includes('r2.cloudflarestorage.com') ? `/api/r2-proxy?url=${encodeURIComponent(url)}` : url

/** Toutes les affiches d'une fiche : l'affiche principale, puis les affiches supplémentaires (liste JSON). */
export function listeAffiches(event: { image_url?: string | null; affiches_supplementaires?: string | null }): string[] {
  let autres: string[] = []
  try {
    const v = event.affiches_supplementaires ? JSON.parse(event.affiches_supplementaires) : []
    if (Array.isArray(v)) autres = v.filter((x): x is string => typeof x === 'string' && x.length > 0)
  } catch {
    autres = []
  }
  return [event.image_url, ...autres].filter((x): x is string => !!x)
}

/**
 * Affiche d'un événement ou d'un webinaire, montrée EN ENTIER (sans recadrage) sur la page de lecture.
 * Un clic l'ouvre en grand dans un nouvel onglet. Les cartes des listes n'en montrent qu'un extrait.
 */
export default function AfficheEvenement({ src, titre }: { src: string; titre: string }) {
  const adresse = urlAffiche(src)
  return (
    <figure className="space-y-2">
      <a href={adresse} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-card border border-outline-variant bg-surface-container">
        {/* eslint-disable-next-line @next/next/no-img-element -- dimensions inconnues : l'affiche garde ses proportions */}
        <img src={adresse} alt={`Affiche de l'événement « ${titre} »`} loading="lazy" className="mx-auto h-auto max-h-[80vh] w-auto max-w-full object-contain" />
      </a>
      <figcaption className="text-center text-body-sm text-on-surface-variant">
        <a href={adresse} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Voir l'affiche en grand</a>
      </figcaption>
    </figure>
  )
}
