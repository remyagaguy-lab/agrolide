'use client'

import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, CheckCircle, Loader2, Upload } from 'lucide-react'

interface SubmitDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function SubmitDocumentModal({ isOpen, onClose, onSuccess }: SubmitDocumentModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    titre: '',
    auteur: '',
    type: 'guide_pratique',
    thematique: 'agrobusiness',
    resume: '',
    pays: '',
    filiere: '',
    langue: 'fr',
    annee: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Veuillez sélectionner un fichier PDF.')
      return
    }

    if (file.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont acceptés.')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 50 Mo.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Demander URL d'upload
      const urlRes = await fetch(`/api/bibliotheque/upload-url?filename=${encodeURIComponent(file.name)}`)
      
      if (!urlRes.ok) throw new Error("Erreur lors de la demande d'upload")
      const { uploadUrl, key, url, useDirect } = await urlRes.json()

      const targetUrl = uploadUrl || url // Handle differences if any

      // 2. Upload vers R2
      const uploadRes = await fetch(targetUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': 'application/pdf' }
      })
      
      if (!uploadRes.ok) throw new Error("Erreur lors du transfert du fichier")

      // 3. Insert via API
      const payload = {
        ...formData,
        annee: formData.annee ? parseInt(formData.annee, 10) : null,
        fichier_r2_key: key,
        taille: file.size,
        format: 'pdf',
        acces: 'public', // Par défaut public
        statut: 'publie' // Directement publié pour l'admin
      }

      const docRes = await fetch(`/api/bibliotheque`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!docRes.ok) throw new Error("Erreur lors de l'enregistrement en base de données")

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
        setSuccess(false)
        setFile(null)
        setFormData({ titre: '', auteur: '', type: 'guide_pratique', thematique: 'agrobusiness', resume: '', pays: '', filiere: '', langue: 'fr', annee: '' })
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-surface-container-lowest p-6 shadow-lg duration-200 sm:rounded-2xl max-h-[90vh] overflow-y-auto">
          
          <Dialog.Close aria-label="Fermer" className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
          </Dialog.Close>

          {success ? (
            <div className="py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-success-container text-success rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <Dialog.Title className="text-xl font-bold text-on-surface mb-2">
                Document publié !
              </Dialog.Title>
              <Dialog.Description className="text-on-surface-variant">
                Le document a été mis en ligne et est accessible à tous.
              </Dialog.Description>
            </div>
          ) : (
            <>
              <div className="mb-2">
                <Dialog.Title className="text-xl font-bold text-on-surface">
                  Publier un Document
                </Dialog.Title>
                <Dialog.Description className="text-on-surface-muted mt-1 text-sm">
                  Ajoutez un nouveau PDF à la bibliothèque.
                </Dialog.Description>
              </div>

              {error && (
                <div className="p-3 bg-error-container text-error border border-error/30 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-on-surface-variant">Titre *</label>
                  <input required name="titre" value={formData.titre} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-on-surface-variant">Auteur(s) *</label>
                    <input required name="auteur" value={formData.auteur} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-on-surface-variant">Type *</label>
                    <select required name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary">
                      <option value="guide_pratique">Guide Pratique</option>
                      <option value="rapport">Rapport</option>
                      <option value="article">Article</option>
                      <option value="livre">Livre</option>
                      <option value="fiche_technique">Fiche Technique</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-on-surface-variant">Thématique *</label>
                  <select required name="thematique" value={formData.thematique} onChange={handleChange} className="w-full px-3 py-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary">
                    <option value="agrobusiness">Agrobusiness</option>
                    <option value="innovation">Innovation</option>
                    <option value="changement_climatique">Changement climatique</option>
                    <option value="economie">Économie</option>
                    <option value="politique">Politique</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-on-surface-variant">Résumé *</label>
                  <textarea required name="resume" value={formData.resume} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary resize-y" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant">Fichier PDF *</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-outline border-dashed rounded-xl cursor-pointer bg-surface-container-low hover:bg-surface-container transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-on-surface-muted mb-2" />
                      <p className="text-sm text-on-surface-muted font-medium">
                        {file ? file.name : "Cliquez pour sélectionner un PDF"}
                      </p>
                      {file && <p className="text-xs text-primary mt-1">{(file.size / (1024*1024)).toFixed(2)} Mo</p>}
                    </div>
                    <input type="file" className="hidden" accept=".pdf,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publier le document"}
                </button>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
