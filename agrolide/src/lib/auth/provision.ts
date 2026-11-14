import 'server-only'
import { eq, sql } from 'drizzle-orm'
import type { User } from '@supabase/supabase-js'
import { db } from '@/db'
import { users } from '@/db/schema'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { suivreAgrolide } from '@/lib/suivi/suivis.server'

/**
 * Garantit qu'un compte Supabase a une ligne dans la table `user` (D1).
 * Remplace le webhook Clerk et le « fallback » de membres/layout.
 *
 * Retourne :
 *  - isNew      : profil créé à l'instant (-> onboarding)
 *  - needsRefresh : app_metadata modifié, il faut rafraîchir le jeton pour qu'il le contienne
 */
export async function provisionProfile(authUser: User) {
  const email = authUser.email?.toLowerCase()
  if (!email) throw new Error('Compte sans e-mail')

  const appMeta = (authUser.app_metadata ?? {}) as { d1_id?: string; role?: string }
  const meta = (authUser.user_metadata ?? {}) as Record<string, string | undefined>
  const admin = createSupabaseAdmin()
  const d1Id = appMeta.d1_id ?? authUser.id

  // 1. Profil déjà présent sous l'identifiant attendu
  const byId = (await db.select({ id: users.id, role: users.role_plateforme }).from(users).where(eq(users.id, d1Id)).limit(1))[0]
  if (byId) {
    let needsRefresh = false
    if (appMeta.role !== (byId.role ?? 'membre')) {
      await admin.auth.admin.updateUserById(authUser.id, {
        app_metadata: { ...appMeta, role: byId.role ?? 'membre' },
      })
      needsRefresh = true
    }
    return { d1Id, isNew: false, needsRefresh }
  }

  // 2. Ancien compte (même e-mail, autre identifiant) : on garde son identifiant D1
  const byEmail = (await db.select({ id: users.id, role: users.role_plateforme }).from(users).where(sql`lower(${users.email}) = ${email}`).limit(1))[0]
  if (byEmail) {
    await admin.auth.admin.updateUserById(authUser.id, {
      app_metadata: { ...appMeta, d1_id: byEmail.id, role: byEmail.role ?? 'membre' },
    })
    return { d1Id: byEmail.id, isNew: false, needsRefresh: true }
  }

  // 3. Nouveau membre
  const now = new Date().toISOString()
  const fullName = meta.full_name ?? meta.name ?? null
  // Google ne fournit que le nom complet : on le découpe (1er mot = prénom).
  // Un Partenaire s'inscrit sous le nom de son organisation : pas de prénom.
  const nomOrganisation = meta.profil === 'partenaire' ? meta.nom?.trim() || null : null
  const prenom = nomOrganisation ? null : (meta.prenom || meta.given_name || meta.first_name || (fullName?.split(' ')[0] || null))
  const nom = nomOrganisation ?? (meta.nom ?? meta.family_name ?? meta.last_name ?? (fullName?.split(' ').slice(1).join(' ') || null))
  await db.insert(users).values({
    id: authUser.id,
    email,
    name: `${prenom ?? ''} ${nom ?? ''}`.trim() || fullName,
    prenom,
    nom,
    organisation: nomOrganisation,
    image: meta.avatar_url ?? meta.picture ?? null,
    photo_url: meta.avatar_url ?? meta.picture ?? null,
    emailVerified: authUser.email_confirmed_at ? new Date(authUser.email_confirmed_at) : null,
    role_plateforme: 'membre',
    statut_adhesion: 'gratuit',
    annuaire_visible: true,
    // Ouvert aux invitations par défaut (le code traite déjà une valeur vide comme « ouvert ») ; carte publique désactivée par défaut.
    ouvert_contact: true,
    profil_public: false,
    newsletter_brevo: true,
    created_at: now,
    updated_at: now,
  }).onConflictDoNothing()

  await admin.auth.admin.updateUserById(authUser.id, {
    app_metadata: { ...appMeta, role: 'membre' },
  })

  // Tout nouveau membre suit agrolide (il peut se désabonner depuis la fiche d'agrolide).
  await suivreAgrolide(authUser.id)

  // Inscription newsletter (consentement affiché sur la page d'inscription)
  import('@/app/actions/newsletter')
    .then(({ addEmailToBrevo }) => addEmailToBrevo(email))
    .catch((err) => console.error('Erreur auto-inscription Brevo:', err))

  return { d1Id: authUser.id, isNew: true, needsRefresh: true }
}
