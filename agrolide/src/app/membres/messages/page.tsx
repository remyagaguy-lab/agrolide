import React from 'react'
import MessagesClient from '@/components/modules/messages/MessagesClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Messagerie | Agrolide',
  description: 'Vos conversations privées avec les membres du réseau.',
}

export default function MessagesPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8">
      <MessagesClient />
    </div>
  )
}
