import { db } from "@/db"
import { cotisations, contributions } from "@/db/schema"
import { desc, gte, lte, eq, and } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CreditCard, AlertCircle, Clock } from "lucide-react"
import RappelButton from "./RappelButton"

export const metadata = { title: "Paiements & Cotisations" }
export const dynamic = 'force-dynamic'

export default async function AdminPaiementsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const now = new Date()
  const in30Days = new Date(Date.now() + 30 * 86400_000).toISOString()

  let cotisationsList: any[] = []
  let contributionsList: any[] = []
  let expirationsBientot: any[] = []

  try {
    cotisationsList = await db.select().from(cotisations)
      .orderBy(desc(cotisations.created_at)).limit(50)
    
    contributionsList = await db.select().from(contributions)
      .orderBy(desc(contributions.created_at)).limit(30)

    expirationsBientot = await db.select().from(cotisations)
      .where(and(
        eq(cotisations.statut, 'valide'),
        gte(cotisations.date_fin, now.toISOString()),
        lte(cotisations.date_fin, in30Days)
      ))
      .orderBy(cotisations.date_fin)
  } catch (e) {
    console.error('Erreur fetch paiements:', e)
  }

  const statutBadge: Record<string, string> = {
    valide: "bg-green-100 text-green-700",
    en_attente: "bg-yellow-100 text-yellow-700",
    echoue: "bg-red-100 text-red-700",
    rembourse: "bg-gray-100 text-gray-500",
  }

  const formatFCFA = (n: number) => `${(n || 0).toLocaleString("fr-FR")} FCFA`

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center">
          <CreditCard size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paiements &amp; Cotisations</h1>
          <p className="text-sm text-gray-500">Suivi des revenus et des expirations</p>
        </div>
      </div>

      {/* Section Expirations */}
      {expirationsBientot.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">
              Expirations dans 30 jours ({expirationsBientot.length})
            </h2>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-orange-100/70 border-b border-orange-200">
                <tr>
                  <th className="px-5 py-3 font-medium text-orange-800 text-xs uppercase tracking-wide text-left">Membre ID</th>
                  <th className="px-5 py-3 font-medium text-orange-800 text-xs uppercase tracking-wide text-left">Expire le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {expirationsBientot.map((c) => (
                  <tr key={c.id} className="hover:bg-orange-100/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{c.membre_id}</td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1.5 text-orange-700 font-medium text-xs">
                        <Clock size={12} />
                        {c.date_fin ? new Date(c.date_fin).toLocaleDateString("fr-FR") : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tableau cotisations */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Historique cotisations (50 dernières)</h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Membre ID</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Montant</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Méthode</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Statut</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cotisationsList.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 italic">Aucune cotisation enregistrée</td></tr>
                ) : cotisationsList.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs text-gray-500">{c.membre_id}</td>
                    <td className="px-5 py-3 font-semibold text-green-700">{formatFCFA(c.montant_fcfa)}</td>
                    <td className="px-5 py-3 text-gray-500 capitalize text-xs">{c.methode?.replace(/_/g, " ")}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statutBadge[c.statut || ''] || "bg-gray-100 text-gray-500"}`}>
                        {c.statut || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Dons */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Historique dons (30 derniers)</h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Donateur</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Montant</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Méthode</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Statut</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contributionsList.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 italic">Aucun don enregistré</td></tr>
                ) : contributionsList.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{c.prenom || "Anonyme"}</div>
                      <div className="text-xs text-gray-400">{c.email}</div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-green-700">{formatFCFA(c.montant_fcfa)}</td>
                    <td className="px-5 py-3 text-gray-500 capitalize text-xs">{c.methode?.replace(/_/g, " ")}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statutBadge[c.statut || ''] || "bg-gray-100 text-gray-500"}`}>
                        {c.statut || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "—"}
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
