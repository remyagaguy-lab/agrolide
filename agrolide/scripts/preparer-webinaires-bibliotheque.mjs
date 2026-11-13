// Prépare l'entrée des diaporamas des webinaires « Parlons agriculture » dans la bibliothèque.
//
//   node scripts/preparer-webinaires-bibliotheque.mjs <dossier-Parlons-agriculture> <dossier-sortie>
//
// Produit dans <dossier-sortie> (hors dépôt) :
//   manifeste_webinaires.json    → à donner à scripts/envoyer-bibliotheque-r2.mjs (envoi des PDF dans R2)
//   webinaires_bibliotheque.sql  → à appliquer avec wrangler (2 lignes `documents` + liaison `evenements.document_id`)
// N'écrit rien dans R2 ni dans D1 : c'est le propriétaire qui lance les deux commandes (voir le rapport).
import fs from 'node:fs'
import path from 'node:path'

const [dossier, sortie] = process.argv.slice(2)
if (!dossier || !sortie) { console.error('Usage : node scripts/preparer-webinaires-bibliotheque.mjs <Parlons-agriculture> <sortie>'); process.exit(2) }

const MAINTENANT = new Date().toISOString()
const q = (s) => `'${String(s).replace(/'/g, "''")}'`

const DOCS = [
  {
    id: '7d0c1f9e-4a53-5b8e-9a41-0a1e5c3b7f01',
    reference: 'AGRO-WEB-01',
    fichier: path.join(dossier, 'Wébiniare 1', 'Webinaire formatif (gestion de projet agricole).pdf'),
    cle: 'bibliotheque/agroeconomie/gestion_projet_business_plan/AGRO-WEB-01__webinaire-1-monter-un-projet-agricole-rentable.pdf',
    titre: 'Webinaire 1 : comment monter un projet agricole rentable (diaporama)',
    resume: "Diaporama du premier webinaire « Parlons agriculture » du réseau Agrolide : de l'idée aux premières récoltes, les étapes pour construire un projet agricole rentable.",
    sous_domaine: 'gestion_projet_business_plan', thematique: 'Agroéconomie', annee: 2025,
    mots_cles: ['webinaire', 'projet agricole', 'rentabilité', 'business plan', 'agripreneuriat'],
    evenement: "Comment monter un projet agricole rentable%",
  },
  {
    id: '7d0c1f9e-4a53-5b8e-9a41-0a1e5c3b7f02',
    reference: 'AGRO-WEB-02',
    fichier: path.join(dossier, 'Wébinaire 2', 'Parlons Agriculture 2.pdf'),
    cle: 'bibliotheque/agroeconomie/economie_filieres_marches/AGRO-WEB-02__webinaire-2-commercialisation-des-produits-agricoles.pdf',
    titre: 'Webinaire 2 : du champ au marché, commercialiser ses produits agricoles (diaporama)',
    resume: "Diaporama du deuxième webinaire « Parlons agriculture » du réseau Agrolide : stratégies de commercialisation des produits agricoles, du champ au marché.",
    sous_domaine: 'economie_filieres_marches', thematique: 'Agroéconomie', annee: 2026,
    mots_cles: ['webinaire', 'commercialisation', 'marché', 'vente', 'produits agricoles'],
    evenement: "Du champ au marché%",
  },
]

fs.mkdirSync(sortie, { recursive: true })
const manifeste = []
const sql = ['-- Diaporamas des webinaires : INSERT OR IGNORE (relançable), puis liaison à l\'événement. Aucune suppression.',
  '-- À appliquer APRÈS la migration 0016 et APRÈS l\'envoi des PDF dans R2.']
for (const d of DOCS) {
  const taille = fs.statSync(d.fichier).size
  manifeste.push({ id: d.reference, cle: d.cle, local: d.fichier, taille })
  sql.push(
    `INSERT OR IGNORE INTO documents (id, acces, annee, auteurs, created_at, fichier_r2_key, langue, nb_telechargements, pays, published_at, resume, statut, taille_octets, thematique, titre, type_doc, domaine, sous_domaine, public_cible, niveau, licence, source_organisation, mots_cles, reference) VALUES (` +
    [q(d.id), q('public'), d.annee, q('Agrolide'), q(MAINTENANT), q(d.cle), q('fr'), 0, 'NULL', q(MAINTENANT), q(d.resume), q('publie'), taille, q(d.thematique), q(d.titre), q('presentation'),
      q('agroeconomie'), q(d.sous_domaine), q('entrepreneur_porteur_projet'), q('initiation'), q("Propriété d'Agrolide"), q('Agrolide'), q(JSON.stringify(d.mots_cles)), q(d.reference)].join(', ') + ');',
    `UPDATE evenements SET document_id = ${q(d.id)} WHERE type_evt = 'webinaire' AND titre LIKE ${q(d.evenement)};`,
  )
}
fs.writeFileSync(path.join(sortie, 'manifeste_webinaires.json'), JSON.stringify(manifeste, null, 2))
fs.writeFileSync(path.join(sortie, 'webinaires_bibliotheque.sql'), sql.join('\n') + '\n')
console.log('OK :', manifeste.map((m) => `${m.id} (${(m.taille / 1048576).toFixed(1)} Mo)`).join(', '))
