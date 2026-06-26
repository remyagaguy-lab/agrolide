import React from 'react'
import CategorieClient from '@/components/modules/forum/CategorieClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catégorie | Forum Agrolide',
}

export default async function CategoriePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CategorieClient categorieId={id} />
}
