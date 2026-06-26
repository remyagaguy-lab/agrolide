'use client'

import { useState } from 'react'
import { Eye, Loader2 } from 'lucide-react'

export function DownloadButton({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setLoading(true)
    setError(null)
    try {
      // In a real app, we need the auth token
      // For this demo, assuming the user is authenticated via some context or we fetch it
      // Utilisation de la route API Next.js interne
      const API_URL = '';
      
      // We would normally get the token from supabase auth session
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data: { session } } = await supabase.auth.getSession()
      
      const res = await fetch(`${API_URL}/api/bibliotheque/download/${documentId}`, {
        headers: {
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        }
      })
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Erreur lors du téléchargement')
      }
      
      const data = await res.json()
      
      if (data.url) {
        // Rediriger vers l'URL signée R2, en cachant la barre d'outils du lecteur PDF (qui contient le bouton télécharger)
        window.open(data.url + '#toolbar=0', '_blank')
      } else {
        throw new Error('URL du document introuvable')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button 
        onClick={handleDownload}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-70"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
        {loading ? 'Préparation...' : 'Lire le document'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium text-center">{error}</p>
      )}
    </div>
  )
}
