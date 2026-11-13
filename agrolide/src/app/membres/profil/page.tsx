import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { ProfilView } from "@/components/modules/profil/ProfilView"

export const metadata = { title: "Mon profil" }

export default async function ProfilPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const [profile] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (!profile) redirect("/login")

  return <ProfilView profile={profile} />
}
