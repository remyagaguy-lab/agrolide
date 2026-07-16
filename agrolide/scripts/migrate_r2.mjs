import { S3Client, ListObjectsV2Command, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const privateBucket = process.env.R2_BUCKET_NAME; // agrolide-biblio
const publicBucket = process.env.NEXT_PUBLIC_R2_PUBLIC_BUCKET; // agrolide-ressources
const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL; // https://pub-...

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrateAffiches() {
  console.log(`Migrating affiches from ${privateBucket} to ${publicBucket}...`);
  
  const listCmd = new ListObjectsV2Command({
    Bucket: privateBucket,
    Prefix: 'evenements/affiches/'
  });
  
  const listRes = await s3.send(listCmd);
  const items = listRes.Contents || [];
  
  if (items.length === 0) {
    console.log("No affiches to migrate.");
    return;
  }
  
  for (const item of items) {
    if (!item.Key) continue;
    if (item.Key.endsWith('/')) continue; // skip directories if any
    
    console.log(`Processing ${item.Key}...`);
    
    // 1. Copy to public bucket
    const copyCmd = new CopyObjectCommand({
      CopySource: `${privateBucket}/${item.Key}`,
      Bucket: publicBucket,
      Key: item.Key
    });
    await s3.send(copyCmd);
    console.log(` -> Copied to ${publicBucket}`);
    
    // 2. Update Supabase
    // We update any event that has this image
    const oldUrlPart = item.Key; // usually the URL ends with this
    const newUrl = `${publicUrlBase}/${item.Key}`;
    
    // Using illike to find the event
    const { data: events, error: searchErr } = await supabase
      .from('evenements')
      .select('id, image_url')
      .like('image_url', `%${oldUrlPart}%`);
      
    if (searchErr) {
      console.error(` -> DB Search error:`, searchErr);
    } else {
      for (const event of events) {
        await supabase.from('evenements').update({ image_url: newUrl }).eq('id', event.id);
        console.log(` -> Updated event ${event.id} DB record`);
      }
    }
    
    // 3. Delete from private bucket
    const delCmd = new DeleteObjectCommand({
      Bucket: privateBucket,
      Key: item.Key
    });
    await s3.send(delCmd);
    console.log(` -> Deleted from ${privateBucket}`);
  }
  
  console.log("Migration complete!");
}

migrateAffiches().catch(console.error);
