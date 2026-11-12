import { parseList } from './profil'

/**
 * Carte publique d'un membre (tableau de visibilité §6.2) : ce qu'un visiteur sans compte a le droit de voir,
 * uniquement si la personne a activé son « profil public ». Ni e-mail, ni téléphone, ni nom complet.
 * Fichier sans accès base : importable côté client (aperçu) comme côté serveur.
 */
export interface CartePublique {
  /** Prénom et initiale du nom : « Awa K. ». */
  nom: string
  photo_url: string | null
  specialite: string | null
  pays: string | null
  /** 3 au plus. */
  thematiques: string[]
}

export const MAX_THEMATIQUES_PUBLIQUES = 3

export interface LigneCarte {
  prenom: string | null
  nom: string | null
  photo_url: string | null
  specialite: string | null
  pays: string | null
  secteurs_expertise: string | null
}

export function carteDepuis(row: LigneCarte): CartePublique {
  const prenom = (row.prenom ?? '').trim()
  const initiale = (row.nom ?? '').trim().charAt(0).toLocaleUpperCase('fr')
  return {
    nom: [prenom, initiale ? `${initiale}.` : ''].filter(Boolean).join(' ') || 'Membre agrolide',
    photo_url: row.photo_url?.trim() || null,
    specialite: row.specialite?.trim() || null,
    pays: row.pays?.trim() || null,
    thematiques: parseList(row.secteurs_expertise).slice(0, MAX_THEMATIQUES_PUBLIQUES),
  }
}

/** Visible d'un visiteur seulement si le membre a activé sa carte ET reste présent dans l'annuaire. */
export function carteEstPublique(row: { profil_public: boolean | null; annuaire_visible: boolean | null }): boolean {
  return row.profil_public === true && row.annuaire_visible !== false
}
