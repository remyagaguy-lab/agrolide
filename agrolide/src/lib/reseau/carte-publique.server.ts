import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { carteDepuis, carteEstPublique, type CartePublique } from './carte-publique'

/**
 * Carte publique d'un membre pour un visiteur. `null` dans tous les cas où elle ne doit pas être montrée
 * (inexistant, profil public désactivé, profil masqué) : la page répond pareil, pas d'énumération possible.
 * Seules les colonnes de la carte sont lues.
 */
export async function fetchCartePublique(id: string): Promise<CartePublique | null> {
  const [row] = await db
    .select({
      prenom: users.prenom,
      nom: users.nom,
      photo_url: users.photo_url,
      specialite: users.specialite,
      pays: users.pays,
      secteurs_expertise: users.secteurs_expertise,
      profil_public: users.profil_public,
      annuaire_visible: users.annuaire_visible,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
  if (!row || !carteEstPublique(row)) return null
  return carteDepuis(row)
}
