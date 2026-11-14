import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils/formatters'
import { getAllFormations } from '@/lib/cache/public-queries'
import CourseFilters from './CourseFilters'
import { CarteCatalogue } from './CarteCatalogue'

type Espace = 'membre' | 'public'

/**
 * Catalogue des formations : filtres + grille, partagé par le site public (/formations) et l'espace membre
 * (/membres/formations/catalogue). Seuls les liens changent : un membre reste dans son espace.
 */
export async function CatalogueFormations({
  searchParams,
  mode,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
  mode: Espace
}) {
  const base = mode === 'membre' ? '/membres/formations' : '/formations'
  const source = searchParams.source as string | undefined;
  const niveau = searchParams.niveau as string | undefined;
  const prix = searchParams.prix as string | undefined;
  const thematique = searchParams.thematique as string | undefined;

  // Liste identique pour tout le monde : lue dans le cache de données (1 h, invalidé par les actions admin
  // via revalidateTag('formations')) au lieu d'un appel D1 à chaque visite.
  let allFormations = await getAllFormations();

  // Apply filters
  if (source) {
    if (source === 'Agrolide') { // editorial:ignore valeur stockée en base
      allFormations = allFormations.filter(f => !f.source_externe || f.source_externe === 'Agrolide'); // editorial:ignore valeur stockée en base
    } else {
      allFormations = allFormations.filter(f => f.source_externe === source);
    }
  }

  if (niveau) {
    allFormations = allFormations.filter(f => f.niveau === niveau);
  }

  if (thematique) {
    allFormations = allFormations.filter(f => f.thematique === thematique);
  }

  if (prix) {
    if (prix === 'gratuit') {
      allFormations = allFormations.filter(f => f.prix_fcfa === 0);
    } else if (prix === 'payant') {
      allFormations = allFormations.filter(f => (f.prix_fcfa || 0) > 0);
    }
  }

  // Une seule liste : formations Agrolide et partenaires alternées (comme la bibliothèque), le filtre « source » sépare au besoin.
  const partenaires = allFormations.filter((f) => !!f.lien_externe)
  const propres = allFormations.filter((f) => !f.lien_externe)
  const melangees: typeof allFormations = []
  for (let i = 0; i < Math.max(propres.length, partenaires.length); i++) {
    if (propres[i]) melangees.push(propres[i])
    if (partenaires[i]) melangees.push(partenaires[i])
  }

  return (
    <section
      className={cn(
        'mx-auto mb-20 w-full flex-1 pt-2',
        // Dans l'espace membre, même largeur que la barre d'onglets ; sur le site public, la largeur du site.
        mode === 'membre' ? 'max-w-[1200px] px-2 md:px-4' : 'max-w-7xl px-4 sm:px-6 lg:px-8',
      )}
    >
      <div className="space-y-5">
        {/* Barre de filtres */}
        <CourseFilters />

        {/* Grille */}
        {allFormations.length === 0 ? (
          <EmptyState arche title="Aucune formation trouvée" description="Modifiez vos filtres pour découvrir nos autres programmes ou revenez bientôt !" />
        ) : (
          <div>
            <p role="status" className="mb-4 text-body-md text-on-surface-variant">
              {allFormations.length} {allFormations.length > 1 ? 'formations' : 'formation'}
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {melangees.map((formation) => (
                <CarteCatalogue key={formation.id} formation={formation} href={`${base}/${formation.id}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
