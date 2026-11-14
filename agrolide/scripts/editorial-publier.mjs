#!/usr/bin/env node
/**
 * Prépare la mise en ligne d'un article rédigé dans editorial/articles/<slug>/02-article.md :
 * produit editorial/articles/<slug>/03-publication.sql à exécuter sur la base D1 (le script n'écrit jamais en base).
 *
 *   node scripts/editorial-publier.mjs <slug> [--publie]
 *
 * Par défaut l'article est inséré en brouillon (validation technique d'un référent à faire). --publie le met en ligne.
 * Lecture de l'en-tête : sujet, categorie (obligatoire), cta, cta_cible (référence DOC-xxxxx, facultatif).
 * Le texte du CTA (paragraphe contenant `cta`) devient le bloc « custom-cta » du blog, qui remplace le bloc d'adhésion par défaut.
 * Commande à lancer ensuite dans le terminal connecté à Cloudflare :
 *   npx wrangler d1 execute agrolide-d1 --remote --file=editorial/articles/<slug>/03-publication.sql
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { marked } from 'marked'

const slug = process.argv[2]
const publie = process.argv.includes('--publie')
if (!slug) {
  console.error('Usage : node scripts/editorial-publier.mjs <slug> [--publie]')
  process.exit(1)
}
const dossier = resolve(import.meta.dirname, '..', 'editorial', 'articles', slug)
const brut = readFileSync(join(dossier, '02-article.md'), 'utf8').replace(/\r\n/g, '\n')

const m = brut.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
if (!m) throw new Error('En-tête introuvable dans 02-article.md')
const entete = Object.fromEntries(
  m[1].split('\n').map((l) => {
    const i = l.indexOf(':')
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  }),
)
if (!entete.categorie) throw new Error('Ajouter « categorie » dans l\'en-tête (ex. Production Animal)')

let corps = m[2].trim()
const titre = corps.match(/^# (.+)$/m)?.[1]
if (!titre) throw new Error('Titre (# ...) introuvable')
corps = corps.replace(/^# .+\n+/, '')
// Bloc final de sources : « Sources : » ou « D'où ça vient : » (registre Terrain).
const reSources = /\n\s*(Sources|D'où ça vient) :\s*\n/
const [avantSources] = corps.split(reSources)
const marqueSources = corps.match(reSources)
const titreSources = marqueSources ? marqueSources[1] : 'Sources'
const sources = marqueSources ? corps.split(reSources)[2] : ''

// Chapô = premier paragraphe, utilisé aussi comme extrait des cartes.
const paragraphes = avantSources.split(/\n{2,}/)
const chapo = paragraphes[0].trim()

// Bloc CTA : paragraphe contenant le texte du CTA, suivi de la ligne de lien [libellé → /chemin].
const iCta = paragraphes.findIndex((p) => entete.cta && p.includes(entete.cta))
let ctaHtml = ''
if (iCta >= 0) {
  const lien = paragraphes[iCta + 1]?.match(/^\[(.+?) → (\/[^\]]+)\]$/)
  const href = lien ? lien[2] : '/bibliotheque'
  ctaHtml = `<div class="custom-cta" style="margin: 2rem 0; padding: 2rem; background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 0.75rem; text-align: center;">
<p style="margin: 0 auto 1.5rem auto; font-size: 1.125rem; max-width: 600px; line-height: 1.6;">${paragraphes[iCta].replace(/</g, '&lt;')}</p>
<a href="${href}" style="display: inline-block; background-color: #f99e1d; color: #ffffff; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 1.125rem;">${entete.cta}</a>
</div>`
  paragraphes.splice(iCta, lien ? 2 : 1, '@@CTA@@')
}

const html =
  marked.parse(paragraphes.join('\n\n'), { async: false }).replace('<p>@@CTA@@</p>', ctaHtml) +
  (sources ? `\n<h2>${titreSources}</h2>\n${marked.parse(sources, { async: false })}` : '')

const q = (s) => `'${String(s).replace(/'/g, "''")}'`
const maintenant = new Date().toISOString()
const sql = `-- Article ${slug} : ${publie ? 'PUBLIÉ' : 'brouillon'}. Généré par editorial-publier.mjs le ${maintenant}.
DELETE FROM articles WHERE slug = ${q(slug)};
INSERT INTO articles (id, acces, auteur_externe, categorie, contenu_json, created_at, extrait, published_at, slug, statut, titre, updated_at)
VALUES (${q(randomUUID())}, 'public', 'Équipe agrolide', ${q(entete.categorie)}, ${q(html)}, ${q(maintenant)}, ${q(chapo.replace(/\s+/g, ' '))}, ${q(maintenant)}, ${q(slug)}, ${q(publie ? 'publie' : 'brouillon')}, ${q(titre)}, ${q(maintenant)});
`
writeFileSync(join(dossier, '03-publication.sql'), sql)
console.log(`${join('editorial/articles', slug, '03-publication.sql')} : ${html.length} caractères de HTML, statut ${publie ? 'publie' : 'brouillon'}`)
