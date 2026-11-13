/**
 * Web Push sans dépendance : chiffrement du message (RFC 8291, « aes128gcm ») et signature VAPID (RFC 8292),
 * avec le seul module `node:crypto`. Aucun accès base ici : ce fichier est testable seul.
 *
 * Les clés VAPID viennent des variables d'environnement (jamais du dépôt) : voir `scripts/vapid-generer.mjs`.
 */
import { type ECDH, createCipheriv, createECDH, createPrivateKey, createPublicKey, hkdfSync, randomBytes, sign, verify } from 'node:crypto'

export interface AbonnementPush {
  endpoint: string
  p256dh: string // clé publique du navigateur (65 octets, base64url)
  auth: string // secret d'authentification (16 octets, base64url)
}

export interface ClesVapid {
  publique: string // 65 octets non compressés, base64url
  privee: string // 32 octets, base64url
  sujet: string // « mailto:… » ou URL https
}

export interface ResultatEnvoi {
  ok: boolean
  statut: number
  /** 404 et 410 : l'abonnement n'existe plus chez le service de push, il faut le supprimer. */
  perime: boolean
}

const b64u = (b: Buffer | Uint8Array) => Buffer.from(b).toString('base64url')
const deB64u = (s: string) => Buffer.from(s, 'base64url')

/** Services de push connus : le serveur ne contacte jamais une adresse choisie librement par un client (SSRF). */
const HOTES_AUTORISES = [
  /(^|\.)fcm\.googleapis\.com$/,
  /(^|\.)push\.services\.mozilla\.com$/,
  /(^|\.)notify\.windows\.com$/,
  /(^|\.)push\.apple\.com$/,
]
export function endpointAutorise(endpoint: string): boolean {
  try {
    const u = new URL(endpoint)
    return u.protocol === 'https:' && !u.port && HOTES_AUTORISES.some((r) => r.test(u.hostname)) && endpoint.length <= 600
  } catch {
    return false
  }
}

/** Les clés VAPID du serveur, ou `null` si elles ne sont pas (bien) configurées. */
export function clesVapid(env: Record<string, string | undefined> = process.env): ClesVapid | null {
  const publique = env.VAPID_PUBLIC_KEY?.trim()
  const privee = env.VAPID_PRIVATE_KEY?.trim()
  if (!publique || !privee) return null
  if (deB64u(publique).length !== 65 || deB64u(privee).length !== 32) return null
  return { publique, privee, sujet: env.VAPID_SUBJECT?.trim() || 'mailto:contact@agrolide.org' }
}

function cleSignature(cles: ClesVapid) {
  const pub = deB64u(cles.publique)
  return createPrivateKey({
    key: { kty: 'EC', crv: 'P-256', d: cles.privee, x: b64u(pub.subarray(1, 33)), y: b64u(pub.subarray(33, 65)) },
    format: 'jwk',
  })
}

/** En-tête `Authorization` VAPID pour un service de push donné (valable 12 h). */
export function enteteVapid(endpoint: string, cles: ClesVapid, maintenant = Date.now()): string {
  const audience = new URL(endpoint).origin
  const entete = b64u(Buffer.from(JSON.stringify({ typ: 'JWT', alg: 'ES256' })))
  const corps = b64u(Buffer.from(JSON.stringify({ aud: audience, exp: Math.floor(maintenant / 1000) + 12 * 3600, sub: cles.sujet })))
  const signature = sign('sha256', Buffer.from(`${entete}.${corps}`), { key: cleSignature(cles), dsaEncoding: 'ieee-p1363' })
  return `vapid t=${entete}.${corps}.${b64u(signature)}, k=${cles.publique}`
}

/** Vérifie la signature d'un jeton VAPID (utilisé par les tests). */
export function jetonVapidValide(jeton: string, cles: ClesVapid): boolean {
  const [e, c, s] = jeton.split('.')
  if (!e || !c || !s) return false
  const pub = deB64u(cles.publique)
  const cle = createPublicKey({ key: { kty: 'EC', crv: 'P-256', x: b64u(pub.subarray(1, 33)), y: b64u(pub.subarray(33, 65)) }, format: 'jwk' })
  return verify('sha256', Buffer.from(`${e}.${c}`), { key: cle, dsaEncoding: 'ieee-p1363' }, deB64u(s))
}

/** Chiffre `message` pour l'abonnement (RFC 8291). Le corps renvoyé contient en-tête, sel, clé éphémère et contenu. */
export function chiffrer(message: Buffer, abonnement: Pick<AbonnementPush, 'p256dh' | 'auth'>, sel = randomBytes(16), ephemere?: ECDH): Buffer {
  if (!ephemere) {
    ephemere = createECDH('prime256v1')
    ephemere.generateKeys()
  }
  const clePubliqueNavigateur = deB64u(abonnement.p256dh)
  const secretAuth = deB64u(abonnement.auth)
  const clePubliqueServeur = ephemere.getPublicKey()
  const secretPartage = ephemere.computeSecret(clePubliqueNavigateur)

  const ikm = Buffer.from(
    hkdfSync('sha256', secretPartage, secretAuth, Buffer.concat([Buffer.from('WebPush: info\0'), clePubliqueNavigateur, clePubliqueServeur]), 32),
  )
  const cek = Buffer.from(hkdfSync('sha256', ikm, sel, Buffer.from('Content-Encoding: aes128gcm\0'), 16))
  const nonce = Buffer.from(hkdfSync('sha256', ikm, sel, Buffer.from('Content-Encoding: nonce\0'), 12))

  const chiffre = createCipheriv('aes-128-gcm', cek, nonce)
  // 0x02 : délimiteur du dernier (et unique) enregistrement.
  const contenu = Buffer.concat([chiffre.update(Buffer.concat([message, Buffer.from([2])])), chiffre.final(), chiffre.getAuthTag()])

  const tailleEnregistrement = Buffer.alloc(4)
  tailleEnregistrement.writeUInt32BE(4096)
  return Buffer.concat([sel, tailleEnregistrement, Buffer.from([clePubliqueServeur.length]), clePubliqueServeur, contenu])
}

/** Envoie un message (JSON) à un abonnement. Ne lève jamais d'erreur : le résultat dit s'il faut purger l'abonnement. */
export async function envoyerWebPush(
  abonnement: AbonnementPush,
  charge: object,
  cles: ClesVapid,
  options: { ttlSecondes?: number; urgence?: 'very-low' | 'low' | 'normal' | 'high'; sujet?: string } = {},
): Promise<ResultatEnvoi> {
  if (!endpointAutorise(abonnement.endpoint)) return { ok: false, statut: 0, perime: true }
  try {
    const reponse = await fetch(abonnement.endpoint, {
      method: 'POST',
      headers: {
        Authorization: enteteVapid(abonnement.endpoint, cles),
        'Content-Encoding': 'aes128gcm',
        'Content-Type': 'application/octet-stream',
        TTL: String(options.ttlSecondes ?? 24 * 3600),
        Urgency: options.urgence ?? 'normal',
      },
      body: new Uint8Array(chiffrer(Buffer.from(JSON.stringify(charge)), abonnement)),
      signal: AbortSignal.timeout(8000),
      redirect: 'error',
    })
    return { ok: reponse.ok, statut: reponse.status, perime: reponse.status === 404 || reponse.status === 410 }
  } catch {
    return { ok: false, statut: 0, perime: false }
  }
}
