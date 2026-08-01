import { redirect } from "next/navigation"
import { ProfilForm } from "./ProfilForm"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function ProfilModifierPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const userRows = await db.select({
    id: users.id,
    prenom: users.prenom,
    nom: users.nom,
    entreprise: users.organisation,
    bio: users.biographie,
    avatar_url: users.photo_url
  })
  .from(users)
  .where(eq(users.id, userId))
  .limit(1)

  const profile = userRows[0] ? {
    ...userRows[0],
    telephone: ""
  } : null

  if (!profile) redirect("/login")

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="mb-6">
        <h1 className="dash-page-title">Modifier mon Profil</h1>
        <p className="mt-2 text-gray-500 text-sm">Mettez à jour vos informations personnelles et professionnelles.</p>
      </div>
      
      <div className="card-glass p-6 md:p-8">
        <ProfilForm initialData={profile} />
      </div>
    </div>
  )
}
