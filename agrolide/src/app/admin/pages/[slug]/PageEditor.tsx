"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, CheckCircle, ArrowLeft } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { revalidateEverything } from "@/app/actions/revalidate"
import { useAuth } from "@/lib/auth/client"

const ArticleEditorForm = dynamic(
  () => import("@/app/admin/contenus/articles/[id]/ArticleEditorForm").then(m => m.ArticleEditorForm),
  { ssr: false, loading: () => <div className="h-64 bg-surface-container-low rounded-xl animate-pulse" /> }
)

interface Props {
  slug: string
  titre: string | null
  contenuJson: any
}

export function PageEditor({ slug, titre, contenuJson }: Props) {
  const router = useRouter()
  const { getToken } = useAuth()
  const [json, setJson] = useState(contenuJson)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      const token = await getToken()
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ contenu_json: json }),
      })
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde")
      setSaved(true)
      await revalidateEverything()
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/pages" className="flex items-center gap-2 text-sm text-on-surface-muted hover:text-on-surface transition-colors">
          <ArrowLeft size={16} /> Retour aux pages
        </Link>
        <div className="flex items-center gap-3">
          {error && <p className="text-sm text-error">{error}</p>}
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-success font-medium">
              <CheckCircle size={16} /> Sauvegardé !
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-on-primary bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Save size={16} />
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-1 min-h-[500px]">
        {/* 
          NOTE: Le PageEditor utilise un éditeur Tiptap simplifié.
          Pour l'instant on affiche le JSON éditable directement,
          en attendant de brancher un éditeur complet.
        */}
        <div className="p-5">
          <p className="text-sm font-medium text-on-surface-variant mb-3">Contenu JSON de la page (éditeur avancé à venir)</p>
          <textarea
            className="w-full h-[450px] font-mono text-xs text-on-surface-variant border border-outline-variant rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-success resize-none"
            value={JSON.stringify(json, null, 2)}
            onChange={e => {
              try {
                setJson(JSON.parse(e.target.value))
              } catch {
                // JSON invalide, on ignore
              }
            }}
          />
          <p className="text-xs text-on-surface-muted mt-2">Format JSON Tiptap. Sauvegardez pour mettre à jour la page.</p>
        </div>
      </div>
    </div>
  )
}
