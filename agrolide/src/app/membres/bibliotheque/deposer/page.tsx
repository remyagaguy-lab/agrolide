'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

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

  // Vérification de l'autorisation au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/connexion')
        return
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('categorie')
        .eq('id', session.user.id)
        .single()
        
      if (profile?.categorie === 'junior') {
        setIsAuthorized(false)
      } else {
        setIsAuthorized(true)
      }
    }
    checkAuth()
  }, [router])

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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      // 1. Demander URL d'upload
      const urlRes = await fetch(`${API_URL}/api/bibliotheque/upload-url?filename=${encodeURIComponent(file.name)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!urlRes.ok) throw new Error('Erreur lors de la génération de l\'URL d\'upload')
      const { url, key, useDirect } = await urlRes.json()

      // 2. Upload vers R2
      if (useDirect) {
        // Fallback custom upload route in worker
        const uploadRes = await fetch(`${API_URL}${url}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
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

      // 3. Créer le document en base (via Worker pour déclencher email et set statut)
      const docRes = await fetch(`${API_URL}/api/bibliotheque`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
    )
  }

  if (isAuthorized === false) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès restreint</h1>
        <p className="text-gray-600 mb-6">
          Le dépôt de documents est réservé aux membres Professionnels, Partenaires et Séniors.
          Votre abonnement Junior ne vous permet pas de publier dans la bibliothèque.
        </p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">
          Retour
        </button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Document déposé avec succès !</h1>
        <p className="text-gray-600 mb-6">
          Votre document a été soumis et est en attente de validation par notre équipe technique.
          Vous serez redirigé vers la bibliothèque...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Déposer un document</h1>
        <p className="text-gray-600">Partagez vos connaissances avec la communauté Agrolide.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Fichier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fichier PDF (Max 50 Mo) *</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                 onClick={() => document.getElementById('file-upload')?.click()}>
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <span className="relative rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                    <span>Téléverser un fichier</span>
                    <input id="file-upload" type="file" accept="application/pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </span>
                </div>
                <p className="text-xs text-gray-500">PDF jusqu'à 50MB</p>
              </div>
            </div>
            {file && (
              <div className="mt-2 text-sm text-green-700 flex items-center gap-2 bg-green-50 p-2 rounded">
                <FileText className="w-4 h-4" /> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input type="text" {...register('titre')} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
              {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auteur(s) *</label>
              <input type="text" {...register('auteur')} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
              {errors.auteur && <p className="text-red-500 text-xs mt-1">{errors.auteur.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de document *</label>
              <select {...register('type')} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white">
                <option value="">Sélectionner</option>
                <option value="Thèse">Thèse</option>
                <option value="Mémoire">Mémoire</option>
                <option value="Fiche technique">Fiche technique</option>
                <option value="Guide">Guide</option>
                <option value="Article">Article</option>
                <option value="Rapport">Rapport</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thématique *</label>
              <select {...register('thematique')} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white">
                <option value="">Sélectionner</option>
                <option value="Agroécologie">Agroécologie</option>
                <option value="Élevage">Élevage</option>
                <option value="Maraîchage">Maraîchage</option>
                <option value="Gestion de projet">Gestion de projet</option>
              </select>
              {errors.thematique && <p className="text-red-500 text-xs mt-1">{errors.thematique.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Résumé (max 500 car.) *</label>
            <textarea {...register('resume')} rows={4} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"></textarea>
            {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Langue *</label>
              <select {...register('langue')} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white">
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
              <input type="text" {...register('pays')} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="ex: Togo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
              <input type="number" {...register('annee')} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="ex: 2023" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
            <input type="text" {...register('filiere')} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="ex: Maraîchage" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? 'Dépôt en cours...' : 'Soumettre le document'}
          </button>
        </div>
      </form>
    </div>
  )
}
