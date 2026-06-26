import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { 
  Users, UserPlus, TrendingUp, CreditCard, BookOpen, FileText, 
  MessageCircle, Calendar, Eye, Download, Target, Activity, Coins
} from "lucide-react"

import { AdminRevenueChart, AdminDonutChart } from "@/components/admin/ChartsWrapper"

export const metadata = { title: "Dashboard Admin | agrolide" }

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

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400_000).toISOString()

  // ── MEMBRES ────────────────────────────────────────────────────────────────
  const [
    { count: totalActifs },
    { count: totalMembres },
    { count: nouveauxMois },
    { count: membresActifs30j },
    { data: membresParCategorie },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("statut_adhesion", "actif"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", firstDayOfMonth),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("updated_at", thirtyDaysAgo),
    supabase.from("profiles").select("categorie").eq("statut_adhesion", "actif"),
  ])

  const categorieCount: Record<string, number> = {}
  for (const m of membresParCategorie || []) {
    categorieCount[m.categorie] = (categorieCount[m.categorie] || 0) + 1
  }
  const donutData = [
    { name: "Junior", value: categorieCount["junior"] || 0, color: "#86efac" },
    { name: "Professionnel", value: categorieCount["professionnel"] || 0, color: "#1b5e38" },
    { name: "Sénior", value: categorieCount["senior"] || 0, color: "#166534" },
    { name: "Partenaire", value: categorieCount["partenaire"] || 0, color: "#4ade80" },
  ]

  // Taux de renouvellement (membres renouvelés ce mois / total expirations)
  const { count: renouveles } = await supabase.from("cotisations")
    .select("*", { count: "exact", head: true })
    .eq("statut", "valide")
    .gte("created_at", firstDayOfMonth)
  const { count: expires } = await supabase.from("cotisations")
    .select("*", { count: "exact", head: true })
    .lt("date_fin", firstDayOfMonth)
  const tauxRenouvellement = expires && expires > 0 
    ? Math.round(((renouveles || 0) / expires) * 100) 
    : 0

  // ── REVENUS ────────────────────────────────────────────────────────────────
  const [
    { data: cotisationsMois },
    { data: toutesLesCotisations },
    { data: dons },
  ] = await Promise.all([
    supabase.from("cotisations").select("montant_fcfa").eq("statut", "valide").gte("created_at", firstDayOfMonth),
    supabase.from("cotisations").select("montant_fcfa, created_at").eq("statut", "valide"),
    supabase.from("contributions").select("montant_fcfa, created_at").eq("statut", "valide"),
  ])

  const revenusMois = (cotisationsMois || []).reduce((s, c) => s + c.montant_fcfa, 0)
  const revenusCumules = (toutesLesCotisations || []).reduce((s, c) => s + c.montant_fcfa, 0)
  const totalDons = (dons || []).reduce((s, c) => s + c.montant_fcfa, 0)

  // Bar chart 12 derniers mois
  const revenueByMonth: Record<string, { cotisations: number; dons: number }> = {}
  const today = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    revenueByMonth[key] = { cotisations: 0, dons: 0 }
  }
  for (const c of toutesLesCotisations || []) {
    if (!c.created_at) continue
    const key = c.created_at.slice(0, 7)
    if (revenueByMonth[key]) revenueByMonth[key].cotisations += c.montant_fcfa
  }
  for (const d of dons || []) {
    if (!d.created_at) continue
    const key = d.created_at.slice(0, 7)
    if (revenueByMonth[key]) revenueByMonth[key].dons += d.montant_fcfa
  }
  const revenueChartData = Object.entries(revenueByMonth).map(([k, v]) => ({
    mois: MOIS_LABELS[parseInt(k.split("-")[1]) - 1],
    ...v,
  }))

  // ── ENGAGEMENT ─────────────────────────────────────────────────────────────
  const [
    { data: docsData },
    { count: inscriptionsFormations },
    { count: messagesForum },
  ] = await Promise.all([
    supabase.from("documents").select("nb_telechargements").eq("statut", "publie").gte("published_at", firstDayOfMonth),
    supabase.from("inscriptions_formation").select("*", { count: "exact", head: true }).gte("created_at", firstDayOfMonth),
    supabase.from("forum_messages").select("*", { count: "exact", head: true }).gte("created_at", firstDayOfMonth),
  ])
  const docsTelecharges = (docsData || []).reduce((s, d) => s + (d.nb_telechargements || 0), 0)

  // ── CONTENU ────────────────────────────────────────────────────────────────
  const [
    { count: articlesPublies },
    { count: documentsApprouves },
    { count: opportunitesPub },
    { count: evenementsAvenir },
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("statut", "published"),
    supabase.from("documents").select("*", { count: "exact", head: true }).eq("statut", "publie"),
    supabase.from("opportunites").select("*", { count: "exact", head: true }).eq("statut", "publie"),
    supabase.from("evenements").select("*", { count: "exact", head: true }).eq("publie", true).gte("date_debut", now.toISOString()),
  ])

  // ── DERNIERS MEMBRES ───────────────────────────────────────────────────────
  const { data: derniersMembres } = await supabase.from("profiles")
    .select("id, prenom, nom, categorie, statut_adhesion, pays, created_at")
    .order("created_at", { ascending: false })
    .limit(8)

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
  }

  return (
    <div className="space-y-10 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de l'activité de la plateforme agrolide.</p>
      </div>

      {/* ── Rangée 1 : Membres ─────────────────────────────────── */}
      <section>
        <SectionHeader title="Membres" sub="Statistiques d'adhésion" icon={Users} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Membres actifs" value={totalActifs || 0} icon={Users} color="bg-green-50 text-green-600" />
          <KpiCard label="Nouveaux ce mois" value={nouveauxMois || 0} icon={UserPlus} color="bg-blue-50 text-blue-600" />
          <KpiCard label="Actifs (30 jours)" value={membresActifs30j || 0} icon={Activity} color="bg-indigo-50 text-indigo-600" />
          <KpiCard label="Taux renouvellement" value={`${tauxRenouvellement}%`} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" valueClass={tauxRenouvellement >= 50 ? "text-green-700" : "text-red-600"} />
        </div>
        {/* Donut catégories */}
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-2">Répartition par catégorie</p>
          <AdminDonutChart data={donutData} />
        </div>
      </section>

      {/* ── Rangée 2 : Revenus ─────────────────────────────────── */}
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
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-[#1b5e38] inline-block" /> Cotisations</span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-[#86efac] inline-block" /> Dons</span>
          </div>
        </div>
      </section>

      {/* ── Rangée 3 : Engagement ──────────────────────────────── */}
      <section>
        <SectionHeader title="Engagement" sub="Activité des membres ce mois" icon={TrendingUp} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Docs téléchargés" value={docsTelecharges} icon={Download} color="bg-teal-50 text-teal-600" sub="ce mois" />
          <KpiCard label="Inscriptions formations" value={inscriptionsFormations || 0} icon={BookOpen} color="bg-blue-50 text-blue-600" sub="ce mois" />
          <KpiCard label="Messages forum" value={messagesForum || 0} icon={MessageCircle} color="bg-violet-50 text-violet-600" sub="ce mois" />
          <KpiCard label="Membres actifs" value={membresActifs30j || 0} icon={Activity} color="bg-pink-50 text-pink-600" sub="30 derniers jours" />
        </div>
      </section>

      {/* ── Rangée 4 : Contenu ─────────────────────────────────── */}
      <section>
        <SectionHeader title="Contenu" sub="État de la plateforme" icon={FileText} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Articles publiés" value={articlesPublies || 0} icon={FileText} color="bg-amber-50 text-amber-600" />
          <KpiCard label="Documents bibliothèque" value={documentsApprouves || 0} icon={Eye} color="bg-cyan-50 text-cyan-600" />
          <KpiCard label="Opportunités publiées" value={opportunitesPub || 0} icon={Target} color="bg-lime-50 text-lime-600" />
          <KpiCard label="Événements à venir" value={evenementsAvenir || 0} icon={Calendar} color="bg-rose-50 text-rose-600" />
        </div>
      </section>

      {/* ── Derniers membres inscrits ──────────────────────────── */}
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
                {(derniersMembres || []).map(m => (
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
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${catColors[m.categorie] || "bg-gray-100 text-gray-600"}`}>
                        {m.categorie}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statutColors[m.statut_adhesion] || "bg-gray-100 text-gray-500"}`}>
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
