#!/usr/bin/env node
/**
 * Évaluations : lancé par `npm run ed:eval`. Note les sorties d'agents sur des briefs fixes, et compare deux agents.
 *
 *   node scripts/ed-eval.mjs                          note toutes les sorties trouvées
 *   node scripts/ed-eval.mjs --brief <id> [--agent <nom>]
 *   node scripts/ed-eval.mjs --prompt <id> [--agent <nom>]   affiche le prompt à donner à un agent
 *   node scripts/ed-eval.mjs --liste                  liste les briefs
 * Options : --en-ligne (teste aussi les liens web), --json
 *
 * Briefs : editorial/evaluations/briefs/<id>.json. Sorties : editorial/evaluations/sorties/<id>/<agent>/{01-cadrage.md, 02-article.md}.
 * Un agent n'est jamais lancé par ce script : il note ce que l'agent a écrit. Le script ne juge pas la qualité de lecture,
 * il vérifie des critères mesurables (voir editorial/evaluations/README.md). Échec (code 1) si un critère échoue.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { appRoot, compterMots, edDir, lireContenu, LONGUEURS } from './lib/ed-commun.mjs'
import { valider } from './ed-valider.mjs'
import { verifierSources } from './ed-sources.mjs'

const DECISIONS_STRICTES = ['public', 'registre', 'objectif', 'cta_cible', 'domaine_code']
const DECISIONS_LIEES = ['public', 'registre', 'niveau', 'objectif', 'domaine', 'pilier', 'categorie', 'cta', 'cta_cible']

export function chargerBriefs() {
  const dir = join(edDir, 'evaluations', 'briefs')
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
}

export const dossierSorties = (id) => join(edDir, 'evaluations', 'sorties', id)

export function agentsDuBrief(id) {
  const d = dossierSorties(id)
  return existsSync(d) ? readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort() : []
}

export function promptPourAgent(brief, agent = '<nom-agent>') {
  return `Lis agrolide/.agents/AGENTS.md, puis suis, dans l'ordre, les procédures agrolide-cadrage-article puis agrolide-redaction-article (agrolide/editorial/procedures/).

Brief : ${brief.brief}

Personne n'est disponible pour répondre : choisis la meilleure interprétation du brief, note-la dans le cadrage, et continue.
Écris le cadrage dans agrolide/editorial/evaluations/sorties/${brief.id}/${agent}/01-cadrage.md et l'article dans agrolide/editorial/evaluations/sorties/${brief.id}/${agent}/02-article.md.
Quand les deux fichiers existent, lance depuis agrolide/ : npm run ed:eval -- --brief ${brief.id} --agent ${agent}
et corrige en réécrivant jusqu'à ce que tous les critères passent.`
}

/** Contrôle de la charte sur un fichier : retourne { erreurs, avertissements } lus dans le bilan de ed:check. */
function controleCharte(fichier) {
  let sortie = ''
  let code = 0
  try {
    sortie = execFileSync(process.execPath, [join(appRoot, 'scripts', 'editorial-check.mjs'), '--fichier', fichier, '--warnings'], { cwd: appRoot, encoding: 'utf8' })
  } catch (err) {
    code = err.status ?? 1
    sortie = `${err.stdout ?? ''}`
  }
  const m = sortie.match(/Bilan : (\d+) erreur\(s\), (\d+) avertissement\(s\)/)
  return { erreurs: m ? Number(m[1]) : 1, avertissements: m ? Number(m[2]) : 0, sortie, code }
}

const codeDomaine = (d = '') => d.split(' ')[0]

/** Note une sortie. Retourne { criteres:[{id, categorie, ok, detail}], ok, score }. */
export async function evaluerSortie(brief, dir, { enLigne = false } = {}) {
  const criteres = []
  const c = (id, categorie, ok, detail = '') => criteres.push({ id, categorie, ok: Boolean(ok), detail })
  const cadrage = join(dir, '01-cadrage.md')
  const article = join(dir, '02-article.md')
  c('fichiers', 'bloquant', existsSync(cadrage) && existsSync(article), 'les deux fichiers 01-cadrage.md et 02-article.md existent')
  if (!existsSync(cadrage) || !existsSync(article)) return { criteres, ok: false, score: 0, mots: 0, entete: null }

  for (const f of [cadrage, article]) {
    const n = f.endsWith('01-cadrage.md') ? 'cadrage' : 'article'
    const r = controleCharte(f)
    c(`ed:check ${n}`, 'bloquant', r.erreurs === 0 && r.avertissements === 0, `${r.erreurs} erreur(s), ${r.avertissements} avertissement(s)`)
    const v = valider(f)
    c(`ed:valider ${n}`, 'bloquant', v.erreurs.length === 0, v.erreurs.map((e) => e.id).join(', '))
  }
  const s = await verifierSources(article, { horsLigne: !enLigne })
  c('ed:sources article', 'bloquant', s.erreurs.length === 0, s.erreurs.map((e) => e.id).join(', '))

  const ca = lireContenu(cadrage)
  const ar = lireContenu(article)
  const e = ar.entete ?? {}
  const att = brief.entete
  for (const k of ['public', 'registre', 'objectif', 'cta_cible']) c(`en-tête ${k}`, 'bloquant', e[k] === att[k], `attendu « ${att[k]} », trouvé « ${e[k] ?? 'absent'} »`)
  c('en-tête domaine', 'bloquant', codeDomaine(e.domaine) === att.domaine, `attendu « ${att.domaine} », trouvé « ${codeDomaine(e.domaine) || 'absent'} »`)
  c('en-tête niveau', 'bloquant', brief.niveaux.includes(e.niveau), `attendu ${brief.niveaux.join(' ou ')}, trouvé « ${e.niveau ?? 'absent'} »`)
  c('statut article', 'bloquant', e.statut === 'redaction', `attendu « redaction », trouvé « ${e.statut ?? 'absent'} »`)
  const lies = (e.documents_lies ?? '').match(/DOC-\d{5}/g) ?? []
  for (const d of brief.documents_lies_obligatoires) c(`document lié ${d}`, 'bloquant', lies.includes(d), `documents_lies : ${lies.join(', ') || 'vide'}`)
  const incoherents = DECISIONS_LIEES.filter((k) => (ca.entete?.[k] ?? '') !== (e[k] ?? ''))
  c('cadrage et article cohérents', 'bloquant', incoherents.length === 0, incoherents.length ? `diffèrent : ${incoherents.join(', ')}` : '')

  const texte = ar.corps
  for (const g of brief.doit_contenir) c(`contient : ${g.nom}`, 'qualite', g.un_parmi.some((re) => new RegExp(re, 'iu').test(texte)), '')
  for (const n of brief.ne_doit_pas ?? []) c(`ne contient pas : ${n.nom}`, 'bloquant', !new RegExp(n.motif, 'iu').test(texte), '')
  const nbSources = (texte.split(/\n\s*(?:Sources|D'où ça vient)\s:\s*\n/)[1] ?? '').split('\n').filter((l) => /^\s*(?:[-*]|\d+\.)\s/.test(l)).length
  c('nombre de sources', 'qualite', nbSources >= brief.sources_minimum, `${nbSources} source(s), ${brief.sources_minimum} au moins`)

  const bloquants = criteres.filter((x) => x.categorie === 'bloquant')
  const ok = bloquants.every((x) => x.ok)
  const score = Math.round((criteres.filter((x) => x.ok).length / criteres.length) * 100)
  return { criteres, ok, score, mots: compterMots(texte), entete: e }
}

/** Compare deux sorties du même brief. Les décisions strictes doivent être identiques, les longueurs comparables. */
export function comparer(brief, a, b) {
  const lecture = (r) => ({ ...r.entete, domaine_code: codeDomaine(r.entete?.domaine) })
  const ea = lecture(a)
  const eb = lecture(b)
  const differences = DECISIONS_STRICTES.filter((k) => ea[k] !== eb[k])
  const ratio = Math.max(a.mots, b.mots) / Math.max(1, Math.min(a.mots, b.mots))
  const informatives = ['niveau', 'pilier', 'categorie'].filter((k) => ea[k] !== eb[k])
  const docs = (r) => new Set(r.entete?.documents_lies?.match(/DOC-\d{5}/g) ?? [])
  const communs = [...docs(a)].filter((d) => docs(b).has(d))
  const concepts = (r) => r.criteres.filter((x) => x.id.startsWith('contient :') && x.ok).length
  return {
    ok: differences.length === 0 && ratio <= 1.6,
    decisionsDifferentes: differences,
    ratioLongueur: Number(ratio.toFixed(2)),
    informatives,
    documentsCommuns: communs,
    conceptsTrouves: [concepts(a), concepts(b)],
  }
}

async function main() {
  const args = process.argv.slice(2)
  const val = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null }
  const briefs = chargerBriefs()
  if (args.includes('--liste')) {
    for (const b of briefs) console.log(`${b.id} : ${b.titre} (${b.entete.registre}) sorties : ${agentsDuBrief(b.id).join(', ') || 'aucune'}`)
    return
  }
  const idPrompt = val('--prompt')
  if (idPrompt) {
    const b = briefs.find((x) => x.id === idPrompt)
    if (!b) { console.error(`Brief introuvable : ${idPrompt}`); process.exit(2) }
    console.log(promptPourAgent(b, val('--agent') ?? '<nom-agent>'))
    return
  }
  const choisis = briefs.filter((b) => !val('--brief') || b.id === val('--brief') || b.id.startsWith(`${val('--brief')}-`))
  const resultats = []
  let echec = false
  for (const b of choisis) {
    const agents = agentsDuBrief(b.id).filter((a) => !val('--agent') || a === val('--agent'))
    const notes = {}
    for (const agent of agents) {
      const r = await evaluerSortie(b, join(dossierSorties(b.id), agent), { enLigne: args.includes('--en-ligne') })
      notes[agent] = r
      if (!r.ok) echec = true
    }
    const noms = Object.keys(notes)
    const paires = []
    for (let i = 0; i < noms.length; i++) for (let j = i + 1; j < noms.length; j++) {
      const cmp = comparer(b, notes[noms[i]], notes[noms[j]])
      paires.push({ agents: [noms[i], noms[j]], ...cmp })
      if (!cmp.ok) echec = true
    }
    resultats.push({ brief: b.id, notes, paires })
  }
  if (args.includes('--json')) console.log(JSON.stringify(resultats, null, 2))
  else {
    for (const r of resultats) {
      console.log(`\n== ${r.brief}`)
      if (!Object.keys(r.notes).length) console.log('  aucune sortie')
      for (const [agent, n] of Object.entries(r.notes)) {
        console.log(`  ${agent} : ${n.ok ? 'RÉUSSI' : 'ÉCHEC'} (score ${n.score} %, ${n.mots} mots)`)
        for (const x of n.criteres.filter((y) => !y.ok)) console.log(`    [${x.categorie === 'bloquant' ? 'ERREUR' : 'qualité'}] ${x.id}${x.detail ? ` : ${x.detail}` : ''}`)
      }
      for (const p of r.paires) console.log(`  comparaison ${p.agents.join(' / ')} : ${p.ok ? 'COMPARABLES' : 'ÉCART'} (décisions différentes : ${p.decisionsDifferentes.join(', ') || 'aucune'}, rapport de longueur ${p.ratioLongueur}, documents communs : ${p.documentsCommuns.join(', ') || 'aucun'}, concepts trouvés : ${p.conceptsTrouves.join(' / ')})`)
    }
  }
  if (echec) process.exit(1)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
