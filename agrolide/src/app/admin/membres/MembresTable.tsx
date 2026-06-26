"use client"

import { useState, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, Filter, Download, Eye, CheckCircle, Ban, ShieldCheck,
  ChevronLeft, ChevronRight, X
} from "lucide-react"

type Membre = {
  id: string
  prenom: string
  nom: string
  email: string
  categorie: string
  statut_adhesion: string
  pays: string
  created_at: string | null
  cotisation_expiry: string | null
}

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

const CATEGORIES = ["junior", "professionnel", "senior", "partenaire"]
const STATUTS = ["actif", "en_attente_paiement", "suspendu", "expire"]

interface Props {
  membres: Membre[]
  total: number
  page: number
  perPage: number
  searchParams: { q?: string; categorie?: string; statut?: string; pays?: string }
}

export function MembresTable({ membres, total, page, perPage, searchParams }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ id: string; action: string; label: string } | null>(null)

  const totalPages = Math.ceil(total / perPage)

  const updateSearchParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(Object.entries(searchParams).filter(([, v]) => v) as [string, string][])
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete("page")
    startTransition(() => router.push(`/admin/membres?${params.toString()}`))
  }, [searchParams, router])

  const setPage = (p: number) => {
    const params = new URLSearchParams(Object.entries(searchParams).filter(([, v]) => v) as [string, string][])
    params.set("page", String(p))
    startTransition(() => router.push(`/admin/membres?${params.toString()}`))
  }

  const executeAction = async (id: string, action: string) => {
    setActionLoading(`${id}-${action}`)
    try {
      if (action === "activer" || action === "suspendre") {
        const statut = action === "activer" ? "actif" : "suspendu"
        await fetch(`/api/admin/membres/${id}/statut`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statut_adhesion: statut }),
        })
      } else if (action === "admin") {
        await fetch(`/api/admin/membres/${id}/role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role_plateforme: "admin_content" }),
        })
      }
      router.refresh()
    } finally {
      setActionLoading(null)
      setConfirmDialog(null)
    }
  }

  const exportCSV = () => {
    const params = new URLSearchParams(Object.entries(searchParams).filter(([, v]) => v) as [string, string][])
    window.location.href = `/api/admin/membres/export?${params.toString()}`
  }

  return (
    <div className="space-y-4">
      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-gray-900 mb-2">Confirmer l'action</h3>
            <p className="text-sm text-gray-600 mb-5">{confirmDialog.label}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDialog(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Annuler</button>
              <button 
                onClick={() => executeAction(confirmDialog.id, confirmDialog.action)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1b5e38] rounded-lg hover:bg-[#164d2e]"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher nom, email..."
              defaultValue={searchParams.q || ""}
              onChange={e => updateSearchParam("q", e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            defaultValue={searchParams.categorie || ""}
            onChange={e => updateSearchParam("categorie", e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Toutes catégories</option>
            {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
          <select
            defaultValue={searchParams.statut || ""}
            onChange={e => updateSearchParam("statut", e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tous statuts</option>
            {STATUTS.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
          {(searchParams.q || searchParams.categorie || searchParams.statut) && (
            <button
              onClick={() => startTransition(() => router.push("/admin/membres"))}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              <X size={14} /> Réinitialiser
            </button>
          )}
          <div className="ml-auto">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1b5e38] rounded-lg hover:bg-[#164d2e] transition-colors"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="text-xs text-gray-500">
        {isPending ? "Chargement..." : `${total} membre${total > 1 ? "s" : ""} trouvé${total > 1 ? "s" : ""}`}
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Membre</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Catégorie</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Statut</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Pays</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Inscription</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Expiration</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {membres.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400 italic">
                    Aucun membre ne correspond aux filtres.
                  </td>
                </tr>
              ) : membres.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {m.prenom?.charAt(0)}{m.nom?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{m.prenom} {m.nom}</div>
                        <div className="text-xs text-gray-400">{m.email}</div>
                      </div>
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
                  <td className="px-5 py-3 text-gray-500 text-xs">{m.pays}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {m.created_at ? new Date(m.created_at).toLocaleDateString("fr-FR") : "—"}
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {m.cotisation_expiry ? (
                      <span className={new Date(m.cotisation_expiry) < new Date() ? "text-red-600 font-medium" : "text-gray-500"}>
                        {new Date(m.cotisation_expiry).toLocaleDateString("fr-FR")}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/membres/${m.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir profil"
                      >
                        <Eye size={15} />
                      </a>
                      {m.statut_adhesion !== "actif" ? (
                        <button
                          onClick={() => setConfirmDialog({ id: m.id, action: "activer", label: `Activer le compte de ${m.prenom} ${m.nom} ?` })}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Activer"
                          disabled={!!actionLoading}
                        >
                          <CheckCircle size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmDialog({ id: m.id, action: "suspendre", label: `Suspendre le compte de ${m.prenom} ${m.nom} ?` })}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Suspendre"
                          disabled={!!actionLoading}
                        >
                          <Ban size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDialog({ id: m.id, action: "admin", label: `Promouvoir ${m.prenom} ${m.nom} comme administrateur de contenu ?` })}
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Promouvoir admin"
                        disabled={!!actionLoading}
                      >
                        <ShieldCheck size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between text-sm">
            <span className="text-gray-500 text-xs">
              Page {page} sur {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
