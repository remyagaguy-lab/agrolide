/** Règles pures des codes d'accès aux formations Agrolide (sans base de données : testables seules). */

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

export interface CodeEnregistre {
  utilise_par: string | null
  formation_id: string | null
  expire_le: string | null
}

export type VerdictCode = { ok: true } | { ok: false; erreur: string }

export const MESSAGES_CODE = {
  trop_court: 'Saisissez le code reçu (il commence par AGRO).',
  inconnu: "Ce code n'existe pas. Vérifiez-le et réessayez.",
  utilise: 'Ce code a déjà été utilisé.',
  expire: 'Ce code a expiré.',
  autre_formation: "Ce code n'est pas valable pour cette formation.",
} as const

/** Dit si un code (ou son absence) permet l'inscription à cette formation, et sinon pourquoi. */
export function diagnostiquerCode(code: CodeEnregistre | null | undefined, formationId: string, maintenantIso: string): VerdictCode {
  if (!code) return { ok: false, erreur: MESSAGES_CODE.inconnu }
  if (code.utilise_par) return { ok: false, erreur: MESSAGES_CODE.utilise }
  if (code.expire_le && code.expire_le <= maintenantIso) return { ok: false, erreur: MESSAGES_CODE.expire }
  if (code.formation_id && code.formation_id !== formationId) return { ok: false, erreur: MESSAGES_CODE.autre_formation }
  return { ok: true }
}
