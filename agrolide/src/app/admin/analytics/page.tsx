import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Users, BookOpen, Download, UserCheck } from "lucide-react"
import { AdminLineChart } from "@/components/admin/ChartsWrapper"

export const metadata = { title: "Analytiques | agrolide" }

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  // Fetch all members to build a registration trend
  const { data: profiles } = await supabase
    .from("profiles")
    .select("created_at")
    .order("created_at", { ascending: true })

  // Build trend data for the last 6 months
  const monthsData: Record<string, number> = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    monthsData[key] = 0
  }

  const MOIS_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]

  if (profiles) {
    profiles.forEach(p => {
      if (!p.created_at) return
      const date = new Date(p.created_at)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (monthsData[key] !== undefined) {
        monthsData[key]++
      }
    })
  }

  const registrationsTrend = Object.entries(monthsData).map(([k, v]) => ({
    name: MOIS_LABELS[parseInt(k.split("-")[1]) - 1],
    Inscriptions: v
  }))

  // Fetch documents to get total downloads
  const { data: docs } = await supabase.from("documents").select("nb_telechargements")
  const totalDownloads = docs?.reduce((acc, curr) => acc + (curr.nb_telechargements || 0), 0) || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytiques Détaillées</h1>
        <p className="text-gray-500 mt-2">Vue approfondie de la croissance et de l'engagement de la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <p className="text-sm font-medium text-gray-500">Membres Totaux</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{profiles?.length || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck size={20} />
            </div>
            <p className="text-sm font-medium text-gray-500">Membres ce mois</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {registrationsTrend[registrationsTrend.length - 1]?.Inscriptions || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Download size={20} />
            </div>
            <p className="text-sm font-medium text-gray-500">Téléchargements</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalDownloads}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <p className="text-sm font-medium text-gray-500">Ressources en ligne</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{docs?.length || 0}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Croissance des inscriptions (6 derniers mois)</h2>
        <AdminLineChart data={registrationsTrend} dataKey="Inscriptions" stroke="#16a34a" />
      </div>
      
      <div className="bg-blue-50 border border-blue-100 text-blue-800 p-6 rounded-2xl">
        <h3 className="font-bold mb-2">💡 Suivi Analytique Avancé</h3>
        <p className="text-sm">
          Actuellement, les statistiques sont générées à partir de votre base de données Supabase. Pour suivre le trafic en temps réel (visiteurs uniques, pages les plus vues, provenance du trafic), nous recommandons d'intégrer une solution externe comme <strong>Google Analytics</strong> ou <strong>Plausible</strong> à l'avenir.
        </p>
      </div>
    </div>
  )
}
