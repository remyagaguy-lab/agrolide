import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfilForm } from "./ProfilForm"

export default async function ProfilModifierPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (!profile) redirect("/login")

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Modifier mon Profil</h1>
        <p className="text-[var(--color-gris-texte)]">Mettez à jour vos informations personnelles et professionnelles.</p>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[var(--color-gris-clair)]">
        <ProfilForm initialData={profile} sessionToken={session.access_token} />
      </div>
    </div>
  )
}
