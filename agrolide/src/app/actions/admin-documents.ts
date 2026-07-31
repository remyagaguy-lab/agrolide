'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { documents, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { revalidatePath } from 'next/cache'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function validateDocument(documentId: string) {
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

  // Update status to 'publie'
  await db.update(documents).set({
    statut: 'publie',
    valide_par: currentUserId,
    published_at: new Date().toISOString()
  }).where(eq(documents.id, documentId))

  revalidatePath('/admin/contenus/documents')
  revalidatePath('/membres/bibliotheque')
  
  return { success: true }
}

export async function rejectDocument(documentId: string, reason: string) {
  const { userId: currentUserId } = await auth();
  const user = currentUserId ? { id: currentUserId } : null;
  const session = currentUserId ? { user: { id: currentUserId } } : null;

  if (!user || !currentUserId) throw new Error("Non autorisé")

  const adminProfile = await db.query.users.findFirst({
    columns: { role_plateforme: true },
    where: eq(users.id, currentUserId)
  })

  if (!adminProfile || (adminProfile.role_plateforme !== 'admin' && adminProfile.role_plateforme !== 'super_admin')) {
    throw new Error("Privilèges insuffisants")
  }

  // Get document details and the author's email
  const doc = await db.query.documents.findFirst({
    columns: { titre: true },
    with: { depose_par: { columns: { email: true, prenom: true } } },
    where: eq(documents.id, documentId)
  })

  if (!doc) throw new Error("Document introuvable")

  const authorProfile = doc.depose_par

  // Update status to 'rejete'
  await db.update(documents).set({
    statut: 'rejete',
    valide_par: currentUserId
  }).where(eq(documents.id, documentId))

  // Send email if Resend is configured and author has an email
  if (resend && authorProfile?.email) {
    try {
      await resend.emails.send({
        from: 'Agrolide <contact@agrolide.org>',
        to: authorProfile.email,
        subject: 'Mise à jour concernant votre document - Agrolide',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Bonjour ${authorProfile.prenom || ''},</h2>
            <p>Nous vous remercions d'avoir partagé le document <strong>"${doc.titre}"</strong> sur Agrolide.</p>
            <p>Après examen par notre équipe de modération, nous ne pouvons malheureusement pas publier ce document pour la raison suivante :</p>
            <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
              ${reason}
            </div>
            <p>N'hésitez pas à proposer d'autres documents respectant nos critères de publication.</p>
            <p>Cordialement,<br>L'équipe de modération Agrolide</p>
          </div>
        `
      })
    } catch (e) {
      console.error("Erreur envoi email rejet document:", e)
    }
  }

  revalidatePath('/admin/contenus/documents')
  
  return { success: true }
}

export async function deleteDocumentAdmin(documentId: string) {
  const { userId: currentUserId } = await auth();
  const user = currentUserId ? { id: currentUserId } : null;
  const session = currentUserId ? { user: { id: currentUserId } } : null;

  if (!user || !currentUserId) throw new Error("Non autorisé")

  const adminProfile = await db.query.users.findFirst({
    columns: { role_plateforme: true },
    where: eq(users.id, currentUserId)
  })

  if (!adminProfile || (adminProfile.role_plateforme !== 'admin' && adminProfile.role_plateforme !== 'super_admin')) {
    throw new Error("Privilèges insuffisants")
  }

  await db.delete(documents).where(eq(documents.id, documentId))

  revalidatePath('/admin/contenus/documents')
  revalidatePath('/membres/bibliotheque')
  
  return { success: true }
}
