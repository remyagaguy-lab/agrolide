'use client'

import React, { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface InscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  event: any | null
}

export default function InscriptionModal({ isOpen, onClose, event }: InscriptionModalProps) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Pour les visiteurs
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }
    
    if (isOpen) {
      fetchSession()
      setSuccess(false)
      setError('')
      setPrenom('')
      setNom('')
      setEmail('')
    }
  }, [isOpen])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!event) return
    
    setSubmitting(true)
    setError('')
    
    try {
      const response = await fetch(`/api/evenements/inscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          evenement_id: event.id,
          // Si non connecté on envoie les champs
          ...(!session ? { prenom, nom, email_externe: email } : {})
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'inscription.")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!event) return null

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl">
          
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500">
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </Dialog.Close>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : success ? (
            <div className="py-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-2">
                Inscription confirmée !
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-6">
                Vous êtes bien inscrit(e) à l'événement <strong>{event.titre}</strong>. Un email de confirmation a été envoyé.
              </Dialog.Description>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  Inscription à l'événement
                </Dialog.Title>
                <Dialog.Description className="text-gray-500 mt-2">
                  {event.titre}
                </Dialog.Description>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              {session ? (
                <div className="py-4">
                  <p className="text-gray-700 mb-6">
                    Vous êtes connecté(e) en tant que <strong>{session.user.email}</strong>. 
                    Vous pouvez confirmer votre inscription en un clic !
                  </p>
                  
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={submitting}
                      className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleSubmit()}
                      disabled={submitting}
                      className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Confirmer l'inscription
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Prénom <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        value={prenom}
                        onChange={e => setPrenom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                        placeholder="John" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nom <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        value={nom}
                        onChange={e => setNom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                        placeholder="Doe" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Adresse e-mail <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                      placeholder="john.doe@exemple.com" 
                    />
                  </div>
                  
                  <div className="pt-4 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={submitting}
                      className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      S'inscrire
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
