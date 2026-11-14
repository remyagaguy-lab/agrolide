import { db } from "@/db"
import { cotisations, contributions } from "@/db/schema"
import { desc, gte, lte, eq, and } from "drizzle-orm"
import { auth } from "@/lib/auth/server"
import { redirect } from "next/navigation"
import RappelButton from "./RappelButton"

import { CreditCard, AlertTriangle, Clock } from "@/components/ui/icons"
export const metadata = { title: "Paiements & Cotisations" }
export const dynamic = 'force-dynamic'

export default async function AdminPaiementsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

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
    valide: "bg-success-container text-success",
    en_attente: "bg-warning-container text-warning",
    echoue: "bg-error-container text-error",
    rembourse: "bg-surface-container text-on-surface-muted",
  }

  const formatFCFA = (n: number) => `${(n || 0).toLocaleString("fr-FR")} FCFA`

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-info-container text-on-info-container rounded-xl flex items-center justify-center">
          <CreditCard size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Paiements &amp; Cotisations</h1>
          <p className="text-sm text-on-surface-muted">Suivi des revenus et des expirations</p>
        </div>
      </div>

      {/* Section Expirations */}
      {expirationsBientot.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-warning" />
            <h2 className="text-base font-semibold text-on-surface">
              Expirations dans 30 jours ({expirationsBientot.length})
            </h2>
          </div>
          <div className="bg-tertiary-container border border-warning/40 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-warning-container border-b border-warning/40">
                <tr>
                  <th className="px-5 py-3 font-medium text-on-warning-container text-xs uppercase tracking-wide text-left">Membre ID</th>
                  <th className="px-5 py-3 font-medium text-on-warning-container text-xs uppercase tracking-wide text-left">Expire le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warning/40">
                {expirationsBientot.map((c) => (
                  <tr key={c.id} className="hover:bg-warning-container transition-colors">
                    <td className="px-5 py-3 font-medium text-on-surface">{c.membre_id}</td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1.5 text-on-warning-container font-medium text-xs">
                        <Clock size={16} />
                        {c.date_fin ? new Date(c.date_fin).toLocaleDateString("fr-FR") : "Non renseigné"}
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
        <h2 className="text-base font-semibold text-on-surface mb-4">Historique cotisations (50 dernières)</h2>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Membre ID</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Montant</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Méthode</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Statut</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {cotisationsList.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-on-surface-muted italic">Aucune cotisation enregistrée</td></tr>
                ) : cotisationsList.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3 text-xs text-on-surface-muted">{c.membre_id}</td>
                    <td className="px-5 py-3 font-semibold text-success">{formatFCFA(c.montant_fcfa)}</td>
                    <td className="px-5 py-3 text-on-surface-muted capitalize text-xs">{c.methode?.replace(/_/g, " ")}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statutBadge[c.statut || ''] || "bg-surface-container text-on-surface-muted"}`}>
                        {c.statut || "Non renseigné"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-on-surface-muted text-xs">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "Non renseigné"}
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
        <h2 className="text-base font-semibold text-on-surface mb-4">Historique dons (30 derniers)</h2>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Donateur</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Montant</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Méthode</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Statut</th>
                  <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {contributionsList.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-on-surface-muted italic">Aucun don enregistré</td></tr>
                ) : contributionsList.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-on-surface">{c.prenom || "Anonyme"}</div>
                      <div className="text-xs text-on-surface-muted">{c.email}</div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-success">{formatFCFA(c.montant_fcfa)}</td>
                    <td className="px-5 py-3 text-on-surface-muted capitalize text-xs">{c.methode?.replace(/_/g, " ")}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statutBadge[c.statut || ''] || "bg-surface-container text-on-surface-muted"}`}>
                        {c.statut || "Non renseigné"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-on-surface-muted text-xs">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "Non renseigné"}
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
