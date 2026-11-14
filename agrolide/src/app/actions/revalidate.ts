"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth/admin"

/** Vide le cache de tout le site : outil technique, réservé au super administrateur. */
export async function revalidateEverything() {
  const admin = await requireAdmin(['super_admin'])
  if (!admin.ok) return
  revalidatePath('/', 'layout')
}
