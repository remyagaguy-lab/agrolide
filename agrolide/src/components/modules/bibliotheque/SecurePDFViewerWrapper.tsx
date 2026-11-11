'use client'

import dynamic from 'next/dynamic'
import React from 'react'

export const SecurePDFViewerWrapper = dynamic(
  () => import('./SecurePDFViewer').then(mod => mod.SecurePDFViewer),
  {
    ssr: false,
    loading: () => <div className="text-center p-12 text-on-surface-muted">Chargement de la liseuse sécurisée...</div>
  }
)
