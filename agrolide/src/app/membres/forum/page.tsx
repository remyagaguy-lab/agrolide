import React from 'react'
import ForumClient from '@/components/modules/forum/ForumClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forum | Agrolide',
  description: 'Forum communautaire Agrolide.',
}

export default function ForumPage() {
  return <ForumClient />
}
