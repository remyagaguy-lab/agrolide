/**
 * Test de portabilité du système éditorial : `npm run ed:test`.
 *
 * Il prouve, sans réseau et sans lancer d'agent :
 *  1. les procédures ne nomment aucun outil, et les adaptateurs (.agents, .claude) sont à jour et identiques ;
 *  2. le point d'entrée AGENTS.md renvoie au système éditorial ;
 *  3. les modèles de référence sont identiques à leurs sources ;
 *  4. les contrôles distinguent un bon article d'un mauvais (ils ne sont pas trop permissifs) ;
 *  5. pour chaque brief qui a deux sorties d'agents différents ou plus, toutes passent tous les contrôles et sont comparables.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { FICHIERS_JEU } from '../lib/ed-formats-courts.mjs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { appRoot, chargerIndexBibliotheque, edDir, REGISTRES } from '../lib/ed-commun.mjs'
import { chargerProcedures, CIBLES, codeTemoin, lireCodeAgents, synchroniser } from '../ed-sync.mjs'
import { valider } from '../ed-valider.mjs'
import { verifierSources } from '../ed-sources.mjs'
import { agentsDuBrief, chargerBriefs, comparer, dossierSorties, evaluerSortie } from '../ed-eval.mjs'

const lire = (f) => readFileSync(f, 'utf8').replace(/\r\n/g, '\n')
const MODELE = join(edDir, 'articles', 'aliment-poisson-sacs-par-bassin', '02-article.md')

test('procédures : valides, sans nom d\'outil, au moins deux', () => {
  const { procedures, problemes } = chargerProcedures()
  assert.deepEqual(problemes, [])
  assert.ok(procedures.length >= 2)
})

test('adaptateurs : à jour avec les procédures, identiques entre outils, avec code témoin', () => {
  const r = synchroniser({ check: true })
  assert.deepEqual(r.problemes, [])
  assert.deepEqual(r.differences, [], 'lancer npm run ed:sync')
  const { procedures } = chargerProcedures()
  for (const p of procedures) {
    const contenus = CIBLES.map((c) => lire(join(c.dir, p.nom, 'SKILL.md')))
    assert.equal(new Set(contenus).size, 1, `${p.nom} diffère d'un outil à l'autre`)
    assert.ok(contenus[0].includes(codeTemoin(p.nom)))
    assert.ok(contenus[0].includes('GÉNÉRÉ par npm run ed:sync'))
  }
})

test('AGENTS.md : renvoie au système éditorial et garde ses règles d\'origine', () => {
  const agents = lire(join(appRoot, '.agents', 'AGENTS.md'))
  assert.ok(lireCodeAgents())
  assert.ok(agents.includes('agrolide/editorial/ROADMAP.md'))
  assert.ok(agents.includes('Séparation des Buckets R2'), 'les règles existantes doivent rester')
  assert.ok(existsSync(join(edDir, 'portabilite', 'prompt-test-antigravity.md')))
})

test('modèles : identiques à leurs sources', () => {
  const paires = [
    ['article-terrain.md', 'aliment-poisson-sacs-par-bassin/02-article.md'],
    ['cadrage-article-terrain.md', 'aliment-poisson-sacs-par-bassin/01-cadrage.md'],
    ['article-parcours.md', 'aliment-ferme-piscicole/02-article.md'],
    ['cadrage-article-parcours.md', 'aliment-ferme-piscicole/01-cadrage.md'],
  ]
  for (const [m, s] of paires) assert.equal(lire(join(edDir, 'modeles', m)), lire(join(edDir, 'articles', s)), `${m} diffère de ${s}`)
})

test('contrôles : le modèle passe, des articles abîmés échouent pour la bonne raison', async () => {
  assert.deepEqual(valider(MODELE).erreurs, [])
  const base = lire(MODELE)
  const dir = mkdtempSync(join(tmpdir(), 'ed-test-'))
  const essai = (nom, transformer) => {
    const d = join(dir, nom)
    mkdirSync(d)
    const f = join(d, '02-article.md')
    writeFileSync(f, transformer(base))
    return valider(f).erreurs.map((e) => e.id)
  }
  assert.ok(essai('registre', (t) => t.replace('registre: Terrain', 'registre: Parcours')).includes('longueur'))
  assert.ok(essai('public', (t) => t.replace('public: producteur', 'public: decideur_institution')).includes('registre-public'))
  assert.ok(essai('domaine', (t) => t.replace('production_animale (aquaculture_peche)', 'astrologie')).includes('domaine-invalide'))
  assert.ok(essai('champ', (t) => t.replace(/^cta_cible:.*\n/m, '')).includes('champ-manquant'))
  assert.ok(essai('intertitres', (t) => t.replace(/^## /gm, '')).includes('intertitres'))
  assert.ok(essai('sources', (t) => t.split("D'où ça vient :")[0]).includes('sources-absentes'))
  assert.ok(essai('cta2', (t) => t.replace('## Les pièges', 'Inscrivez-vous à la formation dès maintenant.\n\n## Les pièges')).includes('cta-second'))
  assert.ok(essai('lien', (t) => t.replace(/\[Production d'alevins[^\n]*\]\n/, '')).includes('cta-sans-lien'))
  assert.ok(essai('gras', (t) => t.replace('Comptez vos sacs', '**Comptez vos sacs**')).includes('gras'))
  assert.ok(essai('tic', (t) => t.replace('Le bassin est creusé', 'La vérité, c\'est que le bassin est creusé')).includes('tic'))
  assert.ok(essai('pourcent', (t) => t.replace('60 à 75 %', '60 à 75%')).includes('pourcent'))
  assert.ok(essai('publie', (t) => t.replace('statut: redaction', 'statut: publie')).includes('publie-sans-validation'))
  const s = await verifierSources(MODELE, { horsLigne: true })
  assert.deepEqual(s.erreurs, [], 'le modèle rattache chaque chiffre à une source ou à un exemple fictif')
  const sans = join(dir, 'sans-source')
  mkdirSync(sans)
  writeFileSync(join(sans, '02-article.md'), base.replace('## Ce que cela change chez vous\n', '## Ce que cela change chez vous\n\nLe prix du sac a augmenté de 12 % en un an.\n'))
  const r2 = await verifierSources(join(sans, '02-article.md'), { horsLigne: true })
  assert.ok(r2.erreurs.some((e) => e.id === 'chiffre-sans-source'))
  const doc = join(dir, 'doc')
  mkdirSync(doc)
  writeFileSync(join(doc, '02-article.md'), base.replace('DOC-00584]', 'DOC-00584, DOC-99999]'))
  const r3 = await verifierSources(join(doc, '02-article.md'), { horsLigne: true })
  const index = chargerIndexBibliotheque()
  if (index) assert.ok(r3.erreurs.some((e) => e.id === 'doc-inconnu'))
})

test('briefs : au moins six, quatre registres, documents cibles publiés', () => {
  const briefs = chargerBriefs()
  assert.ok(briefs.length >= 6)
  assert.deepEqual([...new Set(briefs.map((b) => b.entete.registre))].sort(), [...REGISTRES].sort())
  const index = chargerIndexBibliotheque()
  for (const b of briefs) {
    assert.ok(b.brief && b.entete && b.doit_contenir?.length, `${b.id} incomplet`)
    if (index && /^DOC-/.test(b.entete.cta_cible)) assert.ok(['public', 'membres'].includes(index.docs.get(b.entete.cta_cible)?.decision_finale), `${b.id} : cta_cible non publié`)
  }
})

test('formats courts : un article se décline en six posts, une fiche et une newsletter qui passent les contrôles', () => {
  const racine = join(edDir, 'declinaisons')
  const jeux = readdirSync(racine, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
  assert.ok(jeux.length >= 1, 'au moins un jeu de déclinaisons modèle')
  for (const slug of jeux) {
    assert.deepEqual(valider(join(edDir, 'articles', slug, '02-article.md')).erreurs, [], `l'article source ${slug}`)
    for (const f of Object.keys(FICHIERS_JEU)) {
      const chemin = join(racine, slug, f)
      assert.ok(existsSync(chemin), `${slug} : ${f} manque`)
      const r = valider(chemin)
      assert.deepEqual(r.erreurs.map((e) => `${e.id}: ${e.msg}`), [], `${slug}/${f}`)
      assert.equal(r.entete.canal, FICHIERS_JEU[f])
      assert.equal(r.entete.source, slug)
    }
  }
})

test('formats courts : les contrôles refusent la copie, le chiffre inventé, le double CTA, le mauvais canal', () => {
  const slug = 'aliment-poisson-sacs-par-bassin'
  const dir = mkdtempSync(join(tmpdir(), 'ed-court-'))
  const essai = (fichier, transformer) => {
    const f = join(dir, `${fichier}-${Math.random().toString(36).slice(2, 7)}.md`)
    writeFileSync(f, transformer(lire(join(edDir, 'declinaisons', slug, fichier))))
    return valider(f).erreurs.map((e) => e.id)
  }
  const article = lire(MODELE)
  const phrase = article.split('\n').find((l) => l.startsWith('Un poste qui pèse plus de la moitié'))
  assert.ok(essai('post-facebook.md', (t) => t.replace('La bonne nouvelle', `${article.split('\n')[22] ?? ''} ${phrase} ${phrase}`)).includes('copie-de-la-source'))
  assert.ok(essai('post-whatsapp.md', (t) => t.replace('60 à 75 %', '83 %')).includes('chiffre-hors-source'))
  assert.ok(essai('post-whatsapp.md', (t) => t.replace('Lien :', 'Téléchargez la fiche.\n\nLien :')).includes('cta-second'))
  assert.ok(essai('post-whatsapp.md', (t) => t.replace('canal: whatsapp', 'canal: linkedin')).includes('registre-canal'))
  assert.ok(essai('post-whatsapp.md', (t) => t.replace('🐟', '🐟🐟🐟')).includes('emojis'))
  assert.ok(essai('post-instagram.md', (t) => `${t}\n#a #b #c #d #e #f`).includes('hashtags'))
  assert.ok(essai('post-whatsapp.md', (t) => t.replace(/^Lien :.*$/m, '')).includes('lien-source'))
  assert.ok(essai('fiche-technique.md', (t) => t.replace('## À retenir', '## Notes')).includes('a-retenir'))
  assert.ok(essai('fiche-technique.md', (t) => t.replace('validation_technique: a faire (référent aquaculture du réseau)', 'validation_technique: a faire (x)').replace('statut: redaction', 'statut: valide')).includes('fiche-sans-validation'))
})

test('même brief, plusieurs agents : toutes les sorties passent tous les contrôles et sont comparables', async () => {
  const briefs = chargerBriefs()
  const multiAgents = briefs.filter((b) => agentsDuBrief(b.id).length >= 2)
  assert.ok(multiAgents.length >= 1, 'au moins un brief doit avoir deux sorties d\'agents différents')
  for (const b of briefs) {
    const notes = {}
    for (const agent of agentsDuBrief(b.id)) {
      notes[agent] = await evaluerSortie(b, join(dossierSorties(b.id), agent))
      const echecs = notes[agent].criteres.filter((c) => !c.ok && c.categorie === 'bloquant').map((c) => `${c.id} (${c.detail})`)
      assert.deepEqual(echecs, [], `${b.id} / ${agent}`)
    }
    const noms = Object.keys(notes)
    for (let i = 0; i < noms.length; i++) for (let j = i + 1; j < noms.length; j++) {
      const cmp = comparer(b, notes[noms[i]], notes[noms[j]])
      assert.ok(cmp.ok, `${b.id} : ${noms[i]} et ${noms[j]} ne sont pas comparables : ${JSON.stringify(cmp)}`)
    }
  }
})
