import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const { code } = searchParams
  
  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  
  // Redirige vers /membres/cotisation (paiement obligatoire avant accès dashboard)
  redirect('/membres/cotisation')
}
