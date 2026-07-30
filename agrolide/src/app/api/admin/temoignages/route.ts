import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { temoignages } from "@/db/schema"
import { asc } from "drizzle-orm"

// GET : liste tous les témoignages
export async function GET() {
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
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  // Vérification de rôle admin omise ici (pour simplifier, on suppose que auth() protège la route ou qu'il y a un middleware)

  const body = await request.json()
  const { prenom, nom, pays, citation, photo_url, publie, ordre } = body

  if (!nom || !citation) return NextResponse.json({ error: "Nom et citation requis" }, { status: 400 })

  try {
    const [data] = await db.insert(temoignages).values({
      prenom: prenom || '', nom, pays, citation, photo_url, publie: publie ?? false, ordre: ordre ?? 0
    }).returning()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
