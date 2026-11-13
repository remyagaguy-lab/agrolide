// Génère les pages « cas chiffrés » (src/content/cas-chiffres/*.ts) à partir de scripts/modeles_bp/cas_chiffres.json,
// produit par : python scripts/modeles_bp/cas_chiffres.py --json scripts/modeles_bp/cas_chiffres.json
// Tous les chiffres des pages viennent de ce calcul : ne jamais les écrire à la main.
import fs from 'fs';

const J = JSON.parse(fs.readFileSync('scripts/modeles_bp/cas_chiffres.json', 'utf8'));
const f1 = (x) => x.toFixed(1).replace('.', ',');
const f2 = (x) => x.toFixed(2).replace('.', ',');
const pc = (x, d = 0) => (x * 100).toFixed(d).replace('.', ',') + ' %';
const sg = (x) => (x < 0 ? '− ' + f1(-x) : f1(x));
const fr = (x) => Math.round(x).toLocaleString('fr-FR').replace(/ /g, ' ').replace(/ /g, ' ');

function tableauCommun(r, dev) {
  const L = [];
  L.push(`### Coût du projet et financement (en millions de ${dev})`);
  L.push('');
  L.push('| Poste | Montant | Durée d\'amortissement |');
  L.push('|---|---|---|');
  for (const [n, m, d] of r.immos_list) L.push(`| ${n} | ${f1(m)} | ${d} ans |`);
  L.push(`| **Total immobilisations** | **${f1(r.immos)}** | |`);
  L.push(`| Besoin en fonds de roulement initial | ${f1(r.bfr)} | |`);
  L.push(`| **Coût total du projet** | **${f1(r.cout)}** | |`);
  L.push('');
  L.push(`**Ressources :** apport ${f1(r.apport)} (${pc(r.apport / r.cout)}) + emprunt ${f1(r.emprunt)} à ${pc(r.taux)} sur ${r.duree} ans dont ${r.differe} an de différé. L'année 1, seuls les intérêts sont payés (${f1(r.dette[0].interets)}) ; à partir de l'année 2, l'annuité constante est d'environ ${f1(r.annuite)} par an. Amortissements : ${f1(r.amort)} par an.`);
  L.push('');
  L.push('### Compte de résultat prévisionnel (scénario réaliste)');
  L.push('');
  L.push('| | An 1 | An 2 | An 3 | An 4 | An 5 |');
  L.push('|---|---|---|---|---|---|');
  const row = (lab, k, neg = false) => L.push(`| ${lab} | ${r.res.map((y) => sg(neg ? -y[k] : y[k])).join(' | ')} |`);
  row('Chiffre d\'affaires', 'ca');
  row('Charges variables', 'cv', true);
  L.push(`| Charges fixes | ${r.res.map(() => sg(-r.fixes)).join(' | ')} |`);
  L.push(`| Personnel | ${r.res.map(() => sg(-r.personnel)).join(' | ')} |`);
  row('**EBE**', 'ebe');
  L.push(`| Amortissements | ${r.res.map(() => sg(-r.amort)).join(' | ')} |`);
  row('Résultat d\'exploitation', 'rex');
  L.push(`| Intérêts | ${r.res.map((y, i) => sg(-r.dette[i].interets)).join(' | ')} |`);
  row('Résultat avant impôt', 'rai');
  row(`Impôt (${pc(r.pct_is)} à titre d'exemple)`, 'is_', true);
  row('**Résultat net**', 'rn');
  L.push('');
  return L.join('\n');
}

function indicateurs(c, dev, filiere) {
  const re = c.re, pe = c.pe, cr = c.cr;
  const L = [];
  L.push('### Seuil de rentabilité (année 2, croisière)');
  L.push('');
  L.push(`- Taux de marge sur coûts variables : (${f1(re.ca)} − ${f1(re.cv)}) ÷ ${f1(re.ca)} = **${pc(re.tm, 1)}**`);
  L.push(`- Coûts fixes totaux : personnel ${f1(re.personnel)} + charges fixes ${f1(re.fixes)} + amortissements ${f1(re.amort)} + intérêts ${f1(re.dette[1].interets)} = **${f1(re.cf_tot)}**`);
  L.push(`- Seuil de rentabilité = ${f1(re.cf_tot)} ÷ ${(Math.round(re.tm * 1000) / 1000).toString().replace('.', ',')} = **${f1(re.seuil)}**, soit ${pc(re.seuil / re.ca)} du chiffre d'affaires réaliste (marge de sécurité : ${pc(1 - re.seuil / re.ca)}).`);
  L.push('');
  L.push('### Couverture de la dette (DSCR, année 2)');
  L.push('');
  L.push('| Scénario | CA | EBE | Flux disponible | Service de la dette | DSCR |');
  L.push('|---|---|---|---|---|---|');
  for (const [lab, x] of [['Réaliste', re], [filiere.pe, pe], [filiere.cr, cr]]) {
    L.push(`| ${lab} | ${f1(x.ca)} | ${f1(x.res[1].ebe)} | ${f1(x.flux_dispo)} | ${f1(x.service2)} | **${f2(x.dscr)}** |`);
  }
  L.push('');
  L.push('### Flux du projet, VAN et TRI');
  L.push('');
  L.push(`Flux avant financement : année 0 = − ${f1(re.cout)} ; chaque année, EBE − impôt sur le résultat d'exploitation ; année 5, ajout de la valeur résiduelle (valeur nette comptable ${f1(re.vnc5)} + BFR récupéré ${f1(re.bfr)}).`);
  L.push('');
  L.push('| | Année 0 | Année 1 | Année 2 | Année 3 | Année 4 | Année 5 |');
  L.push('|---|---|---|---|---|---|---|');
  L.push(`| Flux réaliste | ${re.flux.map(sg).join(' | ')} |`);
  L.push('');
  L.push('| Scénario | VAN (' + pc(re.act) + ') | TRI | Délai de récupération |');
  L.push('|---|---|---|---|');
  for (const [lab, x] of [['Réaliste', re], [filiere.pe, pe], [filiere.cr, cr]]) {
    L.push(`| ${lab} | ${sg(x.van)} | ${pc(x.tri, 1)} | ${x.payback ? f1(x.payback) + ' ans' : 'au-delà de 5 ans'} |`);
  }
  L.push('');
  return L.join('\n');
}

function page(meta) {
  const { c, dev, intro, hyp, charges, specifique, lecons, exo, filiere } = meta;
  const re = c.re;
  return `### À propos de ce cas

${intro}

**Les chiffres sont des hypothèses pédagogiques reconstituées** : ils sont cohérents entre eux (calculés par script, avec la même méthode que le cas Diap Touré de la formation) mais ne sont pas des données de marché. Remplacez chaque prix, chaque coût et chaque rendement par vos devis et vos relevés datés avant de les utiliser dans un dossier.

### Le projet

${hyp}

### Charges variables

${charges}

${tableauCommun(re, dev)}
${indicateurs(c, dev, filiere)}
### Lecture du cas

${specifique}

### Pour aller plus loin

${lecons}

### Exercice

${exo}
`;
}

const P = J.poulet, A = J.attieke;
const poulet = page({
  c: P, dev: 'FCFA', filiere: { pe: 'Pessimiste (mortalité + 2 pts, aliment + 4 %, prix − 3 %)', cr: 'Crise (aliment + 15 %, prix − 4 %)' },
  intro: `**Ama Koffi** (nom fictif), technicienne d'élevage, souhaite créer une ferme de poulets de chair en périphérie de Lomé, au Togo, après quatre ans d'expérience dans une ferme avicole. Elle vise une clientèle de rôtisseurs, de restaurants et de revendeurs du marché. Forme juridique envisagée : SARL à associé unique. Monnaie : FCFA.`,
  hyp: `- **Capacité :** 3 bâtiments de 2 000 places, **6 bandes par an** par bâtiment (42 jours d'élevage plus un vide sanitaire), soit **36 000 poussins mis en place par an**.
- **Performance :** mortalité de 6 %, poids de vente de 2,0 kg, indice de consommation de 1,75 kg d'aliment par kg de poids vif.
- **Prix :** poussin d'un jour 550 FCFA ; aliment 380 FCFA/kg ; poulet vendu **3 000 FCFA** pièce.
- **Année 1 :** 80 % de la pleine production (rodage des premières bandes) ; les coûts suivent la production.
- **Chiffre d'affaires de croisière :** 36 000 × (1 − 6 %) × 3 000 FCFA = **${f1(P.re.ca)} M FCFA**.`,
  charges: `Par poussin mis en place : poussin 550 FCFA, aliment 1,75 × 2,0 kg × 380 FCFA = 1 330 FCFA, produits vétérinaires 90 FCFA, litière 100 FCFA, eau, énergie et divers 100 FCFA, soit **2 170 FCFA** ; pour 36 000 sujets, **${f1(P.re.cv)} M FCFA**. L'**aliment représente environ 61 %** de ce coût : c'est la première variable à surveiller.

Charges fixes : ${f1(P.re.fixes)} M FCFA par an (assurance, entretien, eau et énergie, comptabilité, commercial). Personnel permanent : ${f1(P.re.personnel)} M FCFA par an (responsable d'élevage, ouvriers, gardien, cotisations).`,
  specifique: `- **Une marge fine.** L'EBE de croisière (${f1(P.re.res[1].ebe)} M FCFA) ne représente que ${pc(P.re.res[1].ebe / P.re.ca)} du chiffre d'affaires, contre ${pc(25.3 / 54.4)} pour Diap Touré. Le seuil de rentabilité (${pc(P.re.seuil / P.re.ca)} du CA) est proche de celui de Diap, mais le **taux de marge sur coûts variables n'est que de ${pc(P.re.tm)}** : une variation de quelques points du prix de l'aliment ou du prix de vente change tout.
- **DSCR :** ${f2(P.re.dscr)} en scénario réaliste, ${f2(P.pe.dscr)} en scénario pessimiste (la dette est tout juste couverte), ${f2(P.cr.dscr)} en crise. La banque exigera des garanties et une réserve de trésorerie.
- **VAN :** ${sg(P.re.van)} M FCFA en réaliste (TRI ${pc(P.re.tri, 1)}) ; ${sg(P.pe.van)} M en pessimiste, c'est-à-dire que le projet ne rémunère plus l'argent investi au taux de ${pc(P.re.act)}.
- **Leviers de mitigation :** contrat d'approvisionnement en aliment à prix connu, contrats de vente avec les rôtisseurs et les restaurants, respect strict de la biosécurité et du vide sanitaire, générateur de secours pour la ventilation et le chauffage, assurance si une offre existe (voir la fiche Cadre pays du Togo).`,
  lecons: `Revoyez la leçon 5.7 (seuil, DSCR, VAN, TRI) et la leçon 6.1 (risques) en les appliquant à ce cas. Pour le contexte togolais, la fiche Cadre pays du Togo liste les statuts, le foncier, la fiscalité à vérifier et les financeurs.`,
  exo: `1. Refaites le calcul du coût variable par poussin avec **vos** prix d'aliment et de poussin.
2. Quel prix de vente minimal couvre exactement le seuil de rentabilité pour 36 000 poussins ? (Indice : coûts fixes totaux ÷ nombre de poulets vendus, plus le coût variable par poulet.)
3. Que devient le DSCR si l'aliment augmente de 10 % et que le prix de vente reste inchangé ?
4. Proposez deux mesures chiffrées pour ramener le DSCR pessimiste au-dessus de 1,3.

**Critères de réussite :** vos calculs reprennent les mêmes méthodes que dans la leçon 5.7, chaque hypothèse porte une source et une date, et vos mesures de mitigation sont chiffrées.`,
});

const attieke = page({
  c: A, dev: 'FCFA', filiere: { pe: 'Pessimiste (rendement − 3 %, pertes 5 %, prix − 7 %, manioc + 5 %)', cr: 'Crise de prix (− 20 %)' },
  intro: `**Mariam Ouattara** (nom fictif) crée une unité de transformation du manioc en attiéké dans le sud de la Côte d'Ivoire. Elle achète le manioc à des producteurs sous contrat, le transforme dans une petite usine (râpage, pressage, granulation, cuisson à la vapeur) et le vend emballé à des grossistes et à des commerces d'Abidjan. Forme juridique envisagée : SARL. Monnaie : FCFA.`,
  hyp: `- **Capacité :** **1,2 tonne de manioc frais par jour**, 250 jours par an, soit **300 tonnes de manioc** par an.
- **Rendement :** 0,55 kg d'attiéké par kg de manioc ; pertes de 3 % ; volume vendable d'environ ${fr(300000 * 0.55 * 0.97)} kg.
- **Prix :** manioc acheté 110 FCFA/kg ; attiéké vendu **600 FCFA/kg** en gros.
- **Année 1 :** 75 % de la pleine capacité ; les coûts de production suivent le volume.
- **Chiffre d'affaires de croisière :** **${f1(A.re.ca)} M FCFA**.`,
  charges: `Charges variables de croisière : manioc 33,0 M FCFA, emballage et étiquetage 6,6 (40 FCFA/kg d'attiéké), énergie, gaz et eau 4,2, journalières de transformation et manutention 11,0, transport 4,0, soit **${f1(A.re.cv)} M FCFA**. Charges fixes : ${f1(A.re.fixes)} M FCFA par an. Personnel permanent : ${f1(A.re.personnel)} M FCFA par an.`,
  specifique: `- **Une marge confortable mais dépendante de la matière première.** Le taux de marge sur coûts variables est de ${pc(A.re.tm)} et l'EBE de croisière de ${f1(A.re.res[1].ebe)} M FCFA (${pc(A.re.res[1].ebe / A.re.ca)} du CA). Le manioc représente plus de la moitié des charges variables : un approvisionnement sous contrat est la clé du modèle.
- **DSCR :** ${f2(A.re.dscr)} en réaliste, ${f2(A.pe.dscr)} en pessimiste, ${f2(A.cr.dscr)} en crise de prix de 20 %. Le projet tient un recul modeste mais pas une chute de prix durable.
- **VAN :** ${sg(A.re.van)} M FCFA en réaliste (TRI ${pc(A.re.tri, 1)}), ${sg(A.pe.van)} M en pessimiste.
- **Leviers de mitigation :** contrats de culture avec des producteurs de manioc (prix et calendrier), stock de sécurité, contrats de livraison avec des grossistes, normes d'hygiène et agrément pour accéder aux supermarchés, énergie de secours.
- **Différence avec un projet de culture :** ici le risque principal n'est pas le climat mais le **prix et la disponibilité de la matière première**, et la régularité de la qualité.`,
  lecons: `Revoyez la leçon 5.7 (seuil, DSCR, VAN, TRI) et la leçon 4.2 (contrats et lettres d'intention). Pour le contexte ivoirien (certificat foncier, identifiant unique, financeurs), voyez la fiche Cadre pays de la Côte d'Ivoire.`,
  exo: `1. Recalculez le chiffre d'affaires et le coût de la matière première avec **vos** prix du manioc et de l'attiéké.
2. À partir de quel prix d'achat du manioc le DSCR passe-t-il sous 1,2 ? Testez par pas de 10 FCFA/kg.
3. Rédigez une lettre d'intention d'achat pour 30 tonnes d'attiéké par an à destination d'un grossiste (modèle de la leçon 4.2).
4. Proposez un plan d'approvisionnement en manioc sur 12 mois avec au moins deux fournisseurs.

**Critères de réussite :** vos calculs sont reproductibles, chaque prix porte une source et une date, et le plan d'approvisionnement traite la saisonnalité du manioc.`,
});

const mk = (slug, titre, resume, contenu) => `import type { CasChiffre } from './types'

export const ${slug.replace(/-/g, '_')}: CasChiffre = {
  slug: '${slug}',
  titre: ${JSON.stringify(titre)},
  pays: ${JSON.stringify(slug.includes('togo') ? 'Togo' : "Côte d'Ivoire")},
  monnaie: 'FCFA',
  resume: ${JSON.stringify(resume)},
  contenu: ${JSON.stringify(contenu)},
}
`;
fs.mkdirSync('src/content/cas-chiffres', { recursive: true });
fs.writeFileSync('src/content/cas-chiffres/poulet-togo.ts', mk('poulet-togo', 'Poulet de chair au Togo', `Élevage de 36 000 poulets par an : marge fine, DSCR de ${f2(P.re.dscr)} en réaliste, ${f2(P.pe.dscr)} en pessimiste.`, poulet).replace(/\n/g, '\r\n'));
fs.writeFileSync('src/content/cas-chiffres/attieke-cote-d-ivoire.ts', mk('attieke-cote-d-ivoire', "Transformation du manioc en attiéké en Côte d'Ivoire", `Unité de 300 t de manioc par an : DSCR de ${f2(A.re.dscr)} en réaliste, ${f2(A.pe.dscr)} en pessimiste.`, attieke).replace(/\n/g, '\r\n'));
fs.writeFileSync('src/content/cas-chiffres/types.ts', `export interface CasChiffre {
  slug: string
  titre: string
  pays: string
  monnaie: string
  resume: string
  contenu: string
}
`.replace(/\n/g, '\r\n'));
fs.writeFileSync('src/content/cas-chiffres/index.ts', `import type { CasChiffre } from './types'
import { poulet_togo } from './poulet-togo'
import { attieke_cote_d_ivoire } from './attieke-cote-d-ivoire'

/** Cas chiffrés complémentaires au cas fil rouge Diap Touré (calculés par scripts/modeles_bp/cas_chiffres.py). */
export const CAS_CHIFFRES: CasChiffre[] = [poulet_togo, attieke_cote_d_ivoire]

export const trouverCas = (slug: string) => CAS_CHIFFRES.find((c) => c.slug === slug)
`.replace(/\n/g, '\r\n'));
console.log('pages cas écrites');
