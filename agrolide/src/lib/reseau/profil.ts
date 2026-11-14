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
  est_organisation?: boolean | null
  type_organisation?: string | null
  thematiques: string[]
  /** `false` = le membre ne souhaite pas recevoir d'invitations ; `null`/`true` = ouvert (décision D2). */
  ouvert_contact: boolean | null
  state: ConnectionState
  /** Identifiant de la ligne `user_connections`, quand il existe (pour accepter, ignorer ou retirer). */
  connectionId: string | null
  /** Note facultative jointe à une invitation reçue (texte brut, 300 caractères au plus). */
  note?: string | null
  /** Raisons réellement calculées d'une suggestion (3 au plus) ; absent hors tri « pertinence ». */
  raisons?: string[]
  /** Tri « pertinence » : `true` = suggéré (seuil atteint), `false` = simple nouveau membre. */
  suggere?: boolean
}

export function displayName(m: { prenom?: string | null; nom?: string | null }) {
  return `${m.prenom ?? ''} ${m.nom ?? ''}`.trim() || 'Membre agrolide'
}

export function categorieLabel(value: string | null | undefined) {
  if ((value ?? '').toLowerCase() === CATEGORIE_ORGANISATION) return 'Organisation'
  return CATEGORIES.find((c) => c.value === (value ?? '').toLowerCase())?.label ?? null
}

/**
 * Valeur d'affichage « Organisation » : jamais une catégorie d'adhésion (pas de cotisation, pas de choix à l'inscription,
 * pas dans le filtre de l'annuaire). Elle ne sert qu'à l'étiquette d'un compte marqué `est_organisation`.
 */
export const CATEGORIE_ORGANISATION = 'organisation'

/** Types d'organisation courants proposés aux Partenaires ; « Autre » ouvre une saisie libre. */
export const TYPES_ORGANISATION = [
  'Entreprise',
  'Association',
  'ONG',
  'Coopérative',
  'Organisation paysanne',
  'Institution publique',
  'Centre de recherche',
  'Établissement de formation',
  'Institution financière',
] as const

export const TYPE_ORGANISATION_AUTRE = 'Autre'

/** Seules les organisations (Partenaires et compte du réseau) portent un type d'organisation. */
export function porteUnType(m: { categorie?: string | null; est_organisation?: boolean | null }): boolean {
  return !!m.est_organisation || (m.categorie ?? '').toLowerCase() === 'partenaire'
}

/** Catégorie à afficher en badge : « organisation » pour le compte du réseau, sinon la catégorie d'adhésion. */
export function categorieAffichee(m: { categorie?: string | null; est_organisation?: boolean | null }): string | null {
  return m.est_organisation ? CATEGORIE_ORGANISATION : (m.categorie ?? null)
}

/** Second badge : type d'organisation, seulement pour une organisation et si renseigné. */
export function typeOrganisationAffiche(m: { categorie?: string | null; est_organisation?: boolean | null; type_organisation?: string | null }): string | null {
  return porteUnType(m) ? m.type_organisation?.trim() || null : null
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
  'Haoussa', 'Peul', 'Yoruba', 'Mooré', 'Fon', 'Kinyarwanda', 'Amharique', 'Berbère',
] as const

/** Marque de la langue maternelle dans la colonne `langues` (pas de colonne à ajouter : elle reste la première de la liste). */
const MARQUE_MATERNELLE = 'Maternelle : '

/** Sépare la langue maternelle des autres langues parlées. `toutes` = toutes les langues, sans marque (pour comparer deux membres). */
export function lireLangues(val: unknown): { maternelle: string; autres: string[]; toutes: string[] } {
  const liste = parseList(val)
  const mat = liste.find((l) => l.startsWith(MARQUE_MATERNELLE))
  const maternelle = mat ? mat.slice(MARQUE_MATERNELLE.length).trim() : ''
  const autres = liste.filter((l) => !l.startsWith(MARQUE_MATERNELLE) && l.toLowerCase() !== maternelle.toLowerCase())
  return { maternelle, autres, toutes: maternelle ? [maternelle, ...autres] : autres }
}

/** Inverse de `lireLangues` : la langue maternelle d'abord, avec sa marque. */
export function ecrireLangues(maternelle: string, autres: string[]): string[] {
  const m = maternelle.trim()
  const reste = autres.filter((l) => l.toLowerCase() !== m.toLowerCase())
  return m ? [MARQUE_MATERNELLE + m, ...reste] : reste
}

/** Centres d'intérêt proposés : l'agricole, mais aussi tout ce qui fait un membre (la liste libre complète). */
export const CENTRES_INTERET_GROUPES = [
  { titre: 'Agriculture', options: THEMATIQUES },
  { titre: 'Sciences et technologie', options: ['Technologie', 'Numérique', 'Énergie', 'Sciences', 'Innovation'] },
  { titre: 'Culture et loisirs', options: ['Lecture', 'Musique', 'Cinéma', 'Photographie', 'Cuisine', 'Voyage', 'Écriture'] },
  { titre: 'Sport et bien-être', options: ['Football', 'Course à pied', 'Randonnée', 'Sport', 'Bien-être'] },
  { titre: 'Engagement et société', options: ['Bénévolat', 'Entrepreneuriat', 'Jeunesse', 'Éducation', 'Développement durable'] },
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
