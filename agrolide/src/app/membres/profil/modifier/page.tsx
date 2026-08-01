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
    <div className="max-w-[800px] mx-auto space-y-6 py-6 px-2 md:px-4">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] font-heading">Modifier mon Profil</h1>
        <p className="mt-1 text-gray-500 text-xs">Mettez à jour vos informations personnelles et professionnelles.</p>
      </div>
      
      <div className="bg-white border border-[#e8e8e4] rounded-2xl shadow-sm p-5 md:p-6">
        <ProfilForm initialData={profile} />
      </div>
    </div>
  )
}
