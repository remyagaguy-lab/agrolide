import { Metadata } from 'next'
import { BookOpen, GraduationCap, Clock, ChevronRight, ExternalLink, Globe } from 'lucide-react'
import { db } from "@/db"
import Link from 'next/link'
import { Badge } from "@/components/ui/Badge"
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

  if (prix) {
    if (prix === 'gratuit') {
      allFormations = allFormations.filter(f => f.prix_fcfa === 0);
    } else if (prix === 'payant') {
      allFormations = allFormations.filter(f => (f.prix_fcfa || 0) > 0);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 flex flex-col">
      {/* Hero Section */}
      <section className="bg-green-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Développez vos compétences agricoles
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-10">
            Des formations pratiques et certifiantes animées par des experts de terrain pour lancer ou propulser votre exploitation.
          </p>
        </div>
      </section>

      {/* Catalog Section with Sidebar */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 w-full mb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 lg:w-72 shrink-0">
            <CourseFilters />
          </div>

          {/* Grid */}
          <div className="flex-1">
            {allFormations.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-10 md:p-16 text-center border border-gray-100 w-full">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Aucune formation trouvée
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                  Modifiez vos filtres pour découvrir nos autres programmes ou revenez bientôt !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {allFormations.map((formation) => {
                  const isExternal = !!formation.lien_externe;
                  return (
                  <Link key={formation.id} href={`/formations/${formation.id}`} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                      {formation.cover_image_url ? (
                        <img 
                          src={formation.cover_image_url} 
                          alt={formation.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-green-50 text-green-800">
                          <BookOpen size={48} className="opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <Badge variant="category" className="bg-white/90 text-green-900 font-medium backdrop-blur-sm self-start">
                          {formation.thematique}
                        </Badge>
                      </div>
                      {isExternal && (
                        <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 text-gray-600 backdrop-blur-sm">
                          <ExternalLink size={16} />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1.5 font-medium text-primary-700 shrink-0">
                          <GraduationCap size={16} />
                          {formation.niveau}
                        </span>
                        {isExternal && (
                          <span className="text-right font-medium text-gray-500 text-xs line-clamp-2">
                            Source: {formation.source_externe}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                        {formation.titre}
                      </h3>
                      
                      <p className="text-gray-600 line-clamp-3 mb-6 flex-1">
                        {formation.description}
                      </p>
                      
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="font-bold text-gray-900">
                          {formation.prix_fcfa === 0 ? "Gratuit" : `${formation.prix_fcfa?.toLocaleString('fr-FR')} FCFA`}
                        </span>
                        <span className="text-primary-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Découvrir <ChevronRight size={18} />
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
