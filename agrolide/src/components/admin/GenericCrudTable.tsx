"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, CheckCircle } from "lucide-react"

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
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle size={15} /> {message}
          </span>
        )}
        <div className="ml-auto">
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1b5e38] rounded-lg hover:bg-[#164d2e] transition-colors"
          >
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>

      {/* Formulaire création */}
      {creating && (
        <div className="bg-white rounded-xl border border-green-200 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-900">Nouvel élément</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.filter(f => f.type !== "toggle").map(f => (
              <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {f.label}{f.required && " *"}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    value={formData[f.key] || ""}
                    onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <input
                    type={f.type || "text"}
                    value={formData[f.key] || ""}
                    onChange={e => setFormData(prev => ({ ...prev, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1b5e38] rounded-lg hover:bg-[#164d2e] disabled:opacity-50">
              <Save size={14} /> {loading ? "..." : "Créer"}
            </button>
            <button onClick={cancel} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              <X size={14} /> Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="py-12 text-center text-gray-400 italic">
            Aucun élément. Cliquez sur "Ajouter" pour créer le premier.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map(item => (
              <div key={item.id}>
                {editing === item.id ? (
                  <div className="p-5 bg-blue-50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fields.filter(f => f.type !== "toggle").map(f => (
                        <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                          <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                          {f.type === "textarea" ? (
                            <textarea
                              value={formData[f.key] || ""}
                              onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <input
                              type={f.type || "text"}
                              value={formData[f.key] || ""}
                              onChange={e => setFormData(prev => ({ ...prev, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        <Save size={14} /> {loading ? "..." : "Enregistrer"}
                      </button>
                      <button onClick={cancel} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <X size={14} /> Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item[labelField]}</p>
                      {item.poste && <p className="text-xs text-gray-500">{item.poste}{item.organisation ? ` • ${item.organisation}` : ""}</p>}
                      {item.nom && item[labelField] !== item.nom && <p className="text-xs text-gray-500">{item.nom}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {togglePublieKey && (
                        <button
                          onClick={() => togglePublie(item)}
                          className={`p-1.5 rounded-lg transition-colors ${item[togglePublieKey] ? "text-green-600 bg-green-50 hover:bg-green-100" : "text-gray-400 bg-gray-50 hover:bg-gray-100"}`}
                          title={item[togglePublieKey] ? "Publié — cliquer pour dépublier" : "Non publié — cliquer pour publier"}
                        >
                          {item[togglePublieKey] ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                      )}
                      <button onClick={() => startEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                        <Trash2 size={15} />
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
