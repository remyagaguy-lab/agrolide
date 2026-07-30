import React from 'react'
import FilClient from '@/components/modules/forum/FilClient'
import { Metadata } from 'next'

import { db } from '@/db'
import { forum_fils } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  const data = await db.query.forum_fils.findFirst({
    columns: { titre: true },
    where: eq(forum_fils.id, id)
  })
  
  return { title: data?.titre || "Sujet" }
}

export default async function FilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <FilClient filId={id} />
}
