import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq, or, and, like, inArray, count as countFn, isNull } from 'drizzle-orm'
import { auth } from '@/lib/auth/server'
import { rateLimit } from '@/lib/security/rate-limit'

export const dynamic = 'force-dynamic'

const MAX_PAGES = 5

export async function GET(request: NextRequest) {
  try {
    // Annuaire réservé aux membres connectés (protection des données personnelles)
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

    // Freine la collecte en masse
    const limited = await rateLimit(request, 'annuaire', 60, 60)
    if (limited) return limited

    const { searchParams } = new URL(request.url)
    
    const search = (searchParams.get('q') || '').slice(0, 100)
    const pays = searchParams.get('pays')?.split(',').filter(Boolean) || []
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
    const specialites = searchParams.get('specialites')?.split(',').filter(Boolean) || []
    const ouvertMentorat = searchParams.get('mentorat') === 'true'
    
    // Pages plafonnées (5 x 20 résultats max) : impossible d'énumérer tous les membres
    const page = Math.min(Math.max(parseInt(searchParams.get('page') || '1') || 1, 1), MAX_PAGES)
    const limit = 20
    const offset = (page - 1) * limit

    let conditions: any[] = [or(eq(users.annuaire_visible, true), isNull(users.annuaire_visible))]

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
      
    // Statut de connexion avec chaque membre
    let membersWithConnection = data;
    
    if (data.length > 0) {
      const targetIds = data.map(u => u.id);
      const connections = await db.query.user_connections.findMany({
        where: (connections, { or, and, eq, inArray }) => 
          or(
            and(eq(connections.requester_id, userId), inArray(connections.receiver_id, targetIds)),
            and(eq(connections.receiver_id, userId), inArray(connections.requester_id, targetIds))
          )
      });
      
      membersWithConnection = data.map(member => {
        const conn = connections.find(c => c.requester_id === member.id || c.receiver_id === member.id);
        let connectionStatus = null;
        if (conn) {
          if (conn.status === 'accepted') connectionStatus = 'accepted';
          else if (conn.status === 'pending') {
            connectionStatus = conn.requester_id === userId ? 'pending_sent' : 'pending_received';
          }
        }
        return { ...member, connectionStatus };
      });
    }

    return NextResponse.json({ 
      data: membersWithConnection || [], 
      count: count || 0,
      page,
      totalPages: count ? Math.min(Math.ceil(count / limit), MAX_PAGES) : 0
    })

  } catch (error: any) {
    console.error("API Annuaire Error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de l'annuaire." }, { status: 500 })
  }
}
