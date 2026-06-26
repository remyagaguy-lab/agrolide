import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Base query
    let query = supabase
      .from('profiles')
      .select('id, prenom, nom, pays, specialite, categorie, avatar_url, secteurs_expertise, langues', { count: 'exact' })
      .eq('annuaire_visible', true)

    // TODO: Add statut_adhesion='actif' filter when implemented in the schema
    // query = query.eq('statut_adhesion', 'actif')

    // Recherche plein texte (sur fts_search si la colonne existe)
    if (search) {
      // Pour éviter les erreurs si fts_search n'est pas encore créé, on fallback sur 'or'
      // S'il est créé, on peut utiliser textSearch('fts_search', search)
      // On utilise ilike sur le nom/prenom/organisation/specialite par sécurité si fts_search n'est pas actif
      query = query.or(`prenom.ilike.%${search}%,nom.ilike.%${search}%,organisation.ilike.%${search}%,specialite.ilike.%${search}%`)
      
      // Idéalement :
      // query = query.textSearch('fts_search', search, { type: 'websearch', config: 'french' })
    }

    if (pays.length > 0) {
      query = query.in('pays', pays)
    }

    if (categories.length > 0) {
      query = query.in('categorie', categories)
    }

    if (specialites.length > 0) {
      query = query.in('specialite', specialites)
    }

    if (ouvertMentorat) {
      query = query.eq('ouvert_contact', true).eq('categorie', 'senior') // Simplification, ouvert_contact est le flag
    }

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data, count, error } = await query

    if (error) {
      console.error("Supabase Error:", error)
      throw error
    }

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
