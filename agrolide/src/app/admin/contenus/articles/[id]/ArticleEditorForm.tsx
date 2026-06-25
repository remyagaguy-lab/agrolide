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
import { 
  Bold, Italic, List, ListOrdered, Link as LinkIcon, 
  Image as ImageIcon, Heading2, Heading3, Loader2, Save, Send 
} from "lucide-react"

export function ArticleEditorForm({ initialData, sessionToken }: { initialData?: any, sessionToken: string }) {
  const router = useRouter()
  const isNew = !initialData
  
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState(initialData?.image_une_url || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      titre: initialData?.title || initialData?.titre || "",
      slug: initialData?.slug || "",
      category: initialData?.category || "agronomie",
      excerpt: initialData?.excerpt || initialData?.extrait || "",
      status: initialData?.status || "draft",
      access: initialData?.access || "public",
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
    content: initialData?.content || "<p>Commencez à écrire votre article ici...</p>",
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"
    
    try {
      const response = await fetch(`${apiUrl}/api/blog/media`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${sessionToken}` },
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
    
    const payload = {
      ...data,
      content: editor?.getHTML(),
      image_une_url: imageUrl,
      tags: data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"
      const url = isNew ? `${apiUrl}/api/blog/articles` : `${apiUrl}/api/blog/articles/${initialData.id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "Erreur lors de l'enregistrement")
      }

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
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Titre & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'article *</label>
          <Input {...register("titre", { required: "Le titre est requis" })} placeholder="Ex: Les défis de l'agriculture..." />
          {errors.titre && <p className="text-red-500 text-xs mt-1">{String(errors.titre.message)}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
          <Input {...register("slug")} className="bg-gray-50" />
        </div>
      </div>

      {/* Métadonnées & Catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select 
            {...register("category")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="agronomie">Agronomie</option>
            <option value="innovation">Innovation</option>
            <option value="politique">Politique</option>
            <option value="marche">Marché</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Accès</label>
          <select 
            {...register("access")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="public">Public</option>
            <option value="membres">Membres uniquement</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut de publication</label>
          <select 
            {...register("status")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mots-clés (tags séparés par des virgules)</label>
        <Input {...register("tags")} placeholder="Ex: afrique, climat, rendement" />
      </div>

      {/* Extrait & SEO */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Extrait / Meta Description (Max 160 caractères)
        </label>
        <Textarea 
          {...register("excerpt")} 
          maxLength={160}
          className="h-24"
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {excerptValue?.length || 0} / 160
        </div>
      </div>

      {/* Image à la Une */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image à la Une</label>
        <div className="flex items-center gap-4">
          <div className="w-48 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt="Image à la une" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="text-gray-400" size={32} />
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
            <p className="text-xs text-gray-500 mt-2">Format 16:9 recommandé (1200x630px pour le SEO OpenGraph)</p>
          </div>
        </div>
      </div>

      {/* Tiptap Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contenu de l'article</label>
        <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
            ><Bold size={16} /></button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
            ><Italic size={16} /></button>
            <div className="w-px h-6 bg-gray-300 mx-1 my-auto"></div>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
            ><Heading2 size={16} /></button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
            ><Heading3 size={16} /></button>
            <div className="w-px h-6 bg-gray-300 mx-1 my-auto"></div>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
            ><List size={16} /></button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
            ><ListOrdered size={16} /></button>
            <div className="w-px h-6 bg-gray-300 mx-1 my-auto"></div>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt("URL du lien :")
                if (url) editor.chain().focus().setLink({ href: url }).run()
              }}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'}`}
            ><LinkIcon size={16} /></button>
            <button
              type="button"
              onClick={addEditorImage}
              className="p-2 rounded hover:bg-gray-200 text-gray-600"
            ><ImageIcon size={16} /></button>
          </div>
          
          {/* Editeur */}
          <div className="bg-white max-h-[600px] overflow-y-auto">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
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
