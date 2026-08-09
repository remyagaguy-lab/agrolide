import { Metadata } from 'next'
import { BookOpen, GraduationCap, Clock, ChevronRight } from 'lucide-react'
import { db } from "@/db"
import Link from 'next/link'
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

export const metadata: Metadata = {
  title: "Formations Agricoles",
  description: "Développez vos compétences avec les programmes de formation de notre réseau agricole. Des cursus certifiants adaptés aux réalités de l'agriculture en Afrique.",
  alternates: { canonical: '/formations' }
}

export default async function FormationsPage() {
  const allFormations = await db.query.formations.findMany({
    orderBy: (formations, { desc }) => [desc(formations.created_at)],
  });

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

      {/* Catalog Section */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 w-full">
        {allFormations.length === 0 ? (
           <div className="bg-white rounded-2xl shadow-lg p-10 md:p-16 text-center border border-gray-100 w-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Catalogue en Préparation
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Nous concevons actuellement de nouvelles formations. Revenez bientôt !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allFormations.map((formation) => (
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
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="secondary" className="bg-white/90 text-green-900 font-semibold backdrop-blur-sm">
                      {formation.thematique}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1.5 font-medium text-primary-700">
                      <GraduationCap size={16} />
                      {formation.niveau}
                    </span>
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
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
