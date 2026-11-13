'use server'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { users } from '@/db/schema'
import { auth } from '@/lib/auth/server'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const EXTENSIONS: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
/** La photo est recadrée et compressée dans le navigateur (≈ 100 Ko) ; 2 Mo restent un plafond de sécurité. */
const TAILLE_MAX = 2 * 1024 * 1024

/** Vérifie la signature du fichier : le type annoncé par le navigateur ne suffit pas. */
function signatureValide(octets: Uint8Array, type: string) {
  if (type === 'image/jpeg') return octets[0] === 0xff && octets[1] === 0xd8
  if (type === 'image/png') return octets[0] === 0x89 && octets[1] === 0x50 && octets[2] === 0x4e && octets[3] === 0x47
  if (type === 'image/webp') return octets[0] === 0x52 && octets[1] === 0x49 && octets[8] === 0x57 && octets[9] === 0x45
  return false
}

/**
 * Envoie la photo de profil (déjà recadrée par le navigateur), l'enregistre sur le profil du membre
 * et invalide les pages qui l'affichent. Les messages d'erreur sont destinés au membre.
 */
export async function uploadAvatarAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, error: 'Votre session a expiré. Reconnectez-vous puis réessayez.' }

    const file = formData.get('photo')
    if (!(file instanceof Blob) || file.size === 0) return { success: false, error: 'Aucune image reçue. Choisissez à nouveau votre photo.' }

    const extension = EXTENSIONS[file.type]
    if (!extension) return { success: false, error: 'Format non pris en charge. Utilisez une image JPEG, PNG ou WebP.' }
    if (file.size > TAILLE_MAX) return { success: false, error: 'L’image est trop volumineuse (2 Mo au maximum).' }

    const buffer = Buffer.from(await file.arrayBuffer())
    if (!signatureValide(buffer, file.type)) return { success: false, error: 'Ce fichier n’est pas une image valide.' }

    const cle = `profils/${userId}-${crypto.randomUUID()}.${extension}`
    const bucket = process.env.NEXT_PUBLIC_R2_PUBLIC_BUCKET || 'agrolide-ressources'
    if (!process.env.NEXT_PUBLIC_R2_PUBLIC_URL) {
      console.error("Erreur d'upload d'avatar : NEXT_PUBLIC_R2_PUBLIC_URL manquante")
      return { success: false, error: 'Le stockage des photos n’est pas disponible pour le moment. Réessayez plus tard.' }
    }

    await s3Client.send(new PutObjectCommand({ Bucket: bucket, Key: cle, Body: buffer, ContentType: file.type, CacheControl: 'public, max-age=31536000, immutable' }))

    const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${cle}`
    await db.update(users).set({ photo_url: url, updated_at: new Date().toISOString() }).where(eq(users.id, userId))
    // Avatar du menu, de l'en-tête, de l'annuaire et des messages : tout le dossier membre se recharge.
    revalidatePath('/membres', 'layout')
    return { success: true, url }
  } catch (error) {
    console.error("Erreur d'upload d'avatar:", error)
    return { success: false, error: 'L’envoi de la photo a échoué. Vérifiez votre connexion et réessayez.' }
  }
}

/** Retire la photo : l'emblème par défaut est de nouveau affiché. */
export async function retirerAvatarAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, error: 'Votre session a expiré. Reconnectez-vous puis réessayez.' }
    await db.update(users).set({ photo_url: null, updated_at: new Date().toISOString() }).where(eq(users.id, userId))
    revalidatePath('/membres', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Erreur retirerAvatarAction:', error)
    return { success: false, error: 'La photo n’a pas pu être retirée. Réessayez.' }
  }
}
