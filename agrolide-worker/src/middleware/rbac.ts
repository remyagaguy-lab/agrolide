import { Context, Next } from 'hono'

export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const profile = c.get('profile')
    if (!profile) return c.json({ error: 'Profil introuvable' }, 403)

    const hasRole = roles.includes(profile.role_plateforme)
      || roles.includes(profile.categorie)
    if (!hasRole) return c.json({ error: 'Accès refusé' }, 403)

    // Vérifier statut adhésion (sauf admin)
    if (!['admin_content', 'super_admin'].includes(profile.role_plateforme)) {
      if (profile.statut_adhesion !== 'actif') {
        return c.json({ error: 'Adhésion inactive' }, 403)
      }
    }
    await next()
  }
}
