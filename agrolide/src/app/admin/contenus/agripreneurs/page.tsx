import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sprout } from "lucide-react"
import { GenericCrudTable } from "@/components/admin/GenericCrudTable"

export const metadata = { title: "Agripreneurs | Admin agrolide" }

const AGRIPRENEUR_FIELDS = [
  { key: "nom", label: "Nom de l'agripreneur", required: true },
  { key: "projet", label: "Nom du projet", required: true },
  { key: "secteur", label: "Secteur" },
  { key: "pays", label: "Pays" },
  { key: "description", label: "Description du projet", type: "textarea" as const },
  { key: "temoignage", label: "Témoignage", type: "textarea" as const },
  { key: "photo_url", label: "URL de la photo", type: "url" as const },
  { key: "lien_web", label: "Site web", type: "url" as const },
]

export default async function AdminAgripreneursPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  const { data: agripreneurs } = await supabase.from("agripreneurs").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-lime-50 text-lime-700 rounded-xl flex items-center justify-center">
          <Sprout size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vitrine Agripreneurs</h1>
          <p className="text-sm text-gray-500">Success stories affichées sur la page agrobusiness</p>
        </div>
      </div>

      <GenericCrudTable
        items={agripreneurs || []}
        fields={AGRIPRENEUR_FIELDS}
        title="Agripreneurs"
        apiBase="/api/admin/agripreneurs"
        labelField="nom"
        togglePublieKey="publie"
      />
    </div>
  )
}
