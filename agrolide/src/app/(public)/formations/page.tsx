import { FormationCard, FormationType } from '@/components/modules/formations/FormationCard'

export const revalidate = 3600 // Revalidate every hour

async function getFormations() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
  try {
    const res = await fetch(`${API_URL}/api/formations`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return json.data as FormationType[]
  } catch (e) {
    console.error('Erreur fetch formations:', e)
    return []
  }
}

export const metadata = {
  title: 'Formations Agricoles | Agrolide',
  description: 'Découvrez notre catalogue de formations en ligne, en présentiel et hybrides pour développer vos compétences agricoles.',
}

export default async function FormationsPage() {
  const formations = await getFormations()

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-green-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Développez vos compétences agricoles
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-10">
            Des formations pratiques et certifiantes animées par des experts de terrain pour vous accompagner dans la réussite de vos projets.
          </p>
        </div>
      </section>

      {/* Catalogue */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Catalogue des formations ({formations.length})</h2>
            {/* Filtres simples statiques pour le moment (SSR) */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <select className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-green-500 focus:border-green-500">
                <option value="">Toutes thématiques</option>
                <option value="Agroécologie">Agroécologie</option>
                <option value="Élevage">Élevage</option>
                <option value="Maraîchage">Maraîchage</option>
                <option value="Gestion">Gestion</option>
              </select>
              <select className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-green-500 focus:border-green-500">
                <option value="">Toute modalité</option>
                <option value="En ligne">En ligne</option>
                <option value="Présentiel">Présentiel</option>
                <option value="Hybride">Hybride</option>
              </select>
            </div>
          </div>
        </div>

        {formations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formations.map((formation) => (
              <FormationCard key={formation.id} formation={formation} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucune formation disponible</h3>
            <p className="text-gray-500">De nouvelles formations seront bientôt proposées.</p>
          </div>
        )}
      </section>
    </div>
  )
}
