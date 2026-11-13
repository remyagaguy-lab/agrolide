import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, GraduationCap, ChevronRight, ExternalLink } from 'lucide-react'
import { getAllFormations } from '@/lib/cache/public-queries'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils/formatters'
import CourseFilters from './CourseFilters'

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
    if (source === 'Agrolide') {
      allFormations = allFormations.filter(f => !f.source_externe || f.source_externe === 'Agrolide');
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

  return (
      <section
        className={cn(
          'flex-1 mx-auto w-full pt-2 mb-20',
          // Dans l'espace membre, même largeur que la barre d'onglets ; sur le site public, la largeur du site.
          mode === 'membre' ? 'max-w-[1200px] px-2 md:px-4' : 'max-w-7xl px-4 sm:px-6 lg:px-8',
        )}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-60 lg:w-64 shrink-0">
            <CourseFilters />
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {allFormations.length === 0 ? (
              <EmptyState arche title="Aucune formation trouvée" description="Modifiez vos filtres pour découvrir nos autres programmes ou revenez bientôt !" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {allFormations.map((formation) => {
                  const isExternal = !!formation.lien_externe;
                  return (
                  <Link key={formation.id} href={`${base}/${formation.id}`} className="group flex flex-col bg-surface-container-lowest rounded-card shadow-sm border border-outline-variant overflow-hidden hover:border-primary hover:shadow-md transition-all duration-300">
                    <div className="relative aspect-[16/10] w-full bg-surface-container overflow-hidden">
                      {formation.cover_image_url ? (
                        <Image
                          src={formation.cover_image_url}
                          alt={formation.titre}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-success-container text-on-success-container">
                          <BookOpen size={48} className="opacity-20" />
                        </div>
                      )}
                      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                        <Badge variant="category" className="max-w-[75%] truncate bg-surface-container-lowest/90 text-on-success-container font-medium backdrop-blur-sm">
                          {formation.thematique}
                        </Badge>
                        {isExternal && (
                          <span className="shrink-0 rounded-full bg-surface-container-lowest/90 p-1.5 text-on-surface-variant backdrop-blur-sm" title="Formation d'un partenaire">
                            <ExternalLink size={14} aria-hidden />
                            <span className="sr-only">Formation d&apos;un partenaire</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="inline-flex items-center gap-1.5 text-label-md font-bold text-primary">
                          <GraduationCap size={16} aria-hidden />
                          {formation.niveau}
                        </span>
                        {isExternal && formation.source_externe && (
                          <Badge variant="neutral" className="max-w-full truncate">
                            {formation.source_externe}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-title-lg font-bold leading-snug text-on-surface mb-2 line-clamp-3 group-hover:text-primary transition-colors">
                        {formation.titre}
                      </h3>

                      <p className="text-body-md text-on-surface-variant line-clamp-3 mb-5 flex-1">
                        {formation.description}
                      </p>

                      <div className="pt-4 border-t border-outline-variant flex items-center justify-between gap-3">
                        <span className="font-bold text-on-surface">
                          {formation.prix_fcfa === 0 ? "Gratuit" : `${formation.prix_fcfa?.toLocaleString('fr-FR')} FCFA`}
                        </span>
                        <span className="text-on-primary bg-primary font-medium flex items-center gap-1 px-4 py-2 rounded-control transition-all text-label-lg group-hover:gap-2">
                          {isExternal ? "Accéder" : "S'inscrire"} <ChevronRight size={16} aria-hidden />
                        </span>
                      </div>
                    </div>
                  </Link>
                )})}
              </div>
            )}
          </div>
        </div>
      </section>
  )
}
