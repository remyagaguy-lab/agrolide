import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { data: profile } = await supabase.from("profiles")
    .select("role_plateforme").eq("id", session.user.id).single()
  if (profile?.role_plateforme !== "super_admin") {
    return NextResponse.json({ error: "Seul le super_admin peut promouvoir des administrateurs" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { role_plateforme } = body

  const VALID_ROLES = ["membre", "admin_content", "super_admin"]
  if (!VALID_ROLES.includes(role_plateforme)) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 })
  }

  const { error } = await supabase.from("profiles")
    .update({ role_plateforme, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
