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

const privateBucket = process.env.R2_BUCKET_NAME; // agrolide-biblio
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
  
  if (bucket === publicBucket) {
    return `${publicUrlBase}/${objectKey}`;
  } else {
    // Internal URL for private bucket
    return `https://${privateBucket}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${objectKey}`;
  }
}

async function seed() {
  const baseDir = "c:/Users/remya/OneDrive/Documents/agrolide.org/Evènements/Wébinaire 2";
  
  const poster1Path = path.join(baseDir, "Parlons Agriculture By BIFERA  Josias.jpg");
  const poster2Path = path.join(baseDir, "Parlons agriculture By BIFERA  Joseph.jpg");
  const presentationPath = path.join(baseDir, "Parlons Agriculture 2.pdf");

  console.log("Uploading files...");
  
  const urlJosias = await uploadFile(poster1Path, publicBucket, "evenements/affiches", "image/jpeg");
  const urlJoseph = await uploadFile(poster2Path, publicBucket, "evenements/affiches", "image/jpeg");
  const urlPresentation = await uploadFile(presentationPath, privateBucket, "evenements/presentations", "application/pdf");

  const description = `Produire, c’est une chose, vendre au bon prix, au bon moment et au bon client, c’en est une autre.

Beaucoup d’agriculteurs et d’agroentrepreneurs travaillent dur, investissent du temps, de l’énergie et des ressources… mais rencontrent encore des difficultés au moment crucial : la commercialisation. 

Produits invendus, prix imposés par les intermédiaires, manque de débouchés structurés, méconnaissance du marché… ces réalités freinent trop souvent la rentabilité des activités agricoles.

C’est précisément pour répondre à ces défis que BIFERA lance ce nouveau rendez-vous 

**Parlons Agriculture – En live sur le thème : Du champ au marché : stratégies de commercialisation des produits agricoles**

Lors de ce webinaire, nous irons au cœur des stratégies concrètes qui permettent de passer efficacement du champ au marché : 
🍎 comprendre les attentes des acheteurs, 
🍎 structurer son offre, mieux fixer ses prix, sécuriser ses débouchés 
🍎 et transformer sa production en véritable opportunité économique.

🎙️ **Intervenants**
Avec **M. Josias SOKPOR**, agroéconomiste et promoteur du projet AGRO IA 
et 
**M. Joseph FIAGAN**, Agroéconomiste | Président 2AEC et Coordinateur national SDG Youth Connect (Togo)

![Intervenant Joseph FIAGAN](${urlJoseph})

📅 **Rendez-vous ce Samedi 31 janvier 2026 de 19h00 à 20h30 GMT**

En direct sur Google Meet : bit.ly/parlons-agriculture 
Rejoignez le Réseau BIFERA via : bit.ly/reseau-bifera`;

  console.log("Inserting event into database...");

  const { data, error } = await supabase
    .from('evenements')
    .insert({
      titre: 'Du champ au marché : stratégies de commercialisation des produits agricoles',
      type_evt: 'webinaire',
      description: description,
      date_debut: '2026-01-31T19:00:00Z',
      date_fin: '2026-01-31T20:30:00Z',
      en_ligne: true,
      lien_inscription: 'https://bit.ly/parlons-agriculture',
      publie: true,
      image_url: urlJosias,
      presentation_url: urlPresentation,
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
