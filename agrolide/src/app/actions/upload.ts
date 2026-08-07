'use server'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { auth } from '@clerk/nextjs/server'
import { v4 as uuidv4 } from 'uuid' // Or just crypto.randomUUID() if supported

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

export async function uploadAvatarAction(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Non autorisé");
    }

    const file = formData.get('photo') as File;
    if (!file) {
      throw new Error("Aucun fichier fourni");
    }

    // Verify file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error("Format de fichier non supporté. Veuillez utiliser JPEG, PNG ou WEBP.");
    }
    
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("L'image est trop volumineuse. La taille maximum est de 2MB.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split('.').pop();
    const filename = `profils/${userId}-${crypto.randomUUID()}.${extension}`;
    
    // We will upload to the public bucket: agrolide-ressources
    const bucketName = process.env.NEXT_PUBLIC_R2_PUBLIC_BUCKET || 'agrolide-ressources';

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${filename}`;
    
    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Erreur d'upload d'avatar:", error);
    return { success: false, error: error.message || "Erreur lors de l'upload" };
  }
}
