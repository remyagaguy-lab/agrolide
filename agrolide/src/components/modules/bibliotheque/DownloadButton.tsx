'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Loader2 } from 'lucide-react'

export function DownloadButton({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleDownload = () => {
    // Redirige vers le lecteur sécurisé interne
    router.push(`/membres/bibliotheque/${documentId}/lire`)
  }

  return (
    <div>
      <button 
        onClick={handleDownload}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-70"
      >
        <Eye className="w-5 h-5" />
        Lire le document de façon sécurisée
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium text-center">{error}</p>
      )}
    </div>
  )
}
