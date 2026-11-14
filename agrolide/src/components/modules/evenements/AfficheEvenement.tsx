import Image from 'next/image'

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
        {/* Version réduite servie par l'optimiseur d'images (quelques dizaines de Ko au lieu de plusieurs Mo) ;
            l'original n'est ouvert qu'au clic. Dimensions inconnues : l'affiche garde ses proportions. */}
        <Image
          src={adresse}
          alt={`Affiche de l'événement « ${titre} »`}
          width={0}
          height={0}
          sizes="(max-width: 1024px) 100vw, 40vw"
          unoptimized={src.includes('r2.cloudflarestorage.com')}
          className="mx-auto h-auto w-full"
        />
      </a>
      <figcaption className="text-center text-body-sm text-on-surface-variant">
        <a href={adresse} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Voir l'affiche en grand</a>
      </figcaption>
    </figure>
  )
}
