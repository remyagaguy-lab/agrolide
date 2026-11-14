import { auth } from "@/lib/auth/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users, cotisations, demandes_categorie } from "@/db/schema"
import { eq, desc, inArray, like, or, and, count } from "drizzle-orm"
import { MembresTable } from "./MembresTable"
import { roleAdmin } from "@/lib/auth/roles"
import Link from "next/link"
import { Users, UserCog } from "@/components/ui/icons"
export const metadata = { title: "Gestion des membres" }
export const dynamic = 'force-dynamic'

const PER_PAGE = 25

export default async function AdminMembresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categorie?: string; statut?: string; pays?: string; page?: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect("/login")

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

  // Demandes de Partenaire / Sénior à valider (la table peut manquer avant la migration)
  let demandesEnAttente = 0
  try {
    const [r] = await db.select({ n: count() }).from(demandes_categorie).where(eq(demandes_categorie.statut, "en_attente"))
    demandesEnAttente = Number(r?.n ?? 0)
  } catch (e) {}

  return (
    <div className="space-y-6 pb-10">
      <Link href="/admin/membres/demandes-categorie" className="inline-flex min-h-11 items-center gap-2 rounded-card border border-outline-variant bg-surface-container-lowest px-4 text-body-sm font-semibold text-primary hover:bg-primary-container">
        <UserCog className="size-4" aria-hidden="true" />
        Demandes de changement de catégorie{demandesEnAttente > 0 ? ` (${demandesEnAttente} à traiter)` : ""}
      </Link>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-success-container text-success rounded-xl flex items-center justify-center">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Gestion des membres</h1>
          <p className="text-sm text-on-surface-muted">{total} membre{total > 1 ? "s" : ""} au total</p>
        </div>
      </div>

      <MembresTable
        membres={membresEnriched}
        total={total}
        page={page}
        perPage={PER_PAGE}
        searchParams={params}
        superAdmin={(await roleAdmin()) === "super_admin"}
      />
    </div>
  )
}
