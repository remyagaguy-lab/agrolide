import { createClient } from '@supabase/supabase-js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function test() {
  const { data: docs } = await supabase.from('documents').select('id, fichier_r2_key').limit(1);
  const doc = docs[0];

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || 'agrolide-biblio',
    Key: doc.fichier_r2_key,
  });

  try {
    const response = await s3Client.send(command);
    // Try to get byte array
    const bytes = await response.Body.transformToByteArray();
    console.log("Success! Bytes length:", bytes.length);
  } catch (error) {
    console.error("S3 Error:", error);
  }
}

test();
