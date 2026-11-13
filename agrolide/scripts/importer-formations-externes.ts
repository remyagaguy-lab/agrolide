/**
 * Import des formations externes retenues (FAO elearning Academy, GIZ atingi) depuis le catalogue Gemini vérifié à la main.
 * Génère un fichier SQL (idempotent : une formation dont le lien existe déjà n'est jamais réinsérée) :
 *   npx tsx scripts/importer-formations-externes.ts <catalogue.csv> <sortie.sql>
 *   npx wrangler d1 execute agrolide-d1 --remote --file=<sortie.sql>
 * Les textes passent par `nettoyerTextes` (aucun emoji).
 */
import { readFileSync, writeFileSync } from 'fs'
import { nettoyerTextes } from '../src/lib/utils/sans-emoji'

// Valeurs contrôlées le 13/11/2026 sur les pages des organismes (durée, certificat, langue).
const FAO_CERT = 'Badge numérique gratuit après examen final (75 % minimum)'
const ATINGI_CERT = 'Certificat PDF gratuit après évaluation'
const RETENUES: Record<string, { source: string; duree: string; certificat: string; niveau: string | null; thematique?: string }> = {
  '1285': { source: 'FAO elearning Academy', duree: '3 h 45', certificat: FAO_CERT, niveau: null, thematique: 'Agroécologie' },
  '485': { source: 'FAO elearning Academy', duree: '2 h', certificat: FAO_CERT, niveau: null, thematique: 'Gestion des Sols' },
  '486': { source: 'FAO elearning Academy', duree: '3 h', certificat: FAO_CERT, niveau: null, thematique: 'Production Animale' },
  '865': { source: 'FAO elearning Academy', duree: '2 h', certificat: FAO_CERT, niveau: null },
  '1360': { source: 'FAO elearning Academy', duree: '3 h 50', certificat: FAO_CERT, niveau: null, thematique: 'Agrobusiness' },
  '1083': { source: 'FAO elearning Academy', duree: '1 h 35', certificat: FAO_CERT, niveau: null },
  '96': { source: 'GIZ atingi', duree: '1 h', certificat: ATINGI_CERT, niveau: 'Débutant' },
  '3202': { source: 'GIZ atingi', duree: '1 h', certificat: ATINGI_CERT, niveau: 'Débutant' },
  '6614': { source: 'GIZ atingi', duree: '3 h 30', certificat: ATINGI_CERT, niveau: 'Débutant' },
  '2822': { source: 'GIZ atingi', duree: 'environ 16 à 18 h (4 sessions de 1 à 3 h)', certificat: ATINGI_CERT, niveau: 'Débutant', thematique: 'Agrobusiness' },
  '4927': { source: 'GIZ atingi', duree: '2 h 30', certificat: ATINGI_CERT, niveau: 'Débutant', thematique: 'Agrobusiness' },
}

function lireCsv(texte: string): Record<string, string>[] {
  const lignes: string[][] = []
  let champ = '', ligne: string[] = [], guillemets = false
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i]
    if (guillemets) {
      if (c === '"' && texte[i + 1] === '"') { champ += '"'; i++ } else if (c === '"') guillemets = false
      else champ += c
    } else if (c === '"') guillemets = true
    else if (c === ';') { ligne.push(champ); champ = '' }
    else if (c === '\n') { ligne.push(champ.replace(/\r$/, '')); lignes.push(ligne); ligne = []; champ = '' }
    else champ += c
  }
  if (champ || ligne.length) { ligne.push(champ); lignes.push(ligne) }
  const [entete, ...corps] = lignes
  return corps.filter((l) => l.length > 1).map((l) => Object.fromEntries(entete.map((k, i) => [k.replace(/^﻿/, ''), l[i] ?? ''])))
}

const q = (v: string | number | null) => (v === null ? 'NULL' : typeof v === 'number' ? String(v) : `'${v.replace(/'/g, "''")}'`)

const [, , csvChemin, sortie] = process.argv
const lignes = lireCsv(readFileSync(csvChemin, 'utf-8'))
const sql: string[] = []
const trouvees = new Set<string>()

for (const r of lignes) {
  const idCours = r.lien_officiel.match(/[?&]id=(\d+)$/)?.[1]
  const cfg = idCours && RETENUES[idCours]
  if (!idCours || !cfg || !/elearning\.fao\.org|online\.atingi\.org/.test(r.lien_officiel)) continue
  // « Introduction à l'agriculture intelligente » (480) est écartée : déjà en ligne en anglais (fao-4).
  trouvees.add(idCours)
  const c = nettoyerTextes({
    titre: r.titre.trim(),
    description: r.description_courte.trim(),
    thematique: cfg.thematique ?? r.thematique.trim().replace('Production végétale', 'Production Végétale'),
    programme: {
      public_cible: r.public_cible.trim(),
      objectifs: r.objectifs.split('|').map((o) => o.trim()).filter(Boolean),
      presentation_structure: `Cours en ligne proposé par ${cfg.source} (${r.organisme.trim()}). Un compte gratuit sur la plateforme de l'organisme est nécessaire pour le suivre.`,
      duree: cfg.duree,
      langue: 'Français',
      certificat: cfg.certificat,
    },
  })
  const id = `ext-${cfg.source.startsWith('FAO') ? 'fao' : 'atingi'}-${idCours}`
  sql.push(
    `INSERT INTO formations (id, titre, modalite, niveau, prix_fcfa, thematique, description, lien_externe, source_externe, statut, acces, programme_json, created_at)\n` +
      `SELECT ${q(id)}, ${q(c.titre)}, 'En ligne (Externe)', ${q(cfg.niveau)}, 0, ${q(c.thematique)}, ${q(c.description)}, ${q(r.lien_officiel.trim())}, ${q(cfg.source)}, 'publie', 'libre', ${q(JSON.stringify(c.programme))}, ${q(new Date().toISOString())}\n` +
      `WHERE NOT EXISTS (SELECT 1 FROM formations WHERE lien_externe = ${q(r.lien_officiel.trim())} OR id = ${q(id)});`,
  )
}

const manquantes = Object.keys(RETENUES).filter((k) => !trouvees.has(k))
if (manquantes.length) throw new Error(`Formations introuvables dans le catalogue : ${manquantes.join(', ')}`)
writeFileSync(sortie, sql.join('\n\n') + '\n', 'utf-8')
console.log(`${sql.length} formations dans ${sortie}`)
