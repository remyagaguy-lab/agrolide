import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextResponse, NextRequest } from "next/server"
import { revalidatePath } from "next/cache"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { data: profile } = await supabase.from("profiles")
    .select("role_plateforme").eq("id", session.user.id).single()
  if (!profile || !["admin_content", "super_admin"].includes(profile.role_plateforme)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const { id } = await params
  const payload = await request.json()

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error, data } = await supabaseAdmin.from("articles").update(payload).eq("id", id).select('id').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: "Article introuvable" }, { status: 404 })
  
  revalidatePath(`/blog`)
  revalidatePath(`/${payload.slug || ''}`)
  revalidatePath(`/admin/contenus/articles`)
  
  return NextResponse.json({ success: true })
}
