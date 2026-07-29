'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
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

  return { supabase, user }
}

// Catégories
export async function createCategory(data: { nom: string, description: string, icone: string, ordre: number }) {
  const { supabase } = await checkAdmin()
  const { error } = await supabase.from('forum_categories').insert([data])
  if (error) throw new Error(error.message)
  revalidatePath('/admin/forum')
}

export async function updateCategory(id: string, data: { nom: string, description: string, icone: string, ordre: number }) {
  const { supabase } = await checkAdmin()
  const { error } = await supabase.from('forum_categories').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/forum')
}

export async function deleteCategory(id: string) {
  const { supabase } = await checkAdmin()
  // Ensure no threads are linked, or cascade depending on DB settings.
  // We'll just attempt to delete.
  const { error } = await supabase.from('forum_categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/forum')
}

// Fils
export async function deleteThread(id: string) {
  const { supabase } = await checkAdmin()
  // Delete all messages first if no cascade
  await supabase.from('forum_messages').delete().eq('fil_id', id)
  const { error } = await supabase.from('forum_fils').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/forum')
}

export async function createAdminThread(categorie_id: string, titre: string, contenu: string) {
  const { supabase, user } = await checkAdmin()
  
  // Create thread
  const { data: fil, error: filErr } = await supabase.from('forum_fils').insert({
    categorie_id,
    titre,
    auteur_id: user.id
  }).select().single()

  if (filErr || !fil) throw new Error(filErr?.message || "Erreur création fil")

  // Create first message
  const { error: msgErr } = await supabase.from('forum_messages').insert({
    fil_id: fil.id,
    auteur_id: user.id,
    contenu,
    statut: 'publie'
  })

  if (msgErr) throw new Error(msgErr.message)

  revalidatePath('/admin/forum')
  return fil.id
}
