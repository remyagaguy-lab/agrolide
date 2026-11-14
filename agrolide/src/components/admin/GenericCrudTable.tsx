"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, CheckCircle2 } from "@/components/ui/icons"
type Item = {
  id: string
  [key: string]: any
}

interface Field {
  key: string
  label: string
  type?: "text" | "textarea" | "url" | "number" | "toggle"
  required?: boolean
}

interface GenericCrudTableProps {
  items: Item[]
  fields: Field[]
  title: string
  apiBase: string
  labelField: string
  togglePublieKey?: string
}

export function GenericCrudTable({ items: initialItems, fields, title, apiBase, labelField, togglePublieKey }: GenericCrudTableProps) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const startCreate = () => {
    setFormData({})
    setEditing(null)
    setCreating(true)
  }

  const startEdit = (item: Item) => {
    setFormData({ ...item })
    setCreating(false)
    setEditing(item.id)
  }

  const cancel = () => {
    setEditing(null)
    setCreating(false)
    setFormData({})
  }

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (creating) {
        const res = await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (res.ok) {
          setItems(prev => [...prev, data])
          showMessage("Créé avec succès !")
          setCreating(false)
        }
      } else if (editing) {
        const res = await fetch(`${apiBase}/${editing}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          setItems(prev => prev.map(it => it.id === editing ? { ...it, ...formData } : it))
          showMessage("Mis à jour !")
          setEditing(null)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet élément ?")) return
    const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" })
    if (res.ok) {
      setItems(prev => prev.filter(it => it.id !== id))
      showMessage("Supprimé.")
    }
  }

  const togglePublie = async (item: Item) => {
    if (!togglePublieKey) return
    const newVal = !item[togglePublieKey]
    const res = await fetch(`${apiBase}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [togglePublieKey]: newVal }),
    })
    if (res.ok) {
      setItems(prev => prev.map(it => it.id === item.id ? { ...it, [togglePublieKey]: newVal } : it))
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        {message && (
          <span className="flex items-center gap-1.5 text-sm text-success">
            <CheckCircle2 size={16} /> {message}
          </span>
        )}
        <div className="ml-auto">
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-primary bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>

      {/* Formulaire création */}
      {creating && (
        <div className="bg-surface-container-lowest rounded-xl border border-success/30 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-on-surface">Nouvel élément</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.filter(f => f.type !== "toggle").map(f => (
              <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">
                  {f.label}{f.required && " *"}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    value={formData[f.key] || ""}
                    onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-success"
                  />
                ) : (
                  <input
                    type={f.type || "text"}
                    value={formData[f.key] || ""}
                    onChange={e => setFormData(prev => ({ ...prev, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-success"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-primary bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50">
              <Save size={16} /> {loading ? "..." : "Créer"}
            </button>
            <button onClick={cancel} className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low">
              <X size={16} /> Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="py-12 text-center text-on-surface-muted italic">
            Aucun élément. Cliquez sur "Ajouter" pour créer le premier.
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {items.map(item => (
              <div key={item.id}>
                {editing === item.id ? (
                  <div className="p-5 bg-info-container space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fields.filter(f => f.type !== "toggle").map(f => (
                        <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                          <label className="block text-xs font-medium text-on-surface-variant mb-1">{f.label}</label>
                          {f.type === "textarea" ? (
                            <textarea
                              value={formData[f.key] || ""}
                              onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-info"
                            />
                          ) : (
                            <input
                              type={f.type || "text"}
                              value={formData[f.key] || ""}
                              onChange={e => setFormData(prev => ({ ...prev, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-info"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-surface-brand bg-info rounded-lg hover:bg-info disabled:opacity-50">
                        <Save size={16} /> {loading ? "..." : "Enregistrer"}
                      </button>
                      <button onClick={cancel} className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low">
                        <X size={16} /> Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container-low transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-on-surface truncate">{item[labelField]}</p>
                      {item.poste && <p className="text-xs text-on-surface-muted">{item.poste}{item.organisation ? ` · ${item.organisation}` : ""}</p>}
                      {item.nom && item[labelField] !== item.nom && <p className="text-xs text-on-surface-muted">{item.nom}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {togglePublieKey && (
                        <button
                          onClick={() => togglePublie(item)}
                          className={`p-1.5 rounded-lg transition-colors ${item[togglePublieKey] ? "text-success bg-success-container hover:bg-success-container" : "text-on-surface-muted bg-surface-container-low hover:bg-surface-container"}`}
                          title={item[togglePublieKey] ? "Publié : cliquer pour dépublier" : "Non publié : cliquer pour publier"}
                        >
                          {item[togglePublieKey] ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      )}
                      <button onClick={() => startEdit(item)} className="p-1.5 text-on-surface-muted hover:text-info hover:bg-info-container rounded-lg transition-colors" title="Modifier">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-on-surface-muted hover:text-error hover:bg-error-container rounded-lg transition-colors" title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
