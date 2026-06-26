"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, CheckCircle, ArrowLeft } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"

const ArticleEditorForm = dynamic(
  () => import("@/app/admin/contenus/articles/[id]/ArticleEditorForm").then(m => m.ArticleEditorForm),
  { ssr: false, loading: () => <div className="h-64 bg-gray-50 rounded-xl animate-pulse" /> }
)

interface Props {
  slug: string
  titre: string | null
  contenuJson: any
  sessionToken: string
}

export function PageEditor({ slug, titre, contenuJson, sessionToken }: Props) {
  const router = useRouter()
  const [json, setJson] = useState(contenuJson)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ contenu_json: json }),
      })
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde")
      setSaved(true)
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
        <Link href="/admin/pages" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} /> Retour aux pages
        </Link>
        <div className="flex items-center gap-3">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle size={16} /> Sauvegardé !
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#1b5e38] rounded-lg hover:bg-[#164d2e] disabled:opacity-50 transition-colors"
          >
            <Save size={16} />
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1 min-h-[500px]">
        {/* 
          NOTE: Le PageEditor utilise un éditeur Tiptap simplifié.
          Pour l'instant on affiche le JSON éditable directement,
          en attendant de brancher un éditeur complet.
        */}
        <div className="p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Contenu JSON de la page (éditeur avancé à venir)</p>
          <textarea
            className="w-full h-[450px] font-mono text-xs text-gray-700 border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            value={JSON.stringify(json, null, 2)}
            onChange={e => {
              try {
                setJson(JSON.parse(e.target.value))
              } catch {
                // JSON invalide, on ignore
              }
            }}
          />
          <p className="text-xs text-gray-400 mt-2">Format JSON Tiptap. Sauvegardez pour mettre à jour la page.</p>
        </div>
      </div>
    </div>
  )
}
