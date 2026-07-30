import { NextResponse, NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { users, pages_statiques } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const profile = await db.select({ role_plateforme: users.role_plateforme })
    .from(users).where(eq(users.id, userId)).limit(1).then(r => r[0])

  if (!profile || !["admin_content", "super_admin"].includes(profile.role_plateforme || '')) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const { slug } = await params
  const { contenu_json, titre, meta_description } = await request.json()

  try {
    await db.update(pages_statiques)
      .set({ 
        contenu_json, 
        ...(titre && { titre }), 
        ...(meta_description && { meta_description }),
        updated_at: new Date().toISOString()
      })
      .where(eq(pages_statiques.slug, slug))

    revalidatePath(`/${slug}`)
    revalidatePath('/admin/pages')
    
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
