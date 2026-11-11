import 'server-only'
import { cache } from 'react'
import { createSupabaseServer } from '@/lib/supabase/server'

/**
 * Couche d'authentification serveur (Supabase Auth).
 * Garde la même forme que l'ancienne API Clerk : `const { userId } = await auth()`.
 *
 * `userId` = identifiant de la table `user` (D1) :
 *   - anciens comptes : `app_metadata.d1_id` (ancien ID Clerk conservé)
 *   - nouveaux comptes : UUID Supabase
 */

export type AppRole = 'membre' | 'admin_content' | 'super_admin' | string

/**
 * RÈGLE (audit S10) : le rôle présent dans le jeton Supabase (app_metadata.role) peut être
 * périmé jusqu'à la prochaine connexion. Il n'est donc volontairement PAS exposé ici.
 * Toute décision de droit d'accès relit le rôle dans D1 (voir lib/auth/admin.ts : requireAdmin()).
 */
export type AuthResult = {
  userId: string | null
  /** UUID Supabase (peut différer de userId pour les anciens comptes). */
  authId: string | null
  email: string | null
  /** Compat Auth.js : `session.user.id` */
  user: { id: string; email: string | null } | null
}

const EMPTY: AuthResult = {
  userId: null, authId: null, email: null, user: null,
}

export const auth = cache(async (): Promise<AuthResult> => {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (error || !claims?.sub) return EMPTY

  const appMeta = (claims.app_metadata ?? {}) as { d1_id?: string; role?: string }
  const userId = appMeta.d1_id ?? claims.sub
  const email = (claims.email as string | undefined) ?? null

  return {
    userId,
    authId: claims.sub,
    email,
    user: { id: userId, email },
  }
})

export type CurrentUser = {
  id: string
  authId: string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  emailAddresses: { emailAddress: string }[]
  primaryEmailAddress: { emailAddress: string } | null
}

export const currentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.auth.getUser()
  const u = data?.user
  if (error || !u) return null

  const meta = (u.user_metadata ?? {}) as Record<string, string | undefined>
  const appMeta = (u.app_metadata ?? {}) as { d1_id?: string; role?: string }
  const email = u.email ?? ''
  const fullName = meta.full_name ?? meta.name ?? ''

  return {
    id: appMeta.d1_id ?? u.id,
    authId: u.id,
    firstName: meta.prenom ?? meta.first_name ?? (fullName.split(' ')[0] || null),
    lastName: meta.nom ?? meta.last_name ?? (fullName.split(' ').slice(1).join(' ') || null),
    imageUrl: meta.avatar_url ?? meta.picture ?? null,
    emailAddresses: email ? [{ emailAddress: email }] : [],
    primaryEmailAddress: email ? { emailAddress: email } : null,
  }
})

/** E-mails super-administrateurs de secours (variable d'env ADMIN_EMAILS, séparés par des virgules). */
export function isBootstrapAdminEmail(email: string | null | undefined) {
  if (!email) return false
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase())
}
