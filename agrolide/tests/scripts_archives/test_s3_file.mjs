import { createClient } from '@supabase/supabase-js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function checkS3() {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'agrolide-biblio',
    Key: '1782480100618-viandes_de_boucherie_farines_animales_noir_animal_abats.pdf',
  });

  try {
    const response = await s3Client.send(command);
    console.log("Success! Length:", response.ContentLength);
  } catch (error) {
    console.error("S3 Error:", error);
  }
}

checkS3();
