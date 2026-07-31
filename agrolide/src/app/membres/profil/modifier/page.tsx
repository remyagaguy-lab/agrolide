import { redirect } from "next/navigation"
import { ProfilForm } from "./ProfilForm"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function ProfilModifierPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const profile = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })

  if (!profile) redirect("/login")

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Modifier mon Profil</h1>
        <p className="text-[var(--color-gris-texte)]">Mettez à jour vos informations personnelles et professionnelles.</p>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[var(--color-gris-clair)]">
        <ProfilForm initialData={profile} />
      </div>
    </div>
  )
}
