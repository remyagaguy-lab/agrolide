'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function ignoreReport(messageId: string) {
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
    .from('forum_messages')
    .update({ statut: 'publie' }) // remettre en ligne
    .eq('id', messageId)

  if (error) throw new Error("Erreur lors de l'ignorance du signalement: " + error.message)

  revalidatePath('/admin/forum')
  
  return { success: true }
}

export async function deleteMessage(messageId: string) {
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
    .from('forum_messages')
    .update({ statut: 'supprime' }) // suppression logique
    .eq('id', messageId)

  if (error) throw new Error("Erreur lors de la suppression: " + error.message)

  revalidatePath('/admin/forum')
  
  return { success: true }
}

export async function banUser(userId: string, reason: string) {
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

  // To ban a user in Supabase, we need the Service Role Key to use the Admin API
  const { createClient: createAdminClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Ban the user indefinitely (for example, 10 years = 87600h)
  const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    ban_duration: '87600h'
  })

  if (banError) throw new Error("Erreur lors du bannissement au niveau de l'authentification: " + banError.message)

  // We also optionally update their profile status if there's a field for it, but Auth level ban is sufficient.
  // We can just keep a log or note of the reason somewhere, or just trust the admin knows why.

  revalidatePath('/admin/forum')
  
  return { success: true }
}
