import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, asc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(['super_admin'])
  if (!admin.ok) return admin.response

  const url = new URL(request.url)
  const q = url.searchParams.get("q")
  const categorie = url.searchParams.get("categorie")
  const statut = url.searchParams.get("statut")

  // Récupérer tous les membres depuis D1
  let membres = await db.select({
    id: users.id, prenom: users.prenom, nom: users.nom, email: users.email,
    categorie: users.categorie, statut_adhesion: users.statut_adhesion,
    pays: users.pays, created_at: users.created_at, specialite: users.specialite,
  }).from(users).orderBy(asc(users.nom))

  // Filtres JS
  if (q) {
    const qi = q.toLowerCase()
    membres = membres.filter(m =>
      m.prenom?.toLowerCase().includes(qi) ||
      m.nom?.toLowerCase().includes(qi) ||
      m.email?.toLowerCase().includes(qi)
    )
  }
  if (categorie) membres = membres.filter(m => m.categorie === categorie)
  if (statut) membres = membres.filter(m => m.statut_adhesion === statut)

  // Générer CSV
  const headers = ["ID", "Prénom", "Nom", "Email", "Catégorie", "Statut", "Pays", "Spécialité", "Date inscription"]
  const rows = membres.map(m => [
    m.id,
    m.prenom || "",
    m.nom || "",
    m.email,
    m.categorie || "",
    m.statut_adhesion || "",
    m.pays || "",
    m.specialite || "",
    m.created_at ? new Date(m.created_at).toLocaleDateString("fr-FR") : "",
  ])

  const csvContent = [
    headers.join(";"),
    ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(";")),
  ].join("\n")

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="membres_agrolide_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
