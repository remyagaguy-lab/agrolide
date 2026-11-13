import { NextResponse, NextRequest } from "next/server"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/db"
import { partenaires } from "@/db/schema"
import { asc } from "drizzle-orm"
import { nettoyerTextes } from "@/lib/utils/sans-emoji"

// GET : liste tous les partenaires
export async function GET(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response
  try {
    const data = await db.select().from(partenaires).orderBy(asc(partenaires.ordre))
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST : créer un partenaire
export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  const body = nettoyerTextes(await request.json())
  const { nom, description, site_web, logo_url, temoignage, contact_nom, contact_titre, publie, ordre } = body

  if (!nom) return NextResponse.json({ error: "Le nom est requis" }, { status: 400 })

  try {
    const inserted = await db.insert(partenaires).values({
      id: crypto.randomUUID(),
      nom, description, site_web, logo_url, temoignage, contact_nom, contact_titre,
      publie: publie ?? true,
      ordre: ordre ?? 0,
      created_at: new Date().toISOString(),
    }).returning()

    return NextResponse.json(inserted[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
