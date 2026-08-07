import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users, articles, documents, cotisations, contributions, opportunites, evenements, inscriptions_formation, forum_messages } from "@/db/schema"
import { eq, gte, lt, count, sum, desc } from "drizzle-orm"
import { 
  Users, UserPlus, TrendingUp, CreditCard, BookOpen, FileText, 
  MessageCircle, Calendar, Eye, Download, Target, Activity, Coins
} from "lucide-react"
import { AdminRevenueChart, AdminDonutChart } from "@/components/admin/ChartsWrapper"

export const metadata = { title: "Tableau de bord" }
export const dynamic = 'force-dynamic'

function KpiCard({ 
  label, value, sub, icon: Icon, color, valueClass = ""
}: { 
  label: string; value: string | number; sub?: string; 
  icon: React.ElementType; color: string; valueClass?: string 
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{label}</p>
        <p className={`text-2xl font-bold text-gray-900 mt-0.5 ${valueClass}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function SectionHeader({ title, sub, icon: Icon }: { title: string; sub?: string; icon?: React.ElementType }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-gray-500" />}
        {title}
      </h2>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

const MOIS_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]

const formatFCFA = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M FCFA` :
  n >= 1_000 ? `${Math.round(n / 1_000)}k FCFA` :
  `${n} FCFA`

const catColors: Record<string, string> = {
  junior: "bg-green-100 text-green-700",
  professionnel: "bg-blue-100 text-blue-700",
  senior: "bg-purple-100 text-purple-700",
  partenaire: "bg-orange-100 text-orange-700",
}
const statutColors: Record<string, string> = {
  actif: "bg-green-100 text-green-700",
  en_attente_paiement: "bg-yellow-100 text-yellow-700",
  suspendu: "bg-red-100 text-red-700",
  expire: "bg-gray-100 text-gray-500",
  gratuit: "bg-gray-100 text-gray-500",
}

export default async function AdminDashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400_000).toISOString()

  // Récupération des données depuis Cloudflare D1 via Drizzle
  const [
    totalMembresRows,
    derniersMembresRows,
    articlesPubliesRows,
    documentsApprouvesRows,
    opportunitesPubRows,
    evenementsAvenirRows,
    cotisationsRows,
    contributionsRows,
  ] = await Promise.all([
    db.select().from(users),
    db.select({ id: users.id, prenom: users.prenom, nom: users.nom, categorie: users.categorie, statut_adhesion: users.statut_adhesion, pays: users.pays, created_at: users.created_at })
      .from(users).orderBy(desc(users.created_at)).limit(8),
    db.select({ id: articles.id }).from(articles).where(eq(articles.statut, 'publie')),
    db.select({ id: documents.id }).from(documents).where(eq(documents.statut, 'publie')),
    db.select({ id: opportunites.id }).from(opportunites).where(eq(opportunites.statut, 'publie')),
    db.select({ id: evenements.id }).from(evenements).where(eq(evenements.publie, true)),
    db.select({ montant_fcfa: cotisations.montant_fcfa, created_at: cotisations.created_at }).from(cotisations).where(eq(cotisations.statut, 'valide')),
    db.select({ montant_fcfa: contributions.montant_fcfa, created_at: contributions.created_at }).from(contributions).where(eq(contributions.statut, 'valide')),
  ])

  const totalMembres = totalMembresRows.length
  const totalActifs = totalMembresRows.filter(m => m.statut_adhesion === 'actif').length
  const nouveauxMois = totalMembresRows.filter(m => m.created_at && m.created_at >= firstDayOfMonth).length
  const membresActifs30j = totalMembresRows.filter(m => m.updated_at && m.updated_at >= thirtyDaysAgo).length

  const categorieCount: Record<string, number> = {}
  for (const m of totalMembresRows.filter(m => m.statut_adhesion === 'actif')) {
    const cat = m.categorie || 'professionnel'
    categorieCount[cat] = (categorieCount[cat] || 0) + 1
  }
  const donutData = [
    { name: "Junior", value: categorieCount["junior"] || 0, color: "#86efac" },
    { name: "Professionnel", value: categorieCount["professionnel"] || 0, color: "#1b5e38" },
    { name: "Sénior", value: categorieCount["senior"] || 0, color: "#166534" },
    { name: "Partenaire", value: categorieCount["partenaire"] || 0, color: "#4ade80" },
  ]

  const cotisationsMois = cotisationsRows.filter(c => c.created_at && c.created_at >= firstDayOfMonth)
  const revenusMois = cotisationsMois.reduce((s, c) => s + (c.montant_fcfa || 0), 0)
  const revenusCumules = cotisationsRows.reduce((s, c) => s + (c.montant_fcfa || 0), 0)
  const totalDons = contributionsRows.reduce((s, c) => s + (c.montant_fcfa || 0), 0)

  // Graphique revenus 12 derniers mois
  const revenueByMonth: Record<string, { cotisations: number; dons: number }> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    revenueByMonth[key] = { cotisations: 0, dons: 0 }
  }
  for (const c of cotisationsRows) {
    if (!c.created_at) continue
    const key = c.created_at.slice(0, 7)
    if (revenueByMonth[key]) revenueByMonth[key].cotisations += c.montant_fcfa || 0
  }
  for (const d of contributionsRows) {
    if (!d.created_at) continue
    const key = d.created_at.slice(0, 7)
    if (revenueByMonth[key]) revenueByMonth[key].dons += d.montant_fcfa || 0
  }
  const revenueChartData = Object.entries(revenueByMonth).map(([k, v]) => ({
    mois: MOIS_LABELS[parseInt(k.split("-")[1]) - 1],
    ...v,
  }))

  return (
    <div className="space-y-10 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d&apos;ensemble de l&apos;activité de la plateforme agrolide.</p>
      </div>

      <section>
        <SectionHeader title="Membres" sub="Statistiques d'adhésion" icon={Users} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Membres actifs" value={totalActifs} icon={Users} color="bg-green-50 text-green-600" />
          <KpiCard label="Nouveaux ce mois" value={nouveauxMois} icon={UserPlus} color="bg-blue-50 text-blue-600" />
          <KpiCard label="Actifs (30 jours)" value={membresActifs30j} icon={Activity} color="bg-indigo-50 text-indigo-600" />
          <KpiCard label="Total membres" value={totalMembres} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" />
        </div>
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-2">Répartition par catégorie</p>
          <AdminDonutChart data={donutData} />
        </div>
      </section>

      <section>
        <SectionHeader title="Revenus" sub="Cotisations et dons" icon={Coins} />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <KpiCard label="Cotisations ce mois" value={formatFCFA(revenusMois)} icon={CreditCard} color="bg-green-50 text-green-600" />
          <KpiCard label="Revenus cumulés" value={formatFCFA(revenusCumules)} icon={TrendingUp} color="bg-purple-50 text-purple-600" />
          <KpiCard label="Dons collectés" value={formatFCFA(totalDons)} icon={Target} color="bg-orange-50 text-orange-600" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-3">Revenus mensuels (12 derniers mois)</p>
          <AdminRevenueChart data={revenueChartData} />
        </div>
      </section>

      <section>
        <SectionHeader title="Contenu" sub="État de la plateforme" icon={FileText} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Articles publiés" value={articlesPubliesRows.length} icon={FileText} color="bg-amber-50 text-amber-600" />
          <KpiCard label="Documents bibliothèque" value={documentsApprouvesRows.length} icon={Eye} color="bg-cyan-50 text-cyan-600" />
          <KpiCard label="Opportunités publiées" value={opportunitesPubRows.length} icon={Target} color="bg-lime-50 text-lime-600" />
          <KpiCard label="Événements à venir" value={evenementsAvenirRows.length} icon={Calendar} color="bg-rose-50 text-rose-600" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Derniers membres inscrits" icon={UserPlus} />
          <a href="/admin/membres" className="text-xs font-medium text-green-700 hover:underline">Voir tous →</a>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Membre</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Catégorie</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Statut</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Pays</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {derniersMembresRows.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {m.prenom?.charAt(0)}{m.nom?.charAt(0)}
                        </div>
                        <a href={`/admin/membres/${m.id}`} className="font-medium text-gray-900 hover:text-green-700 transition-colors">
                          {m.prenom} {m.nom}
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${catColors[m.categorie || ''] || "bg-gray-100 text-gray-600"}`}>
                        {m.categorie}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statutColors[m.statut_adhesion || ''] || "bg-gray-100 text-gray-500"}`}>
                        {m.statut_adhesion?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{m.pays}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString("fr-FR") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
