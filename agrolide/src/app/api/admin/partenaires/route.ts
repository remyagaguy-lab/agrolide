import { NextResponse, NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { partenaires, users } from "@/db/schema"
import { eq, asc } from "drizzle-orm"

// GET : liste tous les partenaires
export async function GET(request: NextRequest) {
  try {
    const data = await db.select().from(partenaires).orderBy(asc(partenaires.ordre))
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST : créer un partenaire
export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await request.json()
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
