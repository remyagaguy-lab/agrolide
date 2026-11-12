// Envoie vers R2 les PDF listés dans manifeste_upload.json (produit par Bibliotheque-Curation/import/generer_import.py).
//
//   node --env-file=.env.local scripts/envoyer-bibliotheque-r2.mjs <manifeste.json>             envoi réel
//   node --env-file=.env.local scripts/envoyer-bibliotheque-r2.mjs <manifeste.json> --verifier  contrôle seulement, n'écrit rien
//
// - Reprend où il s'est arrêté : un fichier déjà présent avec la bonne taille est sauté.
// - Aucun fichier existant n'est écrasé avec un contenu différent : en cas de taille différente, il s'arrête sur ce fichier.
// - Ne supprime jamais rien dans R2.
import fs from 'node:fs'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

const [manifestePath, ...options] = process.argv.slice(2)
const verifierSeulement = options.includes('--verifier')
if (!manifestePath) { console.error('Usage : node --env-file=.env.local scripts/envoyer-bibliotheque-r2.mjs <manifeste.json> [--verifier]'); process.exit(2) }

const { CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env
const bucket = process.env.R2_BUCKET_NAME || 'agrolide-biblio'
if (!CLOUDFLARE_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('Variables manquantes dans .env.local : CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY'); process.exit(2)
}
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
})

const manifeste = JSON.parse(fs.readFileSync(manifestePath, 'utf8'))
console.log(`${manifeste.length} fichiers | bucket « ${bucket} » | ${verifierSeulement ? 'contrôle seulement' : 'envoi'}`)

async function taillePresente(cle) {
  try { return (await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: cle }))).ContentLength }
  catch (e) { if (e.$metadata?.httpStatusCode === 404 || e.name === 'NotFound') return null; throw e }
}

const bilan = { envoyes: 0, dejaLa: 0, manquants: 0, conflits: [], erreurs: [] }

async function traiter(m) {
  const presente = await taillePresente(m.cle)
  if (presente === m.taille) { bilan.dejaLa++; return }
  if (presente !== null) { bilan.conflits.push(`${m.id} : R2 contient ${presente} octets, le fichier local en fait ${m.taille}`); return }
  if (verifierSeulement) { bilan.manquants++; return }
  for (let essai = 1; essai <= 3; essai++) {
    try {
      await s3.send(new PutObjectCommand({ Bucket: bucket, Key: m.cle, Body: fs.readFileSync(m.local), ContentType: 'application/pdf', ContentLength: m.taille }))
      if ((await taillePresente(m.cle)) !== m.taille) throw new Error('taille différente après envoi')
      bilan.envoyes++; return
    } catch (e) {
      if (essai === 3) bilan.erreurs.push(`${m.id} : ${e.message}`)
    }
  }
}

const file = [...manifeste]; let fait = 0
await Promise.all(Array.from({ length: 4 }, async () => {
  while (file.length) {
    await traiter(file.shift()); fait++
    if (fait % 25 === 0 || !file.length) console.log(`  ${fait}/${manifeste.length}`)
  }
}))

console.log('\nBilan :', JSON.stringify({ ...bilan, conflits: bilan.conflits.length, erreurs: bilan.erreurs.length }))
bilan.conflits.forEach((x) => console.log('  CONFLIT', x))
bilan.erreurs.forEach((x) => console.log('  ERREUR', x))
const ok = bilan.conflits.length === 0 && bilan.erreurs.length === 0 && bilan.manquants === 0
console.log(ok ? `OK : les ${manifeste.length} fichiers sont dans R2 avec la bonne taille.` : 'À corriger avant de continuer (voir ci-dessus).')
process.exit(ok ? 0 : 1)
