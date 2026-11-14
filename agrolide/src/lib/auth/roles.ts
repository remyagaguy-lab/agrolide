import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { auth, isBootstrapAdminEmail } from '@/lib/auth/server'

/**
 * Deux niveaux d'administration :
 *  - `admin` (rôle D1 `admin_content`) : le compte du réseau, qui fait vivre la plateforme (contenus, communauté, demandes) ;
 *  - `super_admin` : supervision complète (paiements, analytics, rôles, suspensions, export, outils techniques).
 * Le rôle est toujours relu dans D1 (jamais décidé avec le seul jeton) ; ADMIN_EMAILS vaut super administrateur.
 */
export type RoleAdmin = 'super_admin' | 'admin'

export const roleAdmin = cache(async (): Promise<RoleAdmin | null> => {
  const { userId, email } = await auth()
  if (!userId) return null
  if (isBootstrapAdminEmail(email)) return 'super_admin'
  try {
    const [row] = await db.select({ role: users.role_plateforme }).from(users).where(eq(users.id, userId)).limit(1)
    if (row?.role === 'super_admin') return 'super_admin'
    if (row?.role === 'admin_content' || row?.role === 'admin') return 'admin'
  } catch (e) {
    console.error('[roles] rôle illisible :', e)
  }
  return null
})

/** Pages réservées au super administrateur : l'administrateur est renvoyé à son tableau de bord. */
export async function exigerSuperAdmin(): Promise<void> {
  const role = await roleAdmin()
  if (role !== 'super_admin') redirect(role === 'admin' ? '/admin/dashboard' : '/login')
}
