import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Configuration depuis les variables d'environnement manuellement (car process.env peut ne pas charger .env.local facilement en ES modules sans dotenv config)
const NEXT_PUBLIC_SUPABASE_URL = "https://uwmpihvplckcbefzacqm.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bXBpaHZwbGNrY2JlZnphY3FtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM4MTMwNywiZXhwIjoyMDk3OTU3MzA3fQ.EfPXaMxMsoL_23ORI84tnd8fg_CtDKQwEYMFEgeo9zs";
const CLOUDFLARE_ACCOUNT_ID = "384a52e5c7736534216323423c852a8b";
const R2_ACCESS_KEY_ID = "110b6d86278ffff8a2023cf164efe364";
const R2_SECRET_ACCESS_KEY = "7442957f58ac72c153062c84d04ba141caf849fbc2106d1fc9af9d582a8a887f";
const R2_BUCKET_NAME = "agrolide-biblio";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function uploadFile(filePath, folder, contentType) {
  const fileContent = fs.readFileSync(filePath);
  const ext = path.extname(filePath);
  const objectKey = `${folder}/${crypto.randomUUID()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: objectKey,
    Body: fileContent,
    ContentType: contentType,
  });

  await S3.send(command);
  console.log(`Uploaded ${filePath} to ${objectKey}`);
  
  return `https://${R2_BUCKET_NAME}.${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${objectKey}`;
}

async function main() {
  try {
    const affichePath = "C:\\Users\\remya\\OneDrive\\Documents\\agrolide.org\\Evenements\\Wébiniare 1.png";
    const presentationPath = "C:\\Users\\remya\\OneDrive\\Documents\\agrolide.org\\Evenements\\Webinaire formatif (gestion de projet agricole).pdf";

    console.log("Uploading Affiche...");
    const imageUrl = await uploadFile(affichePath, "evenements/affiches", "image/png");
    
    console.log("Uploading Presentation...");
    const presentationUrl = await uploadFile(presentationPath, "evenements/presentations", "application/pdf");

    const description = `Tu veux savoir comment gérer un projet agricole de l'idée aux récoltes ? J'ai une bonne nouvelle pour toi... 

Le Réseau BIFERA : Bibliothèque Internationale pour la Formation, l’Entrepreneuriat et le Réseautage Agricole a le plaisir de vous inviter à son tout premier webinaire dédié à celles et ceux qui souhaitent passer de l’idée à l’action en agriculture.

Thème :
« Comment monter un projet agricole rentable : de l’idée aux premières récoltes »

Ce webinaire s’adresse aux étudiants en agriculture, jeunes agripreneurs et porteurs de projets qui veulent comprendre : 

🍅 comment structurer une idée agricole,
🍅 éviter les erreurs courantes au démarrage,
🍅 transformer un projet agricole en activité concrète et viable.

Ce n'est pas qu'un simple webinaire, c'est un rendez-vous avec un entrepreneur expérimenté du secteur agricole échanger et apprendre de son expérience.`;

    const eventPayload = {
      titre: "Comment monter un projet agricole rentable : de l’idée aux premières récoltes",
      description: description,
      type_evt: "webinaire",
      date_debut: "2025-12-20T19:00:00Z",
      date_fin: "2025-12-20T20:30:00Z",
      lieu: "En ligne via Google Meet",
      en_ligne: true,
      image_url: imageUrl,
      presentation_url: presentationUrl,
      publie: true
    };

    console.log("Inserting Event into Supabase...");
    const { data, error } = await supabase.from('evenements').insert(eventPayload).select();

    if (error) {
      console.error("Error inserting event:", error);
    } else {
      console.log("Event inserted successfully!", data);
    }
  } catch (error) {
    console.error("Script failed:", error);
  }
}

main();
