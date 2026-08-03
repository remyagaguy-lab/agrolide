import { Metadata } from 'next'
import { BookOpen, Wrench } from 'lucide-react'

export const metadata: Metadata = {
  title: "Formations Agricoles",
  description: "Développez vos compétences avec les programmes de formation de notre réseau agricole. Des cursus certifiants adaptés aux réalités de l'agriculture en Afrique.",
,
  alternates: { canonical: '/formations' }
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

      {/* En cours de développement avec Liste d'attente */}
      <section className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 w-full flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 md:p-16 text-center border border-gray-100 w-full">
          <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Catalogue de Formations en Préparation
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Nous concevons actuellement des programmes de formation certifiants de haute qualité, adaptés aux réalités de l'agriculture africaine.
          </p>
          
          <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-2">Soyez informé en avant-première</h3>
            <p className="text-sm text-gray-500 mb-4">Rejoignez la liste d'attente pour être averti du lancement et bénéficier d'une offre exclusive.</p>
            <form className="flex flex-col sm:flex-row gap-2" action="">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                required 
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button 
                type="submit"
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm active:scale-[0.98]"
              >
                M'inscrire
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
