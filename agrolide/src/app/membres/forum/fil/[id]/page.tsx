import React from 'react'
import FilClient from '@/components/modules/forum/FilClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sujet | Forum Agrolide',
}

export default async function FilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <FilClient filId={id} />
}
