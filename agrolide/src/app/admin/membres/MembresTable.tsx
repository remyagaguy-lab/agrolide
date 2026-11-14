"use client"

import { useState, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal, Download, Eye, CheckCircle2, Ban, ShieldCheck, ChevronLeft, ChevronRight, X } from "@/components/ui/icons"
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
}

const CATEGORIES = ["junior", "professionnel", "senior", "partenaire"]
const STATUTS = ["actif", "en_attente_paiement", "suspendu", "expire"]

interface Props {
  membres: Membre[]
  total: number
  page: number
  perPage: number
  searchParams: { q?: string; categorie?: string; statut?: string; pays?: string }
  /** Suspension, promotion et export : réservés au super administrateur. */
  superAdmin?: boolean
}

export function MembresTable({ membres, total, page, perPage, searchParams, superAdmin = false }: Props) {
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
          <div className="bg-surface-container-lowest rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-on-surface mb-2">Confirmer l'action</h3>
            <p className="text-sm text-on-surface-variant mb-5">{confirmDialog.label}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDialog(null)} className="px-4 py-2 text-sm text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low">Annuler</button>
              <button 
                onClick={() => executeAction(confirmDialog.id, confirmDialog.action)}
                className="px-4 py-2 text-sm font-medium text-on-primary bg-primary rounded-lg hover:bg-primary/90"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted" />
            <input
              type="text"
              placeholder="Rechercher nom, email..."
              defaultValue={searchParams.q || ""}
              onChange={e => updateSearchParam("q", e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-success focus:border-transparent"
            />
          </div>
          <select
            defaultValue={searchParams.categorie || ""}
            onChange={e => updateSearchParam("categorie", e.target.value)}
            className="text-sm border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-success"
          >
            <option value="">Toutes catégories</option>
            {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
          <select
            defaultValue={searchParams.statut || ""}
            onChange={e => updateSearchParam("statut", e.target.value)}
            className="text-sm border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-success"
          >
            <option value="">Tous statuts</option>
            {STATUTS.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
          {(searchParams.q || searchParams.categorie || searchParams.statut) && (
            <button
              onClick={() => startTransition(() => router.push("/admin/membres"))}
              className="flex items-center gap-1 text-xs text-on-surface-muted hover:text-error transition-colors"
            >
              <X size={16} /> Réinitialiser
            </button>
          )}
          {superAdmin && <div className="ml-auto">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-primary bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>}
        </div>
      </div>

      {/* Résultats */}
      <div className="text-xs text-on-surface-muted">
        {isPending ? "Chargement..." : `${total} membre${total > 1 ? "s" : ""} trouvé${total > 1 ? "s" : ""}`}
      </div>

      {/* Tableau */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Membre</th>
                <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Catégorie</th>
                <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Statut</th>
                <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Pays</th>
                <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Inscription</th>
                <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide">Expiration</th>
                <th className="px-5 py-3 font-medium text-on-surface-muted text-xs uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {membres.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-on-surface-muted italic">
                    Aucun membre ne correspond aux filtres.
                  </td>
                </tr>
              ) : membres.map(m => (
                <tr key={m.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-success-container text-success flex items-center justify-center text-xs font-bold shrink-0">
                        {m.prenom?.charAt(0)}{m.nom?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">{m.prenom} {m.nom}</div>
                        <div className="text-xs text-on-surface-muted">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${catColors[m.categorie] || "bg-surface-container text-on-surface-variant"}`}>
                      {m.categorie}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statutColors[m.statut_adhesion] || "bg-surface-container text-on-surface-muted"}`}>
                      {m.statut_adhesion?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-on-surface-muted text-xs">{m.pays}</td>
                  <td className="px-5 py-3 text-on-surface-muted text-xs">
                    {m.created_at ? new Date(m.created_at).toLocaleDateString("fr-FR") : "Non renseigné"}
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {m.cotisation_expiry ? (
                      <span className={new Date(m.cotisation_expiry) < new Date() ? "text-error font-medium" : "text-on-surface-muted"}>
                        {new Date(m.cotisation_expiry).toLocaleDateString("fr-FR")}
                      </span>
                    ) : "Non renseigné"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/membres/${m.id}`}
                        className="p-1.5 text-on-surface-muted hover:text-info hover:bg-info-container rounded-lg transition-colors"
                        title="Voir profil"
                      >
                        <Eye size={16} />
                      </a>
                      {superAdmin && (m.statut_adhesion !== "actif" ? (
                        <button
                          onClick={() => setConfirmDialog({ id: m.id, action: "activer", label: `Activer le compte de ${m.prenom} ${m.nom} ?` })}
                          className="p-1.5 text-on-surface-muted hover:text-success hover:bg-success-container rounded-lg transition-colors"
                          title="Activer"
                          disabled={!!actionLoading}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmDialog({ id: m.id, action: "suspendre", label: `Suspendre le compte de ${m.prenom} ${m.nom} ?` })}
                          className="p-1.5 text-on-surface-muted hover:text-error hover:bg-error-container rounded-lg transition-colors"
                          title="Suspendre"
                          disabled={!!actionLoading}
                        >
                          <Ban size={16} />
                        </button>
                      ))}
                      {superAdmin && <button
                        onClick={() => setConfirmDialog({ id: m.id, action: "admin", label: `Promouvoir ${m.prenom} ${m.nom} comme administrateur de contenu ?` })}
                        className="p-1.5 text-on-surface-muted hover:text-info hover:bg-info-container rounded-lg transition-colors"
                        title="Promouvoir admin"
                        disabled={!!actionLoading}
                      >
                        <ShieldCheck size={16} />
                      </button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-outline-variant flex items-center justify-between text-sm">
            <span className="text-on-surface-muted text-xs">
              Page {page} sur {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-outline-variant text-on-surface-muted hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-outline-variant text-on-surface-muted hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed"
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
