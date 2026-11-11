/**
 * Import des membres existants (D1) vers Supabase Auth.
 *
 * 1) Exporter les membres depuis Cloudflare D1 (Console) :
 *      SELECT id, email, prenom, nom, password_hash, role_plateforme FROM "user";
 *    puis enregistrer le résultat en JSON (tableau d'objets) dans  scripts/users-export.json
 *    (ce fichier contient des hash : NE PAS le commiter, il est ignoré par .gitignore).
 *
 * 2) Simulation (aucune écriture) :
 *      node --env-file=.env.local scripts/import-users-to-supabase.mjs
 *
 * 3) Import réel :
 *      node --env-file=.env.local scripts/import-users-to-supabase.mjs --apply
 *
 * 4) Import + envoi d'un e-mail « définir votre mot de passe » aux comptes sans mot de passe :
 *      node --env-file=.env.local scripts/import-users-to-supabase.mjs --apply --invite
 *
 * Chaque compte reçoit app_metadata = { d1_id: <ancien id>, role } : le site continue ainsi
 * à retrouver les données existantes (clés étrangères inchangées).
 * Le script est relançable : un e-mail déjà présent dans Supabase est ignoré.
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const apply = process.argv.includes('--apply')
const invite = process.argv.includes('--invite')
const file = new URL('./users-export.json', import.meta.url)

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.')
  process.exit(1)
}

const rows = JSON.parse(readFileSync(file, 'utf-8'))
const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.agrolide.org'

// Emails déjà présents dans Supabase
const existing = new Set()
for (let page = 1; ; page++) {
  const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
  if (error) throw error
  data.users.forEach((u) => u.email && existing.add(u.email.toLowerCase()))
  if (data.users.length < 1000) break
}

const stats = { created: 0, skipped: 0, withPassword: 0, invited: 0, errors: 0 }

for (const r of rows) {
  const email = String(r.email || '').trim().toLowerCase()
  if (!email) { stats.errors++; continue }
  if (existing.has(email)) { stats.skipped++; console.log(`= ${email} (déjà présent)`); continue }

  const hasBcrypt = typeof r.password_hash === 'string' && /^\$2[aby]\$/.test(r.password_hash)
  const payload = {
    email,
    email_confirm: true,
    app_metadata: { d1_id: r.id, role: r.role_plateforme || 'membre' },
    user_metadata: { prenom: r.prenom ?? null, nom: r.nom ?? null, full_name: `${r.prenom ?? ''} ${r.nom ?? ''}`.trim() },
    ...(hasBcrypt ? { password_hash: r.password_hash } : {}),
  }

  if (!apply) {
    console.log(`+ (simulation) ${email}  role=${payload.app_metadata.role}  mot de passe importé=${hasBcrypt}`)
    stats.created++; if (hasBcrypt) stats.withPassword++
    continue
  }

  const { error } = await admin.auth.admin.createUser(payload)
  if (error) { stats.errors++; console.error(`! ${email}: ${error.message}`); continue }
  stats.created++
  if (hasBcrypt) stats.withPassword++

  if (invite && !hasBcrypt) {
    const { error: e2 } = await admin.auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl}/auth/callback?next=/reset-password` })
    if (e2) console.error(`! invitation ${email}: ${e2.message}`)
    else stats.invited++
  }
}

console.log(`\n${apply ? 'IMPORT' : 'SIMULATION'} terminé :`, stats)
