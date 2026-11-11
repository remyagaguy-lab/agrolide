import { db } from "@/db"
import { users, documents } from "@/db/schema"
import { asc } from "drizzle-orm"
import { auth } from "@/lib/auth/server"
import { redirect } from "next/navigation"
import { Users, BookOpen, Download, UserCheck } from "lucide-react"
import { AdminLineChart } from "@/components/admin/ChartsWrapper"

export const metadata = { title: "Analytiques" }
export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  let profiles: any[] = []
  let docs: any[] = []

  try {
    profiles = await db.select({ created_at: users.created_at }).from(users).orderBy(asc(users.created_at))
    docs = await db.select({ nb_telechargements: documents.nb_telechargements }).from(documents)
  } catch (e) {
    console.error('Erreur fetch analytics:', e)
  }

  const totalDownloads = docs.reduce((acc, curr) => acc + (curr.nb_telechargements || 0), 0)

  // Build trend data for the last 6 months
  const monthsData: Record<string, number> = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    monthsData[key] = 0
  }

  const MOIS_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]

  profiles.forEach(p => {
    if (!p.created_at) return
    const date = new Date(p.created_at)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    if (monthsData[key] !== undefined) {
      monthsData[key]++
    }
  })

  const registrationsTrend = Object.entries(monthsData).map(([k, v]) => ({
    name: MOIS_LABELS[parseInt(k.split("-")[1]) - 1],
    Inscriptions: v
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Analytiques Détaillées</h1>
        <p className="text-on-surface-muted mt-2">Vue approfondie de la croissance et de l&apos;engagement de la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-container text-success flex items-center justify-center">
              <Users size={20} />
            </div>
            <p className="text-sm font-medium text-on-surface-muted">Membres Totaux</p>
          </div>
          <p className="text-3xl font-bold text-on-surface mt-2">{profiles.length}</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info-container text-info flex items-center justify-center">
              <UserCheck size={20} />
            </div>
            <p className="text-sm font-medium text-on-surface-muted">Membres ce mois</p>
          </div>
          <p className="text-3xl font-bold text-on-surface mt-2">
            {registrationsTrend[registrationsTrend.length - 1]?.Inscriptions || 0}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-tertiary-container text-warning flex items-center justify-center">
              <Download size={20} />
            </div>
            <p className="text-sm font-medium text-on-surface-muted">Téléchargements</p>
          </div>
          <p className="text-3xl font-bold text-on-surface mt-2">{totalDownloads}</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info-container text-info flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <p className="text-sm font-medium text-on-surface-muted">Ressources en ligne</p>
          </div>
          <p className="text-3xl font-bold text-on-surface mt-2">{docs.length}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
        <h2 className="text-lg font-bold text-on-surface mb-6">Croissance des inscriptions (6 derniers mois)</h2>
        <AdminLineChart data={registrationsTrend} dataKey="Inscriptions" stroke="var(--ag-sys-color-primary)" />
      </div>
      
      <div className="bg-info-container border border-info/30 text-on-info-container p-6 rounded-2xl">
        <h3 className="font-bold mb-2">💡 Suivi Analytique Avancé</h3>
        <p className="text-sm">
          Les statistiques sont maintenant générées depuis Cloudflare D1. Pour suivre le trafic en temps réel (visiteurs uniques, pages les plus vues), intégrez Google Analytics ou Plausible.
        </p>
      </div>
    </div>
  )
}
