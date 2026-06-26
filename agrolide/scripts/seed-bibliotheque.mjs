import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { createClient } from '@supabase/supabase-js'

const execAsync = promisify(exec)

// Les clés sont extraites de .env.local
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uwmpihvplckcbefzacqm.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bXBpaHZwbGNrY2JlZnphY3FtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM4MTMwNywiZXhwIjoyMDk3OTU3MzA3fQ.EfPXaMxMsoL_23ORI84tnd8fg_CtDKQwEYMFEgeo9zs'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const BIBLIOTHEQUE_DIR = path.resolve('../Bibliothèque')
const WRANGLER_DIR = path.resolve('../agrolide-worker')

async function seed() {
  if (!fs.existsSync(BIBLIOTHEQUE_DIR)) {
    console.error(`Le dossier ${BIBLIOTHEQUE_DIR} n'existe pas.`)
    return
  }

  const files = fs.readdirSync(BIBLIOTHEQUE_DIR).filter(f => f.endsWith('.pdf') || f.endsWith('.ppt') || f.endsWith('.pptx'))
  
  console.log(`${files.length} fichiers trouvés. Début du seed...`)

  // Fonction pour traiter un seul fichier
  async function processFile(file) {
    const filePath = path.join(BIBLIOTHEQUE_DIR, file)
    const stats = fs.statSync(filePath)
    const key = `seed/${Date.now()}-${file.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    const nameLower = file.toLowerCase()
    let type = 'Article'
    let thematique = 'Agroécologie'
    if (nameLower.includes('guide')) type = 'Guide'
    if (nameLower.includes('business plan')) type = 'Rapport'
    if (nameLower.includes('tomate') || nameLower.includes('pasteque') || nameLower.includes('piment')) thematique = 'Maraîchage'
    if (nameLower.includes('volaille')) thematique = 'Élevage'
    
    try {
      // Upload via Wrangler
      await execAsync(`npx wrangler r2 object put agrolide-bibliotheque/${key} "${filePath}"`, { cwd: WRANGLER_DIR })
      
      // Insertion DB
      const { error } = await supabase.from('documents').insert({
        titre: file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        auteur: 'Agrolide Seed',
        type, thematique,
        resume: `Document de test importé automatiquement depuis le dossier Bibliothèque. Fichier original: ${file}`,
        statut: 'publie', acces: 'public', langue: 'fr',
        fichier_r2_key: key, taille: stats.size,
        format: path.extname(file).replace('.', ''),
        annee: 2024
      })
      
      if (error) {
        console.error(`Erreur DB pour ${file}:`, error)
      } else {
        console.log(`✅ ${file}`)
      }
    } catch (err) {
      console.error(`❌ Échec ${file}:`, err.message.substring(0, 100))
    }
  }

  // Traiter par lots de 5 pour éviter de surcharger
  const BATCH_SIZE = 5
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE)
    console.log(`Traitement du lot ${Math.floor(i/BATCH_SIZE) + 1} (${batch.length} fichiers)...`)
    await Promise.all(batch.map(f => processFile(f)))
  }
  
  console.log('\nSeed terminé !')
}

seed()
