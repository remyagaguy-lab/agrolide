'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth/client'

const formSchema = z.object({
  titre: z.string().min(3, 'Le titre est requis'),
  auteur: z.string().min(2, "L'auteur est requis"),
  type: z.string().min(1, 'Le type est requis'),
  resume: z.string().min(10, 'Le résumé est requis').max(500, 'Le résumé ne doit pas dépasser 500 caractères'),
  thematique: z.string().min(1, 'La thématique est requise'),
  pays: z.string().optional(),
  filiere: z.string().optional(),
  langue: z.string().min(2, 'La langue est requise'),
  annee: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function DeposerDocumentPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      langue: 'fr',
    }
  })

  const { userId, isLoaded } = useAuth()

  // Vérification de l'autorisation au chargement
  useEffect(() => {
    if (!isLoaded) return

    if (!userId) {
      router.push('/login')
      return
    }

    const checkAuthorization = async () => {
      try {
        const { getCurrentUserCategory } = await import('@/app/actions/profil')
        const userCategory = await getCurrentUserCategory()
        
        if (userCategory === 'junior') {
          setIsAuthorized(false)
        } else {
          setIsAuthorized(true)
        }
      } catch (err) {
        console.error(err)
        setIsAuthorized(false)
      }
    }

    checkAuthorization()
  }, [isLoaded, userId, router])

  const onSubmit = async (data: FormData) => {
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
    setError(null)
    
    try {
      // 1. Demander URL d'upload
      const urlRes = await fetch(`/api/bibliotheque/upload-url?filename=${encodeURIComponent(file.name)}`)
      
      if (!urlRes.ok) throw new Error('Erreur lors de la génération de l\'URL d\'upload')
      const { url, key, useDirect } = await urlRes.json()

      // 2. Upload vers R2
      if (useDirect) {
        // Fallback custom upload route
        const uploadRes = await fetch(`${url}`, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type
          },
          body: file
        })
        if (!uploadRes.ok) throw new Error('Erreur lors de l\'upload du fichier (direct)')
      } else {
        // S3 Presigned URL upload
        const uploadRes = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type
          },
          body: file
        })
        if (!uploadRes.ok) throw new Error('Erreur lors de l\'upload du fichier vers R2')
      }

      // 3. Créer le document en base
      const docRes = await fetch(`/api/bibliotheque`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          annee: data.annee ? parseInt(data.annee, 10) : null,
          fichier_r2_key: key,
          taille: file.size,
          format: 'pdf',
          acces: 'public' // Par défaut public ou laisser l'admin choisir
        })
      })
      
      if (!docRes.ok) throw new Error('Erreur lors de l\'enregistrement du document')

      // 4. Lancer la validation par l'Agent IA (de façon asynchrone pour ne pas bloquer l'UI)
      fetch(`/api/documents/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          r2Key: key,
          titre: data.titre,
          resume: data.resume
        })
      }).catch(e => console.error("Validation IA échouée en arrière-plan", e))

      setSuccess(true)
      
      // Redirect after 3s
      setTimeout(() => {
        router.push('/membres/bibliotheque')
      }, 3000)
      
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Une erreur est survenue lors du dépôt')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-success" />
      </div>
    )
  }

  if (isAuthorized === false) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-error" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Accès restreint</h1>
        <p className="text-on-surface-variant mb-6">
          Le dépôt de documents est réservé aux membres Professionnels, Partenaires et Séniors.
          Votre abonnement Junior ne vous permet pas de publier dans la bibliothèque.
        </p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-inverse-surface text-inverse-on-surface rounded-lg font-medium hover:bg-inverse-surface">
          Retour
        </button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-success-container rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Document déposé avec succès !</h1>
        <p className="text-on-surface-variant mb-6">
          Votre document a été soumis et est en attente de validation par notre équipe technique.
          Vous serez redirigé vers la bibliothèque...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Déposer un document</h1>
        <p className="text-on-surface-variant">Partagez vos connaissances avec la communauté Agrolide.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-sm">
        {error && (
          <div className="p-4 bg-error-container text-error rounded-lg flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Fichier */}
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">Fichier PDF (Max 50 Mo) *</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-outline border-dashed rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
                 onClick={() => document.getElementById('file-upload')?.click()}>
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-12 w-12 text-on-surface-muted" />
                <div className="flex text-sm text-on-surface-variant justify-center">
                  <span className="relative rounded-md font-medium text-success hover:text-success focus-within:outline-none">
                    <span>Téléverser un fichier</span>
                    <input id="file-upload" type="file" accept="application/pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </span>
                </div>
                <p className="text-xs text-on-surface-muted">PDF jusqu'à 50MB</p>
              </div>
            </div>
            {file && (
              <div className="mt-2 text-sm text-success flex items-center gap-2 bg-success-container p-2 rounded">
                <FileText className="w-4 h-4" /> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Titre *</label>
              <input type="text" {...register('titre')} className="w-full p-2.5 border border-outline rounded-lg focus:ring-success focus:border-success" />
              {errors.titre && <p className="text-error text-xs mt-1">{errors.titre.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Auteur(s) *</label>
              <input type="text" {...register('auteur')} className="w-full p-2.5 border border-outline rounded-lg focus:ring-success focus:border-success" />
              {errors.auteur && <p className="text-error text-xs mt-1">{errors.auteur.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Type de document *</label>
              <select {...register('type')} className="w-full p-2.5 border border-outline rounded-lg focus:ring-success focus:border-success bg-surface-container-lowest">
                <option value="">Sélectionner</option>
                <option value="Thèse">Thèse</option>
                <option value="Mémoire">Mémoire</option>
                <option value="Fiche technique">Fiche technique</option>
                <option value="Guide">Guide</option>
                <option value="Article">Article</option>
                <option value="Rapport">Rapport</option>
              </select>
              {errors.type && <p className="text-error text-xs mt-1">{errors.type.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Thématique *</label>
              <select {...register('thematique')} className="w-full p-2.5 border border-outline rounded-lg focus:ring-success focus:border-success bg-surface-container-lowest">
                <option value="">Sélectionner</option>
                <option value="Agroécologie">Agroécologie</option>
                <option value="Élevage">Élevage</option>
                <option value="Maraîchage">Maraîchage</option>
                <option value="Gestion de projet">Gestion de projet</option>
              </select>
              {errors.thematique && <p className="text-error text-xs mt-1">{errors.thematique.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Résumé (max 500 car.) *</label>
            <textarea {...register('resume')} rows={4} className="w-full p-2.5 border border-outline rounded-lg focus:ring-success focus:border-success"></textarea>
            {errors.resume && <p className="text-error text-xs mt-1">{errors.resume.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Langue *</label>
              <select {...register('langue')} className="w-full p-2.5 border border-outline rounded-lg focus:ring-success focus:border-success bg-surface-container-lowest">
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Pays</label>
              <input type="text" {...register('pays')} className="w-full p-2.5 border border-outline rounded-lg focus:ring-success focus:border-success" placeholder="ex: Togo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Année</label>
              <input type="number" {...register('annee')} className="w-full p-2.5 border border-outline rounded-lg focus:ring-success focus:border-success" placeholder="ex: 2023" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Filière</label>
            <input type="text" {...register('filiere')} className="w-full p-2.5 border border-outline rounded-lg focus:ring-success focus:border-success" placeholder="ex: Maraîchage" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-success text-on-primary rounded-lg font-medium hover:bg-primary/90 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? 'Dépôt en cours...' : 'Soumettre le document'}
          </button>
        </div>
      </form>
    </div>
  )
}
