import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

dotenv.config({ path: '.env.local' })
const execAsync = promisify(exec)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const WRANGLER_DIR = path.resolve('../agrolide-worker')
const filePath = path.resolve('public/documents/manuel_transformation_manioc.pdf')
const fileBaseName = 'manuel_transformation_manioc.pdf'
const key = `seed/${Date.now()}-${fileBaseName}`

async function run() {
  console.log('Uploading to R2 via wrangler...')
  try {
    await execAsync(`npx wrangler r2 object put agrolide-bibliotheque/${key} --file "${filePath}"`, { cwd: WRANGLER_DIR })
    console.log('Upload OK')
  } catch (err) {
    console.error('Erreur upload R2:', err.message)
    return
  }

  console.log('Inserting into documents table...')
  const stats = fs.statSync(filePath)
  
  const { data: document, error } = await supabase.from('documents').insert({
    titre: 'Manuel de transformation du manioc (IITA)',
    auteurs: 'IITA',
    type_doc: 'guide_pratique',
    thematique: 'Agroécologie',
    resume: "Le manioc offre bien plus de débouchés que la vente en frais ; sa transformation locale ouvre au moins sept voies d'activité. Consultez ce manuel de transformation élaboré par l'Institut International d'Agriculture Tropicale (IITA).",
    statut: 'publie',
    acces: 'public',
    langue: 'fr',
    fichier_r2_key: key,
    taille_octets: stats.size,
    annee: 2024
  }).select('id').single()

  if (error || !document) {
    console.error('Erreur insertion document:', error)
    return
  }

  const docId = document.id
  console.log('Document inséré avec ID:', docId)

  console.log('Fetching article to update CTA...')
  const { data: article, error: fetchError } = await supabase
    .from('articles')
    .select('id, contenu_json')
    .eq('slug', '7-opportunites-agrobusiness-manioc')
    .single()

  if (fetchError || !article) {
    console.error('Erreur fetch article:', fetchError)
    return
  }

  // Replace link in HTML
  let content = article.contenu_json
  content = content.replace(
    /href="\/documents\/manuel_transformation_manioc\.pdf"/g, 
    `href="/bibliotheque/${docId}"`
  )

  const { error: updateError } = await supabase
    .from('articles')
    .update({ contenu_json: content })
    .eq('id', article.id)

  if (updateError) {
    console.error('Erreur update article:', updateError)
  } else {
    console.log('Article mis à jour avec le lien vers la bibliothèque:', `/bibliotheque/${docId}`)
  }
}

run()
