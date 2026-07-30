/**
 * Script d'export Supabase → Cloudflare D1
 * Usage: node scripts/export-supabase.mjs
 * 
 * Ce script :
 * 1. Exporte toutes les tables Supabase vers des fichiers JSON
 * 2. Génère un fichier SQL d'import pour Cloudflare D1
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- PARSER LE SCHEMA SQLITE POUR AVOIR LES BONNES COLONNES ---
const sqlSchema = readFileSync(join(__dirname, '..', 'drizzle', '0000_icy_viper.sql'), 'utf8')
const tableColumnsMap = {}
let currentTable = null

for (const line of sqlSchema.split('\n')) {
  const tableMatch = line.match(/CREATE TABLE `([^`]+)`/)
  if (tableMatch) {
    currentTable = tableMatch[1]
    tableColumnsMap[currentTable] = []
    continue
  }
  if (currentTable) {
    if (line.includes(');')) {
      currentTable = null
    } else {
      const colMatch = line.match(/^\s*`([^`]+)`/)
      if (colMatch) {
        tableColumnsMap[currentTable].push(colMatch[1])
      }
    }
  }
}

// --- CONFIGURATION ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uwmpihvplckcbefzacqm.supabase.co'
// On utilise la SERVICE ROLE KEY pour bypasser RLS
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bXBpaHZwbGNrY2JlZnphY3FtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM4MTMwNywiZXhwIjoyMDk3OTU3MzA3fQ.EfPXaMxMsoL_23ORI84tnd8fg_CtDKQwEYMFEgeo9zs'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
  // Désactiver RLS via le rôle service
  global: { headers: { 'x-supabase-role': 'service_role' } }
})

// Tables à exporter (dans l'ordre des dépendances)
const TABLES = [
  'profiles',
  'articles',
  'pages_statiques',
  'temoignages',
  'partenaires',
  'agripreneurs',
  'documents',
  'telechargements',
  'formations',
  'sessions_formation',
  'inscriptions_formation',
  'avis_formation',
  'evenements',
  'inscriptions_evenement',
  'opportunites',
  'forum_categories',
  'forum_fils',
  'forum_messages',
  'messages',
  'notifications',
  'cotisations',
  'contributions',
  'campagnes_financement',
  'webinaires',
  'candidatures_incubation',
  'demandes_service',
  'contacts_partenariat',
]

// Créer le dossier d'export
const exportDir = join(__dirname, '..', 'supabase-export')
if (!existsSync(exportDir)) {
  mkdirSync(exportDir, { recursive: true })
}

function escapeSQLValue(val) {
  if (val === null || val === undefined) return 'NULL'
  if (typeof val === 'boolean') return val ? '1' : '0'
  if (typeof val === 'number') return val.toString()
  if (Array.isArray(val)) return `'${JSON.stringify(val).replace(/'/g, "''")}'`
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`
  return `'${String(val).replace(/'/g, "''")}'`
}

async function exportTable(tableName) {
  console.log(`📤 Export de "${tableName}"...`)
  
  // Tables sans colonne created_at — on supprime l'order by
  const tablesWithoutCreatedAt = ['pages_statiques', 'temoignages', 'forum_categories']
  
  let url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*`
  if (!tablesWithoutCreatedAt.includes(tableName)) {
    url += '&order=created_at.asc'
  }

  const resp = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Accept': 'application/json',
      // Bypass RLS avec le rôle service_role
      'x-supabase-role': 'service_role',
    }
  })

  if (!resp.ok) {
    const errText = await resp.text()
    console.warn(`  ⚠️  Erreur sur "${tableName}": ${resp.status} - ${errText.substring(0, 100)}`)
    return []
  }

  const data = await resp.json()

  if (!data || data.length === 0) {
    console.log(`  ℹ️  Table vide, skippée.`)
    return []
  }

  console.log(`  ✅ ${data.length} enregistrements trouvés.`)
  
  // Sauvegarder en JSON pour la traçabilité
  writeFileSync(
    join(exportDir, `${tableName}.json`),
    JSON.stringify(data, null, 2),
    'utf8'
  )

  return data
}

function generateInsertSQL(tableName, rows) {
  if (!rows || rows.length === 0) return ''
  
  // Mapping des tables Supabase → D1 (certaines ont des noms différents)
  const tableNameMap = {
    'profiles': 'user', // Dans notre schéma D1, profiles = user
  }
  const d1TableName = tableNameMap[tableName] || tableName
  
  let columns = Object.keys(rows[0])
  
  // Utiliser les colonnes autorisées par le schéma SQLite
  const validColumns = tableColumnsMap[d1TableName] || []
  if (validColumns.length > 0) {
    columns = columns.filter(c => validColumns.includes(c))
  }
  
  let sql = `-- Table: ${d1TableName} (${rows.length} enregistrements)\n`
  sql += `DELETE FROM "${d1TableName}";\n`
  
  for (const row of rows) {
    const values = columns.map(col => escapeSQLValue(row[col]))
    sql += `INSERT OR IGNORE INTO "${d1TableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});\n`
  }
  
  return sql + '\n'
}

async function main() {
  console.log('🚀 Démarrage de l\'export Supabase → Cloudflare D1\n')
  
  let allSQL = `-- =============================================
-- Export Supabase → Cloudflare D1
-- Généré le ${new Date().toISOString()}
-- =============================================

PRAGMA foreign_keys = OFF;

`

  for (const table of TABLES) {
    const rows = await exportTable(table)
    allSQL += generateInsertSQL(table, rows)
  }

  allSQL += '\nPRAGMA foreign_keys = ON;\n'

  // Sauvegarder le fichier SQL
  const sqlPath = join(exportDir, 'import-d1.sql')
  writeFileSync(sqlPath, allSQL, 'utf8')

  console.log(`\n✅ Export terminé !`)
  console.log(`📁 Fichiers JSON : ${exportDir}`)
  console.log(`📄 Fichier SQL  : ${sqlPath}`)
  console.log(`\nPour importer dans D1, exécutez :`)
  console.log(`  npx wrangler d1 execute agrolide-d1 --remote --file=supabase-export/import-d1.sql`)
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err)
  process.exit(1)
})
