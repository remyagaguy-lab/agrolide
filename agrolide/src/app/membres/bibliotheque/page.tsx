import { BibliothequeClient } from '@/components/modules/bibliotheque/BibliothequeClient'
import { createClient } from '@supabase/supabase-js'

export const metadata = {
  title: 'Bibliothèque | Agrolide',
  description: 'Bibliothèque de documents pour les membres Agrolide',
}

export default async function MembresBibliothequePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  // Next 15+ needs await on searchParams
  const params = await searchParams
  
  // Initial fetch for SSR
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  let query = supabase.from('documents').select('*').eq('statut', 'publie').order('created_at', { ascending: false }).limit(20)
  
  const search = typeof params.search === 'string' ? params.search : ''
  const type = typeof params.type === 'string' ? params.type : ''
  const thematique = typeof params.thematique === 'string' ? params.thematique : ''
  
  if (search) query = query.ilike('titre', `%${search}%`)
  if (type) query = query.in('type_doc', type.split(','))
  if (thematique) query = query.in('thematique', thematique.split(','))
  
  const { data } = await query
  
  const initialData = {
    data: data || [],
    nextCursor: data && data.length === 20 ? data[data.length - 1].created_at : null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bibliothèque</h1>
        <p className="mt-2 text-gray-600">Recherchez et consultez nos ressources documentaires.</p>
      </div>
      
      <BibliothequeClient 
        initialData={initialData} 
        supabaseUrl={supabaseUrl} 
        supabaseAnonKey={supabaseAnonKey} 
      />
    </div>
  )
}
