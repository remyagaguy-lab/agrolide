/**
 * Types et utilitaires de profil partagés par l'annuaire, « Mon réseau » et la fiche.
 * Aucun accès base ici : ce fichier est importable côté client comme côté serveur.
 */

export const CATEGORIES = [
  { value: 'passionne', label: 'Passionné' },
  { value: 'junior', label: 'Junior' },
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'partenaire', label: 'Partenaire' },
  { value: 'senior', label: 'Sénior' },
] as const

/** Thématiques proposées par l'annuaire (liste d'origine, à faire valider : décision D4). */
export const THEMATIQUES = [
  'Productions végétales',
  'Élevage',
  'Transformation',
  'Agroéconomie',
  'Agritech',
  'Environnement',
  'Logistique',
  'Commerce',
  'Recherche',
] as const

/** Pays proposés à l'inscription (même liste que l'onboarding), « Autre » regroupant le reste. */
export const PAYS = [
  'Sénégal', "Côte d'Ivoire", 'Cameroun', 'Bénin', 'Togo', 'Mali', 'Burkina Faso', 'Guinée', 'Congo', 'Gabon',
  'RDC', 'Madagascar', 'Maroc', 'Tunisie', 'Algérie', 'France', 'Canada',
] as const

export const PAYS_AUTRE = 'Autre'

export type ConnectionState = 'none' | 'pending_sent' | 'pending_received' | 'accepted'

/** Ce qu'une carte de membre a le droit de recevoir : jamais d'e-mail ni de téléphone. */
export interface MemberSummary {
  id: string
  prenom: string | null
  nom: string | null
  photo_url: string | null
  specialite: string | null
  organisation: string | null
  pays: string | null
  ville: string | null
  categorie: string | null
  thematiques: string[]
  /** `false` = le membre ne souhaite pas recevoir d'invitations ; `null`/`true` = ouvert (décision D2). */
  ouvert_contact: boolean | null
  state: ConnectionState
  /** Identifiant de la ligne `user_connections`, quand il existe (pour accepter, ignorer ou retirer). */
  connectionId: string | null
}

export function displayName(m: { prenom?: string | null; nom?: string | null }) {
  return `${m.prenom ?? ''} ${m.nom ?? ''}`.trim() || 'Membre agrolide'
}

export function categorieLabel(value: string | null | undefined) {
  return CATEGORIES.find((c) => c.value === (value ?? '').toLowerCase())?.label ?? null
}

/** Lit une liste stockée en JSON (`["a","b"]`) ou en texte séparé par des virgules. */
export function parseList(val: unknown): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val.map(String).map((s) => s.trim()).filter(Boolean)
  if (typeof val !== 'string') return []
  const trimmed = val.trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return parsed.map(String).map((s) => s.trim()).filter(Boolean)
    } catch {
      // repli : lecture par virgules
    }
  }
  return trimmed.split(',').map((s) => s.trim()).filter(Boolean)
}

/** N'accepte que des liens http(s) : un `javascript:` stocké en base ne devient jamais un lien actif. */
export function safeExternalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  try {
    const url = new URL(raw.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

/** Langues proposées à la saisie du profil (liste fermée ; les valeurs déjà saisies ailleurs restent conservées). */
export const LANGUES = [
  'Français', 'Anglais', 'Arabe', 'Portugais', 'Espagnol', 'Swahili', 'Wolof', 'Lingala', 'Bambara', 'Malgache',
] as const

/** Grandes régions, uniquement pour les pays proposés à l'inscription (aucune région pour France et Canada). */
export const REGIONS: Record<string, readonly string[]> = {
  "Afrique de l'Ouest": ['Sénégal', "Côte d'Ivoire", 'Bénin', 'Togo', 'Mali', 'Burkina Faso', 'Guinée'],
  'Afrique centrale': ['Cameroun', 'Congo', 'Gabon', 'RDC'],
  'Afrique du Nord': ['Maroc', 'Tunisie', 'Algérie'],
  'Océan Indien': ['Madagascar'],
}

export function regionDe(pays: string | null | undefined): string | null {
  if (!pays) return null
  for (const [region, liste] of Object.entries(REGIONS)) if (liste.includes(pays)) return region
  return null
}
