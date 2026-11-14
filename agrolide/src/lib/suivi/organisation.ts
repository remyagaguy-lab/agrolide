/** Compte du réseau « agrolide » : l'organisation qui relaie événements et opportunités. */
export const AGROLIDE_ID = '9b4e6d21-7a3c-4f58-8e10-c5a2d7f1b836'

/** Une organisation se suit (on ne s'y connecte pas) : le compte agrolide et tout profil de catégorie Partenaire. */
export function estOrganisation(id: string | null | undefined, categorie: string | null | undefined): boolean {
  if (id === AGROLIDE_ID) return true
  return (categorie ?? '').trim().toLowerCase() === 'partenaire'
}
