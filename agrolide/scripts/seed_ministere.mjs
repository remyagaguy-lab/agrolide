import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const publicBucket = process.env.NEXT_PUBLIC_R2_PUBLIC_BUCKET; // agrolide-ressources
const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL; // https://pub-...

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function uploadFile(filePath, bucket, folder, contentType) {
  const content = fs.readFileSync(filePath);
  const ext = path.extname(filePath);
  const objectKey = `${folder}/${crypto.randomUUID()}${ext}`;
  
  console.log(`Uploading ${filePath} to ${bucket}/${objectKey}...`);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    Body: content,
    ContentType: contentType,
  });

  await s3.send(command);
  
  return `${publicUrlBase}/${objectKey}`;
}

async function seed() {
  const baseDir = "c:/Users/remya/OneDrive/Documents/agrolide.org/Evènements/Wébinaire Ministère";
  
  const posterPath = path.join(baseDir, "Affiche wébinaire.jpeg");

  console.log("Uploading files...");
  
  const urlPoster = await uploadFile(posterPath, publicBucket, "evenements/affiches", "image/jpeg");

  const description = `Le Ministère délégué, chargé du Commerce et du Contrôle de la Qualité, invite les producteurs locaux, promoteurs, PME/TPME, coopératives et associations professionnelles au démarrage du programme :

**« À la découverte des producteurs locaux »**

Ce webinaire vise à renforcer les capacités des acteurs locaux à travers des formations pratiques sur le digital, la visibilité des produits, la vente en ligne et les opportunités liées à la ZLECAf.

📅 **Date** : 15 août 2026 (Modifié pour rester "À venir")
🕙 **Heure** : 10h00
📍 **Lieu** : En ligne via Zoom

Inscription obligatoire ici 👇
https://us06web.zoom.us/meeting/register/jt-8lq81R8q6c5Yj2f-ELQ`;

  console.log("Inserting event into database...");

  const { data, error } = await supabase
    .from('evenements')
    .insert({
      titre: 'À la découverte des producteurs locaux',
      type_evt: 'webinaire',
      description: description,
      date_debut: '2026-08-15T10:00:00Z', // Futurs
      date_fin: '2026-08-15T12:00:00Z',
      en_ligne: true,
      lien_inscription: 'https://us06web.zoom.us/meeting/register/jt-8lq81R8q6c5Yj2f-ELQ',
      publie: true,
      image_url: urlPoster,
      places_max: null,
      lieu: null,
      pays: null,
    })
    .select();

  if (error) {
    console.error("Database insert error:", error);
  } else {
    console.log("Event seeded successfully:", data[0].id);
  }
}

seed().catch(console.error);
