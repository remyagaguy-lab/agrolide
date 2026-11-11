'use client'

import dynamic from 'next/dynamic'

// @react-pdf/renderer pèse ~1 Mo : chargé uniquement dans le navigateur, à l'affichage du bouton.
export const DownloadCertificatButton = dynamic(
  () => import('./DownloadCertificatButton').then(m => m.DownloadCertificatButton),
  { ssr: false, loading: () => <span className="text-xs text-gray-400">Chargement…</span> }
)
