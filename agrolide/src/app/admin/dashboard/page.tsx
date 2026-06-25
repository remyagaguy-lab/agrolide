import { createClient } from "@/lib/supabase/server"
import { Users, UserPlus, FileText, CreditCard } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // 1. Total membres
  const { count: totalMembres } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true })

  // 2. Nouveaux membres ce mois
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const { count: nouveauxMembres } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true })
    .gte('created_at', firstDayOfMonth)

  // 3. Articles publiés
  const { count: articlesPublies } = await supabase
    .from("articles")
    .select("*", { count: 'exact', head: true })
    .eq('status', 'published')

  // 4. Paiements (Cotisations actives ce mois)
  const { count: cotisationsMois } = await supabase
    .from("cotisations")
    .select("*", { count: 'exact', head: true })
    .eq('statut', 'valide')
    .gte('created_at', firstDayOfMonth)

  // 5. Derniers membres inscrits
  const { data: derniersMembres } = await supabase
    .from("profiles")
    .select("*")
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm">Vue d'ensemble de l'activité de la plateforme.</p>
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Membres totaux</p>
            <p className="text-2xl font-bold text-gray-900">{totalMembres || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <UserPlus size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Nouveaux (ce mois)</p>
            <p className="text-2xl font-bold text-gray-900">{nouveauxMembres || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Articles publiés</p>
            <p className="text-2xl font-bold text-gray-900">{articlesPublies || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Paiements (ce mois)</p>
            <p className="text-2xl font-bold text-gray-900">{cotisationsMois || 0}</p>
          </div>
        </div>
      </div>

      {/* Derniers membres inscrits */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Derniers membres inscrits</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Nom</th>
                <th className="px-6 py-3 font-medium">Catégorie</th>
                <th className="px-6 py-3 font-medium">Spécialité</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium">Date d'inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {derniersMembres && derniersMembres.length > 0 ? (
                derniersMembres.map((membre) => (
                  <tr key={membre.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{membre.prenom} {membre.nom}</td>
                    <td className="px-6 py-4 capitalize">{membre.categorie}</td>
                    <td className="px-6 py-4">{membre.specialite}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        membre.statut_adhesion === 'actif' ? 'bg-green-100 text-green-700' :
                        membre.statut_adhesion === 'en_attente_paiement' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {membre.statut_adhesion?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(membre.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                    Aucun membre inscrit récemment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
