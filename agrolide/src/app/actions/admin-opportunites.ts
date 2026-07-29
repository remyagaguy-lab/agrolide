'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function validateOpportunity(id: string) {
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
    .from('opportunites')
    .update({ statut: 'publie' })
    .eq('id', id)

  if (error) throw new Error("Erreur lors de la validation: " + error.message)

  revalidatePath('/admin/contenus/opportunites')
  revalidatePath('/opportunites')
  
  return { success: true }
}

export async function rejectOpportunity(id: string) {
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
    .from('opportunites')
    .update({ statut: 'rejete' })
    .eq('id', id)

  if (error) throw new Error("Erreur lors du rejet: " + error.message)

  revalidatePath('/admin/contenus/opportunites')
  
  return { success: true }
}

export async function deleteOpportunityAdmin(id: string) {
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
    .from('opportunites')
    .delete()
    .eq('id', id)

  if (error) throw new Error("Erreur lors de la suppression: " + error.message)

  revalidatePath('/admin/contenus/opportunites')
  revalidatePath('/opportunites')
  
  return { success: true }
}
