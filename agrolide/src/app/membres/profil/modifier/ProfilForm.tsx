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
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3 border-b border-[#e8e8e4] pb-1">Photo de profil</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#f0f7f0] border border-[#c3dec4] rounded-xl overflow-hidden flex items-center justify-center relative group">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-[#1b5e38]/50" />
            )}
            
            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="animate-spin text-white" size={16} />
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
              className="bg-white border border-[#e8e8e4] text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:border-[#1b5e38] transition-colors flex items-center gap-1.5"
            >
              <Camera size={14} /> {isUploading ? "Upload..." : "Changer la photo"}
            </button>
            <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-wider">Format JPEG, PNG, WEBP. Max 2MB.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#1a1a1a] border-b border-[#e8e8e4] pb-1">Informations Générales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Prénom *</label>
            <Input {...register("prenom")} className={`w-full p-2 border border-[#e8e8e4] rounded-lg text-xs focus:ring-1 focus:ring-[#1b5e38] focus:border-[#1b5e38] bg-gray-50 outline-none transition-all ${errors.prenom ? "border-red-500" : ""}`} />
            {errors.prenom && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.prenom.message}</p>}
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Nom *</label>
            <Input {...register("nom")} className={`w-full p-2 border border-[#e8e8e4] rounded-lg text-xs focus:ring-1 focus:ring-[#1b5e38] focus:border-[#1b5e38] bg-gray-50 outline-none transition-all ${errors.nom ? "border-red-500" : ""}`} />
            {errors.nom && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.nom.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Téléphone</label>
            <Input {...register("telephone")} className="w-full p-2 border border-[#e8e8e4] rounded-lg text-xs focus:ring-1 focus:ring-[#1b5e38] focus:border-[#1b5e38] bg-gray-50 outline-none transition-all" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Entreprise / Organisation</label>
            <Input {...register("entreprise")} className="w-full p-2 border border-[#e8e8e4] rounded-lg text-xs focus:ring-1 focus:ring-[#1b5e38] focus:border-[#1b5e38] bg-gray-50 outline-none transition-all" />
          </div>
        </div>
        
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Biographie (À propos)</label>
          <Textarea 
            {...register("bio")} 
            placeholder="Parlez-nous un peu de vous et de votre projet..."
            className={`w-full p-2 border border-[#e8e8e4] rounded-lg text-xs focus:ring-1 focus:ring-[#1b5e38] focus:border-[#1b5e38] bg-gray-50 outline-none transition-all min-h-[100px] resize-none ${errors.bio ? "border-red-500" : ""}`}
          />
          <div className="flex justify-between mt-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Présentez-vous aux autres membres du réseau.</p>
            {errors.bio && <p className="text-[10px] text-red-500 font-bold">{errors.bio.message}</p>}
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end gap-3 border-t border-[#e8e8e4]">
        <button 
          type="button" 
          onClick={() => router.push("/membres/profil")} 
          className="bg-white border border-[#e8e8e4] text-gray-600 px-4 py-2 rounded-lg text-xs font-bold hover:border-[#1b5e38] transition-colors mt-4"
          disabled={isSaving}
        >
          Annuler
        </button>
        <button type="submit" className="bg-[#1b5e38] hover:bg-[#144a2c] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm mt-4" disabled={isSaving || isUploading}>
          {isSaving ? (
            <><Loader2 size={14} className="animate-spin" /> Enregistrement...</>
          ) : (
            <><Save size={14} /> Enregistrer les modifications</>
          )}
        </button>
      </div>

    </form>
  )
}
