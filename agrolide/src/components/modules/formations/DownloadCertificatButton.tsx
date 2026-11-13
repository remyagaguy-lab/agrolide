'use client'

import { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CertificatPDF } from './CertificatPDF'
import { Download, Loader2 } from "@/components/ui/icons"
interface Props {
  nom: string
  prenom: string
  formationTitre: string
  dateDebut: string
  inscriptionId: string
}

export function DownloadCertificatButton({ nom, prenom, formationTitre, dateDebut, inscriptionId }: Props) {
  const [isClient, setIsClient] = useState(false)

  // @react-pdf/renderer ne marche qu'entièrement côté client, il faut attendre le montage
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <button disabled className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface-muted rounded-lg text-sm font-medium">
        <Loader2 className="size-4 animate-spin" /> Chargement...
      </button>
    )
  }

  return (
    <PDFDownloadLink
      document={<CertificatPDF nom={nom} prenom={prenom} formationTitre={formationTitre} dateDebut={dateDebut} inscriptionId={inscriptionId} />}
      fileName={`certificat-${formationTitre.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`}
    >
      {({ blob, url, loading, error }) => (
        <button
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-success text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          {loading ? 'Génération...' : 'Télécharger le certificat'}
        </button>
      )}
    </PDFDownloadLink>
  )
}
