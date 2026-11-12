import { Metadata } from 'next'
import Image from 'next/image'
import { BookOpen, GraduationCap, Clock, ChevronRight, ExternalLink, Globe } from 'lucide-react'
import { db } from "@/db"
import Link from 'next/link'
import { Badge } from "@/components/ui/Badge"
import { PageHero } from "@/components/ui/PageHero"
import { EmptyState } from "@/components/ui/EmptyState"
import CourseFilters from './CourseFilters'


export const metadata: Metadata = {
  title: "Formations Agricoles",
  description: "Développez vos compétences avec les programmes de formation de notre réseau agricole. Des cursus certifiants adaptés aux réalités de l'agriculture en Afrique.",
  alternates: { canonical: '/formations' }
}

export default async function FormationsPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const source = searchParams.source as string | undefined;
  const niveau = searchParams.niveau as string | undefined;
  const prix = searchParams.prix as string | undefined;
  const thematique = searchParams.thematique as string | undefined;

  let allFormations = await db.query.formations.findMany({
    orderBy: (formations, { desc }) => [desc(formations.created_at)],
  });

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
    <div className="bg-surface-container-low min-h-screen pb-20 flex flex-col">
      <PageHero
        nextTone="low"
        label="Formations"
        title="Développez vos compétences agricoles"
        description="Des formations pratiques et certifiantes animées par des experts de terrain pour lancer ou propulser votre exploitation."
      />

      {/* Catalog Section with Sidebar */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-2 mb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 lg:w-72 shrink-0">
            <CourseFilters />
          </div>

          {/* Grid */}
          <div className="flex-1">
            {allFormations.length === 0 ? (
              <EmptyState arche title="Aucune formation trouvée" description="Modifiez vos filtres pour découvrir nos autres programmes ou revenez bientôt !" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {allFormations.map((formation) => {
                  const isExternal = !!formation.lien_externe;
                  return (
                  <Link key={formation.id} href={`/formations/${formation.id}`} className="group flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 w-full bg-surface-container overflow-hidden">
                      {formation.cover_image_url ? (
                        <Image 
                          src={formation.cover_image_url} 
                          alt={formation.titre}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-success-container text-on-success-container">
                          <BookOpen size={48} className="opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <Badge variant="category" className="bg-surface-container-lowest/90 text-on-success-container font-medium backdrop-blur-sm self-start">
                          {formation.thematique}
                        </Badge>
                      </div>
                      {isExternal && (
                        <div className="absolute top-4 right-4 bg-surface-container-lowest/90 rounded-full p-2 text-on-surface-variant backdrop-blur-sm">
                          <ExternalLink size={16} />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 text-sm text-on-surface-muted mb-3">
                        <span className="flex items-center gap-1.5 font-medium text-primary shrink-0">
                          <GraduationCap size={16} />
                          {formation.niveau}
                        </span>
                        {isExternal && (
                          <span className="text-right font-medium text-on-surface-muted text-xs line-clamp-2">
                            Source: {formation.source_externe}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                        {formation.titre}
                      </h3>
                      
                      <p className="text-on-surface-variant line-clamp-3 mb-6 flex-1">
                        {formation.description}
                      </p>
                      
                      <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
                        <span className="font-bold text-on-surface">
                          {formation.prix_fcfa === 0 ? "Gratuit" : `${formation.prix_fcfa?.toLocaleString('fr-FR')} FCFA`}
                        </span>
                        <span className="text-on-primary bg-primary hover:bg-primary/90 font-medium flex items-center gap-1 px-4 py-2 rounded-lg transition-all text-sm shadow-sm group-hover:shadow group-hover:gap-2">
                          {isExternal ? "Accéder" : "S'inscrire"} <ChevronRight size={16} />
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
    </div>
  )
}
