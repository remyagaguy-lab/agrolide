import { createClient } from "@/lib/supabase/server"
import { NextResponse, NextRequest } from "next/server"

// GET : liste tous les partenaires
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("partenaires").select("*").order("ordre")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST : créer un partenaire
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await request.json()
  const { nom, description, site_web, logo_url, temoignage, contact_nom, contact_titre, publie, ordre } = body

  if (!nom) return NextResponse.json({ error: "Le nom est requis" }, { status: 400 })

  const { data, error } = await supabase.from("partenaires")
    .insert({ nom, description, site_web, logo_url, temoignage, contact_nom, contact_titre, publie: publie ?? true, ordre: ordre ?? 0 })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
