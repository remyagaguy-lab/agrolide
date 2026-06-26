import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Handshake, Mail } from "lucide-react"
import { GenericCrudTable } from "@/components/admin/GenericCrudTable"

export const metadata = { title: "Partenaires | Admin agrolide" }

const PARTENAIRE_FIELDS = [
  { key: "nom", label: "Nom de l'organisation", required: true },
  { key: "description", label: "Description", type: "textarea" as const },
  { key: "site_web", label: "Site web", type: "url" as const },
  { key: "logo_url", label: "URL du logo", type: "url" as const },
  { key: "temoignage", label: "Témoignage", type: "textarea" as const },
  { key: "contact_nom", label: "Nom du contact" },
  { key: "contact_titre", label: "Titre du contact" },
  { key: "ordre", label: "Ordre d'affichage", type: "number" as const },
]

export default async function AdminPartenairesPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  let contacts: any[] = []
  try {
    const { data } = await supabase.from("contacts_partenariat").select("*").order("created_at", { ascending: false }).limit(20)
    contacts = data || []
  } catch {}

  const { data: partenaires } = await supabase.from("partenaires").select("*").order("ordre")

  return (
    <div className="space-y-10 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
          <Handshake size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des partenaires</h1>
          <p className="text-sm text-gray-500">Vitrine et demandes de partenariat</p>
        </div>
      </div>

      {/* Demandes de partenariat */}
      {contacts && contacts.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail size={16} className="text-blue-500" /> Demandes de partenariat ({contacts.length})
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Organisation</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(contacts as any[]).map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{c.raison_sociale || c.nom || "—"}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs"><a href={`mailto:${c.email}`} className="hover:text-blue-600">{c.email}</a></td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{c.nature_collaboration || c.type_collaboration || "—"}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.statut === "nouveau" ? "bg-blue-100 text-blue-700" : c.statut === "conclu" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {c.statut || "nouveau"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* CRUD Vitrine partenaires */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Vitrine partenaires</h2>
        <GenericCrudTable
          items={partenaires || []}
          fields={PARTENAIRE_FIELDS}
          title="Partenaires"
          apiBase="/api/admin/partenaires"
          labelField="nom"
          togglePublieKey="publie"
        />
      </section>
    </div>
  )
}
