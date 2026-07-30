import { db } from "@/db"
import { temoignages } from "@/db/schema"
import { asc } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Star } from "lucide-react"
import { GenericCrudTable } from "@/components/admin/GenericCrudTable"

export const metadata = { title: "Témoignages" }
export const dynamic = 'force-dynamic'

const TEMOIGNAGE_FIELDS = [
  { key: "prenom", label: "Prénom", required: true },
  { key: "nom", label: "Nom" },
  { key: "categorie", label: "Catégorie" },
  { key: "pays", label: "Pays" },
  { key: "citation", label: "Citation / Témoignage", type: "textarea" as const, required: true },
  { key: "photo_url", label: "URL de la photo", type: "url" as const },
  { key: "ordre", label: "Ordre d'affichage", type: "number" as const },
]

export default async function AdminTemoignagesPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  let temoignagesList: any[] = []
  try {
    temoignagesList = await db.select().from(temoignages).orderBy(asc(temoignages.ordre))
  } catch (e) {}

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
          <Star size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Témoignages</h1>
          <p className="text-sm text-gray-500">Gérez les témoignages affichés sur la page d&apos;accueil</p>
        </div>
      </div>

      <GenericCrudTable
        items={temoignagesList}
        fields={TEMOIGNAGE_FIELDS}
        title="Témoignages"
        apiBase="/api/admin/temoignages"
        labelField="prenom"
        togglePublieKey="publie"
      />
    </div>
  )
}
