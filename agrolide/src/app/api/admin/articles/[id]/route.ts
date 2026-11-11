import { NextResponse, NextRequest } from "next/server"
import { requireAdmin } from "@/lib/auth/admin"
import { revalidatePath, revalidateTag } from "next/cache"
import { db } from "@/db"
import { articles } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  const { id } = await params
  const payload = await request.json()

  try {
    await db.update(articles)
      .set({ ...payload, updated_at: new Date().toISOString() })
      .where(eq(articles.id, id))

    revalidatePath('/blog')
    revalidateTag('articles', 'max')
    revalidatePath('/')
    revalidatePath('/admin/contenus/articles')

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  const { id } = await params

  try {
    await db.delete(articles).where(eq(articles.id, id))
    revalidatePath('/blog')
    revalidateTag('articles', 'max')
    revalidatePath('/')
    revalidatePath('/admin/contenus/articles')
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
