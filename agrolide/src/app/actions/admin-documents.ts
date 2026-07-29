'use server'

import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { revalidatePath } from 'next/cache'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function validateDocument(documentId: string) {
  const supabase = await createClient()

  // Verify if current user is admin/super_admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { data: profile } = await supabase
    .from('profiles')
    .select('role_plateforme')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role_plateforme !== 'admin' && profile.role_plateforme !== 'super_admin')) {
    throw new Error("Privilèges insuffisants")
  }

  // Update status to 'publie'
  const { error } = await supabase
    .from('documents')
    .update({ 
      statut: 'publie',
      valide_par: user.id,
      published_at: new Date().toISOString()
    })
    .eq('id', documentId)

  if (error) throw new Error("Erreur lors de la validation du document: " + error.message)

  revalidatePath('/admin/contenus/documents')
  revalidatePath('/membres/bibliotheque')
  
  return { success: true }
}

export async function rejectDocument(documentId: string, reason: string) {
  const supabase = await createClient()

  // Verify if current user is admin/super_admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role_plateforme')
    .eq('id', user.id)
    .single()

  if (!adminProfile || (adminProfile.role_plateforme !== 'admin' && adminProfile.role_plateforme !== 'super_admin')) {
    throw new Error("Privilèges insuffisants")
  }

  // Get document details and the author's email
  const { data: doc } = await supabase
    .from('documents')
    .select('titre, depose_par, profiles:depose_par(email, prenom)')
    .eq('id', documentId)
    .single()

  if (!doc) throw new Error("Document introuvable")

  // Extract profile correctly whether it's an array or object
  const authorProfile = Array.isArray(doc.profiles) ? doc.profiles[0] : doc.profiles

  // Update status to 'rejete'
  const { error } = await supabase
    .from('documents')
    .update({ 
      statut: 'rejete',
      valide_par: user.id
    })
    .eq('id', documentId)

  if (error) throw new Error("Erreur lors du rejet du document: " + error.message)

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
    } catch (emailError) {
      console.error("Erreur d'envoi d'email :", emailError)
      // We don't throw here to avoid failing the rejection if the email fails
    }
  }

  revalidatePath('/admin/contenus/documents')
  
  return { success: true }
}

export async function deleteDocumentAdmin(documentId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { data: profile } = await supabase
    .from('profiles')
    .select('role_plateforme')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role_plateforme !== 'admin' && profile.role_plateforme !== 'super_admin')) {
    throw new Error("Privilèges insuffisants")
  }

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)

  if (error) throw new Error("Erreur lors de la suppression: " + error.message)

  revalidatePath('/admin/contenus/documents')
  return { success: true }
}
