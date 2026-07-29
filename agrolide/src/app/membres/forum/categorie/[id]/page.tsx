import React from 'react'
import CategorieClient from '@/components/modules/forum/CategorieClient'
import { Metadata } from 'next'

import { createClient } from '@supabase/supabase-js'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const { data } = await supabase.from('forum_categories').select('nom').eq('id', id).single()
  return { title: data?.nom || "Catégorie" }
}

export default async function CategoriePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CategorieClient categorieId={id} />
}
