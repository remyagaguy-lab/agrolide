'use server'

import { chargerActualites } from '@/lib/actualites.server'

export async function getActualites() {
  return chargerActualites('tout')
}
