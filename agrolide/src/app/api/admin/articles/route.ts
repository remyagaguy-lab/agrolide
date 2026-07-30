import { NextResponse, NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { users, articles } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  // Vérifier rôle admin
  const profile = await db.select({ role_plateforme: users.role_plateforme })
    .from(users).where(eq(users.id, userId)).limit(1).then(r => r[0])

  if (!profile || !["admin_content", "super_admin"].includes(profile.role_plateforme || '')) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const payload = await request.json()

  try {
    const inserted = await db.insert(articles).values({
      ...payload,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).returning({ id: articles.id })

    revalidatePath('/blog')
    revalidatePath('/admin/contenus/articles')

    return NextResponse.json({ success: true, id: inserted[0].id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
