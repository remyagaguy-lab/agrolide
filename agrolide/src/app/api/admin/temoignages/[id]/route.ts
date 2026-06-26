import { createClient } from "@/lib/supabase/server"
import { NextResponse, NextRequest } from "next/server"

async function checkAdmin(supabase: any, session: any) {
  if (!session) return false
  const { data } = await supabase.from("profiles").select("role_plateforme").eq("id", session.user.id).single()
  return data && ["admin_content", "super_admin"].includes(data.role_plateforme)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!await checkAdmin(supabase, session)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  const { error } = await supabase.from("temoignages").update(body).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!await checkAdmin(supabase, session)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  const { id } = await params
  const { error } = await supabase.from("temoignages").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
