const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pdfParse = require('pdf-parse');
const { createClient } = require('@supabase/supabase-js');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ override: true });

// Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/owl-alpha';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

const INPUT_DIR = path.resolve(__dirname, process.env.INPUT_DIR || '../../bibliothèque');
const TRAITES_DIR = path.join(INPUT_DIR, 'traites');
const DOUBLONS_DIR = path.join(INPUT_DIR, 'doublons');
const ERREURS_DIR = path.join(INPUT_DIR, 'erreurs');
const MAX_PAGES = parseInt(process.env.MAX_PAGES_TO_EXTRACT || '3');

// Initialisation des clients
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Créer les dossiers si n'existent pas
[TRAITES_DIR, DOUBLONS_DIR, ERREURS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/**
 * Calcule le hash SHA-256 d'un fichier
 */
function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * Lit le texte des premières pages du PDF
 */
async function extractPdfText(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const options = { max: MAX_PAGES };
  try {
    const data = await pdfParse(dataBuffer, options);
    return data.text;
  } catch (error) {
    console.error(`Erreur de lecture PDF pour ${path.basename(filePath)} :`, error.message);
    return null;
  }
}

/**
 * Appelle l'IA via OpenRouter pour analyser le document
 */
async function analyzeDocumentWithAI(text) {
  const prompt = `
Tu es un bibliothécaire expert. Analyse le texte suivant extrait d'un document (les premières pages) et extrait les informations pour l'indexer.
Retourne UNIQUEMENT un objet JSON strict et valide avec les champs suivants :
- "titre": (string) Le titre exact du document.
- "description": (string) Un résumé de 2 ou 3 phrases du document.
- "thematique": (string) Une catégorie courte (ex: "Techniques agricoles", "Élevage", "Économie", "Changement climatique").
- "type": (string) Choisir STRICTEMENT parmi: "these", "memoire", "fiche_technique", "guide_pratique", "article", "rapport". Choisis le plus pertinent.

Texte extrait :
---
${text.substring(0, 5000)}
---
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
        throw new Error("Réponse inattendue de l'API");
    }
    
    let content = data.choices[0].message.content;
    
    // Parfois l'IA renvoie le JSON dans un bloc markdown
    if (content.includes('\`\`\`json')) {
      content = content.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error("Erreur API IA :", error.message);
    return null;
  }
}

/**
 * Fonction principale
 */
async function runAgent() {
  console.log("🚀 Démarrage de l'Agent IA d'ingestion...");

  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ Le dossier d'entrée n'existe pas : ${INPUT_DIR}`);
    return;
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
  console.log(`📁 ${files.length} fichiers PDF trouvés.`);

  // On limite à 100 fichiers max par exécution (pour y aller par vagues)
  const filesToProcess = files.slice(0, 100);

  for (const file of filesToProcess) {
    const filePath = path.join(INPUT_DIR, file);
    console.log(`\n⏳ Traitement de : ${file}`);

    try {
      // 1. Calcul du hash
      const fileHash = getFileHash(filePath);
      
      // 2. Vérification Doublon Supabase
      const { data: existingDoc } = await supabase
        .from('documents')
        .select('id')
        .eq('file_hash', fileHash)
        .single();

      if (existingDoc) {
        console.log(`⏭️  Doublon détecté. Fichier ignoré.`);
        if (fs.existsSync(filePath)) {
          fs.renameSync(filePath, path.join(DOUBLONS_DIR, file));
        }
        continue;
      }

      // 3. Extraction de texte
      console.log("   Lecture du PDF...");
      const text = await extractPdfText(filePath);
      if (!text || text.trim().length < 50) {
        throw new Error("Impossible d'extraire suffisamment de texte.");
      }

      // 4. Analyse IA
      console.log("   Analyse par l'IA...");
      const metadata = await analyzeDocumentWithAI(text);
      if (!metadata) throw new Error("Échec de l'analyse IA.");
      
      console.log(`   ✅ Titre trouvé : ${metadata.titre}`);

      // 5. Upload Cloudflare R2
      console.log("   Upload vers Cloudflare R2...");
      // Créer un nom de fichier unique et propre
      const cleanFileName = Date.now() + '-' + file.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileBuffer = fs.readFileSync(filePath);
      const fileSize = fs.statSync(filePath).size;

      await s3Client.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: cleanFileName,
        Body: fileBuffer,
        ContentType: 'application/pdf',
      }));

      // L'URL publique de Cloudflare (URL r2.dev ou domaine personnalisé)
      const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com`;
      const publicUrl = `${R2_PUBLIC_URL}/${cleanFileName}`;

      // 6. Insertion Supabase
      console.log("   Sauvegarde dans Supabase...");
      // On récupère le super admin pour l'auteur (ou on met NULL si la table l'autorise)
      const { data: admin } = await supabase.from('profiles').select('id').eq('role_plateforme', 'super_admin').limit(1).single();
      const auteur_id = admin ? admin.id : null;

      let typeDoc = 'article';
      if (metadata.type) {
        const t = metadata.type.toLowerCase();
        if (t.includes('thès') || t.includes('these')) typeDoc = 'these';
        else if (t.includes('mémoire') || t.includes('memoire')) typeDoc = 'memoire';
        else if (t.includes('fiche')) typeDoc = 'fiche_technique';
        else if (t.includes('guide')) typeDoc = 'guide_pratique';
        else if (t.includes('rapport')) typeDoc = 'rapport';
      }

      const { error: dbError } = await supabase.from('documents').insert({
        titre: metadata.titre || file,
        auteurs: "Auteur inconnu",
        type_doc: typeDoc,
        resume: (metadata.description || 'Description générée automatiquement.').substring(0, 490),
        thematique: metadata.thematique || 'Non classé',
        fichier_r2_key: cleanFileName,
        taille_octets: fileSize,
        acces: 'public',
        statut: 'publie',
        file_hash: fileHash,
        depose_par: auteur_id
      });

      if (dbError) throw new Error(`Erreur DB: ${dbError.message}`);

      // 7. Déplacer dans traites
      if (fs.existsSync(filePath)) {
        fs.renameSync(filePath, path.join(TRAITES_DIR, file));
      }
      console.log(`🎉 Document indexé avec succès !`);

    } catch (error) {
      console.error(`❌ Erreur lors du traitement de ${file}:`, error.message);
      if (fs.existsSync(filePath)) {
        fs.renameSync(filePath, path.join(ERREURS_DIR, file));
      }
    }
  }

  console.log("\n✅ Vague de traitement terminée !");
}

runAgent();
