import 'server-only'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { auth, isBootstrapAdminEmail } from '@/lib/auth/server'

const ADMIN_ROLES = ['admin', 'admin_content', 'super_admin']

export type AdminCheck =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse }

/**
 * Contrôle d'accès admin unique pour les routes /api/admin/**.
 * Le rôle est relu dans D1 (jamais décidé avec le seul jeton) ; ADMIN_EMAILS sert de secours.
 *
 * Usage :
 *   const admin = await requireAdmin()
 *   if (!admin.ok) return admin.response
 */
export async function requireAdmin(): Promise<AdminCheck> {
  const { userId, email } = await auth()
  if (!userId) {
    return { ok: false, response: NextResponse.json({ error: 'Non autorisé' }, { status: 401 }) }
  }
  if (isBootstrapAdminEmail(email)) return { ok: true, userId }

  const profile = await db
    .select({ role_plateforme: users.role_plateforme })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .then((r) => r[0])

  if (!profile || !ADMIN_ROLES.includes(profile.role_plateforme || '')) {
    return { ok: false, response: NextResponse.json({ error: 'Accès refusé' }, { status: 403 }) }
  }
  return { ok: true, userId }
}
