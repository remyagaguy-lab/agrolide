'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Lock, BookOpen } from 'lucide-react'

export function QuotaTracker({ documentId, isLoggedIn }: { documentId: string, isLoggedIn?: boolean }) {
  const [quotaReached, setQuotaReached] = useState(false)
  const [viewedCount, setViewedCount] = useState(0)

  useEffect(() => {
    if (isLoggedIn) return; // Ne pas traquer les membres connectés

    try {
      const stored = localStorage.getItem('agrolide_docs_quota')
      let viewedDocs = stored ? JSON.parse(stored) : []

      if (!Array.isArray(viewedDocs)) {
        viewedDocs = []
      }

      if (!viewedDocs.includes(documentId)) {
        if (viewedDocs.length >= 5) {
          setQuotaReached(true)
        } else {
          viewedDocs.push(documentId)
          localStorage.setItem('agrolide_docs_quota', JSON.stringify(viewedDocs))
        }
      }
      
      setViewedCount(viewedDocs.length)
    } catch (e) {
      console.error('Error tracking quota', e)
    }
  }, [documentId])

  if (quotaReached) {
    return (
      <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Limite de consultation atteinte</h2>
          <p className="text-gray-600">
            Vous avez atteint votre quota de 5 documents gratuits. Pour continuer à explorer notre bibliothèque et télécharger des documents, veuillez créer un compte gratuit.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/inscription" 
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
            >
              Créer un compte
            </Link>
            <Link 
              href="/auth/login" 
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Floating counter indicator
  if (viewedCount > 0) {
    return (
      <div className="fixed bottom-6 right-6 z-40 bg-white shadow-lg border border-gray-200 p-4 rounded-xl max-w-[250px] animate-fade-in-up">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {viewedCount} / 5 documents
            </p>
            <p className="text-xs text-gray-500 mt-1">
              consultés gratuitement. <Link href="/auth/inscription" className="text-primary-600 hover:underline">Inscrivez-vous</Link> pour un accès illimité.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
