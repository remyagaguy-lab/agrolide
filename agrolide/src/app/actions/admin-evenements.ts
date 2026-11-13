'use server'

import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { evenements, inscriptions_evenement, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { nettoyerTextes } from "@/lib/utils/sans-emoji"
import { apresReponse, diffuserPush } from '@/lib/push/envoyer.server'

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

export async function getAdminEvenements() {
  await checkAdmin()
  
  const evts = await db.query.evenements.findMany({
    orderBy: (evenements, { desc }) => [desc(evenements.date_debut)]
  })
  
  // get counts (manual count since drizzle query builder may need manual aggregation or separate query)
  const counts = await db.select({
    evenement_id: inscriptions_evenement.evenement_id
  }).from(inscriptions_evenement)
  
  const countMap = counts.reduce((acc: any, row) => {
    acc[row.evenement_id] = (acc[row.evenement_id] || 0) + 1
    return acc
  }, {})

  return evts.map(e => ({
    ...e,
    inscriptions: [{ count: countMap[e.id] || 0 }]
  }))
}

export async function deleteAdminEvenement(id: string) {
  await checkAdmin()
  
  await db.delete(inscriptions_evenement).where(eq(inscriptions_evenement.evenement_id, id))
  await db.delete(evenements).where(eq(evenements.id, id))

  revalidatePath('/admin/contenus/evenements')
  revalidatePath('/evenements')
  revalidatePath('/webinaires')
  
  return { success: true }
}

export async function upsertAdminEvenement(brut: any, id?: string) {
  await checkAdmin()
  const payload = nettoyerTextes(brut)
  
  let idEvenement = id
  let dejaPublie = false
  if (id) {
    const avant = await db.query.evenements.findFirst({ columns: { publie: true }, where: eq(evenements.id, id) })
    dejaPublie = !!avant?.publie
    await db.update(evenements).set(payload).where(eq(evenements.id, id))
  } else {
    idEvenement = crypto.randomUUID()
    await db.insert(evenements).values({ ...payload, id: idEvenement })
  }

  // Annonce aux membres qui ont activé la catégorie « Formations, événements… » : seulement à la mise en ligne
  // (création publiée ou passage de brouillon à publié) d'un événement à venir, jamais à une simple modification.
  const aVenir = payload.date_debut && new Date(payload.date_debut).getTime() > Date.now()
  if (payload.publie && !dejaPublie && aVenir && payload.titre) {
    apresReponse(() =>
      diffuserPush('activite', { titre: 'Nouvel événement', corps: payload.titre, lien: `/membres/evenements/${idEvenement}`, tag: `evenement-${idEvenement}` }),
    )
  }

  revalidatePath('/admin/contenus/evenements')
  revalidatePath('/evenements')
  revalidatePath('/webinaires')

  return { success: true }
}
