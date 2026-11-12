/**
 * Blocage et signalement d'un membre : constantes partagées (client et serveur), sans accès base.
 */

/** Motifs de signalement : liste fermée validée par l'utilisateur (12/11/2026). On enregistre le code, jamais un texte libre. */
export const MOTIFS_SIGNALEMENT = [
  { value: 'harcelement', label: 'Harcèlement ou comportement inapproprié' },
  { value: 'demarchage', label: 'Démarchage ou publicité non sollicités' },
  { value: 'usurpation', label: 'Faux profil ou usurpation d’identité' },
  { value: 'contenu', label: 'Contenu inapproprié' },
  { value: 'autre', label: 'Autre' },
] as const

export type MotifSignalement = (typeof MOTIFS_SIGNALEMENT)[number]['value']

export const estMotifSignalement = (v: unknown): v is MotifSignalement => MOTIFS_SIGNALEMENT.some((m) => m.value === v)

/** Libellé d'un motif enregistré ; un code inconnu (ancienne valeur) est rendu tel quel. */
export const motifLabel = (code: string) => MOTIFS_SIGNALEMENT.find((m) => m.value === code)?.label ?? code
