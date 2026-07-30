import React from 'react'
import CategorieClient from '@/components/modules/forum/CategorieClient'
import { Metadata } from 'next'

import { db } from '@/db'
import { forum_categories } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  const data = await db.query.forum_categories.findFirst({
    columns: { nom: true },
    where: eq(forum_categories.id, id)
  })
  
  return { title: data?.nom || "Catégorie" }
}

export default async function CategoriePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CategorieClient categorieId={id} />
}
