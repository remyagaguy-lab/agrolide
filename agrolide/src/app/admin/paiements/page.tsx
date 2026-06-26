import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CreditCard, AlertCircle, Clock, Send } from "lucide-react"
import RappelButton from "./RappelButton"

export const metadata = { title: "Paiements & Cotisations | Admin agrolide" }

export default async function AdminPaiementsPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  const now = new Date()
  const in30Days = new Date(Date.now() + 30 * 86400_000).toISOString()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { data: cotisations },
    { data: expirationsBientot },
    { data: contributions },
  ] = await Promise.all([
    // Toutes cotisations récentes
    supabase.from("cotisations")
      .select("id, membre_id, montant_fcfa, methode, statut, created_at, date_fin, profiles(prenom, nom, email)")
      .order("created_at", { ascending: false })
      .limit(50),

    // Cotisations qui expirent dans 30 jours
    supabase.from("cotisations")
      .select("id, membre_id, date_fin, profiles(id, prenom, nom, email, statut_adhesion)")
      .eq("statut", "valide")
      .gte("date_fin", now.toISOString())
      .lte("date_fin", in30Days)
      .order("date_fin"),

    // Contributions / Dons
    supabase.from("contributions")
      .select("id, email, prenom, montant_fcfa, methode, statut, created_at")
      .order("created_at", { ascending: false })
      .limit(30),
  ])

  const statutBadge: Record<string, string> = {
    valide: "bg-green-100 text-green-700",
    en_attente: "bg-yellow-100 text-yellow-700",
    echoue: "bg-red-100 text-red-700",
    rembourse: "bg-gray-100 text-gray-500",
  }

  const formatFCFA = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center">
          <CreditCard size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paiements & Cotisations</h1>
          <p className="text-sm text-gray-500">Suivi des revenus et des expirations</p>
        </div>
      </div>

      {/* Section Expirations */}
      {(expirationsBientot || []).length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">
              Expirations dans 30 jours ({expirationsBientot?.length || 0})
            </h2>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-orange-100/70 border-b border-orange-200">
                <tr>
                  <th className="px-5 py-3 font-medium text-orange-800 text-xs uppercase tracking-wide text-left">Membre</th>
                  <th className="px-5 py-3 font-medium text-orange-800 text-xs uppercase tracking-wide text-left">Email</th>
                  <th className="px-5 py-3 font-medium text-orange-800 text-xs uppercase tracking-wide text-left">Expire le</th>
                  <th className="px-5 py-3 font-medium text-orange-800 text-xs uppercase tracking-wide text-left">Statut</th>
                  <th className="px-5 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {(expirationsBientot || []).map((c: any) => (
                  <tr key={c.id} className="hover:bg-orange-100/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {c.profiles?.prenom} {c.profiles?.nom}
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{c.profiles?.email}</td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1.5 text-orange-700 font-medium text-xs">
                        <Clock size={12} />
                        {c.date_fin ? new Date(c.date_fin).toLocaleDateString("fr-FR") : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statutBadge[c.profiles?.statut_adhesion] || "bg-gray-100 text-gray-500"}`}>
                        {c.profiles?.statut_adhesion?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <RappelButton membreId={c.profiles?.id} email={c.profiles?.email} nom={`${c.profiles?.prenom} ${c.profiles?.nom}`} />
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
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Membre</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Montant</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Méthode</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Statut</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Expiration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(cotisations || []).length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400 italic">Aucune cotisation enregistrée</td></tr>
                ) : (cotisations || []).map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{c.profiles?.prenom} {c.profiles?.nom}</div>
                      <div className="text-xs text-gray-400">{c.profiles?.email}</div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-green-700">{formatFCFA(c.montant_fcfa)}</td>
                    <td className="px-5 py-3 text-gray-500 capitalize text-xs">{c.methode?.replace(/_/g, " ")}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statutBadge[c.statut] || "bg-gray-100 text-gray-500"}`}>
                        {c.statut || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {c.date_fin ? new Date(c.date_fin).toLocaleDateString("fr-FR") : "—"}
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
                {(contributions || []).length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 italic">Aucun don enregistré</td></tr>
                ) : (contributions || []).map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{c.prenom || "Anonyme"}</div>
                      <div className="text-xs text-gray-400">{c.email}</div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-green-700">{formatFCFA(c.montant_fcfa)}</td>
                    <td className="px-5 py-3 text-gray-500 capitalize text-xs">{c.methode?.replace(/_/g, " ")}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statutBadge[c.statut] || "bg-gray-100 text-gray-500"}`}>
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
