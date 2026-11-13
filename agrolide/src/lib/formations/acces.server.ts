import 'server-only'
import { and, eq, gt, isNull, or } from 'drizzle-orm'
import { db } from '@/db'
import { codes_acces_formation, formations, inscriptions_formation, users } from '@/db/schema'
import { auth, isBootstrapAdminEmail } from '@/lib/auth/server'

/** Sans I, O, 0, 1 : un code se lit et se recopie sans confusion. */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Forme canonique d'un code saisi : majuscules, sans espaces. « agro-ab12-cd34 » = « AGRO-AB12-CD34 ». */
export function normaliserCode(saisie: string): string {
  return saisie.toUpperCase().replace(/\s+/g, '')
}

/** AGRO-XXXX-XXXX (8 caractères tirés au hasard cryptographique : environ 10^12 combinaisons). */
export function genererCode(): string {
  const octets = crypto.getRandomValues(new Uint8Array(8))
  const c = Array.from(octets, (o) => ALPHABET[o % ALPHABET.length]).join('')
  return `AGRO-${c.slice(0, 4)}-${c.slice(4)}`
}

export type ResultatCode = { ok: true } | { ok: false; erreur: string }

/**
 * Consomme un code pour ce membre et cette formation. Une seule requête atomique :
 * deux personnes qui saisissent le même code au même instant ne peuvent pas toutes deux l'obtenir.
 */
export async function consommerCode(saisie: string, userId: string, formationId: string): Promise<ResultatCode> {
  const code = normaliserCode(saisie)
  if (code.length < 6) return { ok: false, erreur: "Saisissez le code reçu (il commence par AGRO)." }
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
  if (pris.length > 0) return { ok: true }

  // Échec : on dit pourquoi, sans rien révéler d'un code inexistant.
  const existant = await db.query.codes_acces_formation.findFirst({ where: eq(codes_acces_formation.code, code) })
  if (!existant) return { ok: false, erreur: "Ce code n'existe pas. Vérifiez-le et réessayez." }
  if (existant.utilise_par) return { ok: false, erreur: "Ce code a déjà été utilisé." }
  if (existant.expire_le && existant.expire_le <= maintenant) return { ok: false, erreur: "Ce code a expiré." }
  return { ok: false, erreur: "Ce code n'est pas valable pour cette formation." }
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
