// Génère une paire de clés VAPID (Web Push). À lancer UNE FOIS, sur votre poste :
//   node scripts/vapid-generer.mjs
// Puis copier les deux valeurs dans les variables d'environnement de Vercel (Settings → Environment Variables).
// Ne jamais les mettre dans le dépôt. Changer de clés invalide tous les abonnements existants.
import { createECDH } from 'node:crypto'

const ecdh = createECDH('prime256v1')
ecdh.generateKeys()
console.log('VAPID_PUBLIC_KEY=' + ecdh.getPublicKey().toString('base64url'))
console.log('VAPID_PRIVATE_KEY=' + ecdh.getPrivateKey().toString('base64url'))
console.log('VAPID_SUBJECT=mailto:contact@agrolide.org')
