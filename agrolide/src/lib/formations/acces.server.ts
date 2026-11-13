import 'server-only'
import { and, eq, gt, isNull, or } from 'drizzle-orm'
import { db } from '@/db'
import { codes_acces_formation, formations, inscriptions_formation, users } from '@/db/schema'
import { auth, isBootstrapAdminEmail } from '@/lib/auth/server'
import { diagnostiquerCode, genererCode, MESSAGES_CODE, normaliserCode } from './code-acces'

export { normaliserCode, genererCode }

export type ResultatCode = { ok: true } | { ok: false; erreur: string }

/** Vérifie un code sans le consommer (étape « saisie du code » du parcours). */
export async function verifierCode(saisie: string, formationId: string): Promise<ResultatCode> {
  const code = normaliserCode(saisie)
  if (code.length < 6) return { ok: false, erreur: MESSAGES_CODE.trop_court }
  const existant = await db.query.codes_acces_formation.findFirst({ where: eq(codes_acces_formation.code, code) })
  return diagnostiquerCode(existant, formationId, new Date().toISOString())
}

export type ResultatConsommation = { ok: true; codeId: string } | { ok: false; erreur: string }

/**
 * Consomme un code pour ce membre et cette formation. Une seule requête atomique :
 * deux personnes qui saisissent le même code au même instant ne peuvent pas toutes deux l'obtenir.
 */
export async function consommerCode(saisie: string, userId: string, formationId: string): Promise<ResultatConsommation> {
  const code = normaliserCode(saisie)
  if (code.length < 6) return { ok: false, erreur: MESSAGES_CODE.trop_court }
  const maintenant = new Date().toISOString()

  const pris = await db
    .update(codes_acces_formation)
    .set({ utilise_par: userId, utilise_le: maintenant })
    .where(
      and(
        eq(codes_acces_formation.code, code),
        isNull(codes_acces_formation.utilise_par),
        or(isNull(codes_acces_formation.formation_id), eq(codes_acces_formation.formation_id, formationId)),
        or(isNull(codes_acces_formation.expire_le), gt(codes_acces_formation.expire_le, maintenant)),
      ),
    )
    .returning({ id: codes_acces_formation.id })
  if (pris.length > 0) return { ok: true, codeId: pris[0].id }

  // Échec : on dit pourquoi.
  const existant = await db.query.codes_acces_formation.findFirst({ where: eq(codes_acces_formation.code, code) })
  const verdict = diagnostiquerCode(existant, formationId, maintenant)
  return verdict.ok ? { ok: false, erreur: "Ce code vient d'être utilisé." } : verdict
}

/** Rend un code consommé (l'inscription a échoué après coup : le code ne doit pas être perdu). */
export async function libererCode(codeId: string, userId: string): Promise<void> {
  await db
    .update(codes_acces_formation)
    .set({ utilise_par: null, utilise_le: null })
    .where(and(eq(codes_acces_formation.id, codeId), eq(codes_acces_formation.utilise_par, userId)))
}

/** Une formation est « externe » quand elle est hébergée chez un organisme (accès libre, sans code Agrolide). */
export async function formationExigeCode(formationId: string): Promise<boolean | null> {
  const f = await db.query.formations.findFirst({ columns: { lien_externe: true }, where: eq(formations.id, formationId) })
  if (!f) return null
  return !f.lien_externe
}

async function estAdmin(userId: string, email: string | null): Promise<boolean> {
  if (isBootstrapAdminEmail(email)) return true
  const p = await db.query.users.findFirst({ columns: { role_plateforme: true }, where: eq(users.id, userId) })
  return ['admin', 'admin_content', 'super_admin'].includes(p?.role_plateforme ?? '')
}

/** Le membre peut-il lire les leçons ? Inscrit (donc passé par un code), ou administrateur. */
export async function peutSuivre(formationId: string): Promise<{ userId: string | null; autorise: boolean }> {
  const { userId, email } = await auth()
  if (!userId) return { userId: null, autorise: false }
  const [inscription, admin] = await Promise.all([
    db.query.inscriptions_formation.findFirst({
      columns: { id: true },
      where: and(eq(inscriptions_formation.membre_id, userId), eq(inscriptions_formation.formation_id, formationId)),
    }),
    estAdmin(userId, email),
  ])
  return { userId, autorise: !!inscription || admin }
}
