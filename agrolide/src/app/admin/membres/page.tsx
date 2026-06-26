import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MembresTable } from "./MembresTable"
import { Users } from "lucide-react"

export const metadata = { title: "Gestion membres | Admin agrolide" }

const PER_PAGE = 25

export default async function AdminMembresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categorie?: string; statut?: string; pays?: string; page?: string }>
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  const params = await searchParams
  const page = Math.max(1, parseInt(params.page || "1"))
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  // Récupérer les membres avec filtres
  let query = supabase
    .from("profiles")
    .select("id, prenom, nom, email, categorie, statut_adhesion, pays, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (params.q) {
    query = query.or(`prenom.ilike.%${params.q}%,nom.ilike.%${params.q}%,email.ilike.%${params.q}%`)
  }
  if (params.categorie) query = query.eq("categorie", params.categorie)
  if (params.statut) query = query.eq("statut_adhesion", params.statut)
  if (params.pays) query = query.eq("pays", params.pays)

  const { data: membres, count } = await query

  // Enrichir avec la date d'expiration de la dernière cotisation
  const ids = (membres || []).map(m => m.id)
  const { data: cotisations } = ids.length > 0
    ? await supabase.from("cotisations")
        .select("membre_id, date_fin")
        .in("membre_id", ids)
        .eq("statut", "valide")
        .order("date_fin", { ascending: false })
    : { data: [] }

  const expiryMap: Record<string, string> = {}
  for (const c of cotisations || []) {
    if (!expiryMap[c.membre_id] && c.date_fin) expiryMap[c.membre_id] = c.date_fin
  }

  const membresEnriched = (membres || []).map(m => ({
    ...m,
    cotisation_expiry: expiryMap[m.id] || null,
  }))

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-50 text-green-700 rounded-xl flex items-center justify-center">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des membres</h1>
          <p className="text-sm text-gray-500">{count || 0} membre{(count || 0) > 1 ? "s" : ""} au total</p>
        </div>
      </div>

      <MembresTable
        membres={membresEnriched}
        total={count || 0}
        page={page}
        perPage={PER_PAGE}
        searchParams={params}
      />
    </div>
  )
}
