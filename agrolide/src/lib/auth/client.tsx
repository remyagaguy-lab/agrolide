'use client'

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react'
import Link from 'next/link'
import type { Session } from '@supabase/supabase-js'
import { createSupabaseBrowser } from '@/lib/supabase/client'

/**
 * Couche d'authentification client (Supabase Auth).
 * Reprend la forme de l'ancienne API Clerk (useAuth, useUser, useClerk, Show, UserButton).
 */

type ClientUser = {
  id: string
  authId: string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  primaryEmailAddress: { emailAddress: string } | null
  emailAddresses: { emailAddress: string }[]
}

type AuthState = {
  isLoaded: boolean
  isSignedIn: boolean
  userId: string | null
  user: ClientUser | null
  session: Session | null
}

const AuthContext = createContext<AuthState>({
  isLoaded: false, isSignedIn: false, userId: null, user: null, session: null,
})

function toUser(session: Session | null): ClientUser | null {
  const u = session?.user
  if (!u) return null
  const meta = (u.user_metadata ?? {}) as Record<string, string | undefined>
  const appMeta = (u.app_metadata ?? {}) as { d1_id?: string }
  const fullName = meta.full_name ?? meta.name ?? ''
  const email = u.email ?? ''
  return {
    id: appMeta.d1_id ?? u.id,
    authId: u.id,
    firstName: meta.prenom ?? meta.first_name ?? (fullName.split(' ')[0] || null),
    lastName: meta.nom ?? meta.last_name ?? (fullName.split(' ').slice(1).join(' ') || null),
    imageUrl: meta.avatar_url ?? meta.picture ?? null,
    primaryEmailAddress: email ? { emailAddress: email } : null,
    emailAddresses: email ? [{ emailAddress: email }] : [],
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoaded: false, isSignedIn: false, userId: null, user: null, session: null,
  })

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    const apply = (session: Session | null) => {
      const user = toUser(session)
      setState({ isLoaded: true, isSignedIn: !!user, userId: user?.id ?? null, user, session })
    }
    supabase.auth.getSession().then(({ data }) => apply(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => apply(session))
    return () => sub.subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const { isLoaded, isSignedIn, userId } = useContext(AuthContext)
  const getToken = useCallback(async () => {
    const { data } = await createSupabaseBrowser().auth.getSession()
    return data.session?.access_token ?? null
  }, [])
  const signOut = useCallback(async (opts?: { redirectUrl?: string }) => {
    await createSupabaseBrowser().auth.signOut()
    window.location.href = opts?.redirectUrl ?? '/'
  }, [])
  return useMemo(
    () => ({ isLoaded, isSignedIn, userId, getToken, signOut }),
    [isLoaded, isSignedIn, userId, getToken, signOut]
  )
}

export function useUser() {
  const { isLoaded, isSignedIn, user } = useContext(AuthContext)
  return { isLoaded, isSignedIn, user }
}

/** Remplace useClerk() : seul `signOut` est utilisé dans le projet. */
export function useClerk() {
  const { signOut } = useAuth()
  return { signOut }
}

/** Remplace <Show when="signed-in|signed-out">. */
export function Show({ when, children }: { when: 'signed-in' | 'signed-out'; children: ReactNode }) {
  const { isLoaded, isSignedIn } = useContext(AuthContext)
  if (!isLoaded) return null
  return (when === 'signed-in') === isSignedIn ? <>{children}</> : null
}

/** Remplace <UserButton /> : pastille avec initiales + lien profil + déconnexion. */
export function UserButton() {
  const { user } = useUser()
  const { signOut } = useAuth()
  const [open, setOpen] = useState(false)
  if (!user) return null
  const initials = (
    ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')) ||
    user.primaryEmailAddress?.emailAddress?.[0] ||
    '?'
  ).toUpperCase()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu du compte"
        aria-expanded={open}
        className="h-9 w-9 rounded-full bg-[#1b5e38] text-white text-[13px] font-bold flex items-center justify-center overflow-hidden"
      >
        {user.imageUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
          : initials}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-lg border border-[#e8e8e4] bg-white shadow-lg py-1 z-50">
          <p className="px-3 py-2 text-xs text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
          <Link href="/membres/profil" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm hover:bg-gray-50">Mon profil</Link>
          <button type="button" onClick={() => signOut()}className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50">Se déconnecter</button>
        </div>
      )}
    </div>
  )
}
