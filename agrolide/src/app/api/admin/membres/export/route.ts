import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { data: profile } = await supabase.from("profiles")
    .select("role_plateforme").eq("id", session.user.id).single()
  if (!profile || !["admin_content", "super_admin"].includes(profile.role_plateforme)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const url = new URL(request.url)
  const q = url.searchParams.get("q")
  const categorie = url.searchParams.get("categorie")
  const statut = url.searchParams.get("statut")

  let query = supabase.from("profiles")
    .select("id, prenom, nom, email, categorie, statut_adhesion, pays, created_at, specialite")
    .order("nom")

  if (q) query = query.or(`prenom.ilike.%${q}%,nom.ilike.%${q}%,email.ilike.%${q}%`)
  if (categorie) query = query.eq("categorie", categorie)
  if (statut) query = query.eq("statut_adhesion", statut)

  const { data: membres } = await query

  // Générer CSV
  const headers = ["ID", "Prénom", "Nom", "Email", "Catégorie", "Statut", "Pays", "Spécialité", "Date inscription"]
  const rows = (membres || []).map(m => [
    m.id,
    m.prenom,
    m.nom,
    m.email,
    m.categorie,
    m.statut_adhesion,
    m.pays,
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
