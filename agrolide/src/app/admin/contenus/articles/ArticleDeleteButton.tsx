"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function ArticleDeleteButton({ articleId }: { articleId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.")) {
      return
    }

    setIsDeleting(true)
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      
      const { error } = await supabase.from("articles").delete().eq("id", articleId)
      if (error) throw error

      router.refresh()
    } catch (err: any) {
      alert("Erreur lors de la suppression : " + err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Supprimer"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  )
}
