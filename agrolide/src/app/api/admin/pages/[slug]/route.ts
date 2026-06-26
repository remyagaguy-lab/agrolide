import { createClient } from "@/lib/supabase/server"
import { NextResponse, NextRequest } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { data: profile } = await supabase.from("profiles")
    .select("role_plateforme").eq("id", session.user.id).single()
  if (!profile || !["admin_content", "super_admin"].includes(profile.role_plateforme)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const { slug } = await params
  const { contenu_json, titre, meta_description } = await request.json()

  const { error } = await supabase.from("pages_statiques")
    .update({ 
      contenu_json, 
      ...(titre && { titre }), 
      ...(meta_description && { meta_description }),
      updated_at: new Date().toISOString()
    })
    .eq("slug", slug)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
