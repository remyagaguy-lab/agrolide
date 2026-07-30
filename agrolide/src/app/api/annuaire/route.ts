import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq, or, and, like, inArray, count as countFn } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('q') || ''
    const pays = searchParams.get('pays')?.split(',').filter(Boolean) || []
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
    const specialites = searchParams.get('specialites')?.split(',').filter(Boolean) || []
    const ouvertMentorat = searchParams.get('mentorat') === 'true'
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20
    const offset = (page - 1) * limit

    let conditions: any[] = [eq(users.annuaire_visible, true)]

    if (search) {
      conditions.push(or(
        like(users.prenom, `%${search}%`),
        like(users.nom, `%${search}%`),
        like(users.organisation, `%${search}%`), // Organisation mapped to entreprise
        like(users.specialite, `%${search}%`)
      ))
    }

    if (pays.length > 0) {
      conditions.push(inArray(users.pays, pays))
    }

    if (categories.length > 0) {
      conditions.push(inArray(users.categorie, categories))
    }

    if (specialites.length > 0) {
      conditions.push(inArray(users.specialite, specialites))
    }

    if (ouvertMentorat) {
      conditions.push(eq(users.ouvert_contact, true))
      conditions.push(eq(users.categorie, 'senior')) // Simplification
    }

    const whereClause = and(...conditions)

    const data = await db.query.users.findMany({
      columns: { id: true, prenom: true, nom: true, pays: true, specialite: true, categorie: true, photo_url: true },
      where: whereClause,
      limit,
      offset
    })

    const [{ count }] = await db.select({ count: countFn() })
      .from(users)
      .where(whereClause)

    return NextResponse.json({ 
      data: data || [], 
      count: count || 0,
      page,
      totalPages: count ? Math.ceil(count / limit) : 0
    })

  } catch (error: any) {
    console.error("API Annuaire Error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de l'annuaire." }, { status: 500 })
  }
}
