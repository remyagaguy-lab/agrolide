import React from 'react'
import ForumClient from '@/components/modules/forum/ForumClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Forum",
  description: 'Forum communautaire agrolide.',
}

export default function ForumPage() {
  return <ForumClient />
}
