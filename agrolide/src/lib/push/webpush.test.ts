import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createDecipheriv, createECDH, hkdfSync, randomBytes } from 'node:crypto'
import { chiffrer, clesVapid, endpointAutorise, enteteVapid, jetonVapidValide } from './webpush'

const b64u = (b: Buffer) => b.toString('base64url')

/** Déchiffrement côté navigateur (RFC 8291 §4), écrit séparément du chiffrement pour le contrôler. */
function dechiffrer(corps: Buffer, navigateur: ReturnType<typeof createECDH>, secretAuth: Buffer): Buffer {
  const sel = corps.subarray(0, 16)
  const tailleId = corps[20]
  const clePubliqueServeur = corps.subarray(21, 21 + tailleId)
  const contenu = corps.subarray(21 + tailleId)
  const secretPartage = navigateur.computeSecret(clePubliqueServeur)
  const ikm = Buffer.from(
    hkdfSync('sha256', secretPartage, secretAuth, Buffer.concat([Buffer.from('WebPush: info\0'), navigateur.getPublicKey(), clePubliqueServeur]), 32),
  )
  const cek = Buffer.from(hkdfSync('sha256', ikm, sel, Buffer.from('Content-Encoding: aes128gcm\0'), 16))
  const nonce = Buffer.from(hkdfSync('sha256', ikm, sel, Buffer.from('Content-Encoding: nonce\0'), 12))
  const d = createDecipheriv('aes-128-gcm', cek, nonce)
  d.setAuthTag(contenu.subarray(contenu.length - 16))
  const clair = Buffer.concat([d.update(contenu.subarray(0, contenu.length - 16)), d.final()])
  assert.equal(clair[clair.length - 1], 2, 'délimiteur du dernier enregistrement')
  return clair.subarray(0, clair.length - 1)
}

function nouvelAbonne() {
  const navigateur = createECDH('prime256v1')
  navigateur.generateKeys()
  const secretAuth = randomBytes(16)
  return { navigateur, secretAuth, abonnement: { p256dh: b64u(navigateur.getPublicKey()), auth: b64u(secretAuth) } }
}

test('le message chiffré se déchiffre côté navigateur', () => {
  const { navigateur, secretAuth, abonnement } = nouvelAbonne()
  const message = Buffer.from(JSON.stringify({ titre: 'Réseau', corps: 'Aïssatou vous a invité(e) à vous connecter.', lien: '/membres/reseau' }))
  const corps = chiffrer(message, abonnement)
  assert.equal(corps.readUInt32BE(16), 4096)
  assert.equal(corps[20], 65)
  assert.deepEqual(dechiffrer(corps, navigateur, secretAuth), message)
})

test('deux envois du même message ne donnent jamais le même contenu chiffré', () => {
  const { abonnement } = nouvelAbonne()
  const m = Buffer.from('bonjour')
  assert.notDeepEqual(chiffrer(m, abonnement), chiffrer(m, abonnement))
})

test('un mauvais secret d’authentification est rejeté', () => {
  const { navigateur, abonnement } = nouvelAbonne()
  const corps = chiffrer(Buffer.from('secret'), abonnement)
  assert.throws(() => dechiffrer(corps, navigateur, randomBytes(16)))
})

test('le jeton VAPID est signé par la clé du serveur et cible le bon service de push', () => {
  const ecdh = createECDH('prime256v1')
  ecdh.generateKeys()
  const cles = clesVapid({ VAPID_PUBLIC_KEY: b64u(ecdh.getPublicKey()), VAPID_PRIVATE_KEY: b64u(ecdh.getPrivateKey()) })
  assert.ok(cles)
  const entete = enteteVapid('https://fcm.googleapis.com/fcm/send/abc', cles, 1_800_000_000_000)
  const m = /^vapid t=([\w-]+\.[\w-]+\.[\w-]+), k=([\w-]+)$/.exec(entete)
  assert.ok(m)
  assert.equal(m[2], cles.publique)
  assert.ok(jetonVapidValide(m[1], cles))
  const corps = JSON.parse(Buffer.from(m[1].split('.')[1], 'base64url').toString())
  assert.equal(corps.aud, 'https://fcm.googleapis.com')
  assert.equal(corps.exp, 1_800_000_000 + 12 * 3600)
  assert.equal(corps.sub, 'mailto:contact@agrolide.org')
  // Jeton altéré : refusé.
  const [e, c, sg] = m[1].split('.')
  assert.equal(jetonVapidValide(`${e}.${c}.${(sg[0] === 'A' ? 'B' : 'A') + sg.slice(1)}`, cles), false)
})

test('clés VAPID absentes ou mal formées : pas d’envoi', () => {
  assert.equal(clesVapid({}), null)
  assert.equal(clesVapid({ VAPID_PUBLIC_KEY: 'abc', VAPID_PRIVATE_KEY: 'def' }), null)
})

test('seuls les services de push connus sont contactés', () => {
  assert.ok(endpointAutorise('https://fcm.googleapis.com/fcm/send/xyz'))
  assert.ok(endpointAutorise('https://updates.push.services.mozilla.com/wpush/v2/xyz'))
  assert.ok(endpointAutorise('https://web.push.apple.com/xyz'))
  assert.ok(endpointAutorise('https://wns2-par02p.notify.windows.com/w/?token=x'))
  assert.equal(endpointAutorise('http://fcm.googleapis.com/x'), false)
  assert.equal(endpointAutorise('https://evil.example.com/fcm.googleapis.com'), false)
  assert.equal(endpointAutorise('https://fcm.googleapis.com.evil.com/x'), false)
  assert.equal(endpointAutorise('https://127.0.0.1/x'), false)
  assert.equal(endpointAutorise('https://fcm.googleapis.com:8443/x'), false)
  assert.equal(endpointAutorise('pas une adresse'), false)
})
