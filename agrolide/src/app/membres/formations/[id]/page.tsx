import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { FormationDetailClient } from '@/components/modules/formations/FormationDetailClient'

export default async function FormationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  // Use a proper fetching strategy, this might just run at build time if not careful,
  // but since we read cookies inside auth.getSession() it forces dynamic rendering.
  // Wait, Next.js requires cookies() from next/headers to read auth, so let's just 
  // do a basic fetch and pass data. In Next.js App Router, using simple supabase client 
  // without cookies will not have the session. So we pass an anon client and let 
  // the client component handle inscriptions if needed, or we just pass the formation.
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  const { data: formation, error } = await supabase
    .from('formations')
    .select('*, sessions_formation(*), intervenants(*), avis_formation(*, profiles(prenom, nom, avatar_url))')
    .eq('id', id)
    .single()
    
  if (error || !formation) {
    notFound()
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <FormationDetailClient 
        initialFormation={formation} 
      />
    </div>
  )
}
