import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'
import { provisionProfile } from '@/lib/auth/provision'
import { safeNext } from '@/lib/auth/safe-next'

/**
 * Point d'arrivée unique après :
 *  - clic sur le lien de confirmation d'e-mail (?code=...)
 *  - clic sur le lien « mot de passe oublié » (?code=...&next=/reset-password)
 *  - connexion par mot de passe (appel direct, sans code) pour créer/lier le profil D1
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))
  const supabase = await createSupabaseServer()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=lien_invalide`)
    }
  }

  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    return NextResponse.redirect(`${origin}/login?error=session_expiree`)
  }

  // Réinitialisation de mot de passe : pas de provisionnement, on va saisir le nouveau mot de passe.
  if (next.startsWith('/reset-password')) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  try {
    const { isNew, needsRefresh } = await provisionProfile(data.user)
    // Profil choisi avant la connexion Google : retenu sur le compte pour que l'onboarding ne le redemande pas.
    const profil = searchParams.get('profil')
    if (isNew && profil && ['passionne', 'junior', 'professionnel', 'partenaire', 'senior'].includes(profil)) {
      await supabase.auth.updateUser({ data: { profil } })
    }
    if (needsRefresh) await supabase.auth.refreshSession()
    return NextResponse.redirect(`${origin}${isNew ? '/onboarding' : next}`)
  } catch (err) {
    console.error('Provisionnement du profil impossible:', err)
    return NextResponse.redirect(`${origin}/login?error=profil`)
  }
}
