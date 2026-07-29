"use server"

import { revalidatePath } from "next/cache"

export async function revalidateEverything() {
  revalidatePath('/', 'layout')
}
