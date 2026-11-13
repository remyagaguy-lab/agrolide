import { auth } from "@/lib/auth/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users, articles, documents, cotisations, contributions, opportunites, evenements, inscriptions_formation, forum_messages } from "@/db/schema"
import { eq, gte, lt, count, sum, desc } from "drizzle-orm"
import { AdminRevenueChart, AdminDonutChart } from "@/components/admin/ChartsWrapper"

import { ArrowRight, Users, UserPlus, TrendingUp, CreditCard, Library, FileText, MessageCircle, CalendarDays, Eye, Download, Target, Activity, Coins } from "@/components/ui/icons"
export const metadata = { title: "Tableau de bord" }
export const dynamic = 'force-dynamic'

function KpiCard({ 
  label, value, sub, icon: Icon, color, valueClass = ""
}: { 
  label: string; value: string | number; sub?: string; 
  icon: React.ElementType; color: string; valueClass?: string 
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-on-surface-muted uppercase tracking-wide truncate">{label}</p>
        <p className={`text-2xl font-bold text-on-surface mt-0.5 ${valueClass}`}>{value}</p>
        {sub && <p className="text-xs text-on-surface-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function SectionHeader({ title, sub, icon: Icon }: { title: string; sub?: string; icon?: React.ElementType }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-on-surface flex items-center gap-2">
        {Icon && <Icon className="size-5 text-on-surface-muted" />}
        {title}
      </h2>
      {sub && <p className="text-xs text-on-surface-muted mt-1">{sub}</p>}
    </div>
  )
}

const MOIS_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]

const formatFCFA = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M FCFA` :
  n >= 1_000 ? `${Math.round(n / 1_000)}k FCFA` :
  `${n} FCFA`

const catColors: Record<string, string> = {
  junior: "bg-success-container text-success",
  professionnel: "bg-info-container text-info",
  senior: "bg-info-container text-on-info-container",
  partenaire: "bg-warning-container text-on-warning-container",
}
const statutColors: Record<string, string> = {
  actif: "bg-success-container text-success",
  en_attente_paiement: "bg-warning-container text-warning",
  suspendu: "bg-error-container text-error",
  expire: "bg-surface-container text-on-surface-muted",
  gratuit: "bg-surface-container text-on-surface-muted",
}

export default async function AdminDashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

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
    { name: "Junior", value: categorieCount["junior"] || 0, color: "var(--ag-sys-color-accent-leaf)" },
    { name: "Professionnel", value: categorieCount["professionnel"] || 0, color: "var(--ag-sys-color-primary)" },
    { name: "Sénior", value: categorieCount["senior"] || 0, color: "var(--ag-sys-color-accent-sun)" },
    { name: "Partenaire", value: categorieCount["partenaire"] || 0, color: "var(--ag-sys-color-accent-olive)" },
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
        <h1 className="text-2xl font-bold text-on-surface">Tableau de bord</h1>
        <p className="text-sm text-on-surface-muted mt-1">Vue d&apos;ensemble de l&apos;activité de la plateforme agrolide.</p>
      </div>

      <section>
        <SectionHeader title="Membres" sub="Statistiques d'adhésion" icon={Users} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Membres actifs" value={totalActifs} icon={Users} color="bg-success-container text-success" />
          <KpiCard label="Nouveaux ce mois" value={nouveauxMois} icon={UserPlus} color="bg-info-container text-info" />
          <KpiCard label="Actifs (30 jours)" value={membresActifs30j} icon={Activity} color="bg-info-container text-info" />
          <KpiCard label="Total membres" value={totalMembres} icon={TrendingUp} color="bg-success-container text-success" />
        </div>
        <div className="mt-4 bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
          <p className="text-sm font-semibold text-on-surface-variant mb-2">Répartition par catégorie</p>
          <AdminDonutChart data={donutData} />
        </div>
      </section>

      <section>
        <SectionHeader title="Revenus" sub="Cotisations et dons" icon={Coins} />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <KpiCard label="Cotisations ce mois" value={formatFCFA(revenusMois)} icon={CreditCard} color="bg-success-container text-success" />
          <KpiCard label="Revenus cumulés" value={formatFCFA(revenusCumules)} icon={TrendingUp} color="bg-info-container text-info" />
          <KpiCard label="Dons collectés" value={formatFCFA(totalDons)} icon={Target} color="bg-tertiary-container text-warning" />
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
          <p className="text-sm font-semibold text-on-surface-variant mb-3">Revenus mensuels (12 derniers mois)</p>
          <AdminRevenueChart data={revenueChartData} />
        </div>
      </section>

      <section>
        <SectionHeader title="Contenu" sub="État de la plateforme" icon={FileText} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Articles publiés" value={articlesPubliesRows.length} icon={FileText} color="bg-warning-container text-warning" />
          <KpiCard label="Documents bibliothèque" value={documentsApprouvesRows.length} icon={Eye} color="bg-info-container text-info" />
          <KpiCard label="Opportunités publiées" value={opportunitesPubRows.length} icon={Target} color="bg-success-container text-success" />
          <KpiCard label="Événements à venir" value={evenementsAvenirRows.length} icon={CalendarDays} color="bg-error-container text-error" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Derniers membres inscrits" icon={UserPlus} />
          <a href="/admin/membres" className="text-xs font-medium text-success hover:underline">Voir tous<ArrowRight className="ml-1 inline size-4" aria-hidden /></a>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Membre</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Catégorie</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Statut</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Pays</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {derniersMembresRows.map(m => (
                  <tr key={m.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-success-container text-success flex items-center justify-center text-xs font-bold shrink-0">
                          {m.prenom?.charAt(0)}{m.nom?.charAt(0)}
                        </div>
                        <a href={`/admin/membres/${m.id}`} className="font-medium text-on-surface hover:text-success transition-colors">
                          {m.prenom} {m.nom}
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${catColors[m.categorie || ''] || "bg-surface-container text-on-surface-variant"}`}>
                        {m.categorie}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statutColors[m.statut_adhesion || ''] || "bg-surface-container text-on-surface-muted"}`}>
                        {m.statut_adhesion?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-on-surface-muted">{m.pays}</td>
                    <td className="px-5 py-3 text-on-surface-muted text-xs">
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
