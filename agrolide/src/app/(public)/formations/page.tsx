import { Metadata } from 'next'
import { BookOpen, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Formations Agricoles | Agrolide',
  description: 'Notre catalogue de formations est actuellement en cours de développement.',
}

export default function FormationsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 flex flex-col">
      {/* Hero Section */}
      <section className="bg-green-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Développez vos compétences agricoles
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-10">
            Des formations pratiques et certifiantes animées par des experts de terrain.
          </p>
        </div>
      </section>

      {/* En cours de développement */}
      <section className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 w-full flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 md:p-16 text-center border border-gray-100 w-full">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Espace Formations
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            Notre catalogue de formations est actuellement en cours de développement. Nous préparons un contenu de qualité pour vous accompagner dans la réussite de vos projets.
          </p>
          <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm">
            Bientôt disponible
          </span>
        </div>
      </section>
    </div>
  )
}
