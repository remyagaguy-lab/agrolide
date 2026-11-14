'use server'

import { db } from '@/db'
import { formations, sessions_formation, users } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/lib/auth/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { nettoyerTextes } from "@/lib/utils/sans-emoji"
import { apresReponse } from '@/lib/push/envoyer.server'
import { annoncerPublication } from '@/lib/suivi/annonce.server'
import { AGROLIDE_ID } from '@/lib/suivi/organisation'

async function checkAdmin() {
  const { userId: currentUserId } = await auth();
  const user = currentUserId ? { id: currentUserId } : null;
  const session = currentUserId ? { user: { id: currentUserId } } : null;

  if (!user || !currentUserId) throw new Error("Non autorisé")

  const profile = await db.query.users.findFirst({
    columns: { role_plateforme: true },
    where: eq(users.id, currentUserId)
  })

  if (!profile || (profile.role_plateforme !== 'admin' && profile.role_plateforme !== 'super_admin')) {
    throw new Error("Privilèges insuffisants")
  }
}

export async function getAdminFormations() {
  await checkAdmin()

  const results = await db.query.formations.findMany({
    with: {
      sessions_formation: {
        columns: { id: true } // We just want the count, so getting ids is fine
      }
    },
    orderBy: (formations, { desc }) => [desc(formations.created_at)]
  })
  
  // Transform to match the old format
  return results.map(f => ({
    ...f,
    sessions_formation: [{ count: f.sessions_formation?.length || 0 }]
  }))
}

export async function deleteFormation(id: string) {
  await checkAdmin()
  await db.delete(formations).where(eq(formations.id, id))
  revalidateTag('formations', 'max')
  revalidatePath('/formations')
}

export async function upsertFormation(id: string | null, brut: any) {
  await checkAdmin()
  const payload = nettoyerTextes(brut)
  
  const mappedPayload = {
    titre: payload.titre,
    description: payload.description,
    thematique: payload.thematique,
    niveau: payload.niveau,
    modalite: payload.modalite,
    prix_fcfa: payload.prix, // Map prix to prix_fcfa as in schema
    statut: payload.statut,
    acces: payload.acces || 'public',
  }
  
  let idFormation = id
  let dejaPubliee = false
  if (id) {
    const avant = await db.query.formations.findFirst({ columns: { statut: true }, where: eq(formations.id, id) })
    dejaPubliee = avant?.statut === 'publie'
    await db.update(formations).set(mappedPayload).where(eq(formations.id, id))
  } else {
    idFormation = crypto.randomUUID()
    await db.insert(formations).values({
      ...mappedPayload,
      id: idFormation,
      created_at: new Date().toISOString()
    })
  }
  // Mise en ligne (création publiée ou passage de brouillon à publié) : les abonnés d'agrolide sont prévenus.
  if (mappedPayload.statut === 'publie' && !dejaPubliee && mappedPayload.titre) {
    apresReponse(() =>
      annoncerPublication({ auteurId: AGROLIDE_ID, type: 'formation', categorie: 'activite', titreAlerte: 'Nouvelle formation', titre: mappedPayload.titre, lien: `/membres/formations/${idFormation}`, tag: `formation-${idFormation}` }),
    )
  }
  revalidateTag('formations', 'max')
  revalidatePath('/formations')
}
