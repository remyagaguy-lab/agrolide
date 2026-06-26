import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Star } from "lucide-react"
import { GenericCrudTable } from "@/components/admin/GenericCrudTable"

export const metadata = { title: "Témoignages | Admin agrolide" }

const TEMOIGNAGE_FIELDS = [
  { key: "nom", label: "Nom complet", required: true },
  { key: "poste", label: "Poste / Titre" },
  { key: "organisation", label: "Organisation" },
  { key: "pays", label: "Pays" },
  { key: "citation", label: "Citation / Témoignage", type: "textarea" as const, required: true },
  { key: "photo_url", label: "URL de la photo", type: "url" as const },
  { key: "note", label: "Note (1-5)", type: "number" as const },
  { key: "ordre", label: "Ordre d'affichage", type: "number" as const },
]

export default async function AdminTemoignagesPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  const { data: temoignages } = await supabase.from("temoignages").select("*").order("ordre")

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
          <Star size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Témoignages</h1>
          <p className="text-sm text-gray-500">Gérez les témoignages affichés sur la page d'accueil</p>
        </div>
      </div>

      <GenericCrudTable
        items={temoignages || []}
        fields={TEMOIGNAGE_FIELDS}
        title="Témoignages"
        apiBase="/api/admin/temoignages"
        labelField="nom"
        togglePublieKey="publie"
      />
    </div>
  )
}
