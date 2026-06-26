import { createClient } from "@/lib/supabase/server"
import { NextResponse, NextRequest } from "next/server"

// GET : liste tous les témoignages
export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("temoignages").select("*").order("ordre")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST : créer un témoignage
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await request.json()
  const { nom, poste, organisation, pays, citation, photo_url, note, publie, ordre } = body

  if (!nom || !citation) return NextResponse.json({ error: "Nom et citation requis" }, { status: 400 })

  const { data, error } = await supabase.from("temoignages")
    .insert({ nom, poste, organisation, pays, citation, photo_url, note: note ?? 5, publie: publie ?? true, ordre: ordre ?? 0 })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
