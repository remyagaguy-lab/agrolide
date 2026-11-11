import { NextResponse, NextRequest } from "next/server"
import { requireAdmin } from '@/lib/auth/admin'
import { db } from "@/db"
import { temoignages } from "@/db/schema"
import { asc } from "drizzle-orm"

// GET : liste tous les témoignages
export async function GET() {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response
  try {
    const data = await db.query.temoignages.findMany({
      orderBy: [asc(temoignages.ordre)]
    })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST : créer un témoignage
export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  try {
    const body = await request.json()
    const { prenom, nom, pays, citation, photo_url, publie, ordre } = body

    if (!nom || !citation) return NextResponse.json({ error: "Nom et citation requis" }, { status: 400 })

    const [data] = await db.insert(temoignages).values({
      prenom: prenom || '', nom, pays, citation, photo_url, publie: publie ?? false, ordre: ordre ?? 0
    }).returning()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
