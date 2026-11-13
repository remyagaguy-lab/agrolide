'use client'

import { useEffect } from 'react'

/**
 * Enregistre le service worker (/sw.js) : page de repli hors ligne et lecture hors ligne des documents.
 * Désactivé en développement (un service worker y masquerait les modifications).
 */
export function EnregistrementSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    const enregistrer = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {})
    }
    // Après le chargement : l'enregistrement ne doit jamais ralentir l'affichage de la page.
    if (document.readyState === 'complete') enregistrer()
    else window.addEventListener('load', enregistrer, { once: true })
    return () => window.removeEventListener('load', enregistrer)
  }, [])
  return null
}
