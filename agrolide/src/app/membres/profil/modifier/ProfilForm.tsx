"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Camera, Save, Loader2, User } from "lucide-react"

const profilSchema = z.object({
  prenom: z.string().min(2, "Le prénom est requis"),
  nom: z.string().min(2, "Le nom est requis"),
  telephone: z.string().optional(),
  entreprise: z.string().optional(),
  bio: z.string().max(500, "Maximum 500 caractères").optional(),
})

type ProfilForm = z.infer<typeof profilSchema>

export function ProfilForm({ initialData, sessionToken }: { initialData: any, sessionToken?: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [avatarUrl, setAvatarUrl] = useState<string>(initialData.avatar_url || "")
  const [isUploading, setIsUploading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ProfilForm>({
    resolver: zodResolver(profilSchema),
    defaultValues: {
      prenom: initialData.prenom || "",
      nom: initialData.nom || "",
      telephone: initialData.telephone || "",
      entreprise: initialData.entreprise || "",
      bio: initialData.bio || "",
    }
  })

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview locale
    const objectUrl = URL.createObjectURL(file)
    setAvatarUrl(objectUrl)
    
    setIsUploading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append("photo", file)

      // Appel au Worker pour l'upload R2
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"
      
      const response = await fetch(`${apiUrl}/api/membres/profil/photo`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${sessionToken}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload de l'image")
      }

      const data = await response.json()
      
      // Update local state with the permanent URL from R2
      if (data.url) {
        setAvatarUrl(data.url)
        // Update avatar URL immediately
        const { updateAvatarUrl } = await import('@/app/actions/profil')
        await updateAvatarUrl(data.url)
      }
      
    } catch (err: any) {
      setError(err.message || "Impossible d'uploader l'image.")
      // Revert to old avatar on error
      setAvatarUrl(initialData.avatar_url || "")
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: ProfilForm) => {
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const { updateProfil } = await import('@/app/actions/profil')
      await updateProfil({
        prenom: data.prenom,
        nom: data.nom,
        telephone: data.telephone,
        entreprise: data.entreprise,
        bio: data.bio
      })
    } catch (updateError: any) {
      setError(updateError.message)
      setIsSaving(false)
      return
    }

    setSuccess(true)
    setIsSaving(false)
    
    // Refresh server state
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-[#d32f2f] text-sm rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
          Votre profil a été mis à jour avec succès.
        </div>
      )}

      {/* Avatar Section */}
      <div>
        <h3 className="dash-title mb-4 border-b border-gray-100/50 pb-2">Photo de profil</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-[#e8f5e9]/50 border border-[#50a853]/20 rounded-full overflow-hidden flex items-center justify-center relative group">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-[#1b5e38]/50" />
            )}
            
            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="animate-spin text-white" size={24} />
              </div>
            )}
          </div>
          
          <div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/jpeg,image/png,image/webp" 
              className="hidden" 
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn-dash-outline flex items-center gap-2"
            >
              <Camera size={16} /> {isUploading ? "Upload..." : "Changer la photo"}
            </button>
            <p className="text-xs text-gray-500 mt-2 font-medium">Format JPEG, PNG ou WEBP. Max 2MB.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="dash-title border-b border-gray-100/50 pb-2">Informations Générales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="dash-label mb-1 block">Prénom *</label>
            <Input {...register("prenom")} className={`w-full p-2.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#50a853]/30 focus:border-[#50a853] bg-gray-50/50 outline-none transition-all ${errors.prenom ? "border-red-500" : ""}`} />
            {errors.prenom && <p className="mt-1 text-xs text-[#d32f2f]">{errors.prenom.message}</p>}
          </div>
          <div>
            <label className="dash-label mb-1 block">Nom *</label>
            <Input {...register("nom")} className={`w-full p-2.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#50a853]/30 focus:border-[#50a853] bg-gray-50/50 outline-none transition-all ${errors.nom ? "border-red-500" : ""}`} />
            {errors.nom && <p className="mt-1 text-xs text-[#d32f2f]">{errors.nom.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="dash-label mb-1 block">Téléphone</label>
            <Input {...register("telephone")} className="w-full p-2.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#50a853]/30 focus:border-[#50a853] bg-gray-50/50 outline-none transition-all" />
          </div>
          <div>
            <label className="dash-label mb-1 block">Entreprise / Organisation</label>
            <Input {...register("entreprise")} className="w-full p-2.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#50a853]/30 focus:border-[#50a853] bg-gray-50/50 outline-none transition-all" />
          </div>
        </div>
        
        <div>
          <label className="dash-label mb-1 block">Biographie (À propos)</label>
          <Textarea 
            {...register("bio")} 
            placeholder="Parlez-nous un peu de vous et de votre projet..."
            className={`w-full p-2.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#50a853]/30 focus:border-[#50a853] bg-gray-50/50 outline-none transition-all min-h-[120px] ${errors.bio ? "border-red-500" : ""}`}
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">Présentez-vous aux autres membres du réseau.</p>
            {errors.bio && <p className="text-xs text-[#d32f2f]">{errors.bio.message}</p>}
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.push("/membres/profil")} 
          className="btn-dash-outline"
          disabled={isSaving}
        >
          Annuler
        </button>
        <button type="submit" className="btn-dash flex items-center gap-2" disabled={isSaving || isUploading}>
          {isSaving ? (
            <><Loader2 size={16} className="animate-spin" /> Enregistrement...</>
          ) : (
            <><Save size={16} /> Enregistrer les modifications</>
          )}
        </button>
      </div>

    </form>
  )
}
