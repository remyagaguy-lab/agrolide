// Génère src/content/cadre-pays/{benin,cote-d-ivoire,senegal}.ts à partir des textes ci-dessous (vérifiés le 13/11/2026).
// Usage : node scripts/modeles_bp/gen_fiches_pays.mjs  (depuis agrolide/)
import fs from 'fs';

const DIR = 'src/content/cadre-pays/';
const COMMUN_INTRO = (pays, rev) => `### Comment lire cette fiche

Cette fiche rassemble ce qu'un porteur de projet agricole doit vérifier ${pays} avant de chiffrer son business plan. Elle a été contrôlée sur le web le **13 novembre 2026** ; chaque point renvoie à une source listée en fin de fiche.

- Les **textes** (lois, décrets) sont cités par leur numéro : ils changent peu.
- Les **taux, plafonds, seuils et frais** ne sont volontairement **pas** recopiés : ils changent chaque année. La fiche dit où lire la valeur en vigueur, et ces valeurs doivent être saisies dans le modèle financier avec leur source et leur date.
- Quand un point n'a pas pu être confirmé, c'est écrit : « non confirmé ». Une information non confirmée n'est jamais présentée comme acquise.
- Plusieurs sources consultées sont des articles de presse ou des sites commerciaux : elles ne servent qu'à repérer un sujet, jamais à fixer un montant.
- La fiche sera revérifiée au plus tard le **${rev}**.

*Cette fiche est un guide pédagogique, pas un conseil juridique ou fiscal : faites confirmer chaque point par un professionnel local (notaire, expert-comptable, conseil juridique) avant de signer ou de déposer un dossier.*
`;

const OHADA = `Le pays applique les Actes uniformes de l'OHADA. Formes courantes en agriculture : l'**entreprise individuelle** (patrimoine personnel non protégé), l'**entreprenant** (statut simplifié réservé à une personne physique, plafond d'activité fixé par chaque pays), la **SARL** et la **SARL à associé unique (SARLU)**, la **SAS/SASU** (statuts très libres, utile avec des investisseurs), la **société coopérative** (acte uniforme du 15 décembre 2010 : coopérative simplifiée ou avec conseil d'administration) et le **GIE** (solidarité des dettes). Le capital minimal et les frais de constitution sont à confirmer au guichet de création : les sources consultées se contredisent.`;

const CHECK_COMMUN = (foncier, ident) => `### 8. Votre checklist avant de chiffrer

1. ☐ Forme juridique choisie et capital minimal confirmé au guichet de création.
2. ☐ ${foncier}
3. ☐ ${ident}
4. ☐ Taux d'impôt, régime applicable et TVA lus dans le code général des impôts en vigueur, avec la date de lecture.
5. ☐ Régime de l'eau et homologation des produits phytosanitaires instruits.
6. ☐ Dispositif de financement ou de garantie visé, conditions écrites et datées.
7. ☐ Devis d'assurance obtenu, prime inscrite dans les charges fixes.
8. ☐ Chaque taux ou plafond saisi dans le modèle financier porte une source et une date.
`;

const benin = `${COMMUN_INTRO('au Bénin', '13 février 2027')}
### 1. Statuts juridiques

${OHADA}

**Pour votre dossier :** indiquez la forme choisie et la raison du choix ; joignez les statuts et l'extrait du registre du commerce (RCCM).

### 2. Foncier

- Le texte de référence est la **loi n° 2013-01 du 14 août 2013 portant Code foncier et domanial**, modifiée et complétée par la **loi n° 2017-15** (datée du 10 août 2017 par le secrétariat général du gouvernement ; certaines sources donnent le 26 mai 2017, date d'adoption). La réforme de 2017 a rétabli le **titre foncier**, définitif et sécurisé, à la place du certificat de propriété foncière.
- L'**Agence nationale du domaine et du foncier (ANDF)** est créée par l'article 416 du code ; son décret d'organisation est le décret n° 2015-010 du 29 janvier 2015. Elle intervient notamment pour l'**attestation de détention coutumière**, délivrée après une enquête publique ; d'après une autre source, la commune participe à cette délivrance. Confirmez au guichet de votre commune quel service instruit votre dossier.
- Le code cite comme documents de présomption de propriété l'attestation de détention coutumière, l'attestation de recasement, l'avis d'imposition des trois dernières années et le certificat d'inscription. Seul le titre foncier est définitif : visez-le avant un gros investissement.
- **Non confirmé** : le détail des articles sur le plan foncier rural et les délais actuels de délivrance.

**Pour votre dossier :** joignez en annexe l'acte qui sécurise votre terre (titre foncier ou, à défaut, l'attestation de détention coutumière avec la preuve de la procédure engagée). Sans foncier sécurisé, aucune banque ne prête.

### 3. Identifiants et formalités

- La création passe par le **guichet unique de formalisation des entreprises (GUFE) de l'APIEx**, en ligne sur monentreprise.bj : registre du commerce (RCCM), **IFU** (identifiant fiscal unique) et déclaration d'établissement auprès de la direction du travail sont délivrés dans le même parcours.
- Ne confondez pas l'IFU avec le NIF (Togo, Mali, Niger), le NINEA (Sénégal), l'identifiant unique ivoirien ou le TIN (Ghana, Nigeria).
- **Frais et délais** : les sources consultées sont des sites commerciaux aux chiffres variables. Lisez le tarif officiel sur la plateforme avant de planifier votre installation.
- **Sécurité sociale** : l'affiliation des salariés se fait auprès de la caisse nationale ; lisez les taux et plafonds sur son site (ils alimentent la ligne « cotisations sociales » de la feuille CHARGES).

### 4. Fiscalité de base (à vérifier avec un expert-comptable béninois)

- Lisez dans le **code général des impôts en vigueur** : le taux de l'impôt sur les bénéfices, les régimes applicables aux petites entreprises, le traitement de la TVA sur les produits agricoles et le seuil d'assujettissement. Ces valeurs se saisissent dans la feuille HYPOTHESES du modèle financier.
- Intrants et matériel importés : vérifiez les droits de douane et les exonérations auprès de la douane (tarif extérieur commun CEDEAO).
- Les montants cités par les prestataires de création d'entreprise ne font pas foi.

### 5. Eau, environnement et protection des cultures

Le régime des forages et des prélèvements d'eau, l'homologation des produits phytosanitaires et les éventuelles études d'impact environnemental **n'ont pas été vérifiés** pour cette fiche : interrogez les directions chargées de l'eau et de la protection des végétaux avant de lancer vos travaux.

### 6. Financeurs, garanties et appuis

Statut vérifié au 13 novembre 2026. Aucun taux ni plafond n'est cité.

| Dispositif | Ce que c'est | Statut vérifié |
|---|---|---|
| FNDA (Fonds national de développement agricole) | Subventions et appuis aux exploitations, aux jeunes agri-entrepreneurs et aux communes | Actif : conventions signées avec 13 jeunes promoteurs du programme Agrostudies en octobre 2025 ; appels à projets pour les mairies |
| ADPME (Agence de développement des petites et moyennes entreprises) | Appui aux PME ; publie une checklist administrative | Active (document de juillet 2026) |
| FIGPME et FONAGA | Cités comme mécanismes publics de financement dans un document de la Banque mondiale de septembre 2025 | **Non confirmé** : conditions et éligibilité des producteurs |
| Banques commerciales et institutions de microfinance | Crédits de campagne et d'investissement | Non vérifié individuellement |

**Dans votre dossier :** nommez le dispositif visé, ses conditions à la date où vous écrivez, la pièce qui prouve votre éligibilité et un contact de l'organisme.

### 7. Assurance agricole

- Le gouvernement a lancé en 2024 un **projet pilote d'assurance indicielle multirisque**, avec prise en charge par l'État d'une partie des primes (part à confirmer). En août 2026, des indemnisations ont été versées à des producteurs de riz et de coton (561,8 millions de FCFA à 94 905 producteurs, selon la presse).
- L'objectif annoncé pour 2026-2027 est d'élargir la couverture ; **non confirmé** : le déploiement effectif et les filières couvertes. Le dispositif concerne surtout le riz et le coton : si votre culture n'en fait pas partie, demandez un devis à un assureur.

${CHECK_COMMUN('Acte foncier obtenu ou procédure engagée (titre foncier visé).', 'IFU, RCCM et affiliation sociale prévus au calendrier d\'installation.')}
### Sources consultées (13 novembre 2026)

- Code foncier et domanial, loi 2013-01 modifiée par la loi 2017-15 : [LEAP/FAOLEX](https://leap.unep.org/en/countries/bj/national-legislation/loi-ndeg-2017-15-du-26-mai-2017-modifiant-et-completant-la-loi) ; [SGG](https://sgg.gouv.bj/doc/loi-2017-15/read) ; décret n° 2015-010 : [SGG](https://sgg.gouv.bj/doc/decret-2015-010/download)
- Guichet unique et création d'entreprise : [gouvernement du Bénin](https://www.gouv.bj/actualite/1034/conference-nations-unis-commerce-developpement--cnuced-benin-devient-1-mondial-dans-creation-entreprises/) ; checklist [ADPME](https://epmetest.adpme.bj/wp-content/uploads/2026/07/ADPME-Benin_Checklist-Administrative.pdf)
- FNDA : [gouvernement du Bénin](https://www.gouv.bj/article/3285/insertion-jeunes-dans-agrobusiness-fnda-subventionne-beneficiaires-programme-agrostudies/) ; mécanismes de financement : [Banque mondiale, WEDAF](https://finances.bj/wp-content/uploads/2025/11/PMPP_WEDAF_26-09-2025_clean.pdf)
- Assurance agricole : [gouvernement du Bénin](https://www.gouv.bj/article/3628/assurance-agricole-millions-fcfa-proteger-producteurs-face-aleas-climatiques/) ; [Le360](https://afrique.le360.ma/economie/assurance-et-risque-climatique-ce-que-revele-la-premiere-indemnisation-agricole-a-large-echelle-au_H2IQR4G2ORDVJOFPVS5QAE2G6U/)`;

const ci = `${COMMUN_INTRO("en Côte d'Ivoire", '13 février 2027')}
### 1. Statuts juridiques

${OHADA}

**Pour votre dossier :** indiquez la forme choisie et la raison du choix ; joignez les statuts et la preuve d'immatriculation.

### 2. Foncier

- Le foncier rural relève de la **loi n° 98-750 relative au domaine foncier rural**, modifiée à plusieurs reprises (une source de 2025 cite 2004, 2013 et 2019) ; le **décret n° 2019-266** fixe les modalités d'application pour le domaine foncier rural coutumier. Les textes consolidés actuels n'ont pas pu être relus : demandez-les à l'agence foncière.
- Toute personne, ivoirienne ou non, qui détient des droits coutumiers peut demander un **certificat foncier**. Il est préparé par l'**Agence foncière rurale (AFOR)** puis signé par le préfet du département.
- Un arrêté de 2000 prévoyait l'**immatriculation** de la terre dans les trois ans suivant l'obtention du certificat foncier, faute de quoi elle pouvait être immatriculée au nom de l'État. **Non confirmé** : ce délai et ses conséquences dans le régime actuel. Renseignez-vous avant d'investir.
- L'AFOR et des organisations de planteurs ont organisé en novembre 2025 une formation pour accélérer l'accès aux certificats fonciers : l'accès reste un sujet d'actualité.

**Pour votre dossier :** joignez le certificat foncier (ou la preuve de la procédure en cours) et, si possible, le titre foncier. Sans foncier sécurisé, aucune banque ne prête.

### 3. Identifiants et formalités

- La création passe par le **CEPICI** (guichet unique) et le portail **225invest.ci**. D'après le portail du service public, l'**identifiant unique (IDU)** est attribué à la création et remplace les numéros attribués séparément à chaque démarche, dont celui du registre du commerce.
- Le **numéro de compte contribuable (NCC)** a longtemps servi d'identifiant fiscal. **Non confirmé** : sa place par rapport à l'IDU. Demandez à la direction générale des impôts et au CEPICI quel numéro porter sur vos factures.
- **Frais et délais** : les sources consultées sont commerciales ; lisez le tarif officiel sur le portail.
- **Sécurité sociale** : affiliation à la caisse nationale ; taux et plafonds à lire sur son site.

### 4. Fiscalité de base (à vérifier avec un expert-comptable ivoirien)

Lisez dans le **code général des impôts en vigueur** : le taux de l'impôt sur les bénéfices, les régimes applicables aux petites entreprises et aux activités agricoles, le traitement de la TVA et le seuil d'assujettissement. Aucune de ces valeurs n'est recopiée ici. Pour les intrants et le matériel importés, vérifiez les droits de douane et les exonérations.

### 5. Eau, environnement et protection des cultures

Le régime des forages, l'homologation des produits phytosanitaires et les éventuelles études d'impact **n'ont pas été vérifiés** pour cette fiche : interrogez les services compétents avant de lancer vos travaux.

### 6. Financeurs, garanties et appuis

Statut vérifié au 13 novembre 2026. Aucun taux ni plafond n'est cité.

| Dispositif | Ce que c'est | Statut vérifié |
|---|---|---|
| FIRCA (Fonds interprofessionnel pour la recherche et le conseil agricoles) | Financement de la recherche et du conseil agricoles | Actif (présenté en février 2026 comme modèle de financement durable) ; ce n'est pas un guichet de crédit |
| ANADER (conseil agricole) | Appui-conseil aux producteurs | Partenaire de programmes ; aucun produit de crédit confirmé |
| Orange Corners Côte d'Ivoire, Entrepreneurial Solutions Partners et Ecobank | Partenariat signé en février 2026 pour faciliter l'accès des jeunes entrepreneurs agricoles à des solutions financières | Signé ; conditions non confirmées |
| Fonds de garantie agricole | Évoqué avant 2020 | **Non confirmé** : existence et fonctionnement actuels |
| Plan agricole 2026-2030 | Programme public annoncé | Annoncé : ne le citez comme source de financement que pour un volet précis et daté |

**Dans votre dossier :** nommez le dispositif visé, ses conditions à la date où vous écrivez et la pièce qui prouve votre éligibilité.

### 7. Assurance agricole

L'État prépare un **projet d'assurance récolte indicielle** (PASSIR) dont les premiers produits sont annoncés pour 2027, pour trois filières : riz, coton et palmier à huile. Un programme a indemnisé plus de 2 000 riziculteurs du Bas-Sassandra pour les sinistres de 2024. Si votre culture n'est pas dans ces filières, demandez un devis à un assureur et mentionnez dans le dossier ce qui est couvert ou non.

${CHECK_COMMUN('Certificat foncier obtenu ; délai d\'immatriculation confirmé auprès de l\'AFOR.', 'IDU et identifiant fiscal à utiliser confirmés ; affiliation sociale prévue.')}
### Sources consultées (13 novembre 2026)

- Domaine foncier rural, loi 98-750, certificat foncier et AFOR : [Foncier & Développement](https://www.foncier-developpement.fr/wp-content/uploads/Cadre-juridique-institutionnel-COTE-D-IVOIRE-VF.pdf) ; [Banque mondiale, 2024](https://www.worldbank.org/en/results/2024/03/08/cote-ivoire-scaling-up-customary-land-rights-registration-for-inclusion-and-sustainability) ; [AllAfrica, novembre 2025](https://fr.allafrica.com/stories/202511200585.html)
- Identifiant unique et guichet : [portail du service public](https://servicepublic.gouv.ci/accueil/detaildemarcheparticulier/3/455/100) ; [CEPICI](https://cepici.gouv.ci/web/docs/livret.pdf)
- FIRCA : [AllAfrica, février 2026](https://fr.allafrica.com/stories/202602040167.html) ; partenariat Orange Corners : [AllAfrica, mars 2026](https://fr.allafrica.com/stories/202603290093.html)
- Assurance indicielle : [Financial Afrik, septembre 2026](https://www.financialafrik.com/2026/09/29/agriculture-la-cote-divoire-prepare-une-assurance-pour-proteger-les-recoltes-de-riz-face-aux-aleas-climatiques/) ; [AIP](https://www.aip.ci/cote-divoire-aip-plus-de-122-millions-fcfa-dindemnisation-verses-aux-riziculteurs-du-bas-sassandra-pour-les-sinistres-de-2024/)`;

const sn = `${COMMUN_INTRO('au Sénégal', '13 février 2027')}
### 1. Statuts juridiques

${OHADA}

Au Sénégal, la SARL à associé unique s'appelle couramment **SUARL**. **Pour votre dossier :** indiquez la forme choisie et la raison du choix ; joignez les statuts et l'extrait du registre du commerce.

### 2. Foncier

- Environ 95 % du sol relève du **domaine national**, régi par la **loi n° 64-46 du 17 juin 1964** et ses décrets d'application (n° 64-573 et n° 64-574). Sur ces terres, il n'y a pas de propriété privée : on **affecte** la terre à celui qui la met en valeur.
- La compétence d'**affectation et de désaffectation** appartient au **conseil municipal** (code général des collectivités territoriales). D'après la Cour suprême (arrêt n° 13 du 14 mai 2020), un maire ne peut pas délivrer seul une attestation sur une terre du domaine national sans délibération du conseil municipal : exigez la **délibération**, pas un simple papier du maire.
- L'affectation dépend de la **mise en valeur** : une terre non exploitée peut être désaffectée. Dites dans votre dossier comment vous mettrez la terre en valeur et à quelle échéance.
- **Non confirmé** : les conditions actuelles des baux sur le domaine national (durée, redevance, droit de sous-louer) ; demandez-les à votre commune et au service des domaines. Seule l'immatriculation donne un titre foncier.

**Pour votre dossier :** joignez la délibération d'affectation (ou le bail, ou le titre foncier) et la preuve de son enregistrement. Sans foncier sécurisé, aucune banque ne prête.

### 3. Identifiants et formalités

- La création d'entreprise passe par le **point de création d'entreprises de l'APIX**, qui délivre le RCCM et le **NINEA** (identifiant statistique) dans un même dossier, d'après les sources consultées. Ces sources sont des sites commerciaux : **non confirmé** auprès de l'APIX ou de la direction des impôts, y compris le rôle exact du NIF fiscal.
- Ne confondez pas le NINEA avec le NIF (Togo, Mali, Niger), l'IFU (Bénin, Burkina Faso) ou le TIN (Ghana, Nigeria).
- **Frais, délais et capital minimal** : les chiffres des sources commerciales sont contradictoires. Lisez le tarif officiel sur la plateforme de l'APIX.
- **Sécurité sociale** : affiliation à la caisse de sécurité sociale et à l'institution de retraite ; taux et plafonds à lire sur leurs sites.

### 4. Fiscalité de base (à vérifier avec un expert-comptable sénégalais)

Lisez dans le **code général des impôts en vigueur** : le taux de l'impôt sur les sociétés, les régimes applicables aux petites entreprises et aux activités agricoles, le traitement de la TVA et le seuil d'assujettissement. Aucune de ces valeurs n'est recopiée ici. Pour les intrants et le matériel importés, vérifiez les droits de douane. Pour l'oignon et la pomme de terre, vérifiez les mesures de suspension d'importation de l'année (voir la leçon 2.1) : elles changent d'une campagne à l'autre.

### 5. Eau, environnement et protection des cultures

Le régime des forages, l'homologation des produits phytosanitaires et les éventuelles études d'impact **n'ont pas été vérifiés** pour cette fiche : interrogez les services de l'hydraulique et de la protection des végétaux avant de lancer vos travaux.

### 6. Financeurs, garanties et appuis

Statut vérifié au 13 novembre 2026. Aucun taux ni plafond n'est cité.

| Dispositif | Ce que c'est | Statut vérifié |
|---|---|---|
| FONGIP | Fonds de **garantie** : il garantit une part du crédit demandé à une banque ou à un système financier décentralisé partenaire ; ce n'est pas lui qui décaisse | Actif ; le conseil des ministres prévoit pour 2026-2027 une garantie partielle sur les crédits de collecte des opérateurs agréés |
| DER/FJ (Délégation générale à l'entrepreneuriat rapide des femmes et des jeunes) | Financement de projets de femmes et de jeunes, dont des projets agricoles | Active ; changement de direction en juillet 2026 : vérifiez les produits en cours |
| BNDE (Banque nationale pour le développement économique) | Banque de développement ; conventions avec la DER pour la campagne de commercialisation | Active ; convention avec les agropoles signée en septembre 2026 |
| La Banque Agricole (LBA) | Banque agricole ; désignée chef de file du pool bancaire pour la campagne de commercialisation 2026-2027 | Active |
| CNAAS | Compagnie nationale d'assurance agricole (voir ci-dessous) | Active |

**Dans votre dossier :** nommez le dispositif visé, ses conditions à la date où vous écrivez, la pièce qui prouve votre éligibilité et un contact. Le FONGIP et un crédit bancaire se combinent : la banque finance, le fonds garantit une partie.

### 7. Assurance agricole

La **CNAAS** (créée en 2009) propose une assurance indicielle (rendement, pluviométrie ou formule hybride). L'État subventionne une partie des primes (taux à confirmer auprès de la compagnie). En avril 2026, AXA Sénégal, La Banque Agricole et la CNAAS ont signé un partenariat pour renforcer la protection des producteurs. La couverture reste limitée : les études signalent qu'une grande partie des petits producteurs n'est pas assurée. Demandez un devis et budgétez la prime dans vos charges fixes (leçon 6.1).

${CHECK_COMMUN('Délibération d\'affectation du conseil municipal (ou bail, ou titre foncier) obtenue.', 'RCCM et NINEA obtenus ; NIF fiscal et affiliations sociales confirmés.')}
### Sources consultées (13 novembre 2026)

- Domaine national, loi 64-46 et décrets : [LEAP/FAOLEX](https://leap.unep.org/en/countries/sn/national-legislation/loi-no-64-46-relative-au-domaine-national) ; [décret 64-573](https://leap.unep.org/en/countries/sn/national-legislation/decret-no-64-573-fixant-les-conditions-dapplication-de-la-loi-no) ; jurisprudence : [Cour suprême, arrêt n° 13 du 14 mai 2020](https://kohenavocats.com/jurisprudences/cour-supreme-du-senegal-chambre-administrative-arret-n-13-du-14-mai-2020/)
- Campagne 2026-2027, LBA et FONGIP : [vie-publique.sn](https://www.vie-publique.sn/actualites/427/campagne-de-commercialisation-des-produits-agricoles-2026-2027) ; [AllAfrica, juillet 2026](https://fr.allafrica.com/stories/202607010571.html)
- DER/FJ et BNDE : [AllAfrica, décembre 2024](https://fr.allafrica.com/stories/202412270532.html) ; [Financial Afrik, septembre 2026](https://www.financialafrik.com/2026/09/30/senegal-la-bnde-et-les-agropoles-signent-une-convention-pour-financer-lindustrialisation/)
- CNAAS et partenariat AXA-LBA : [Financial Afrik, avril 2026](https://www.financialafrik.com/2026/04/17/senegal-partenariat-strategique-entre-axa-la-banque-agricole-et-la-cnaas/) ; [AllAfrica, août 2026](https://fr.allafrica.com/stories/202608220024.html)`;

const mk = (slug, nom, resume, contenu) => `import type { FichePays } from './types'

export const ${slug.replace(/-/g, '_')}: FichePays = {
  slug: '${slug}',
  nom: ${JSON.stringify(nom)},
  devise: 'FCFA (franc CFA UEMOA)',
  verifieLe: '2026-11-13',
  prochaineRevision: '2027-02-13',
  disponible: true,
  resume: ${JSON.stringify(resume)},
  contenu: ${JSON.stringify(contenu)},
}
`;

for (const [slug, nom, res, c] of [
  ['benin', 'Bénin', 'Code foncier et domanial, titre foncier, guichet unique APIEx et IFU, FNDA, assurance indicielle.', benin],
  ['cote-d-ivoire', "Côte d'Ivoire", 'Domaine foncier rural et certificat foncier, identifiant unique, FIRCA, assurance indicielle en préparation.', ci],
  ['senegal', 'Sénégal', 'Domaine national et affectation communale, NINEA, SUARL, FONGIP, DER/FJ, BNDE, La Banque Agricole, CNAAS.', sn],
]) {
  fs.writeFileSync(DIR + slug + '.ts', mk(slug, nom, res, c).replace(/\n/g, '\r\n'));
}

let idx = fs.readFileSync(DIR + 'index.ts', 'utf8').replace(/\r\n/g, '\n');
if (!idx.includes("from './benin'")) {
  idx = idx.replace("import { togo } from './togo'", "import { togo } from './togo'\nimport { benin } from './benin'\nimport { cote_d_ivoire } from './cote-d-ivoire'\nimport { senegal } from './senegal'");
  idx = idx.replace(/  aVenir\('benin'[^\n]*\n  aVenir\('cote-d-ivoire'[^\n]*\n  aVenir\('senegal'[^\n]*\n/, '  benin,\n  cote_d_ivoire,\n  senegal,\n');
  fs.writeFileSync(DIR + 'index.ts', idx);
}
console.log('fiches écrites');
