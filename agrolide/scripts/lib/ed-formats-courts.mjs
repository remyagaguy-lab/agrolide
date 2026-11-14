/**
 * Règles des formats courts (posts par canal, fiche technique, newsletter), lues par ed:valider.
 * Source des règles : charte/11-formats.md et charte/12-canaux.md. Les limites chiffrées marquées « proposition » ne sont pas
 * dans la charte : elles sont à valider par Remyaga (voir charte/00-decisions.md) et se règlent ici, à un seul endroit.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { compterMots, edDir, lireContenu, PUBLICS, REGISTRES_PAR_PUBLIC, VERBES_CTA } from './ed-commun.mjs'

export const FORMATS = ['post', 'fiche', 'newsletter']
export const BASE_SITE = 'https://agrolide.org'

/** Registres permis par canal (12-canaux.md). */
export const CANAUX = {
  whatsapp: { registres: ['Terrain'], mots: [20, 120], hashtags: 0, emojis: 2 },
  facebook: { registres: ['Terrain', 'Parcours'], mots: [50, 180], hashtags: 3, emojis: 3 },
  instagram: { registres: ['Terrain', 'Parcours'], mots: [40, 150], hashtags: 15, emojis: 3 },
  tiktok: { registres: ['Terrain', 'Parcours'], mots: [40, 150], hashtags: 5, emojis: 3, sections: ['Accroche', 'Script', 'Légende'] },
  youtube: { registres: ['Terrain', 'Parcours', 'Expertise'], mots: [80, 250], hashtags: 5, emojis: 3, titreMax: 70 },
  linkedin: { registres: ['Expertise', 'Partenariat', 'Parcours'], mots: [100, 260], hashtags: 3, emojis: 3, accrocheMax: 140 },
  newsletter: { registres: ['Terrain', 'Parcours', 'Expertise', 'Partenariat'], mots: [150, 450], hashtags: 0, emojis: 0 },
  site: { registres: ['Terrain', 'Parcours'], mots: [400, 600], hashtags: 0, emojis: 0 },
}
/** Fichier attendu par canal dans declinaisons/<slug>/ */
export const FICHIERS_JEU = {
  'post-whatsapp.md': 'whatsapp', 'post-facebook.md': 'facebook', 'post-instagram.md': 'instagram', 'post-tiktok.md': 'tiktok',
  'post-youtube.md': 'youtube', 'post-linkedin.md': 'linkedin', 'fiche-technique.md': 'site', 'newsletter.md': 'newsletter',
}

const CHAMPS = ['format', 'canal', 'source', 'statut', 'public', 'registre', 'objectif', 'cta', 'cta_cible', 'validation_technique']
const EMOJI = /\p{Extended_Pictographic}/gu
const CHIFFRE = /\d(?:[\d\s  .,]*\d)?\s*(?:%|FCFA|F CFA|€|USD|\$|millions?|milliards?|kg|tonnes?|t\b|ha\b|m²)/giu
const norm = (s) => s.toLowerCase().replace(/[\s  ]/g, '').replace(',', '.')
const mots = (t) => (t.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])

/** Plus longue suite de mots identique entre deux textes. */
export function plusLongueSuiteCommune(a, b) {
  const x = mots(a)
  const y = mots(b)
  let best = 0
  let prev = new Array(y.length + 1).fill(0)
  for (let i = 1; i <= x.length; i++) {
    const cur = new Array(y.length + 1).fill(0)
    for (let j = 1; j <= y.length; j++) if (x[i - 1] === y[j - 1]) { cur[j] = prev[j - 1] + 1; if (cur[j] > best) best = cur[j] }
    prev = cur
  }
  return best
}

export function validerCourt(c, chemin, erreurs, avertissements) {
  const { entete, corps } = c
  const e = (id, msg) => erreurs.push({ id, msg, ligne: 1 })
  const w = (id, msg) => avertissements.push({ id, msg, ligne: 1 })
  for (const k of CHAMPS) if (!entete[k]) e('champ-manquant', `champ « ${k} » absent ou vide`)
  if (!FORMATS.includes(entete.format)) return e('format-invalide', `format « ${entete.format} » : attendu ${FORMATS.join(' | ')}`)
  const canal = CANAUX[entete.canal]
  if (!canal) return e('canal-invalide', `canal « ${entete.canal} » : attendu ${Object.keys(CANAUX).join(' | ')}`)
  if (!['redaction', 'valide', 'publie'].includes(entete.statut)) e('statut-invalide', `statut « ${entete.statut} » : redaction | valide | publie`)
  if (!(entete.public in PUBLICS)) e('public-invalide', `public « ${entete.public} » inconnu`)
  if (!canal.registres.includes(entete.registre)) e('registre-canal', `le canal ${entete.canal} accepte les registres ${canal.registres.join(', ')} (12-canaux.md), pas ${entete.registre}`)
  else if (entete.public in PUBLICS && !REGISTRES_PAR_PUBLIC[entete.public].includes(entete.registre)) e('registre-public', `le public ${entete.public} relève du registre ${REGISTRES_PAR_PUBLIC[entete.public].join(' ou ')}`)
  if (!/^(a faire|à faire|non requise|faite par .+)(?: \(.+\))?$/.test(entete.validation_technique ?? '')) e('validation-invalide', 'validation_technique : « a faire », « non requise » ou « faite par <nom> »')
  if (entete.format === 'fiche' && entete.statut !== 'redaction' && /^(a|à) faire/.test(entete.validation_technique ?? '')) e('fiche-sans-validation', 'une fiche technique est validée par un référent avant de passer au statut valide ou publie (11-formats.md)')
  if (entete.statut === 'publie' && /^(a|à) faire/.test(entete.validation_technique ?? '')) e('publie-sans-validation', 'publié sans validation technique')

  // Source : l'article dont le contenu est décliné
  const srcFile = join(edDir, 'articles', entete.source ?? '', '02-article.md')
  const source = existsSync(srcFile) ? lireContenu(srcFile) : null
  if (!source) e('source-introuvable', `l'article source « ${entete.source} » n'existe pas dans articles/`)

  const lignes = corps.trim().split('\n')
  const lienAttendu = entete.format === 'post' || entete.format === 'newsletter' ? `${BASE_SITE}/blog/${entete.source}` : null
  const lienLigne = lignes.find((l) => /^Lien\s:/.test(l))
  const sansLien = lignes.filter((l) => !/^Lien\s:/.test(l)).join('\n')
  if (entete.format === 'post') {
    if (entete.cta_cible !== `/blog/${entete.source}`) e('cta-cible', `un post renvoie vers le contenu source : cta_cible doit valoir /blog/${entete.source}`)
    if (!lienLigne || !lienLigne.includes(lienAttendu)) e('lien-source', `ligne « Lien : ${lienAttendu} » absente : un post renvoie vers le contenu source`)
  }
  const texte = sansLien.replace(/^#+\s.*$/gm, (m) => m.replace(/^#+\s/, '')).trim()

  const n = compterMots(texte)
  const [min, max] = canal.mots
  if (n < min || n > max) e('longueur', `${n} mots : ${entete.format === 'fiche' ? 'la fiche' : `le canal ${entete.canal}`} demande ${min} à ${max} mots (proposition à valider, charte/00-decisions.md)`)
  const nbHash = (texte.match(/(?<![\p{L}\p{N}&])#[\p{L}\p{N}_]+/gu) ?? []).length
  if (nbHash > canal.hashtags) e('hashtags', `${nbHash} hashtag(s) : ${canal.hashtags} au plus pour ${entete.canal}`)
  const emojis = texte.match(EMOJI) ?? []
  if (emojis.length > canal.emojis) e('emojis', `${emojis.length} emoji(s) : ${canal.emojis} au plus pour ${entete.canal} (de 1 à 3 sur un réseau social, aucun ailleurs)`)
  if (/\p{Extended_Pictographic}[\s\uFE0F]*\p{Extended_Pictographic}/u.test(texte)) e('emojis-en-serie', 'emojis en série : jamais accolés')
  if (canal.emojis > 0 && entete.format === 'post' && emojis.length === 0) w('aucun-emoji', 'aucun emoji : permis (1 à 3), jamais obligatoire')

  // CTA unique
  const cta = entete.cta
  if (cta) {
    const paras = texte.split(/\n{2,}/)
    const k = paras.filter((p) => p.includes(cta)).length
    if (k === 0) e('cta-absent', 'le texte du champ « cta » n\'apparaît pas')
    else if (k > 1) e('cta-multiple', `le CTA apparaît dans ${k} paragraphes : un seul`)
    const verbes = new RegExp(`(?:^|[.!?]\\s+|\\n)(?:${VERBES_CTA.join('|')})\\b`, 'g')
    const autres = paras.filter((p) => !p.includes(cta)).filter((p) => verbes.test(p))
    if (autres.length) e('cta-second', `second appel à l'action : « ${autres[0].slice(0, 60)}… »`)
  }

  // Structure propre à chaque canal ou format
  if (entete.canal === 'tiktok') for (const s of canal.sections) if (!new RegExp(`^##\\s+${s}\\s*$`, 'm').test(corps)) e('section-manquante', `section « ## ${s} » absente`)
  if (entete.canal === 'youtube') {
    const titre = corps.match(/^#\s+(.+)$/m)?.[1]
    if (!titre) e('titre-absent', 'titre de la vidéo : une ligne « # Titre »')
    else if (titre.length > canal.titreMax) e('titre-long', `titre de ${titre.length} caractères : ${canal.titreMax} au plus`)
    if (!/(?:linkedin|facebook|instagram|tiktok|whatsapp)/i.test(lignes.slice(-6).join(' '))) w('liens-reseaux', 'fin de description : liens vers les autres réseaux (12-canaux.md)')
  }
  if (entete.canal === 'linkedin') {
    const accroche = texte.split('\n').find((l) => l.trim() && !/^#/.test(l)) ?? ''
    if (accroche.length > canal.accrocheMax) e('accroche', `première ligne de ${accroche.length} caractères : ${canal.accrocheMax} au plus, l'accroche se lit avant « voir plus »`)
  }
  if (entete.format === 'fiche') {
    if (!/^##\s+À retenir\s*$/m.test(corps)) e('a-retenir', 'encart « ## À retenir » absent (11-formats.md)')
    const etapes = (corps.match(/^\s*\d+\.\s/gm) ?? []).length
    if (etapes < 3) e('pas-a-pas', `${etapes} étape(s) numérotée(s) : une fiche est un pas à pas (3 au moins)`)
    if (!/\n\s*(Sources|D'où ça vient)\s:\s*\n/.test(corps)) e('sources-absentes', 'bloc final « Sources : » ou « D\'où ça vient : » absent')
    if (/^non requise/.test(entete.validation_technique ?? '')) w('validation-fiche', 'une fiche technique relève d\'un référent : « non requise » est rarement juste')
  }
  if (entete.format === 'newsletter') {
    if (!/^##\s+/m.test(corps)) w('structure', 'aucun intertitre : une newsletter alterne édito et deux ou trois rubriques courtes')
    if (!lienLigne && !/https?:\/\//.test(corps)) e('lien-source', 'aucun lien : la newsletter renvoie vers le contenu source')
  }

  // Réécrire, ne pas raccourcir, ne rien inventer
  if (source) {
    // Le bloc de sources et les titres cités se recopient tels quels : ce sont des références, pas du texte.
    // Le texte du CTA est repris à l'identique de l'en-tête : il n'entre pas dans la comparaison.
    const epure = (t) => {
      let r = t.split(/\n\s*(?:Sources|D'où ça vient)\s:\s*\n/)[0].replace(/«[^»]*»/g, ' ').replace(/\[[^\]]*\]\([^)]*\)|\[[^\]\n]* → [^\]\n]*\]/g, ' ')
      for (const x of [entete.cta, source.entete?.cta]) if (x) r = r.split(x).join(' ')
      return r
    }
    const commun = plusLongueSuiteCommune(epure(texte), epure(source.corps))
    if (commun > 12) e('copie-de-la-source', `suite de ${commun} mots identique à l'article source : on réécrit pour le canal, on ne copie pas (06-publics-et-registres.md, règle 3)`)
    const base = norm(source.corps)
    for (const m of new Set((texte.match(CHIFFRE) ?? []).map((x) => norm(x)))) if (!base.includes(m)) e('chiffre-hors-source', `le chiffre « ${m} » ne figure pas dans l'article source : un contenu décliné ne crée aucun chiffre`)
    if (source.entete?.registre === 'Terrain' && entete.registre === 'Expertise') w('registre-derive', 'registre plus technique que la source : on réécrit, mais la source doit porter les preuves')
  }
}
