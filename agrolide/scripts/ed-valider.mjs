#!/usr/bin/env node
/**
 * Validation d'un cadrage ou d'un article : lancé par `npm run ed:valider`.
 *
 *   node scripts/ed-valider.mjs <slug|fichier> [...]     un ou plusieurs contenus
 *   node scripts/ed-valider.mjs --tous                   tous les cadrages et articles de editorial/articles/
 *   Option : --json (sortie lisible par machine)
 *
 * Contrôle ce que `ed:check` ne voit pas : l'en-tête (champs et valeurs autorisées de charte/13-production-et-validation.md)
 * et la structure (longueur du registre, intertitres, chapô, CTA unique, lien interne, sources, typographie, tics d'écriture).
 * Les règles de marque, de tirets, de « je » et de tutoiement restent à `ed:check`.
 * Ce script ne juge ni la clarté ni la justesse du texte : la relecture humaine reste obligatoire.
 */
import { existsSync, readdirSync } from 'node:fs'
import { join, basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  analyserCorps, compterMots, compterPhrases, edDir, lireContenu, lireTaxonomie, relApp, resoudreArticle,
  CATEGORIES, LONGUEURS, NIVEAUX, OBJECTIFS, PILIERS, PUBLICS, REGISTRES, REGISTRES_PAR_PUBLIC, STATUTS_ARTICLE, VERBES_CTA,
} from './lib/ed-commun.mjs'

const CHAMPS = ['statut', 'sujet', 'public', 'registre', 'niveau', 'domaine', 'pilier', 'objectif', 'categorie', 'cta', 'cta_cible', 'documents_lies', 'validation_technique']
const CHAMPS_FACULTATIFS = ['persona']

/** Tics d'écriture de `03-ecriture-naturelle.md` qui se mesurent par motif. */
const TICS = [
  [/n['’]est pas (?:seulement|juste|simplement)\b[^.]*\bc['’]est\b/i, 'construction corrélative « n\'est pas seulement X, c\'est Y »'],
  [/\bce n['’]est pas (?:juste|seulement|simplement|une question)\b/i, 'construction corrélative « ce n\'est pas juste X »'],
  [/\bla vérité, c['’]est\b/i, 'formule de préambule « la vérité, c\'est »'],
  [/\bavouons-le\b/i, 'formule de préambule « avouons-le »'],
  [/\bplus que jamais\b/i, 'formule de préambule « plus que jamais »'],
  [/\ben fin de compte\b/i, 'formule de préambule « en fin de compte »'],
  [/\bcela étant dit\b/i, 'formule de préambule « cela étant dit »'],
  [/\bil est important de noter\b/i, 'formule de préambule « il est important de noter »'],
  [/\bil convient de souligner\b/i, 'formule de préambule « il convient de souligner »'],
  [/\bet si on vous disait que\b/i, 'fausse relance « et si on vous disait que »'],
  [/\b(?:le meilleur|le secret) \?/i, 'fausse relance « le meilleur ? / le secret ? »'],
  [/\bpas de blabla\b/i, 'staccato façon slogan'],
  [/\bdans un monde en\b/i, 'ouverture générique « dans un monde en… »'],
  [/(?:^|[.!?]\s+)À l['’]heure où\b/, 'ouverture générique « à l\'heure où »'],
  [/(?:^|[.!?]\s+)Dans un contexte où\b/, 'ouverture générique « dans un contexte où »'],
  [/\ben pleine mutation\b/i, 'ouverture générique « en pleine mutation »'],
  [/(?:^|\n)\s*En (?:conclusion|résumé)\b/i, '« en conclusion / en résumé » : la conclusion enchaîne vers le CTA'],
]

/** Mots de rapport de `05-promesse-et-voix.md` : erreur hors registre Partenariat, avertissement dans ce registre. */
const MOTS_RAPPORT = [
  /\bmettre? en œuvre\b/i, /\bmise en œuvre\b/i, /\bdéployer\b/i, /\bdéploiement\b/i, /\bdispositifs?\b/i, /\bparties prenantes\b/i,
  /\bécosystèmes?\b/i, /\bsynergies?\b/i, /\bpérenniser\b/i, /\boptimiser\b/i, /\bproblématiques?\b/i, /\bvaloriser\b/i, /à l['’]échelle du continent/i,
]

const EMOJI = /\p{Extended_Pictographic}/u
const RE_LIEN_INTERNE = /^\[(.+?) → (\/[^\]\s]+)\]$/

/** Retire liens, adresses et code pour ne contrôler que la prose. */
const prose = (l) =>
  l
    .replace(/\[([^\]]*?)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*?) → [^\]]*\]/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\b[\w.-]+\.(?:org|com|fr|int)\S*/g, '')
    .replace(/DOC-\d+/g, '')
    .replace(/`[^`]*`/g, '')

/** Un contenu retiré du site est conservé comme exemple : ses écarts restent signalés, sans bloquer. */
const estRetire = (entete) => /^retire(?!\p{L})/u.test(entete?.statut ?? '')

export function validerEntete(entete, type, erreurs, avertissements) {
  const e = (id, msg) => erreurs.push({ id, msg, ligne: 1 })
  const w = (id, msg) => avertissements.push({ id, msg, ligne: 1 })
  if (!entete) return e('entete-absent', 'en-tête introuvable : le fichier doit commencer par un bloc délimité par deux lignes « --- »')
  for (const c of CHAMPS) if (!(c in entete) || entete[c] === '') e('champ-manquant', `champ « ${c} » absent ou vide`)
  for (const c of Object.keys(entete)) if (!CHAMPS.includes(c) && !CHAMPS_FACULTATIFS.includes(c)) w('champ-inconnu', `champ « ${c} » inconnu (valides : ${CHAMPS.join(', ')})`)

  const statuts = type === 'cadrage' ? ['cadrage'] : STATUTS_ARTICLE
  if (entete.statut && !estRetire(entete) && !statuts.includes(entete.statut)) e('statut-invalide', `statut « ${entete.statut} » : attendu ${statuts.join(' | ')}`)
  if (entete.public && !(entete.public in PUBLICS)) e('public-invalide', `public « ${entete.public} » : attendu ${Object.keys(PUBLICS).join(' | ')}`)
  if (entete.registre && !REGISTRES.includes(entete.registre)) e('registre-invalide', `registre « ${entete.registre} » : attendu ${REGISTRES.join(' | ')}`)
  if (entete.niveau && !NIVEAUX.includes(entete.niveau)) e('niveau-invalide', `niveau « ${entete.niveau} » : attendu ${NIVEAUX.join(' | ')}`)
  if (entete.objectif && !OBJECTIFS.includes(entete.objectif)) e('objectif-invalide', `objectif « ${entete.objectif} » : attendu ${OBJECTIFS.join(' | ')}`)
  if (entete.pilier && !PILIERS.includes(entete.pilier)) e('pilier-invalide', `pilier « ${entete.pilier} » : attendu ${PILIERS.join(' | ')}`)
  if (entete.categorie && !CATEGORIES.includes(entete.categorie)) e('categorie-invalide', `catégorie « ${entete.categorie} » : attendu ${CATEGORIES.join(' | ')}`)

  if (entete.domaine) {
    const m = entete.domaine.match(/^([a-z_]+)(?: \(([a-z_]+)\))?$/)
    if (!m) e('domaine-invalide', `domaine « ${entete.domaine} » : écrire « code » ou « code (sous_domaine) », par exemple production_animale (aquaculture_peche)`)
    else {
      const tax = lireTaxonomie()
      if (!tax[m[1]]) e('domaine-invalide', `domaine « ${m[1]} » absent de la taxonomie : ${Object.keys(tax).join(' | ')}`)
      else if (m[2] && !tax[m[1]].includes(m[2])) e('sous-domaine-invalide', `sous-domaine « ${m[2]} » absent du domaine ${m[1]} : ${tax[m[1]].join(' | ')}`)
    }
  }
  if (entete.cta_cible && !/^(DOC-\d{5}|\/[^\s]*)$/.test(entete.cta_cible)) e('cta-cible-invalide', `cta_cible « ${entete.cta_cible} » : un identifiant DOC-xxxxx ou un chemin du site commençant par « / »`)
  if (entete.documents_lies !== undefined) {
    const m = entete.documents_lies.match(/^\[(.*)\]$/)
    if (!m) e('documents-lies-invalide', 'documents_lies : écrire une liste entre crochets, par exemple [DOC-01005, DOC-00459]')
    else {
      const ids = m[1].split(',').map((s) => s.trim()).filter(Boolean)
      for (const id of ids) if (!/^DOC-\d{5}$/.test(id)) e('documents-lies-invalide', `documents_lies : « ${id} » n'est pas un identifiant DOC-xxxxx`)
      if (new Set(ids).size !== ids.length) e('documents-lies-invalide', 'documents_lies : identifiant en double')
      if (!ids.length) w('documents-lies-vide', 'documents_lies vide : la charte demande 1 à 3 documents hébergés à indexer, ou le signaler comme manque dans le cadrage')
      if (ids.length > 5) w('documents-lies-nombreux', 'documents_lies : plus de 5 documents, garder les plus utiles')
      if (/^DOC-/.test(entete.cta_cible ?? '') && !ids.includes(entete.cta_cible)) w('cta-cible-non-lie', 'cta_cible n\'est pas dans documents_lies')
    }
  }
  if (entete.validation_technique && !/^(a faire|à faire|non requise|faite par .+)(?: \(.+\))?$/.test(entete.validation_technique))
    e('validation-invalide', 'validation_technique : « a faire », « non requise » ou « faite par <nom> »')

  if (entete.public in PUBLICS && REGISTRES.includes(entete.registre) && !REGISTRES_PAR_PUBLIC[entete.public].includes(entete.registre))
    e('registre-public', `le public « ${entete.public} » relève du registre ${REGISTRES_PAR_PUBLIC[entete.public].join(' ou ')}, pas de ${entete.registre} (06-publics-et-registres.md)`)
  if (type === 'article' && entete.statut === 'publie' && /^(a|à) faire/.test(entete.validation_technique ?? ''))
    e('publie-sans-validation', 'un contenu ne passe en « publie » qu\'après la validation technique d\'un référent')
  if (type === 'article' && entete.statut === 'valide' && /^(a|à) faire/.test(entete.validation_technique ?? '') && entete.registre !== 'Partenariat')
    w('valide-sans-validation', 'statut « valide » alors que la validation technique est à faire')
}

export function validerCadrage(corps, erreurs, avertissements) {
  const titres = [...corps.matchAll(/^##\s+(\d{1,2})\.\s/gm)].map((m) => Number(m[1]))
  for (let i = 1; i <= 11; i++) if (!titres.includes(i)) erreurs.push({ id: 'cadrage-point-manquant', msg: `point ${i} du cadrage absent (11 points attendus, intertitres « ## ${i}. »)`, ligne: 1 })
  if (/^# .+\n+[\s\S]*?^## Article\b/im.test(corps)) avertissements.push({ id: 'cadrage-article', msg: 'le cadrage ne contient pas l\'article rédigé', ligne: 1 })
}

export function validerArticle(c, erreurs, avertissements) {
  const { entete, corps, lignesEntete } = c
  const e = (id, msg, ligne = 1) => erreurs.push({ id, msg, ligne })
  const w = (id, msg, ligne = 1) => avertissements.push({ id, msg, ligne })
  const a = analyserCorps(corps)
  const reg = entete?.registre

  if (!a.titre) e('titre-absent', 'titre absent : une ligne « # Titre »')
  else if (a.titre.length > 110) w('titre-long', `titre de ${a.titre.length} caractères : viser 110 au plus`)
  if ((corps.match(/^# /gm) ?? []).length > 1) e('titre-multiple', 'plusieurs titres de niveau 1')
  if (/^#{3,}\s/m.test(corps)) w('sous-intertitre', 'intertitre de niveau 3 ou plus : un article de fond tient en deux à quatre intertitres de niveau 2')

  // Longueur du registre
  const mots = compterMots(corps)
  if (LONGUEURS[reg]) {
    const [min, max] = LONGUEURS[reg]
    if (mots < min || mots > max) e('longueur', `${mots} mots : le registre ${reg} demande ${min} à ${max} mots`)
  }

  // Intertitres (deux à quatre)
  if (a.intertitres.length < 2 || a.intertitres.length > 4) e('intertitres', `${a.intertitres.length} intertitre(s) « ## » : le gabarit en demande de deux à quatre`)

  // Chapô : 3 phrases au plus, juste après le titre, ni liste ni intertitre
  const premier = a.paragraphes[0] ?? ''
  if (!a.chapo || /^(#|- |\d+\. |\[)/.test(premier)) e('chapo', 'le chapô (paragraphe de texte juste après le titre) est absent')
  else {
    const n = compterPhrases(a.chapo)
    if (n > 3) e('chapo', `chapô de ${n} phrases : 3 au plus`)
    if (a.chapo.length > 600) w('chapo-long', `chapô de ${a.chapo.length} caractères`)
  }

  // CTA : un seul paragraphe, suivi du lien, dans le dernier tiers
  const cta = entete?.cta
  const iCta = a.paragraphes.reduce((acc, p, i) => (cta && p.includes(cta) ? [...acc, i] : acc), [])
  if (cta) {
    if (iCta.length === 0) e('cta-absent', 'le texte du CTA de l\'en-tête (champ « cta ») n\'apparaît pas dans l\'article')
    else if (iCta.length > 1) e('cta-multiple', `le CTA apparaît dans ${iCta.length} paragraphes : un seul par contenu`)
    else {
      const i = iCta[0]
      const suite = a.paragraphes[i + 1] ?? ''
      const m = suite.match(RE_LIEN_INTERNE)
      const inline = a.paragraphes[i].match(/\]\((\/[^)]+)\)/)
      if (!m && !inline) e('cta-sans-lien', 'le CTA doit être suivi d\'une ligne « [libellé → /chemin] » vers sa destination')
      else {
        const chemin = (m ?? inline)[m ? 2 : 1]
        if (/^DOC-/.test(entete.cta_cible ?? '') && !chemin.startsWith('/bibliotheque/')) e('cta-cible', `cta_cible est un document hébergé : le lien du CTA doit viser /bibliotheque/…, pas ${chemin}`)
        if (entete.cta_cible?.startsWith('/') && chemin !== entete.cta_cible) e('cta-cible', `le lien du CTA (${chemin}) diffère de cta_cible (${entete.cta_cible})`)
      }
      if (i < Math.floor(a.paragraphes.length * 0.6)) e('cta-place', 'le CTA doit conclure l\'article (dernier tiers du texte), la conclusion enchaîne vers lui')
    }
    const autres = a.paragraphes.filter((p, i) => !iCta.includes(i) && !/^#/.test(p) && !RE_LIEN_INTERNE.test(p))
    const verbes = new RegExp(`(?:^|[.!?]\\s+)(?:${VERBES_CTA.join('|')})\\b`)
    autres.forEach((p) => { if (verbes.test(p)) e('cta-second', `second appel à l'action dans le texte : « ${p.slice(0, 70)}… »`) })
  }

  // Lien interne
  const liens = (corps.match(/\[[^\]]+ → \/[^\]\s]+\]/g) ?? []).length + (corps.match(/\]\(\/[^)\s]+\)/g) ?? []).length
  if (liens < 1) e('lien-interne', 'aucun lien interne : au moins un « [texte → /ressource] » ou [texte](/ressource)')

  // Bloc de sources
  if (!a.marqueSources) e('sources-absentes', 'bloc final « D\'où ça vient : » (Terrain) ou « Sources : » absent')
  else if (!/\S/.test(a.sources)) e('sources-vides', 'le bloc de sources est vide')
  else {
    const attendu = reg === 'Terrain' ? "D'où ça vient" : null
    if (attendu && a.marqueSources !== attendu) w('sources-titre', `registre Terrain : le bloc s'intitule « ${attendu} : »`)
    if (reg && reg !== 'Terrain' && a.marqueSources !== 'Sources') w('sources-titre', 'hors Terrain : le bloc s\'intitule « Sources : »')
  }

  // Mise en forme et tics, ligne par ligne
  let fence = false
  corps.split('\n').forEach((raw, i) => {
    const n = lignesEntete + i + 1
    if (/^\s*```/.test(raw)) { fence = !fence; return }
    if (fence) return
    const l = prose(raw)
    const hors = l.replace(/«[^»]*»/g, '«»') // un titre cité garde sa ponctuation d'origine
    if (/\*\*[^*]+\*\*|__[^_]+__/.test(l)) e('gras', 'gras dans le corps du texte : la phrase porte l\'emphase', n)
    if (EMOJI.test(raw)) e('emoji', 'emoji ou pictogramme : aucun dans un article', n)
    if (/^\s*[•▪◦▸►➤✓✔→]/.test(raw)) e('puce-tapee', 'caractère de puce tapé à la main : listes en Markdown simple', n)
    if (/\.\.\./.test(l)) e('ellipse', 'trois points : utiliser le caractère unique « … »', n)
    if (/\d%/.test(l)) e('pourcent', 'espace avant le pourcentage : « 30 à 40 % »', n)
    if (/(?<=[\p{L}\d)»”])[;?!](?=\s|$)/u.test(hors)) e('espace-ponctuation', 'espace manquant avant « ; ? ! »', n)
    if (/(?<=[\p{L})»”]):(?=\s|$)/u.test(hors)) e('espace-ponctuation', 'espace manquant avant « : »', n)
    for (const m of l.matchAll(/(?<![\d.,/])(\d{4,})(?![\d])/g)) {
      if (/^(19|20)\d\d$/.test(m[1])) continue
      e('grand-nombre', `grand nombre « ${m[1]} » sans espace insécable : écrire 1 500`, n)
    }
    for (const [re, msg] of TICS) if (re.test(l)) e('tic', msg, n)
    for (const re of MOTS_RAPPORT) {
      const m = l.match(re)
      if (m) (reg === 'Partenariat' ? w : e)('mot-de-rapport', `mot de rapport « ${m[0]} » (05-promesse-et-voix.md)${reg === 'Partenariat' ? ', toléré en Partenariat si utile' : ''}`, n)
    }
  })

  // Listes : réservées aux étapes, chiffres, pièges (pas plus de la moitié du texte)
  const lignesListe = corps.split('\n').filter((l) => /^\s*(?:[-*]|\d+\.)\s/.test(l)).length
  const lignesTexte = corps.split('\n').filter((l) => /\S/.test(l)).length
  if (lignesTexte && lignesListe / lignesTexte > 0.5) w('trop-de-listes', 'plus de la moitié du texte est en listes : le reste en prose (03-ecriture-naturelle.md)')
}

/** Valide un fichier. Retourne { fichier, type, erreurs, avertissements, mots }. */
export function valider(chemin) {
  const nom = basename(chemin)
  const type = nom.startsWith('01-cadrage') ? 'cadrage' : 'article'
  const c = lireContenu(chemin)
  const erreurs = []
  const avertissements = []
  validerEntete(c.entete, type, erreurs, avertissements)
  if (c.entete) {
    if (type === 'cadrage') validerCadrage(c.corps, erreurs, avertissements)
    else validerArticle(c, erreurs, avertissements)
  }
  if (estRetire(c.entete)) {
    avertissements.push(...erreurs.splice(0).map((x) => ({ ...x, msg: `${x.msg} (contenu retiré, exemple conservé)` })))
  }
  return { fichier: relApp(chemin), type, erreurs, avertissements, mots: compterMots(c.corps), entete: c.entete }
}

function tousLesContenus() {
  const dir = join(edDir, 'articles')
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => ['01-cadrage.md', '02-article.md'].map((f) => join(dir, d.name, f)).filter(existsSync))
}

function main() {
  const args = process.argv.slice(2)
  const json = args.includes('--json')
  const cibles = args.includes('--tous') ? tousLesContenus() : args.filter((a) => !a.startsWith('--')).map(resoudreArticle)
  if (!cibles.length) {
    console.error('Usage : node scripts/ed-valider.mjs <slug|fichier> [...] | --tous [--json]')
    process.exit(2)
  }
  const resultats = cibles.map(valider)
  if (json) console.log(JSON.stringify(resultats, null, 2))
  else {
    for (const r of resultats) {
      console.log(`\n${r.fichier} (${r.type}, ${r.mots} mots) : ${r.erreurs.length} erreur(s), ${r.avertissements.length} avertissement(s)`)
      for (const x of r.erreurs) console.log(`  [ERREUR] ${x.id} (ligne ${x.ligne}) : ${x.msg}`)
      for (const x of r.avertissements) console.log(`  [avertissement] ${x.id} (ligne ${x.ligne}) : ${x.msg}`)
    }
    const total = resultats.reduce((s, r) => s + r.erreurs.length, 0)
    console.log(`\nBilan : ${resultats.length} fichier(s), ${total} erreur(s).`)
  }
  if (resultats.some((r) => r.erreurs.length)) process.exit(1)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
