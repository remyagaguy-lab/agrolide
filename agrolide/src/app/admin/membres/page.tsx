import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users, cotisations } from "@/db/schema"
import { eq, desc, inArray, like, or, and } from "drizzle-orm"
import { MembresTable } from "./MembresTable"
import { Users } from "lucide-react"

export const metadata = { title: "Gestion des membres" }
export const dynamic = 'force-dynamic'

const PER_PAGE = 25

export default async function AdminMembresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categorie?: string; statut?: string; pays?: string; page?: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const params = await searchParams
  const page = Math.max(1, parseInt(params.page || "1"))

  // Récupérer les membres depuis D1
  let allMembres: any[] = []
  try {
    allMembres = await db.select({
      id: users.id,
      prenom: users.prenom,
      nom: users.nom,
      email: users.email,
      categorie: users.categorie,
      statut_adhesion: users.statut_adhesion,
      pays: users.pays,
      created_at: users.created_at,
    }).from(users).orderBy(desc(users.created_at))
  } catch (e) {
    console.error('Erreur fetch membres:', e)
  }

  // Filtres en JS (D1 SQLite ne supporte pas ilike, on le fait côté serveur)
  let filtered = allMembres
  if (params.q) {
    const q = params.q.toLowerCase()
    filtered = filtered.filter(m =>
      m.prenom?.toLowerCase().includes(q) ||
      m.nom?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q)
    )
  }
  if (params.categorie) filtered = filtered.filter(m => m.categorie === params.categorie)
  if (params.statut) filtered = filtered.filter(m => m.statut_adhesion === params.statut)
  if (params.pays) filtered = filtered.filter(m => m.pays === params.pays)

  const total = filtered.length
  const from = (page - 1) * PER_PAGE
  const membres = filtered.slice(from, from + PER_PAGE)

  // Enrichir avec la date d'expiration de la dernière cotisation
  const ids = membres.map(m => m.id)
  let cotisationsData: any[] = []
  if (ids.length > 0) {
    try {
      cotisationsData = await db.select({ membre_id: cotisations.membre_id, date_fin: cotisations.date_fin })
        .from(cotisations)
        .where(and(eq(cotisations.statut, 'valide'), inArray(cotisations.membre_id, ids)))
        .orderBy(desc(cotisations.date_fin))
    } catch(e) {}
  }

  const expiryMap: Record<string, string> = {}
  for (const c of cotisationsData) {
    if (!expiryMap[c.membre_id] && c.date_fin) expiryMap[c.membre_id] = c.date_fin
  }

  const membresEnriched = membres.map(m => ({
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
          <p className="text-sm text-gray-500">{total} membre{total > 1 ? "s" : ""} au total</p>
        </div>
      </div>

      <MembresTable
        membres={membresEnriched}
        total={total}
        page={page}
        perPage={PER_PAGE}
        searchParams={params}
      />
    </div>
  )
}
