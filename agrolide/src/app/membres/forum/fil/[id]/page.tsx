import React from 'react'
import FilClient from '@/components/modules/forum/FilClient'
import { Metadata } from 'next'

import { createClient } from '@supabase/supabase-js'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const { data } = await supabase.from('forum_fils').select('titre').eq('id', id).single()
  return { title: data?.titre || "Sujet" }
}

export default async function FilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <FilClient filId={id} />
}
