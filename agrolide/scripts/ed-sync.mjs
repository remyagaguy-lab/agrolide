#!/usr/bin/env node
/**
 * Génère les adaptateurs de chaque outil depuis editorial/procedures/ : `npm run ed:sync`.
 *
 *   node scripts/ed-sync.mjs            écrit .agents/skills/agrolide-* et .claude/skills/agrolide-*
 *   node scripts/ed-sync.mjs --check    ne modifie rien, échoue si un adaptateur diffère de ce que produirait la synchronisation
 *
 * Les procédures (editorial/procedures/<nom>/PROCEDURE.md) sont la seule source. Les dossiers générés ne s'éditent jamais à la main.
 * Le script ne touche qu'aux dossiers dont le nom commence par « agrolide- » : les skills installés par l'outil `skills`
 * (clerk-*, etc.) et le fichier .agents/AGENTS.md ne sont ni lus ni écrits (AGENTS.md est lu seulement pour son code témoin).
 *
 * Il refuse de générer si une procédure nomme un outil d'agent (la portabilité l'interdit) ou si son en-tête est invalide.
 * Il écrit aussi editorial/portabilite/prompt-test-antigravity.md, avec les codes témoins à retrouver.
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { appRoot, edDir } from './lib/ed-commun.mjs'

export const CIBLES = [
  { id: 'agents', dir: join(appRoot, '.agents', 'skills'), rel: '.agents/skills' },
  { id: 'claude', dir: join(appRoot, '.claude', 'skills'), rel: '.claude/skills' },
]
const MARQUE = 'GÉNÉRÉ par npm run ed:sync'
const PREFIXE = 'agrolide-'
const OUTILS = /\b(WebSearch|WebFetch|Bash|Grep|Glob|Claude(?: Code)?|Antigravity|Gemini|Cursor|Copilot|Codex|SKILL\.md|MCP)\b/

export const codeTemoin = (nom) => `ED-${createHash('sha1').update(nom).digest('hex').slice(0, 6).toUpperCase()}`

/** Lit l'en-tête d'une procédure : nom sur une ligne, description sur une ou plusieurs lignes (bloc « > »). */
function lireProcedure(dir) {
  const fichier = join(dir, 'PROCEDURE.md')
  const brut = readFileSync(fichier, 'utf8').replace(/\r\n/g, '\n')
  const m = brut.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) throw new Error(`${fichier} : en-tête introuvable`)
  const nom = m[1].match(/^nom:\s*(\S+)\s*$/m)?.[1]
  const dm = m[1].match(/^description:\s*(?:>\s*\n)?([\s\S]*)$/m)
  const description = (dm?.[1] ?? '').split('\n').map((l) => l.trim()).filter(Boolean).join(' ')
  return { fichier, dossier: dir, nom, description, corps: m[2].trim() }
}

export function chargerProcedures() {
  const racine = join(edDir, 'procedures')
  if (!existsSync(racine)) return { procedures: [], problemes: ['editorial/procedures/ introuvable'] }
  const problemes = []
  const procedures = []
  for (const d of readdirSync(racine, { withFileTypes: true })) {
    if (!d.isDirectory() || !existsSync(join(racine, d.name, 'PROCEDURE.md'))) continue
    const p = lireProcedure(join(racine, d.name))
    const lieu = `procedures/${d.name}/PROCEDURE.md`
    if (!p.nom) problemes.push(`${lieu} : champ « nom » absent`)
    else if (!p.nom.startsWith(PREFIXE)) problemes.push(`${lieu} : le nom « ${p.nom} » doit commencer par « ${PREFIXE} »`)
    else if (!/^[a-z0-9-]+$/.test(p.nom)) problemes.push(`${lieu} : le nom « ${p.nom} » ne contient que minuscules, chiffres et traits d'union`)
    if (!p.description) problemes.push(`${lieu} : champ « description » absent`)
    else if (p.description.length > 1024) problemes.push(`${lieu} : description de ${p.description.length} caractères (1 024 au plus)`)
    const outil = `${p.description}\n${p.corps}`.match(OUTILS)
    if (outil) problemes.push(`${lieu} : « ${outil[0]} » est un nom d'outil. Nommer l'action par sa fonction (chercher sur le web, lire une page, lancer un script)`)
    procedures.push(p)
  }
  const noms = procedures.map((p) => p.nom)
  for (const n of new Set(noms.filter((n, i) => noms.indexOf(n) !== i))) problemes.push(`nom « ${n} » en double`)
  return { procedures, problemes }
}

/** Contenu d'un SKILL.md généré. Identique pour tous les outils : un adaptateur ne reformule jamais une procédure. */
export function contenuSkill(p) {
  const desc = p.description.replace(/(.{1,92})(\s+|$)/g, '  $1\n').trimEnd()
  return `---
name: ${p.nom}
description: >
${desc}
---

<!-- ${MARQUE} depuis agrolide/editorial/procedures/${p.dossier.split(/[\\/]/).pop()}/PROCEDURE.md. Ne pas modifier ici : modifier la procédure, puis relancer la synchronisation. -->

Code témoin de cette procédure : ${codeTemoin(p.nom)}

${p.corps}
`
}

/** Fichiers attendus : chemin absolu -> contenu. */
export function attendu(procedures) {
  const out = new Map()
  for (const cible of CIBLES) for (const p of procedures) out.set(join(cible.dir, p.nom, 'SKILL.md'), contenuSkill(p))
  return out
}

/** Code témoin de la section « Système éditorial » de AGENTS.md. */
export function lireCodeAgents() {
  const f = join(appRoot, '.agents', 'AGENTS.md')
  if (!existsSync(f)) return null
  return readFileSync(f, 'utf8').match(/Code témoin du système éditorial\s*:\s*(ED-AGENTS-[A-Z0-9]+)/)?.[1] ?? null
}

export function contenuPromptTest(procedures, codeAgents) {
  const lignes = procedures.map((p) => `| ${p.nom} | ${codeTemoin(p.nom)} |`).join('\n')
  return `# Test de portabilité : Antigravity lit-il AGENTS.md et les skills ?

Fichier ${MARQUE}. Ne pas modifier ici : \`cd agrolide && npm run ed:sync\`.

Ce test ne démontre rien tant qu'il n'a pas été joué. Tant qu'il n'est pas joué avec succès, ne pas écrire qu'Antigravity lit les règles et les skills du dépôt.

## Avant de commencer

1. Mettre à jour le dossier de travail : la branche qui contient \`agrolide/.agents/AGENTS.md\` et \`agrolide/.agents/skills/agrolide-*\` doit être celle ouverte.
2. Ouvrir dans Antigravity le dossier \`agrolide/\` du dépôt (celui qui contient \`package.json\` et \`.agents/\`), pas le dossier parent. Les conventions de découverte partent de la racine de l'espace de travail : si \`.agents/\` n'est pas à la racine ouverte, le test peut échouer pour cette seule raison.
3. Ouvrir une conversation neuve (aucun historique).

## Prompt 1 : à coller tel quel

\`\`\`
Réponds sans ouvrir aucun fichier et sans lancer aucune commande. Ne devine pas : si tu ne sais pas, écris « inconnu ».

1. Dans les règles du projet agrolide, existe-t-il une section sur le système éditorial ? Si oui, donne son « code témoin ».
2. Liste les skills du projet dont le nom commence par « agrolide- » et, pour chacun, son « code témoin ».
3. Dis honnêtement si tu as ouvert un fichier ou lancé une commande pour répondre.
\`\`\`

Réponse attendue si Antigravity charge AGENTS.md et les skills :

| Élément | Code témoin attendu |
|---|---|
| Section Système éditorial de AGENTS.md | ${codeAgents ?? 'ABSENT : ajouter la section dans .agents/AGENTS.md'} |
${lignes}

## Prompt 2 : à coller dans la même conversation

\`\`\`
Sans ouvrir de fichier : pour un article destiné à un producteur, quel registre faut-il utiliser, et quelle commande vérifie l'en-tête et la structure de l'article avant publication ?
\`\`\`

Réponse attendue : registre Terrain, commande \`npm run ed:valider\`.

## Lire le résultat

| Constat | Conclusion | Suite |
|---|---|---|
| Tous les codes exacts, aucun fichier ouvert | AGENTS.md et les skills sont chargés dans le contexte | Noter la version d'Antigravity et la date dans \`editorial/charte/00-decisions.md\` |
| Codes exacts mais l'agent a ouvert des fichiers | Il sait les trouver, sans les charger d'office | Acceptable : le point d'entrée AGENTS.md suffit si l'agent le consulte. À noter |
| Codes faux, inventés ou « inconnu » | Rien n'est chargé d'office | Redemander en nommant les fichiers (« lis agrolide/.agents/AGENTS.md »). Si cela marche, l'adaptateur manque : l'ajouter dans ed:sync (autre dossier ou fichier de règles), jamais un second jeu de règles |
| L'agent invente des codes | Ne pas conclure à une lecture | Refaire le test, et signaler l'hallucination |

Un code inventé qui ressemble à un code vrai est un échec, pas une réussite. Les codes sont des empreintes : ils ne se devinent pas.
`
}

export function synchroniser({ check = false } = {}) {
  const { procedures, problemes } = chargerProcedures()
  const codeAgents = lireCodeAgents()
  if (!codeAgents) problemes.push('.agents/AGENTS.md : section « Système éditorial » absente (ligne « Code témoin du système éditorial : ED-AGENTS-… » attendue)')
  if (problemes.length) return { ok: false, problemes, ecrits: [], differences: [], supprimes: [] }

  const voulu = attendu(procedures)
  voulu.set(join(edDir, 'portabilite', 'prompt-test-antigravity.md'), contenuPromptTest(procedures, codeAgents))
  const differences = []
  const ecrits = []
  for (const [f, contenu] of voulu) {
    const actuel = existsSync(f) ? readFileSync(f, 'utf8').replace(/\r\n/g, '\n') : null
    if (actuel === contenu) continue
    differences.push(f)
    if (!check) {
      mkdirSync(join(f, '..'), { recursive: true })
      writeFileSync(f, contenu)
      ecrits.push(f)
    }
  }

  // Dossiers agrolide-* générés mais sans procédure : orphelins
  const noms = new Set(procedures.map((p) => p.nom))
  const supprimes = []
  for (const cible of CIBLES) {
    if (!existsSync(cible.dir)) continue
    for (const d of readdirSync(cible.dir, { withFileTypes: true })) {
      if (!d.isDirectory() || !d.name.startsWith(PREFIXE) || noms.has(d.name)) continue
      const skill = join(cible.dir, d.name, 'SKILL.md')
      const genere = existsSync(skill) && readFileSync(skill, 'utf8').includes(MARQUE)
      if (!genere) {
        differences.push(join(cible.dir, d.name))
        continue
      }
      differences.push(join(cible.dir, d.name))
      if (!check) { rmSync(join(cible.dir, d.name), { recursive: true }); supprimes.push(join(cible.dir, d.name)) }
    }
  }
  return { ok: check ? differences.length === 0 : true, problemes: [], ecrits, differences, supprimes }
}

function main() {
  const check = process.argv.includes('--check')
  const r = synchroniser({ check })
  if (r.problemes.length) {
    console.error('Synchronisation impossible :')
    for (const p of r.problemes) console.error(`  - ${p}`)
    process.exit(1)
  }
  const rel = (f) => f.replace(appRoot, 'agrolide').replace(/\\/g, '/')
  if (check) {
    if (!r.ok) {
      console.error('Les adaptateurs ne sont pas à jour avec editorial/procedures/ :')
      for (const f of r.differences) console.error(`  - ${rel(f)}`)
      console.error('Lancer : cd agrolide && npm run ed:sync')
      process.exit(1)
    }
    console.log('Adaptateurs à jour.')
    return
  }
  for (const f of r.ecrits) console.log(`écrit    ${rel(f)}`)
  for (const f of r.supprimes) console.log(`supprimé ${rel(f)} (orphelin généré)`)
  console.log(r.ecrits.length || r.supprimes.length ? `\n${r.ecrits.length} fichier(s) écrit(s).` : 'Rien à écrire : adaptateurs déjà à jour.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
