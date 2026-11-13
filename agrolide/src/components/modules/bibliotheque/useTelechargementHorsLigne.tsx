'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { enregistrerHorsLigne, existeHorsLigne, supprimerHorsLigne } from '@/lib/bibliotheque/hors-ligne'

export type EtatTelechargement = 'inconnu' | 'repos' | 'progression' | 'fait' | 'echec'

/**
 * « Télécharger » = enregistrer le document dans l'application pour le relire plus tard, sans connexion.
 * Suit la progression (0 à 100, ou null quand la taille n'est pas connue) et prépare le cache de l'application pour que
 * la liseuse s'ouvre ensuite sans réseau.
 * `fichier` : si le document est déjà chargé (dans la liseuse), on le range sans le retélécharger.
 */
export function useTelechargementHorsLigne({
  documentId,
  titre,
  membreId,
  fichier,
}: {
  documentId: string
  titre?: string
  membreId?: string | null
  fichier?: () => Blob | null
}) {
  const [etat, setEtat] = useState<EtatTelechargement>('inconnu')
  const [progression, setProgression] = useState<number | null>(0)
  const actif = useRef(true)

  useEffect(() => {
    actif.current = true
    existeHorsLigne(documentId, membreId).then((oui) => {
      if (actif.current) setEtat((e) => (e === 'inconnu' ? (oui ? 'fait' : 'repos') : e))
    })
    return () => {
      actif.current = false
    }
  }, [documentId, membreId])

  const telecharger = useCallback(async () => {
    if (!membreId || !titre || etat === 'progression') return
    setEtat('progression')
    setProgression(0)
    try {
      let blob = fichier?.() ?? null
      if (!blob) {
        const res = await fetch(`/api/bibliotheque/download/${documentId}`, { credentials: 'same-origin' })
        if (!res.ok) throw new Error('reseau')
        const total = Number(res.headers.get('Content-Length') || 0)
        const lecteur = res.body?.getReader()
        if (!lecteur) {
          blob = await res.blob()
        } else {
          const morceaux: Uint8Array<ArrayBuffer>[] = []
          let recu = 0
          setProgression(total ? 0 : null)
          for (;;) {
            const { done, value } = await lecteur.read()
            if (done) break
            morceaux.push(value as Uint8Array<ArrayBuffer>)
            recu += value.length
            // 90 % pour l'arrivée du fichier ; le reste pour le rangement chiffré et la préparation hors ligne.
            if (total) setProgression(Math.min(90, Math.round((recu / total) * 90)))
          }
          blob = new Blob(morceaux, { type: 'application/pdf' })
        }
      }
      setProgression(92)
      const ok = await enregistrerHorsLigne({ id: documentId, titre, membreId, fichier: blob })
      if (!ok) throw new Error('stockage')
      setProgression(96)
      // Pages et code nécessaires pour rouvrir la liseuse sans connexion : on les met dans le cache de l'application.
      await Promise.allSettled([
        fetch(`/membres/bibliotheque/${documentId}/lire`, { credentials: 'same-origin' }),
        fetch('/membres/bibliotheque/hors-ligne', { credentials: 'same-origin' }),
        fetch('/pdf.worker.min.js'),
        import('./SecurePDFViewer'),
      ])
      if (!actif.current) return
      setProgression(100)
      setEtat('fait')
    } catch {
      if (actif.current) setEtat('echec')
    }
  }, [documentId, titre, membreId, etat, fichier])

  const retirer = useCallback(async () => {
    await supprimerHorsLigne(documentId)
    if (actif.current) setEtat('repos')
  }, [documentId])

  return { etat, progression, telecharger, retirer }
}

/** Anneau de progression (0 à 100) : un dégradé conique évidé ; sans valeur, il tourne. */
export function AnneauProgression({ valeur, className }: { valeur: number | null; className?: string }) {
  const angle = valeur === null ? 90 : Math.min(100, Math.max(0, valeur)) * 3.6
  const evide = 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))'
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full ${valeur === null ? 'animate-spin' : ''} ${className ?? 'size-6'}`}
      style={{
        background: `conic-gradient(var(--ag-sys-color-primary) ${angle}deg, var(--ag-sys-color-outline-variant) 0)`,
        WebkitMask: evide,
        mask: evide,
      }}
    />
  )
}
