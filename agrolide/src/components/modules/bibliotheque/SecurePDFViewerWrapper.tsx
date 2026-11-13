'use client'

import dynamic from 'next/dynamic'
import React from 'react'
import { precharger } from './pdf-precharge'

const SecurePDFViewer = dynamic(
  () => import('./SecurePDFViewer').then(mod => mod.SecurePDFViewer),
  {
    ssr: false,
    loading: () => <div className="text-center p-12 text-on-surface-muted">Chargement de la liseuse sécurisée...</div>
  }
)

export function SecurePDFViewerWrapper({ documentId, titre }: { documentId: string; titre?: string }) {
  // Le document commence à arriver sans attendre le code de la liseuse (idempotent, côté navigateur seulement ;
  // lancé au rendu pour passer avant l'effet de la liseuse, afin qu'une seule requête soit faite).
  if (typeof window !== 'undefined') precharger(documentId)
  return <SecurePDFViewer documentId={documentId} titre={titre} />
}
