import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/** Client Supabase pour Server Components, Server Actions et Route Handlers. */
export async function createSupabaseServer() {
  const store = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) => store.set(name, value, options))
          } catch {
            // Appelé depuis un Server Component : le middleware rafraîchit déjà la session.
          }
        },
      },
    }
  )
}
