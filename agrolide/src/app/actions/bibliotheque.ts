'use server'

import { createClient } from '@/lib/supabase/server'

export async function checkTrocEligibility() {
  const supabase = await createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return { authorized: false, reason: 'unauthenticated', count: 0 }
  }

  // Count the number of published documents uploaded by the user
  const { count, error } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('depose_par', session.user.id)
    .eq('statut', 'publie')

  if (error) {
    console.error("Error checking troc eligibility:", error)
    return { authorized: false, reason: 'error', count: 0 }
  }

  const uploadedCount = count || 0
  // Le système de troc est temporairement désactivé. Toute personne connectée peut télécharger.
  return { authorized: true, count: uploadedCount }
}

export async function getDocumentUrl(documentId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('documents')
    .select('fichier_r2_key')
    .eq('id', documentId)
    .single()
    
  if (data?.fichier_r2_key) {
    // Generate the API proxy url to download
    return { url: `/api/r2-proxy?url=${encodeURIComponent(`https://${process.env.NEXT_PUBLIC_R2_PUBLIC_BUCKET}.r2.cloudflarestorage.com/${data.fichier_r2_key}`)}` }
  }
  return { error: 'Document non trouvé' }
}
