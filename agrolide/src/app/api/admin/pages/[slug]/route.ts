import { NextResponse, NextRequest } from "next/server"
import { requireAdmin } from "@/lib/auth/admin"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { pages_statiques } from "@/db/schema"
import { eq } from "drizzle-orm"
import { nettoyerTextes } from "@/lib/utils/sans-emoji"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  const { slug } = await params
  const { contenu_json, titre, meta_description } = nettoyerTextes(await request.json())

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
