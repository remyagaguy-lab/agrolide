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

const P = J.poulet, A = J.attieke, M = J.maraichage;
// (l'aquaculture est définie plus bas : const Q)
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


const maraichage = page({
  c: M, dev: 'FCFA', filiere: { pe: 'Pessimiste (rendement − 5 %, prix − 5 %, pertes + 2 points)', cr: 'Crise de prix (− 15 %)' },
  intro: `**Rufine Agossou** (nom fictif) s'installe comme maraîchère sur 3 hectares irrigués au sud du Bénin, après plusieurs années de culture sur de petites parcelles familiales. Elle vend de la tomate et du chou à des grossistes de marché et à des restaurateurs. Forme juridique envisagée : SARL à associé unique. Monnaie : FCFA.`,
  hyp: `- **Surfaces et cycles :** 1,5 ha de tomate (1 cycle par an, 25 t/ha) et 1,5 ha de chou (2 cycles par an, 30 t/ha), soit **37,5 t de tomate et 90 t de chou** par an.
- **Prix de vente :** tomate **250 FCFA/kg**, chou **180 FCFA/kg** (prix moyens retenus par hypothèse ; à relever sur votre marché, avec la date).
- **Pertes après récolte :** 10 % (tri, transport, invendus).
- **Année 1 :** 85 % de la pleine production ; les coûts suivent la production.
- **Chiffre d'affaires de croisière :** (37,5 t × 250 + 90 t × 180) × (1 − 10 %) = **${f1(M.re.ca)} M FCFA**.`,
  charges: `Intrants par hectare et par cycle : tomate 1,6 M FCFA, chou 1,0 M FCFA, soit 1,5 × 1,6 + 3 × 1,0 = 5,4 M FCFA par an. S'y ajoutent la main-d'œuvre saisonnière (4,0), les caisses et le transport (1,6), l'eau et l'énergie (1,2) : **${f1(M.re.cv)} M FCFA** de charges variables. Charges fixes : ${f1(M.re.fixes)} M FCFA par an. Personnel permanent (chef de culture, gardien) : ${f1(M.re.personnel)} M FCFA par an.`,
  specifique: `- **Une petite exploitation : les coûts fixes pèsent lourd.** Le taux de marge sur coûts variables est correct (${pc(M.re.tm)}), mais l'EBE de croisière (${f1(M.re.res[1].ebe)} M FCFA, ${pc(M.re.res[1].ebe / M.re.ca)} du CA) doit supporter ${f1(M.re.cf_tot)} M FCFA de coûts fixes totaux. Le seuil de rentabilité atteint ${pc(M.re.seuil / M.re.ca)} du chiffre d'affaires : la marge de sécurité n'est que de ${pc(1 - M.re.seuil / M.re.ca)}.
- **DSCR :** ${f2(M.re.dscr)} en réaliste, ${f2(M.pe.dscr)} en pessimiste, ${f2(M.cr.dscr)} en crise de prix de 15 % : dès que les prix reculent un peu, l'exploitation ne couvre plus l'annuité.
- **VAN :** ${sg(M.re.van)} M FCFA en réaliste (TRI ${pc(M.re.tri, 1)}, délai de récupération ${f1(M.re.payback)} ans) ; ${sg(M.pe.van)} M en pessimiste. Le projet est rentable mais fragile : il ne résisterait pas à deux mauvaises campagnes de suite.
- **Leviers :** ajouter un troisième cycle de culture par an ou une culture à plus forte valeur, contrats avec des restaurateurs, calendrier décalé pour étaler les ventes, stockage frais ou conditionnement pour limiter les pertes, et une réserve de trésorerie. Chaque levier doit être chiffré avec le même modèle.`,
  lecons: `Revoyez la leçon 3.2 (calendrier de production), la leçon 5.7 (seuil, DSCR, VAN, TRI) et la leçon 6.1 (risques). Pour le contexte béninois, voyez la fiche Cadre pays du Bénin.`,
  exo: `1. Recalculez le chiffre d'affaires et les intrants avec **vos** rendements et **vos** prix relevés sur votre marché (avec la date).
2. De combien de points faut-il réduire les pertes après récolte pour que le DSCR pessimiste passe au-dessus de 1,2 ?
3. Que devient le seuil de rentabilité si vous ajoutez 1 ha de chou (même rendement, mêmes intrants par hectare, 1 500 000 FCFA d'investissement supplémentaire) ?
4. Construisez un calendrier décalé de deux mois pour la tomate afin d'étaler les ventes.

**Critères de réussite :** vos calculs sont reproductibles, chaque prix porte une source et une date, et chaque levier de mitigation est chiffré.`,
});

const Q = J.aquaculture;
const aqVendus = 36000 * 0.85, aqKg = aqVendus * 0.42, aqAliment = (aqKg * 1.6 * 580) / 1e6;
const aquaculture = page({
  c: Q, dev: 'FCFA', filiere: { pe: 'Pessimiste (mortalité + 5 points, aliment + 8 %, prix − 5 %)', cr: "Crise de l'aliment (aliment + 20 %, prix − 5 %)" },
  intro: `**Abdou Sarr** (nom fictif) crée une ferme de tilapia en étangs dans la région de Thiès, au Sénégal, après quelques années comme technicien dans une station piscicole. Il vend du poisson frais entier à des grossistes, à des restaurants et à des poissonneries de Dakar et de Thiès. Forme juridique envisagée : SARL à associé unique. Monnaie : FCFA.`,
  hyp: `- **Capacité :** 12 étangs de 500 m² (6 000 m²), **3 alevins par m²**, soit 18 000 alevins par cycle ; **2 cycles par an** (environ 6 mois chacun, vide et assec compris), soit **36 000 alevins mis en charge par an**.
- **Performance :** survie de 85 %, poids de vente de 420 g, indice de conversion de 1,6 kg d'aliment par kg de poisson produit.
- **Volumes :** 36 000 × 85 % = ${fr(aqVendus)} poissons vendus, soit environ **${fr(aqKg)} kg** par an.
- **Prix :** alevin 50 FCFA ; aliment 580 FCFA/kg ; poisson frais vendu **2 600 FCFA/kg** en gros (prix par hypothèse, à relever sur votre marché avec la date).
- **Année 1 :** 70 % de la pleine production (mise en eau et premier cycle décalé) ; les coûts suivent la production.
- **Chiffre d'affaires de croisière :** ${fr(aqKg)} kg × 2 600 FCFA = **${f1(Q.re.ca)} M FCFA**.`,
  charges: `Aliment : ${fr(aqKg)} kg × 1,6 × 580 FCFA = **${f1(aqAliment)} M FCFA**, soit **${pc(aqAliment / Q.re.cv)} des charges variables** ; alevins : 36 000 × 50 FCFA = 1,8 M ; main-d'œuvre saisonnière (nourrissage de pointe, pêche) 1,2 M ; énergie et pompage 2,0 M ; glace et transport 1,2 M ; chaux, fertilisation et soins 0,6 M, soit **${f1(Q.re.cv)} M FCFA** au total. Charges fixes : ${f1(Q.re.fixes)} M FCFA par an. Personnel permanent (chef de ferme, ouvrier, gardien) : ${f1(Q.re.personnel)} M FCFA par an.`,
  specifique: `- **L'aliment mène le résultat.** Il pèse ${pc(aqAliment / Q.re.cv)} des charges variables : une hausse de 20 % du prix de l'aliment (avec un prix de vente en recul de 5 %) fait tomber le DSCR à ${f2(Q.cr.dscr)}. C'est la première variable à suivre, avant même le prix de vente.
- **Une marge de sécurité étroite.** Taux de marge sur coûts variables de ${pc(Q.re.tm)}, mais ${f1(Q.re.cf_tot)} M FCFA de coûts fixes totaux : le seuil de rentabilité atteint ${pc(Q.re.seuil / Q.re.ca)} du chiffre d'affaires, soit une marge de sécurité de ${pc(1 - Q.re.seuil / Q.re.ca)}.
- **DSCR :** ${f2(Q.re.dscr)} en réaliste, ${f2(Q.pe.dscr)} en pessimiste, ${f2(Q.cr.dscr)} en crise de l'aliment : dès que la survie baisse de cinq points ou que l'aliment renchérit, l'annuité n'est plus couverte.
- **VAN :** ${sg(Q.re.van)} M FCFA en réaliste (TRI ${pc(Q.re.tri, 1)}, délai de récupération au-delà de 5 ans) ; ${sg(Q.pe.van)} M en pessimiste. L'aquaculture immobilise beaucoup (étangs, eau) pour un retour lent : un financement à durée longue ou une subvention d'équipement change le projet.
- **Leviers :** réduire la mortalité (qualité de l'eau, alevins de station reconnue, densité maîtrisée), améliorer l'indice de conversion (aliment adapté, rationnement), contrats avec des restaurateurs, vente de poisson de plus de 500 g à meilleur prix, plan de repli en cas de manque d'eau. Chaque levier doit être chiffré avec le même modèle.`,
  lecons: `Revoyez la leçon 5.7 (seuil, DSCR, VAN, TRI) et la leçon 6.1 (risques). Pour le contexte sénégalais (statuts, foncier, financeurs), voyez la fiche Cadre pays du Sénégal ; vérifiez en outre les autorisations propres à l'aquaculture (prélèvement d'eau, rejets, agrément sanitaire) auprès de l'administration compétente, avec date et source.`,
  exo: `1. Recalculez la production et le chiffre d'affaires avec **votre** densité, **votre** survie et **votre** poids de vente.
2. De combien de points faut-il améliorer l'indice de conversion pour que le DSCR pessimiste dépasse 1,0 ?
3. Que devient le seuil de rentabilité si vous ajoutez 4 étangs (investissement de 3,3 M FCFA, mêmes performances, même personnel) ?
4. Proposez deux mesures chiffrées pour réduire la mortalité et en estimer l'effet sur le chiffre d'affaires.

**Critères de réussite :** vos calculs sont reproductibles, chaque hypothèse porte une source et une date, et chaque mesure de mitigation est chiffrée.`,
});

const G = J.mangue;
const mangue = page({
  c: G, dev: 'FCFA', filiere: { pe: 'Pessimiste (rendement − 3 %, pertes 6 %, prix − 5 %, fruits + 8 %)', cr: 'Crise de prix (− 15 %)' },
  intro: `**Fatimath Dossou** (nom fictif) crée une petite unité de séchage de mangues dans le nord du Bénin, là où la production de fruits dépasse largement ce que le marché frais absorbe en saison. Elle achète les fruits à des producteurs, les lave, les découpe, les sèche, les emballe et les vend à des grossistes, des supermarchés et un exportateur. Forme juridique envisagée : SARL. Monnaie : FCFA.`,
  hyp: `- **Campagne :** **100 jours par an**, **1,8 tonne de fruits frais par jour**, soit **180 tonnes de mangues** traitées dans l'année. La matière première est saisonnière : l'unité ne tourne qu'en saison.
- **Rendement :** 0,11 kg de mangue séchée pour 1 kg de fruits frais (environ 9 kg de fruits pour 1 kg de produit sec) ; pertes de 4 % au conditionnement ; volume vendable d'environ ${fr(180000 * 0.11 * 0.96)} kg.
- **Prix :** fruits achetés 110 FCFA/kg ; mangue séchée vendue **4 000 FCFA/kg** en gros (hypothèse à remplacer par vos relevés datés et vos devis d'acheteurs).
- **Année 1 :** 70 % de la pleine capacité (rodage, premiers contrats) ; les coûts de production suivent le volume.
- **Chiffre d'affaires de croisière :** **${f1(G.re.ca)} M FCFA**.`,
  charges: `Charges variables de croisière : fruits 19,8 M FCFA, emballage 5,9 (300 FCFA par kg de produit emballé), énergie de séchage 5,0, main-d'œuvre saisonnière (tri, épluchage, découpe) 11,0, transport et contrôles de qualité 3,0, soit **${f1(G.re.cv)} M FCFA**. Charges fixes : ${f1(G.re.fixes)} M FCFA par an. Personnel permanent : ${f1(G.re.personnel)} M FCFA par an.`,
  specifique: `- **Le rendement matière décide tout.** Il faut environ 9 kg de fruits pour 1 kg de produit : le prix des fruits ne pèse que ${pc(19.8 / G.re.cv)} des charges variables, mais le rendement, les pertes et la qualité déterminent le volume vendable. Mesurez-les sur vos propres lots avant tout engagement.
- **Une activité saisonnière.** L'investissement (${f1(G.re.immos)} M FCFA) travaille 100 jours par an. Seuil de rentabilité à ${pc(G.re.seuil / G.re.ca)} du chiffre d'affaires, marge de sécurité de ${pc(1 - G.re.seuil / G.re.ca)} : la rentabilité repose sur l'étalement des coûts fixes et sur un bon taux d'utilisation de la campagne.
- **DSCR :** ${f2(G.re.dscr)} en réaliste, ${f2(G.pe.dscr)} en pessimiste (la dette est tout juste couverte), ${f2(G.cr.dscr)} en crise de prix de 15 %.
- **VAN :** ${sg(G.re.van)} M FCFA en réaliste (TRI ${pc(G.re.tri, 1)}, délai de récupération ${f1(G.re.payback)} ans) ; ${sg(G.pe.van)} M en pessimiste : le projet ne rémunère plus l'argent investi au taux de ${pc(G.re.act)}.
- **Leviers :** contrats d'achat des fruits à prix et calendrier connus, contrats de vente (supermarchés, exportateur) avant d'investir, certification et normes d'hygiène exigées par les acheteurs, usage d'un autre produit en dehors de la saison de la mangue pour amortir les séchoirs, énergie de secours. Chaque levier doit être chiffré avec le même modèle.`,
  lecons: `Revoyez la leçon 5.7 (seuil, DSCR, VAN, TRI), la leçon 4.2 (contrats et lettres d'intention) et la leçon 6.1 (risques). Pour le contexte béninois (statuts, normes, financeurs), voyez la fiche Cadre pays du Bénin ; vérifiez aussi les normes sanitaires et d'étiquetage de vos acheteurs, avec date et source.`,
  exo: `1. Recalculez le chiffre d'affaires et le coût des fruits avec **votre** rendement mesuré et **vos** prix relevés (avec la date).
2. À partir de quel prix d'achat des fruits le DSCR passe-t-il sous 1,2 ? Testez par pas de 10 FCFA/kg.
3. Que devient le seuil de rentabilité si vous traitez aussi un second produit pendant 60 jours (mêmes séchoirs, 40 tonnes de fruits, mêmes marges) ?
4. Rédigez une lettre d'intention d'achat pour 5 tonnes de produit sec par an (modèle de la leçon 4.2).

**Critères de réussite :** vos calculs sont reproductibles, chaque rendement et chaque prix porte une source et une date, et l'étalement de la saisonnalité est chiffré.`,
});

const S = J.mecanisation;
const sHa = 2 * 480, sT = 2 * 900;
const sLabour = sHa * 0.035, sBattage = sT * 0.017, sBrut = sLabour + sBattage;
const sGasoil = (sHa * 12 + sT * 4) * 0.00075;
const mecanisation = page({
  c: S, dev: 'FCFA', filiere: { pe: 'Pessimiste (activité − 15 %, impayés 10 %, gasoil + 10 %, entretien + 15 %)', cr: 'Mauvaise saison (activité − 30 %, impayés 15 %)' },
  intro: `**Moussa Ouédraogo** (nom fictif) monte une entreprise de services de mécanisation dans l'ouest du Burkina Faso, dans une zone où beaucoup de petits producteurs de maïs, de riz et de sorgho labourent encore à la main ou à la traction animale et ne peuvent pas acheter un tracteur. Il leur vend un **service** : le labour à l'hectare et le battage à la tonne. Les producteurs paient en partie à la prestation, en partie à la récolte. Forme juridique envisagée : SARL. Monnaie : FCFA.`,
  hyp: `- **Labour :** **2 tracteurs de 75 CV**, chacun **480 hectares par an** (deux campagnes), soit **${fr(sHa)} ha** à **35 000 FCFA/ha** : ${f1(sLabour)} M FCFA.
- **Battage :** **2 batteuses**, chacune **900 tonnes par an**, soit **${fr(sT)} t** à **17 000 FCFA/t** : ${f1(sBattage)} M FCFA.
- **Chiffre d'affaires brut :** ${f1(sBrut)} M FCFA. **Impayés et rabais :** 5 % du brut, soit ${f1(sBrut * 0.05)} M FCFA : le chiffre d'affaires encaissé de croisière est de **${f1(S.re.ca)} M FCFA**.
- **Année 1 :** 65 % de l'activité de croisière (clientèle à constituer, premières saisons) ; les charges variables suivent l'activité.
- **Tarifs et rendements horaires :** hypothèses pédagogiques, à remplacer par vos devis et par les tarifs relevés auprès des prestataires de votre zone (avec la date).`,
  charges: `Charges variables de croisière : gasoil ${f1(sGasoil)} M FCFA (12 litres par hectare labouré et 4 litres par tonne battue, à 750 FCFA le litre), pièces et entretien 6,8 (10 % de la valeur du matériel, 68,0 M FCFA), opérateurs saisonniers 3,0, transport du matériel et petits frais 1,5, soit **${f1(S.re.cv)} M FCFA**. Charges fixes : ${f1(S.re.fixes)} M FCFA par an (assurance, local, gestion). Personnel permanent (deux mécaniciens et un gestionnaire) : ${f1(S.re.personnel)} M FCFA par an.`,
  specifique: `- **Le matériel ne rapporte que s'il travaille.** L'investissement (${f1(S.re.immos)} M FCFA) est dominé par les machines. Chaque hectare ou tonne de moins ne fait baisser que le chiffre d'affaires, pas les amortissements ni les mensualités : le taux d'utilisation est le premier levier. Seuil de rentabilité à ${pc(S.re.seuil / S.re.ca)} du chiffre d'affaires, marge de sécurité de ${pc(1 - S.re.seuil / S.re.ca)}.
- **Un service à crédit.** Les producteurs paient souvent à la récolte, pas au labour : besoin en fonds de roulement de ${f1(S.re.bfr)} M FCFA, et impayés à provisionner dans le plan (5 % ici). Un service sans suivi des créances se finance sur les fonds du prestataire.
- **Le gasoil et les pannes.** Le gasoil pèse ${pc(sGasoil / S.re.cv)} des charges variables, l'entretien ${pc(6.8 / S.re.cv)}. Une panne en pleine saison coûte du chiffre d'affaires que l'on ne rattrape pas, car la fenêtre de labour est courte.
- **DSCR :** ${f2(S.re.dscr)} en réaliste, ${f2(S.pe.dscr)} en pessimiste (la dette est couverte, de peu), ${f2(S.cr.dscr)} en mauvaise saison : l'annuité n'est plus couverte.
- **VAN :** ${sg(S.re.van)} M FCFA en réaliste (TRI ${pc(S.re.tri, 1)}, délai de récupération ${f1(S.re.payback)} ans) ; ${sg(S.pe.van)} M en pessimiste : le projet ne rémunère plus l'argent investi au taux de ${pc(S.re.act)}.
- **Leviers :** calendrier des chantiers et réservations avant la saison, acomptes ou paiement à la prestation, contrats avec des coopératives, entretien préventif et pièces en stock, formation des opérateurs, activité hors saison (transport, location). Chaque levier doit être chiffré avec le même modèle.`,
  lecons: `Revoyez la leçon 5.7 (seuil, DSCR, VAN, TRI), la leçon 4.2 (contrats et lettres d'intention) et la leçon 6.1 (risques). Pour le contexte du Burkina Faso (statuts, financeurs, dispositifs d'appui), voyez la fiche Cadre pays ; vérifiez les droits et taxes sur l'importation du matériel et les conditions d'immatriculation des engins, avec date et source.`,
  exo: `1. Recalculez le chiffre d'affaires de croisière avec **vos** surfaces à labourer et **vos** tarifs relevés (avec la date).
2. Quel nombre d'hectares par tracteur et par an donne un DSCR de 1,2 ? Testez par pas de 20 ha.
3. Que devient le DSCR si les impayés passent de 5 % à 10 % ? Quelles mesures chiffrées les ramènent à 5 % ?
4. Rédigez une lettre d'intention d'une coopérative pour 150 ha de labour par an (modèle de la leçon 4.2).

**Critères de réussite :** vos calculs sont reproductibles, chaque tarif et chaque hypothèse d'activité porte une source et une date, et les impayés sont chiffrés.`,
});

const Z = J.riz, ZE = Z.extras, zp = ZE.par_ha, zn = ZE.ha_camp;
const zTonnes = ZE.tonnes;
const f3 = (x) => x.toFixed(3).replace('.', ',');
const zLig = (lab, k) => `${lab} ${f1(zn * zp[k])}`;
const zHaussePt = (1 + ZE.cout_stock + ZE.taux_argent * ZE.mois / 12) / (1 - ZE.perte_stock) - 1;
const riz = page({
  c: Z, dev: 'FCFA', filiere: { pe: 'Pessimiste (rendement − 5 %, prix − 4 %, engrais + 10 %, labour et battage + 5 %)', cr: 'Mauvaise campagne (rendement − 20 %, prix − 5 %)' },
  intro: `**Fanta Coulibaly** (nom fictif) cultive du riz sur 15 hectares aménagés avec maîtrise de l'eau, dans le centre du Mali, sur une terre dont elle dispose par un accord écrit avec sa famille. Elle réalise **deux campagnes par an** (hivernage et contre-saison) et vend son paddy à des transformateurs et à des commerçants de la région. Forme juridique envisagée : SARL à associé unique. Monnaie : FCFA.`,
  hyp: `- **Surface et campagnes :** 15 ha, 2 campagnes par an, soit **${zn} hectares-campagnes**.
- **Rendement :** ${fr(ZE.rdt_kg)} kg de paddy par hectare et par campagne (hypothèse pédagogique pour un périmètre bien conduit ; à remplacer par les rendements mesurés dans votre zone, avec la date) ; pertes de ${pc(ZE.perte)} à la récolte et au séchage ; volume vendable d'environ **${f1(zTonnes)} t** par an.
- **Prix :** paddy vendu **190 FCFA/kg** à la récolte (hypothèse pédagogique ; à relever sur votre marché, avec la date).
- **Année 1 :** 80 % de la pleine production (mise en route de l'aménagement, première campagne décalée) ; les coûts suivent la production.
- **Chiffre d'affaires de croisière :** ${f1(zTonnes)} t × 190 FCFA/kg = **${f1(Z.re.ca)} M FCFA**.`,
  charges: `Par hectare et par campagne : semences ${f3(zp.semences)} M FCFA, engrais ${f3(zp.engrais)}, produits phytosanitaires ${f3(zp.phyto)}, eau et énergie de pompage ${f3(zp.eau)}, labour et battage en prestation ${f3(zp.labour_battage)}, main-d'œuvre (repiquage, entretien, récolte) ${f3(zp.main_oeuvre)}, sacs et transport ${f3(zp.sacs_transport)}. Pour ${zn} hectares-campagnes : ${zLig('semences', 'semences')}, ${zLig('engrais', 'engrais')}, ${zLig('phytosanitaires', 'phyto')}, ${zLig('eau et énergie', 'eau')}, ${zLig('labour et battage', 'labour_battage')}, ${zLig('main-d\'œuvre', 'main_oeuvre')}, ${zLig('sacs et transport', 'sacs_transport')}, soit **${f1(Z.re.cv)} M FCFA** de charges variables. Charges fixes : ${f1(Z.re.fixes)} M FCFA par an. Personnel permanent (chef de culture, gardien) : ${f1(Z.re.personnel)} M FCFA par an.`,
  specifique: `- **Le rendement porte le projet.** Le taux de marge sur coûts variables est de ${pc(Z.re.tm)} et l'EBE de croisière de ${f1(Z.re.res[1].ebe)} M FCFA (${pc(Z.re.res[1].ebe / Z.re.ca)} du CA). Les charges de la campagne sont engagées avant la récolte : avec un rendement inférieur d'un cinquième et un prix en recul de 5 %, l'EBE de l'année 2 tombe à ${f1(Z.cr.res[1].ebe)} M FCFA.
- **Un seuil assez haut.** Seuil de rentabilité à ${pc(Z.re.seuil / Z.re.ca)} du chiffre d'affaires, soit une marge de sécurité de ${pc(1 - Z.re.seuil / Z.re.ca)} : l'aménagement et les remboursements pèsent dans les coûts fixes totaux (${f1(Z.re.cf_tot)} M FCFA).
- **DSCR :** ${f2(Z.re.dscr)} en réaliste, ${f2(Z.pe.dscr)} en pessimiste (la dette est tout juste couverte), ${f2(Z.cr.dscr)} en mauvaise campagne : une campagne dont le rendement baisse d'un cinquième ne couvre pas l'annuité.
- **VAN :** ${sg(Z.re.van)} M FCFA en réaliste (TRI ${pc(Z.re.tri, 1)}, délai de récupération au-delà de 5 ans) ; ${sg(Z.pe.van)} M en pessimiste : le projet ne rémunère plus l'argent investi au taux de ${pc(Z.re.act)}.
- **Vendre à la récolte ou plus tard.** En stockant ${pc(ZE.part_stockee)} de la récolte (${f1(ZE.vendu_recolte_equiv)} M FCFA) pendant ${ZE.mois} mois, avec une hausse de prix supposée de ${pc(ZE.hausse)} (hypothèse pédagogique), des pertes de stockage de ${pc(ZE.perte_stock)}, des frais de ${pc(ZE.cout_stock)} et un coût de l'argent de ${pc(ZE.taux_argent)} par an, le gain net est de ${f1(ZE.gain_stock)} M FCFA. Il tombe à zéro si la hausse de prix n'atteint que ${pc(zHaussePt, 1)} : le calcul doit se faire avec vos relevés de prix de plusieurs années, pas avec une seule bonne année.
- **Leviers :** semences de qualité et calendrier cultural tenu, maîtrise de l'eau, engrais appliqué aux bons stades, contrats d'achat avec des transformateurs, achat groupé des intrants, séchage et stockage corrects, assurance récolte si une offre existe (voir la fiche Cadre pays du Mali). Chaque levier doit être chiffré avec le même modèle.`,
  lecons: `Revoyez la leçon 5.7 (seuil, DSCR, VAN, TRI), la leçon 4.2 (contrats et lettres d'intention) et la leçon 6.1 (risques). Pour le contexte malien (statuts, foncier, financeurs), voyez la fiche Cadre pays du Mali ; vérifiez en outre les règles d'accès à l'eau et au périmètre aménagé auprès de la structure gestionnaire, avec date et source.`,
  exo: `1. Recalculez le chiffre d'affaires et les charges avec **vos** rendements mesurés, **vos** prix relevés et **vos** doses d'engrais (avec la date).
2. De combien de kilogrammes par hectare le rendement peut-il baisser avant que le DSCR passe sous 1 ? Testez par pas de 100 kg/ha avec le classeur joint.
3. À partir de quelle hausse de prix le stockage de 40 % de la récolte devient-il rentable avec vos propres frais ?
4. Proposez deux mesures chiffrées pour ramener le DSCR de mauvaise campagne au-dessus de 0,8.

**Critères de réussite :** vos calculs sont reproductibles, chaque rendement et chaque prix porte une source et une date, et le choix de vendre à la récolte ou plus tard est chiffré.`,
});

// ---- Cacaoyère (cultures pérennes) : horizon de 15 ans, structure de page propre
const K = J.cacao, KR = K.re, KP = K.pe, KC = K.cr;
const lignesAn = KR.years.map((y) => `| ${y.an} | ${y.vol ? f1(y.vol / 1000) : 'n.d.'} | ${f1(y.ca)} | ${sg(y.ebe)} | ${y.service ? f1(y.service) : '0,0'} | ${y.dscr ? f2(y.dscr) : 'n.d.'} |`).join('\n');
const cacao = `### À propos de ce cas

**Aïcha Traoré** (nom fictif) planifie une cacaoyère de 20 hectares dans le centre-ouest de la Côte d'Ivoire, sur une terre familiale dont elle dispose depuis plusieurs années. Elle vend ses fèves fermentées et séchées à un acheteur local. Forme juridique envisagée : SARL. Monnaie : FCFA.

**Les chiffres sont des hypothèses pédagogiques reconstituées** : ils sont cohérents entre eux (calculés par script, avec la même méthode que le cas Diap Touré, mais sur 15 ans) et ne sont pas des données de marché. Le prix du cacao varie beaucoup d'une campagne à l'autre et, dans certains pays, il est fixé par l'administration : remplacez chaque prix, chaque rendement et chaque coût par vos devis et vos relevés datés avant de les utiliser dans un dossier.

### Le projet

- **Surface :** 20 hectares de cacaoyers, plantés la même année ; cultures associées (plantain, vivrier) les 3 premières années, pour 3,0 M FCFA de recettes par an.
- **Montée en production :** aucune récolte les années 1 à 3 ; 25 % du rendement de croisière l'année 4, 50 % l'année 5, 75 % l'année 6, 100 % à partir de l'année 7.
- **Rendement de croisière :** 900 kg de fèves sèches par hectare, soit **${f1(KR.vol_mat / 1000)} t** par an.
- **Prix :** **1 800 FCFA/kg** de fèves (hypothèse pédagogique ; à relever sur votre marché et auprès de votre acheteur, avec la date).
- **Chiffre d'affaires de croisière :** ${f1(KR.vol_mat / 1000)} t × 1 800 FCFA = **${f1(KR.ca_mat)} M FCFA** par an.

### Charges

- **Entretien de la plantation :** 0,25 M FCFA par hectare les années 1 à 3 (5,0 M FCFA par an), 0,30 M FCFA par hectare ensuite (6,0 M FCFA par an) : désherbage, taille, fertilisation, traitements.
- **Récolte et post-récolte :** 250 FCFA par kg (cueillette, écabossage, fermentation, séchage, sacs, transport), soit ${f1(KR.vol_mat * 250 / 1e6)} M FCFA en croisière.
- **Personnel permanent** (chef de plantation, gardien) : 3,6 M FCFA par an ; **charges fixes** : 1,2 M FCFA par an.

### Coût du projet et financement (en millions de FCFA)

| Poste | Montant | Durée d'amortissement |
|---|---|---|
${KR.immos_list.map(([n, m, d]) => `| ${n} | ${f1(m)} | ${d} ans |`).join('\n')}
| **Total immobilisations** | **${f1(KR.immos)}** | |
| Déficits d'exploitation des années 1 à 5 (avant que la récolte couvre les charges) | ${f1(KR.deficits)} | |
| Intérêts payés pendant le différé de ${KR.differe} ans | ${f1(KR.interets_differe)} | |
| **Coût total du projet** | **${f1(KR.cout)}** | |

**Ressources :** apport ${f1(KR.apport)} (${pc(KR.apport / KR.cout)}) + emprunt ${f1(KR.emprunt)} à ${pc(KR.taux)} sur ${KR.duree} ans dont **${KR.differe} ans de différé** (seuls les intérêts sont payés). À partir de l'année ${KR.differe + 1}, l'annuité constante est d'environ ${f1(KR.annuite)} par an. Les déficits des premières années et les intérêts du différé sont financés par ce montage : une cacaoyère n'est pas un projet où l'on emprunte seulement pour planter.

### Les 15 premières années (scénario réaliste)

| Année | Récolte (t) | Chiffre d'affaires | EBE | Service de la dette | DSCR |
|---|---|---|---|---|---|
${lignesAn}

Lecture : l'EBE est négatif les quatre premières années, positif dès l'année 5 et atteint ${f1(KR.ebe_mat)} M FCFA en croisière. Le DSCR n'a de sens qu'à partir du premier remboursement de capital (année ${KR.differe + 1}).

### Indicateurs sur 15 ans

| Scénario | EBE de croisière | DSCR le plus bas | VAN (${pc(KR.act)}) | TRI | Récupération |
|---|---|---|---|---|---|
| Réaliste | ${f1(KR.ebe_mat)} | ${f2(KR.dscr_min)} | ${sg(KR.van)} | ${pc(KR.tri, 1)} | ${f1(KR.payback)} ans |
| Pessimiste (rendement − 10 %, prix − 10 %, entretien + 10 %) | ${f1(KP.ebe_mat)} | ${f2(KP.dscr_min)} | ${sg(KP.van)} | ${pc(KP.tri, 1)} | ${f1(KP.payback)} ans |
| Crise de prix (− 30 %) | ${f1(KC.ebe_mat)} | ${f2(KC.dscr_min)} | ${sg(KC.van)} | ${pc(KC.tri, 1)} | ${f1(KC.payback)} ans |

Flux avant financement : année 0 = − ${f1(KR.immos)} (immobilisations) ; chaque année, EBE moins l'impôt sur le résultat d'exploitation ; année 15, ajout de la valeur nette comptable restante (${f1(KR.vnc)}). Les déficits d'exploitation des premières années sont dans les flux des années 1 à 4.

### Lecture du cas

- **Un projet de patience.** L'argent sort pendant ${KR.differe} ans avant que la plantation ne le rembourse ; le délai de récupération est de ${f1(KR.payback)} ans. Le plan doit prouver que vous tenez financièrement jusque-là, et pas seulement que le projet est bon en croisière.
- **Le rendement et le prix décident de tout.** Le TRI de ${pc(KR.tri, 1)} dépasse à peine le taux d'actualisation de ${pc(KR.act)}. En pessimiste (rendement et prix en baisse de 10 %, entretien en hausse de 10 %), la VAN devient très négative et le DSCR tombe à ${f2(KP.dscr_min)} : l'annuité n'est plus couverte.
- **Une vraie marge de sécurité, mais seulement en croisière.** Une fois la plantation en production (DSCR de ${f2(KR.dscr_an7)} dès l'année 7), les remboursements sont couverts avec une marge. Les années 6 et suivantes dépendent du rendement atteint.
- **Leviers :** cultures associées plus longtemps, plants sélectionnés et bien entretenus (le rendement est le premier levier), ombrage et taille adaptés, vente à un acheteur qui paie la qualité (fermentation, séchage), réduction de l'emprunt par un apport plus élevé ou une aide à l'investissement si elle existe (voir la fiche Cadre pays de la Côte d'Ivoire), échelonnement de la plantation sur plusieurs années pour étaler les besoins.
- **Risques propres aux cultures pérennes :** maladies et ravageurs, sécheresse, vieillissement de la plantation, prix mondial ou prix administré, sécurité foncière sur la durée du projet.

### Pour aller plus loin

Revoyez la leçon 5.7 (seuil, DSCR, VAN, TRI), la leçon 6.1 (risques) et la fiche Cadre pays de la Côte d'Ivoire (certificat foncier, identifiant unique, financeurs). Sur un projet de 15 ans, vérifiez en particulier la sécurité de votre droit sur la terre pour toute la durée.

### Exercice

1. Recalculez le chiffre d'affaires de croisière avec **votre** rendement et **votre** prix (avec la date et la source).
2. De combien de points faut-il augmenter le rendement pour que la VAN du scénario pessimiste devienne positive ? Testez avec le classeur joint.
3. Que devient le coût du projet si vous plantez 10 hectares la première année et 10 hectares la troisième ?
4. Proposez un plan de financement qui tient pendant la période sans récolte (apport, différé, cultures associées) et chiffrez-le.

**Critères de réussite :** vos calculs sont reproductibles, chaque hypothèse porte une source et une date, et votre plan montre comment vous financez les années sans récolte.
`;

const mk = (slug, titre, resume, contenu, pays) => `import type { CasChiffre } from './types'

export const ${slug.replace(/-/g, '_')}: CasChiffre = {
  slug: '${slug}',
  titre: ${JSON.stringify(titre)},
  pays: ${JSON.stringify(pays)},
  monnaie: 'FCFA',
  resume: ${JSON.stringify(resume)},
  contenu: ${JSON.stringify(contenu)},
}
`;
fs.mkdirSync('src/content/cas-chiffres', { recursive: true });
fs.writeFileSync('src/content/cas-chiffres/poulet-togo.ts', mk('poulet-togo', 'Poulet de chair au Togo', `Élevage de 36 000 poulets par an : marge fine, DSCR de ${f2(P.re.dscr)} en réaliste, ${f2(P.pe.dscr)} en pessimiste.`, poulet, 'Togo').replace(/\n/g, '\r\n'));
fs.writeFileSync('src/content/cas-chiffres/attieke-cote-d-ivoire.ts', mk('attieke-cote-d-ivoire', "Transformation du manioc en attiéké en Côte d'Ivoire", `Unité de 300 t de manioc par an : DSCR de ${f2(A.re.dscr)} en réaliste, ${f2(A.pe.dscr)} en pessimiste.`, attieke, "Côte d'Ivoire").replace(/\n/g, '\r\n'));
fs.writeFileSync('src/content/cas-chiffres/maraichage-benin.ts', mk('maraichage-benin', 'Maraîchage irrigué (tomate, chou) au Bénin', `Exploitation de 3 ha : DSCR de ${f2(M.re.dscr)} en réaliste, ${f2(M.pe.dscr)} en pessimiste, marge de sécurité étroite.`, maraichage, 'Bénin').replace(/\n/g, '\r\n'));
fs.writeFileSync('src/content/cas-chiffres/aquaculture-senegal.ts', mk('aquaculture-senegal', 'Pisciculture de tilapia en étangs au Sénégal', `Ferme de 12 étangs : DSCR de ${f2(Q.re.dscr)} en réaliste, ${f2(Q.pe.dscr)} en pessimiste, l'aliment pèse ${pc(aqAliment / Q.re.cv)} des charges variables.`, aquaculture, 'Sénégal').replace(/\n/g, '\r\n'));
fs.writeFileSync('src/content/cas-chiffres/mangue-sechee-benin.ts', mk('mangue-sechee-benin', 'Séchage de mangues au Bénin', `Unité de 180 t de fruits par campagne : DSCR de ${f2(G.re.dscr)} en réaliste, ${f2(G.pe.dscr)} en pessimiste, activité saisonnière.`, mangue, 'Bénin').replace(/\n/g, '\r\n'));
fs.writeFileSync('src/content/cas-chiffres/mecanisation-burkina-faso.ts', mk('mecanisation-burkina-faso', 'Prestation de mécanisation (labour et battage) au Burkina Faso', `Un service à 2 tracteurs et 2 batteuses : DSCR de ${f2(S.re.dscr)} en réaliste, ${f2(S.pe.dscr)} en pessimiste, le taux d'utilisation du matériel décide de tout.`, mecanisation, 'Burkina Faso').replace(/\n/g, '\r\n'));
fs.writeFileSync('src/content/cas-chiffres/riz-irrigue-mali.ts', mk('riz-irrigue-mali', 'Riz irrigué en deux campagnes au Mali', `Exploitation de 15 ha en deux campagnes : DSCR de ${f2(Z.re.dscr)} en réaliste, ${f2(Z.pe.dscr)} en pessimiste, le rendement et le prix du paddy décident de tout.`, riz, 'Mali').replace(/\n/g, '\r\n'));
fs.writeFileSync('src/content/cas-chiffres/cacao-cote-d-ivoire.ts', mk('cacao-cote-d-ivoire', "Cacaoyère de 20 hectares en Côte d'Ivoire", `Projet sur 15 ans : ${KR.differe} ans de différé, délai de récupération de ${f1(KR.payback)} ans, TRI de ${pc(KR.tri, 1)} en réaliste.`, cacao, "Côte d'Ivoire").replace(/\n/g, '\r\n'));
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
import { maraichage_benin } from './maraichage-benin'
import { aquaculture_senegal } from './aquaculture-senegal'
import { mangue_sechee_benin } from './mangue-sechee-benin'
import { cacao_cote_d_ivoire } from './cacao-cote-d-ivoire'
import { mecanisation_burkina_faso } from './mecanisation-burkina-faso'
import { riz_irrigue_mali } from './riz-irrigue-mali'

/** Cas chiffrés complémentaires au cas fil rouge Diap Touré (calculés par scripts/modeles_bp/cas_chiffres.py). */
export const CAS_CHIFFRES: CasChiffre[] = [poulet_togo, attieke_cote_d_ivoire, maraichage_benin, aquaculture_senegal, mangue_sechee_benin, cacao_cote_d_ivoire, mecanisation_burkina_faso, riz_irrigue_mali]

export const trouverCas = (slug: string) => CAS_CHIFFRES.find((c) => c.slug === slug)
`.replace(/\n/g, '\r\n'));
console.log('pages cas écrites');
