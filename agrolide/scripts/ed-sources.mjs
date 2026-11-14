#!/usr/bin/env node
/**
 * Vérification des sources d'un article : lancé par `npm run ed:sources`.
 *
 *   node scripts/ed-sources.mjs <slug|fichier> [...]     un ou plusieurs articles
 *   node scripts/ed-sources.mjs --tous                   tous les articles de editorial/articles/
 * Options :
 *   --hors-ligne   ne teste aucun lien web (les autres contrôles tournent)
 *   --strict       l'absence de l'index de la bibliothèque devient une erreur
 *   --json         sortie lisible par machine
 *
 * Contrôles :
 *  1. Liens web : chaque adresse http(s) répond (2xx ou 3xx). 400, 401, 403, 429 (accès automatique refusé) : avertissement.
 *     404, 410, 5xx, délai dépassé : erreur.
 *  2. Identifiants DOC-xxxxx (en-tête et texte) : présents dans INDEX.csv du corpus classé, décision « public » ou « membres ».
 *     Un document archivé, à valider ou exclu ne se cite ni ne se lie (charte/04-lignes-rouges.md).
 *  3. Liens internes : la première partie du chemin est une route du site. Les liens /bibliotheque/<id> sont signalés
 *     comme non vérifiables hors base (D1), avec la requête SELECT de contrôle à lancer.
 *  4. Chiffres : chaque section qui contient un chiffre (pourcentage, montant, quantité) nomme une source du bloc final
 *     ou annonce un exemple fictif. Heuristique : elle ne remplace pas la vérification des faits.
 * Ce script ne dit pas qu'une source est « vérifiée » (lue à la source) : c'est le travail du rédacteur et du vérificateur.
 */
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  analyserCorps, appRoot, chargerIndexBibliotheque, DECISIONS_PUBLIEES, edDir, lireContenu, relApp, resoudreArticle,
} from './lib/ed-commun.mjs'

const FICTIF = /fictif|fictive|hypoth[èe]se|exemple|simulation|cas p[ée]dagogique|à remplacer|illustratif|série de démonstration/i
const CHIFFRE = /\d(?:[\d\s  .,]*\d)?\s*(?:%|FCFA|F CFA|€|USD|\$|millions?|milliards?|kg|tonnes?|t\b|ha\b|m²)/giu

/** Routes de premier niveau du site (dossiers de src/app, groupes entre parenthèses aplatis). */
function routesDuSite() {
  const routes = new Set()
  const racine = join(appRoot, 'src', 'app')
  for (const d of readdirSync(racine, { withFileTypes: true })) {
    if (!d.isDirectory()) continue
    if (d.name.startsWith('(')) {
      for (const s of readdirSync(join(racine, d.name), { withFileTypes: true })) if (s.isDirectory() && !s.name.startsWith('[')) routes.add(s.name)
    } else routes.add(d.name)
  }
  return routes
}

/** Adresses web du texte : liens Markdown et adresses nues. */
export function extraireUrls(texte) {
  const urls = new Set()
  for (const m of texte.matchAll(/https?:\/\/[^\s)\]>"']+/g)) urls.add(m[0].replace(/[.,;:]+$/, ''))
  return [...urls]
}

export async function testerLien(url, delai = 15000) {
  const essai = async (methode) => {
    const r = await fetch(url, {
      method: methode,
      redirect: 'follow',
      signal: AbortSignal.timeout(delai),
      headers: { 'user-agent': 'agrolide-ed-sources/1.0 (contrôle de liens éditoriaux)', accept: 'text/html,application/pdf,*/*' },
    })
    r.body?.cancel?.().catch(() => {})
    return r.status
  }
  try {
    let s = await essai('HEAD')
    if (s === 405 || s === 403 || s === 400 || s === 501) s = await essai('GET')
    return { url, statut: s }
  } catch (err) {
    try {
      return { url, statut: await essai('GET') }
    } catch (err2) {
      return { url, statut: 0, raison: err2?.cause?.code ?? err2?.name ?? 'erreur réseau' }
    }
  }
}

async function enParallele(items, n, fn) {
  const sortie = []
  let i = 0
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; sortie[k] = await fn(items[k]) }
  }))
  return sortie
}

/** Noms de sources du bloc final : mots capitalisés (organisation, auteur, module) avant le titre cité. */
function nomsDeSources(bloc) {
  const noms = new Set()
  for (const item of bloc.split('\n').filter((l) => /^\s*(?:[-*]|\d+\.)\s/.test(l))) {
    const avant = item.replace(/^\s*(?:[-*]|\d+\.)\s*/, '').split(/«|\[|https?:/)[0]
    for (const m of avant.matchAll(/(?<![\p{L}])[\p{Lu}][\p{L}'’]{2,}/gu)) noms.add(m[0])
    for (const m of avant.matchAll(/(?<![\p{L}])[a-zà-ÿ]{3,}(?=\b)/giu)) if (/^agrolide$/i.test(m[0])) noms.add(m[0])
  }
  return noms
}

/** Découpe le texte (hors sources) en sections délimitées par les intertitres. */
function sections(avant) {
  const out = []
  let cur = { titre: '(introduction)', texte: '' }
  for (const p of avant.split(/\n{2,}/)) {
    if (/^## /.test(p.trim())) { out.push(cur); cur = { titre: p.trim().replace(/^## /, ''), texte: '' } } else cur.texte += `${p}\n\n`
  }
  out.push(cur)
  return out
}

export async function verifierSources(chemin, { horsLigne = false, strict = false, indexOverride } = {}) {
  const c = lireContenu(chemin)
  const erreurs = []
  const avertissements = []
  const e = (id, msg) => erreurs.push({ id, msg })
  const w = (id, msg) => avertissements.push({ id, msg })
  const a = analyserCorps(c.corps)
  const tout = c.brut

  // 1. Liens web
  const urls = extraireUrls(c.corps)
  if (!horsLigne) {
    const res = await enParallele(urls, 5, (u) => testerLien(u))
    for (const r of res) {
      if (r.statut >= 200 && r.statut < 400) continue
      if ([400, 401, 403, 429, 999].includes(r.statut)) w('lien-acces-refuse', `${r.url} : réponse ${r.statut}, souvent un refus d'accès automatique (le script ne se fait pas passer pour un navigateur). À ouvrir à la main`)
      else e('lien-mort', `${r.url} : ${r.statut ? `réponse ${r.statut}` : r.raison}`)
    }
  }

  // 2. Identifiants DOC-xxxxx
  const ids = [...new Set(tout.match(/DOC-\d{5}/g) ?? [])]
  const index = indexOverride ?? chargerIndexBibliotheque()
  if (ids.length) {
    if (!index) (strict ? e : w)('index-introuvable', 'INDEX.csv du corpus classé introuvable sur cette machine : identifiants DOC non vérifiés (variable AGROLIDE_INDEX_CSV pour indiquer son chemin)')
    else {
      for (const id of ids) {
        const d = index.docs.get(id)
        if (!d) e('doc-inconnu', `${id} absent de l'index de la bibliothèque`)
        else if (!DECISIONS_PUBLIEES.includes(d.decision_finale)) e('doc-non-publie', `${id} (« ${d.titre.slice(0, 60)} ») a la décision « ${d.decision_finale} » : seuls public et membres se citent ou se lient`)
        else if (d.decision_finale === 'membres' && c.entete?.cta_cible === id) w('doc-membres-cta', `${id} est réservé aux inscrits : le CTA doit porter la mention « réservé aux inscrits »`)
      }
    }
  }

  // 3. Liens internes
  const internes = [...new Set([...(c.corps.matchAll(/\[[^\]]+ → (\/[^\]\s]+)\]/g)), ...(c.corps.matchAll(/\]\((\/[^)\s]+)\)/g))].map((m) => m[1]))]
  const routes = routesDuSite()
  const uuids = []
  const provisoires = []
  for (const l of internes) {
    const premier = l.split(/[/?#]/)[1]
    if (!premier || !routes.has(premier)) e('lien-interne-inconnu', `${l} : « ${premier} » n'est pas une route du site`)
    const m = l.match(/^\/bibliotheque\/([0-9a-f-]{36})/)
    const prov = l.match(/^\/bibliotheque\/(DOC-\d{5})(?![\d])/)
    if (m) uuids.push(m[1])
    else if (prov) provisoires.push(prov[1])
    else if (l.startsWith('/bibliotheque/')) e('lien-bibliotheque', `${l} : l'adresse d'un document est /bibliotheque/<identifiant base> (ou /bibliotheque/DOC-xxxxx en lien provisoire), rien d'autre`)
  }
  if (provisoires.length) {
    const msg = `lien provisoire /bibliotheque/${provisoires.join(', /bibliotheque/')} : le site n'ouvre un document que par son identifiant base. Récupérer les identifiants : npx wrangler d1 execute agrolide-d1 --remote --command "SELECT id, reference FROM documents WHERE reference IN (${provisoires.map((u) => `'${u}'`).join(', ')})" puis remplacer chaque DOC-xxxxx dans les liens`
    if (['valide', 'publie'].includes(c.entete?.statut)) e('lien-provisoire', `${msg}. Interdit au statut ${c.entete.statut}`)
    else w('lien-provisoire', msg)
  }
  if (uuids.length)
    w('documents-non-verifiables', `${uuids.length} lien(s) /bibliotheque/<id> non vérifiable(s) hors base. À contrôler : npx wrangler d1 execute agrolide-d1 --remote --command "SELECT id, reference, statut, acces FROM documents WHERE id IN (${uuids.map((u) => `'${u}'`).join(', ')})" (statut publie attendu)`)

  // 4. Chiffres rattachés à une source
  const noms = nomsDeSources(a.sources)
  for (const s of sections(a.avant)) {
    const chiffres = [...s.texte.matchAll(CHIFFRE)].map((m) => m[0].trim())
    if (!chiffres.length) continue
    const nomme = [...noms].some((n) => new RegExp(`(?<![\\p{L}])${n}(?![\\p{L}])`, 'u').test(s.texte))
    const fictif = FICTIF.test(s.texte)
    if (!nomme && !fictif)
      e('chiffre-sans-source', `section « ${s.titre} » : « ${chiffres.slice(0, 3).join(' | ')} » sans source nommée (celles du bloc final : ${[...noms].slice(0, 6).join(', ') || 'aucune'}) ni mention d'exemple fictif`)
  }

  return { fichier: relApp(chemin), erreurs, avertissements, liens: urls.length, documents: ids.length }
}

function tousLesArticles() {
  const dir = join(edDir, 'articles')
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => join(dir, d.name, '02-article.md'))
    .filter(existsSync)
}

async function main() {
  const args = process.argv.slice(2)
  const cibles = args.includes('--tous') ? tousLesArticles() : args.filter((x) => !x.startsWith('--')).map(resoudreArticle)
  if (!cibles.length) {
    console.error('Usage : node scripts/ed-sources.mjs <slug|fichier> [...] | --tous [--hors-ligne] [--strict] [--json]')
    process.exit(2)
  }
  const opts = { horsLigne: args.includes('--hors-ligne'), strict: args.includes('--strict') }
  const res = []
  for (const f of cibles) res.push(await verifierSources(f, opts))
  if (args.includes('--json')) console.log(JSON.stringify(res, null, 2))
  else {
    for (const r of res) {
      console.log(`\n${r.fichier} : ${r.liens} lien(s) web, ${r.documents} identifiant(s) DOC. ${r.erreurs.length} erreur(s), ${r.avertissements.length} avertissement(s)`)
      for (const x of r.erreurs) console.log(`  [ERREUR] ${x.id} : ${x.msg}`)
      for (const x of r.avertissements) console.log(`  [avertissement] ${x.id} : ${x.msg}`)
    }
    console.log(`\nBilan : ${res.reduce((s, r) => s + r.erreurs.length, 0)} erreur(s).${opts.horsLigne ? ' (liens web non testés : option --hors-ligne)' : ''}`)
  }
  if (res.some((r) => r.erreurs.length)) process.exit(1)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
