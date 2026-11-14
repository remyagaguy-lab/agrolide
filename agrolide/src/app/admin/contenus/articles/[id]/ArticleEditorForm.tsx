"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { revalidateEverything } from "@/app/actions/revalidate"
import { useAuth } from "@/lib/auth/client"

import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Heading2, Heading3, Loader2, Save, Send } from "@/components/ui/icons"
export function ArticleEditorForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const { getToken } = useAuth()
  const isNew = !initialData
  
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState(initialData?.image_une_url || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      titre: initialData?.titre || "",
      slug: initialData?.slug || "",
      category: initialData?.categorie || "Agronomie",
      excerpt: initialData?.extrait || "",
      status: initialData?.statut || "brouillon",
      access: initialData?.acces || "public",
      tags: initialData?.tags?.join(", ") || "",
    }
  })

  const titreValue = watch("titre")
  const excerptValue = watch("excerpt")

  // Auto-génération du slug
  useEffect(() => {
    if (isNew && titreValue) {
      const generatedSlug = titreValue
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Supprimer accents
        .replace(/[^a-z0-9]+/g, "-") // Remplacer espaces par tirets
        .replace(/(^-|-$)+/g, "") // Enlever tirets au début/fin
      setValue("slug", generatedSlug)
    }
  }, [titreValue, isNew, setValue])

  // Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
    ],
    content: initialData?.contenu_json || "<p>Commencez à écrire votre article ici...</p>",
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    
    // Simuler l'upload ou utiliser un vrai endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ""
    
    try {
      const token = await getToken()
      const response = await fetch(`${apiUrl}/api/blog/media`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      })
      
      const data = await response.json()
      if (data.url) {
        setImageUrl(data.url)
      } else {
        throw new Error(data.error || "Erreur upload")
      }
    } catch (err: any) {
      console.error(err)
      alert("Erreur lors de l'upload de l'image. " + err.message)
    }
  }

  const addEditorImage = () => {
    const url = window.prompt("URL de l'image :")
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const onSubmit = async (data: any) => {
    setIsSaving(true)
    setError(null)
    
    const payload: any = {
      titre: data.titre,
      slug: data.slug,
      categorie: data.category,
      extrait: data.excerpt,
      statut: data.status,
      acces: data.access,
      contenu_json: editor?.getHTML(),
      image_une_url: imageUrl,
      tags: data.tags ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []
    }

    try {
      if (payload.statut === "publie" && !initialData?.published_at) {
        payload.published_at = new Date().toISOString()
      }

      let resError;
      if (isNew) {
        const res = await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (!res.ok) resError = new Error(data.error || "Erreur lors de la création")
      } else {
        const res = await fetch(`/api/admin/articles/${initialData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (!res.ok) resError = new Error(data.error || "Erreur lors de la modification")
      }

      if (resError) throw resError

      await revalidateEverything()
      router.push("/admin/contenus/articles")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setIsSaving(false)
    }
  }

  if (!editor) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {error && (
        <div className="p-4 bg-error-container text-error rounded-lg text-sm border border-error/30">
          {error}
        </div>
      )}

      {/* Titre & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Titre de l'article *</label>
          <Input {...register("titre", { required: "Le titre est requis" })} placeholder="Ex: Les défis de l'agriculture..." />
          {errors.titre && <p className="text-error text-xs mt-1">{String(errors.titre.message)}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Slug (URL)</label>
          <Input {...register("slug")} className="bg-surface-container-low" />
        </div>
      </div>

      {/* Métadonnées & Catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Catégorie</label>
          <select 
            {...register("category")}
            className="w-full rounded-md border border-outline px-3 py-2 text-sm focus:border-success focus:outline-none focus:ring-1 focus:ring-success"
          >
            <option value="Agrobusiness">Agrobusiness</option>
            <option value="Agroeconomie">Agroeconomie</option>
            <option value="Agroalimentaire">Agroalimentaire</option>
            <option value="Agroinnovation">Agroinnovation</option>
            <option value="Production Végétal">Production Végétal</option>
            <option value="Production Animal">Production Animal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Accès</label>
          <select 
            {...register("access")}
            className="w-full rounded-md border border-outline px-3 py-2 text-sm focus:border-success focus:outline-none focus:ring-1 focus:ring-success"
          >
            <option value="public">Public</option>
            <option value="membres">Membres uniquement</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Statut de publication</label>
          <select 
            {...register("status")}
            className="w-full rounded-md border border-outline px-3 py-2 text-sm focus:border-success focus:outline-none focus:ring-1 focus:ring-success"
          >
            <option value="brouillon">Brouillon</option>
            <option value="publie">Publié</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-on-surface-variant mb-1">Mots-clés (tags séparés par des virgules)</label>
        <Input {...register("tags")} placeholder="Ex: afrique, climat, rendement" />
      </div>

      {/* Extrait & SEO */}
      <div>
        <label className="block text-sm font-medium text-on-surface-variant mb-1">
          Extrait / Meta Description (Max 160 caractères)
        </label>
        <Textarea 
          {...register("excerpt")} 
          maxLength={160}
          className="h-24"
        />
        <div className="text-right text-xs text-on-surface-muted mt-1">
          {excerptValue?.length || 0} / 160
        </div>
      </div>

      {/* Image à la Une */}
      <div>
        <label className="block text-sm font-medium text-on-surface-variant mb-2">Image à la Une</label>
        <div className="flex items-center gap-4">
          <div className="w-48 h-32 bg-surface-container border-2 border-dashed border-outline rounded-lg flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt="Image à la une" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="text-on-surface-muted" size={24} />
            )}
          </div>
          <div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              Uploader une image
            </Button>
            <p className="text-xs text-on-surface-muted mt-2">Format 16:9 recommandé (1200x630px pour le SEO OpenGraph)</p>
          </div>
        </div>
      </div>

      {/* Tiptap Editor */}
      <div>
        <label className="block text-sm font-medium text-on-surface-variant mb-2">Contenu de l'article</label>
        <div className="border border-outline rounded-lg overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="bg-surface-container-low border-b border-outline p-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-surface-container-high ${editor.isActive('bold') ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant'}`}
            ><Bold size={16} /></button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-surface-container-high ${editor.isActive('italic') ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant'}`}
            ><Italic size={16} /></button>
            <div className="w-px h-6 bg-outline-variant mx-1 my-auto"></div>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-surface-container-high ${editor.isActive('heading', { level: 2 }) ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant'}`}
            ><Heading2 size={16} /></button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded hover:bg-surface-container-high ${editor.isActive('heading', { level: 3 }) ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant'}`}
            ><Heading3 size={16} /></button>
            <div className="w-px h-6 bg-outline-variant mx-1 my-auto"></div>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-surface-container-high ${editor.isActive('bulletList') ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant'}`}
            ><List size={16} /></button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-surface-container-high ${editor.isActive('orderedList') ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant'}`}
            ><ListOrdered size={16} /></button>
            <div className="w-px h-6 bg-outline-variant mx-1 my-auto"></div>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt("URL du lien :")
                if (url) editor.chain().focus().setLink({ href: url }).run()
              }}
              className={`p-2 rounded hover:bg-surface-container-high ${editor.isActive('link') ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant'}`}
            ><LinkIcon size={16} /></button>
            <button
              type="button"
              onClick={addEditorImage}
              className="p-2 rounded hover:bg-surface-container-high text-on-surface-variant"
            ><ImageIcon size={16} /></button>
          </div>
          
          {/* Editeur */}
          <div className="bg-surface-container-lowest max-h-[600px] overflow-y-auto">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => router.push("/admin/contenus/articles")}
          disabled={isSaving}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : (isNew ? <Send size={16} /> : <Save size={16} />)}
          {isSaving ? "Enregistrement..." : (isNew ? "Créer l'article" : "Enregistrer les modifications")}
        </Button>
      </div>

    </form>
  )
}
