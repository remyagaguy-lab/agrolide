'use client'

import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface SubmitOpportunityModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function SubmitOpportunityModal({ isOpen, onClose, onSuccess }: SubmitOpportunityModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_opp: 'emploi',
    lieu: '',
    date_limite: '',
    montant: '',
    lien_externe: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("Vous devez être connecté pour soumettre une opportunité.")
      setLoading(false)
      return
    }

    const payload = {
      ...formData,
      publie_par: user.id,
      statut: 'en_attente',
      date_limite: formData.date_limite ? new Date(formData.date_limite).toISOString() : null
    }

    const { error: insertErr } = await supabase
      .from('opportunites')
      .insert(payload)

    if (insertErr) {
      setError(insertErr.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
        setSuccess(false)
        setFormData({ titre: '', description: '', type_opp: 'emploi', lieu: '', date_limite: '', montant: '', lien_externe: '' })
      }, 3000)
    }
    setLoading(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl max-h-[90vh] overflow-y-auto">
          
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
            <X className="h-4 w-4" />
          </Dialog.Close>

          {success ? (
            <div className="py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-2">
                Opportunité soumise !
              </Dialog.Title>
              <Dialog.Description className="text-gray-600">
                Merci pour votre partage. Votre opportunité sera examinée par nos administrateurs avant d'être publiée sur la plateforme.
              </Dialog.Description>
            </div>
          ) : (
            <>
              <div className="mb-2">
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  Partager une opportunité
                </Dialog.Title>
                <Dialog.Description className="text-gray-500 mt-1 text-sm">
                  Proposez un emploi, un financement ou un partenariat à la communauté.
                </Dialog.Description>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Titre *</label>
                  <input required name="titre" value={formData.titre} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Type *</label>
                    <select required name="type_opp" value={formData.type_opp} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                      <option value="emploi">Emploi / Stage</option>
                      <option value="financement">Financement</option>
                      <option value="partenariat">Partenariat</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Date limite</label>
                    <input name="date_limite" value={formData.date_limite} onChange={handleChange} type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Description *</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-y" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Lieu</label>
                    <input name="lieu" value={formData.lieu} onChange={handleChange} type="text" placeholder="Ville, Pays ou 'En ligne'" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Montant / Salaire</label>
                    <input name="montant" value={formData.montant} onChange={handleChange} type="text" placeholder="ex: 50 000 FCFA" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Lien externe (Optionnel)</label>
                  <input name="lien_externe" value={formData.lien_externe} onChange={handleChange} type="url" placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>

                <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
                  <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                    Annuler
                  </button>
                  <button type="submit" disabled={loading || !formData.titre} className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Soumettre
                  </button>
                </div>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
