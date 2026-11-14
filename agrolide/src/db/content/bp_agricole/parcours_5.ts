import { ParcoursSeed } from './types';
import { QUIZ } from './quiz_banque';

export const parcours5: ParcoursSeed = {
  id: "bp_agri_p5",
  titre: "Parcours 5 : Chiffrez votre projet",
  description: "Le cœur technique du business plan. Sept chapitres courts et très progressifs pour construire des prévisions financières solides et convaincre les bailleurs.",
  lecons: [
    {
      id: "lec_5_1",
      titre: "Estimer vos investissements et bâtir votre plan de financement",
      duree_minutes: 9,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable de lister vos besoins pour démarrer (coût du projet) et de structurer le schéma de financement (plan de financement initial).

### Le Coût du Projet (Ce qu'il faut pour démarrer)

Avant de planter la moindre graine, vous devez financer des actifs et des dépenses de départ. Le coût total du projet se divise en trois grandes catégories :

1. **Les Frais d'établissement :** Ce sont les dépenses immatérielles liées à la création. (Frais de notaire pour la SUARL, études de sol, frais d'obtention du bail agricole).
2. **Les Investissements (Immobilisations) :** Ce sont les biens durables que vous achetez et qui resteront dans l'entreprise pendant plusieurs années.
   - *Terrains et Aménagements :* Achat du terrain ou travaux de défrichage et de nivellement.
   - *Bâtiments :* Hangar de stockage, forage, bassin de rétention d'eau, clôture.
   - *Matériel et Équipements :* Tracteur, système d'irrigation goutte-à-goutte, motopompes, panneaux solaires.
   - *Matériel roulant :* Véhicule de liaison, moto tricycle.
3. **Le Besoin en Fonds de Roulement (BFR) initial :** C'est la somme d'argent dont vous avez besoin pour faire tourner l'entreprise (payer les semences, l'engrais, les salaires) *avant* que votre première récolte ne soit vendue. Nous y reviendrons en détail au chapitre suivant.

**Attention :** N'oubliez jamais d'inclure une ligne "Imprévus" (généralement 5 à 10% du total des investissements) pour faire face aux aléas de l'installation.

### Le Plan de Financement Initial (Comment on paie)

Une fois que vous savez de combien vous avez besoin (Emplois), vous devez expliquer d'où vient l'argent (Ressources). La règle d'or comptable : **Total des Emplois = Total des Ressources.**

Les ressources se divisent en deux :
1. **Vos Fonds Propres (Apport personnel) :** L'argent que vous et vos associés injectez dans le projet (capital social). Une banque exige généralement entre 10% et 30% d'apport personnel pour accorder un prêt.
2. **L'Endettement (Emprunt bancaire, subventions) :** L'argent que les banques ou l'État vont vous prêter ou vous donner.

### Le cas de Diap Touré

Cas pédagogique reconstitué : les chiffres sont des hypothèses cohérentes entre elles, à remplacer par les vôtres et par des devis. Pour ses 10 hectares, voici le plan de financement de Diap (en FCFA) :

**EMPLOIS (Besoin) : 55 000 000 FCFA**
- Frais d'établissement : 600 000 FCFA
- Aménagements & Forage : 12 000 000 FCFA
- Matériel (irrigation solaire, hangar ventilé de 150 tonnes, tricycle) : 26 000 000 FCFA
- Imprévus (environ 5 % des investissements) : 2 400 000 FCFA
- BFR initial (trésorerie de départ) : 14 000 000 FCFA

**RESSOURCES (Origine) : 55 000 000 FCFA**
- Apport personnel de Diap : 11 000 000 FCFA (soit 20 %)
- Emprunt bancaire demandé : 44 000 000 FCFA (soit 80 %), au taux supposé de 9 %, sur 7 ans dont 1 an de différé sur le capital. L'année 1, Diap ne paie que les intérêts (environ 4,0 M) ; à partir de l'année 2, l'annuité constante est d'environ 9,8 M par an.

Vérifiez toujours le taux, la durée, le différé et les garanties exigés par votre banque ou votre institution de financement : ce sont eux qui déterminent votre annuité, donc la solidité de tout le reste du dossier (chapitre 5.7).

**Financeurs et garanties :** les organismes qui financent ou garantissent l'agriculture dans votre pays, avec leur statut vérifié et daté, sont listés dans le [cadre pays](/membres/formations/form_bp_agricole/cadre-pays). N'écrivez jamais un taux ou un plafond de dispositif dans votre dossier sans l'avoir lu à la source, le jour même.

#### Ce qu'il faut retenir
- Le coût total du projet additionne les frais d'établissement, les investissements durables et le besoin de trésorerie initial (BFR).
- Le plan de financement prouve que vous avez les ressources (fonds propres + emprunt) pour couvrir tous ces coûts.
- Le total de vos besoins (Emplois) doit être strictement égal au total de vos financements (Ressources).`,
      quiz_json: QUIZ["lec_5_1"]
    },
    {
      id: "lec_5_2",
      titre: "Calculer votre besoin en fonds de roulement (BFR)",
      duree_minutes: 8,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous comprendrez pourquoi tant d'entreprises agricoles font faillite avant leur première récolte et vous saurez calculer un BFR simplifié pour éviter ce piège.

### Le tueur d'entreprises agricoles : Le BFR

Imaginez : vous avez emprunté 10 millions, vous avez acheté votre tracteur, fait votre forage et acheté vos semences. Vous semez. Mais la plante met 4 mois à pousser. Pendant ces 4 mois, il faut payer l'électricité de la pompe, payer les salaires des ouvriers, payer l'engrais de couverture, mettre du carburant dans la voiture. Or, vous n'avez encore rien vendu !

Cet argent indispensable pour faire tourner l'entreprise pendant le décalage entre les dépenses (les semis) et les encaissements (la vente de la récolte) s'appelle le **Besoin en Fonds de Roulement (BFR)**. 
Sous-estimer son BFR est la première cause de faillite des projets agricoles.

### Comment calculer le BFR initial ?

En agriculture, le BFR initial se calcule sur la période qui va du premier décaissement jusqu'aux premières grosses rentrées d'argent. Le montant à financer est le **creux de trésorerie** : le point le plus bas du cumul des dépenses avant les premières ventes (vous le retrouverez dans le plan de trésorerie mensuel, chapitre 5.5).

**La formule simplifiée pour le premier cycle :**
BFR = (Intrants + main-d'œuvre journalière + salaires + charges fixes de la période) − crédit fournisseurs obtenu + marge de sécurité
*(on ajoute les créances clients si vous vendez à crédit).*

Au sens comptable (SYSCOHADA), le BFR est (stocks + créances) − dettes à court terme. La méthode ci-dessus en est l'équivalent pratique pour une exploitation qui démarre.

### Le BFR de Diap Touré

Diap fait sa pépinière en octobre et vend ses premières pommes de terre en mars, son oignon en avril. Sa ferme vit donc environ 5 mois sans encaissement significatif.

- Semences, plants, engrais et produits phytosanitaires (oignon + pomme de terre) : 11 300 000 FCFA
- Main-d'œuvre journalière avant récolte (pépinière, repiquage, entretien) : 2 000 000 FCFA
- Salaires de l'équipe permanente (5 mois) : 2 700 000 FCFA
- Charges fixes, énergie, entretien (5 mois) : 1 900 000 FCFA
- Crédit fournisseurs obtenu (40 % des intrants payés à 60 jours) : − 4 500 000 FCFA
- Marge de sécurité (aléas) : 600 000 FCFA

**BFR initial = 14 000 000 FCFA.**
Diap a ajouté cette somme à ses besoins de financement (ligne BFR des Emplois, chapitre précédent). Ainsi, le jour où il lance sa ferme, il a l'argent sur le compte pour payer ses ouvriers et ses intrants jusqu'aux premières ventes.

#### Ce qu'il faut retenir
- Le BFR est l'argent nécessaire pour survivre entre le moment où vous commencez à dépenser pour produire et le moment où les clients vous paient.
- En agriculture, les cycles de production étant longs, le BFR est très élevé.
- Le BFR initial doit absolument être financé dès le départ (par l'apport ou l'emprunt), au même titre que l'achat du tracteur.`,
      quiz_json: QUIZ["lec_5_2"]
    },
    {
      id: "lec_5_3",
      titre: "Prévoir votre chiffre d'affaires avec 3 scénarios",
      duree_minutes: 9,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable de construire des prévisions de Chiffre d'Affaires (CA) crédibles en utilisant la méthode des trois scénarios (Pessimiste, Réaliste, Optimiste).

### La crédibilité des ventes agricoles

Prévoir un chiffre d'affaires n'est pas une divination, c'est une multiplication : **Volume Vendu × Prix de Vente**.
Or, en agriculture, ces deux variables sont très instables :
- Le volume vendu dépend du rendement (qui dépend du climat, des ravageurs).
- Le prix de vente dépend de l'offre sur le marché le jour de la récolte.

Présenter un seul chiffre fixe au banquier (ex : « Je ferai 50 millions de CA ») montre que vous n'avez pas pris conscience des risques de l'agriculture. C'est ici que la méthode des 3 scénarios (empruntée au cas de Diap Touré) s'avère redoutable d'efficacité.

### La méthode des 3 scénarios

Vous devez calculer trois niveaux de chiffre d'affaires.

**1. Le Scénario Réaliste (Le scénario de base)**
C'est celui que vous visez avec vos compétences et votre itinéraire technique. Calcul de Diap pour une campagne de croisière :

| Culture | Surface | Rendement | Pertes | Volume vendable | Prix moyen | CA |
|---|---|---|---|---|---|---|
| Oignon | 7 ha | 28 t/ha | 10 % | 176 t | 200 FCFA/kg | 35,3 M |
| Pomme de terre | 3 ha | 25 t/ha | 8 % | 69 t | 230 FCFA/kg | 15,9 M |
| Gombo / maïs doux (hivernage) | 3 ha | 8 t/ha | 10 % | 22 t | 150 FCFA/kg | 3,2 M |
| **Total** | | | | **267 t** | | **54,4 M** |

- *Le prix de l'oignon (200 FCFA/kg) est un prix moyen pondéré :* 60 % du volume vendu à la récolte (environ 160 FCFA/kg) et 40 % stocké sous hangar puis vendu en juin-août (environ 260 FCFA/kg).
- *Attention aux prix :* ils varient énormément d'une année à l'autre (de 105-110 FCFA/kg à la récolte 2025 à plus de 400 FCFA/kg en période de rupture début 2026, selon la presse économique). Votre prix doit être appuyé sur vos enquêtes de marché, daté et sourcé.
- *Année 1 : montée en puissance.* Diap retient 85 % de la pleine production la première année, soit un CA de 46,2 M.

**2. Le Scénario Pessimiste (Le mauvais cas gérable)**
C'est le scénario qui mesure ce qui se passe quand tout va moins bien (maladie, chute des cours) : le projet résiste-t-il, et la dette est-elle encore couverte ? La réponse se calcule au chapitre 5.7, elle ne s'affirme pas.
- *Hypothèses de Diap :* rendements − 10 %, pertes post-récolte + 3 points, prix − 10 %.
- *CA Pessimiste de croisière ≈ 42,6 M FCFA* (36,2 M l'année 1).

**3. Le Scénario Optimiste (Le meilleur cas)**
C'est le scénario « bonus » (météo parfaite, prix en hausse). Il sert à montrer le potentiel maximal aux investisseurs en capital.
- *Hypothèses de Diap :* rendements + 10 %, pertes − 3 points grâce au hangar, prix + 20 %.
- *CA Optimiste de croisière ≈ 74,2 M FCFA* (66,8 M l'année 1).

Le test de crise (prix − 25 % sur toutes les cultures) est mené à part au chapitre 5.7.

### Quel scénario retenir pour la suite ?

Dans votre business plan, vous détaillerez la justification de ces 3 scénarios dans le texte. Ensuite, pour construire tous vos tableaux financiers finaux (compte de résultat, trésorerie), vous utiliserez exclusivement les chiffres du **Scénario Réaliste** (ou un point milieu entre le Pessimiste et le Réaliste si vous êtes très prudent). Ne construisez jamais un business plan sur le scénario optimiste.

#### Ce qu'il faut retenir
- Le chiffre d'affaires est le résultat de : (Surface × Rendement − Pertes) × Prix Unitaire.
- Utilisez trois scénarios (Pessimiste, Réaliste, Optimiste) pour intégrer la volatilité agricole (climatique et marchande).
- Le scénario pessimiste sert à mesurer la capacité de remboursement en cas de crise : il se calcule (DSCR, chapitre 5.7), il ne se proclame pas.
- Le reste des états financiers se construit toujours sur la base du scénario Réaliste.`,
      quiz_json: QUIZ["lec_5_3"]
    },
    {
      id: "lec_5_4",
      titre: "Construire votre compte de résultat prévisionnel",
      duree_minutes: 10,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous saurez lire et construire un Compte de Résultat Prévisionnel, qui permet de répondre à la question ultime : "Est-ce que l'entreprise gagnera de l'argent ou en perdra à la fin de l'année ?"

### Qu'est-ce que le Compte de Résultat ?

Le compte de résultat est un film de l'année comptable de votre ferme (sur 12 mois). Il oppose tout ce que vous gagnez (les **Produits**) à tout ce que vous dépensez pour faire tourner l'entreprise (les **Charges**). 

**La formule fondamentale :**
**BÉNÉFICE NET (ou Perte) = PRODUITS (Chiffre d'affaires) - CHARGES (Dépenses + Amortissements + Impôts)**

Généralement, on le présente sur 3 ans (Année 1, Année 2, Année 3) pour montrer comment la rentabilité va évoluer au fur et à mesure que l'exploitation atteint sa pleine capacité.

### Les éléments du Compte de Résultat

1. **Le Chiffre d'Affaires (CA) :** Vos ventes (issues de votre scénario réaliste vu au chapitre précédent).
2. **Les Achats Consommés (Charges Variables) :** Ce sont les coûts qui augmentent avec votre production (semences, engrais, produits phytosanitaires, carburant des pompes, emballages, main-d'œuvre journalière pour la récolte).
3. **Les Charges Externes (Charges Fixes) :** Ce sont les dépenses incompressibles, même si vous produisez peu. (Loyer du terrain, électricité, entretien des machines, assurances, frais de marketing).
4. **Les Frais de Personnel :** Les salaires de votre équipe permanente et vos cotisations sociales.
5. **L'Amortissement :** C'est un concept crucial ! Un tracteur acheté 10 millions et qui dure 5 ans perd 2 millions de sa valeur chaque année. Cette perte de valeur (2 millions) est inscrite comme une charge chaque année. C'est une charge *comptable* (vous ne décaissez pas d'argent), mais elle diminue votre bénéfice imposable. Attention : elle ne met pas d'argent de côté toute seule. Le cash qu'elle « libère » reste sur votre compte seulement si vous le conservez ; c'est à vous de le provisionner pour racheter le tracteur dans 5 ans.
6. **Les Frais Financiers :** Les intérêts que vous payez sur votre emprunt bancaire.
7. **Les Impôts sur les bénéfices.**

### L'exemple (simplifié) de Diap Touré : année 1 et année de croisière

L'installation (année 0) ne produit aucun chiffre d'affaires. Voici ensuite les deux premières colonnes du compte de résultat prévisionnel (en millions de FCFA) :

| Poste | Année 1 (85 % de la production) | Année 2 et suivantes (croisière) |
|---|---|---|
| Chiffre d'affaires (oignon, pomme de terre, hivernage) | 46,2 | 54,4 |
| Charges variables (semences, engrais, eau, journaliers, emballages) | − 18,1 | − 18,1 |
| Charges fixes (assurances, entretien, énergie, commercial, comptabilité) | − 4,5 | − 4,5 |
| Frais de personnel (équipe permanente) | − 6,5 | − 6,5 |
| **EBE (Excédent Brut d'Exploitation)** | **17,1** | **25,3** |
| Amortissements | − 4,2 | − 4,2 |
| Résultat d'exploitation | 12,9 | 21,1 |
| Frais financiers (intérêts d'emprunt) | − 4,0 | − 4,0 (puis en baisse) |
| Résultat avant impôt | 9,0 | 17,1 |
| Impôt sur les bénéfices (30 % pris à titre d'exemple) | − 2,7 | − 5,1 |
| **Résultat net** | **6,3** | **12,0** |

Trois remarques : (1) les charges variables de culture sont engagées en totalité dès l'année 1, même si les rendements ne sont qu'à 85 % ; (2) le taux d'impôt (30 %), les exonérations agricoles possibles et l'impôt minimum varient selon le pays : vérifiez-les ; (3) le résultat de l'année 1 est positif mais mince, et il dépend fortement des prix : le chapitre 5.7 teste ce point.

Présentez ce tableau sur 3 à 5 ans pour montrer à la banque non seulement que la ferme est rentable en croisière, mais aussi qu'elle reste solvable pendant la montée en puissance.

#### Ce qu'il faut retenir
- Le compte de résultat donne la rentabilité de l'entreprise sur une année (Produits − Charges).
- Différenciez les charges variables (liées à la quantité produite) des charges fixes (à payer quoi qu'il arrive).
- N'oubliez pas les amortissements : c'est la perte de valeur annuelle de vos investissements.
- Le document se présente sur 3 à 5 ans pour montrer la progression financière du projet.`,
      quiz_json: QUIZ["lec_5_4"]
    },
    {
      id: "lec_5_5",
      titre: "Élaborer votre budget de trésorerie mensuel",
      duree_minutes: 9,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous saurez construire l'outil le plus crucial pour la survie d'une ferme : le budget de trésorerie mensuel, qui vérifie que votre compte bancaire n'est jamais à découvert.

### La différence entre la Rentabilité et la Trésorerie

Règle d'or de la finance d'entreprise : **Être rentable ne vous empêche pas de faire faillite.**

Reprenons Diap Touré. Son compte de résultat prévoit un bénéfice de 6,3 millions en année 1 et de 12 millions en année de croisière. 
Mais que se passe-t-il au 4ème mois de son activité ? Il a déjà dépensé près de 18 millions (intrants, journaliers, salaires, charges fixes), dont 4,5 millions restent dus à ses fournisseurs, mais ses cultures ne sont pas encore vendus (0 FCFA de chiffre d'affaires encaissé). S'il n'avait pas prévu ce trou d'air, il ne pourrait pas payer l'essence de la pompe au mois 5, les oignons mourraient de soif, et l'entreprise ferait faillite, malgré un projet très "rentable" sur le papier.

Le **Plan de Trésorerie Mensuel** suit les flux réels d'argent sur votre compte bancaire, mois par mois. Son creux (le solde cumulé le plus bas avant les premières ventes) est exactement le BFR initial à financer : environ 14 millions de FCFA pour Diap.

### Comment construire le tableau de trésorerie (Année 1)

Ce tableau comprend 12 colonnes (de Janvier à Décembre). Pour chaque mois, vous devez remplir :

1. **Solde Initial :** Combien d'argent y a-t-il sur le compte le 1er du mois ? (Au Mois 1, c'est votre apport + l'emprunt).
2. **Encaissements (Entrées d'argent) :** Les ventes payées *réellement* par les clients, les subventions reçues. En agriculture, cette ligne est souvent à 0 pendant les 3 ou 4 premiers mois du cycle.
3. **Décaissements (Sorties d'argent) :** Les paiements effectifs (achats comptant, loyers, salaires, remboursement de l'emprunt mensuel).
4. **Solde Final du mois :** (Solde initial + Encaissements − Décaissements). Ce solde devient le Solde Initial du mois suivant.

### L'alerte : Le solde de fin de mois négatif

L'objectif de cet exercice est de s'assurer que la dernière ligne (Solde de fin de mois) **n'est jamais négative**. Un solde négatif signifie un découvert bancaire.

Si vous constatez, en faisant votre tableau, que le Mois 4 affiche -2 000 000 FCFA, vous avez trois solutions :
- **Augmenter votre BFR initial** (demander plus d'argent au départ à la banque ou aux associés pour couvrir ce trou).
- **Négocier des délais de paiement** avec vos fournisseurs (acheter l'engrais à crédit et le payer au Mois 6 après la vente).
- **Modifier votre calendrier agricole** pour avoir des rentrées d'argent plus tôt (ex: planter des cultures à cycle très court, comme la salade en 45 jours, pour faire rentrer du cash en attendant l'oignon).

Le plan de trésorerie mensuelle démontre au banquier que vous pilotez votre entreprise avec prudence et que vous avez anticipé les creux financiers liés aux longs cycles agricoles.

#### Ce qu'il faut retenir
- Le compte de résultat calcule des "Produits et Charges" (la richesse), la trésorerie calcule des "Encaissements et Décaissements" (l'argent réel sur le compte).
- Une entreprise rentable peut faire faillite si elle manque de trésorerie en cours d'année.
- Le solde de fin de mois de votre plan de trésorerie ne doit jamais être négatif.
- L'agriculture génère des encaissements irréguliers (pics de récolte) face à des décaissements continus (salaires) : la trésorerie est le juge de paix.`,
      quiz_json: QUIZ["lec_5_5"]
    },
    {
      id: "lec_5_6",
      titre: "Lire et bâtir votre bilan prévisionnel",
      duree_minutes: 8,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous saurez distinguer l'actif du passif pour construire un Bilan Prévisionnel simplifié. Le Bilan est une photographie du patrimoine de l'entreprise à la fin d'une année.

### Qu'est-ce qu'un Bilan ?

Si le compte de résultat est un "film" de l'année, le **Bilan** est une "photographie" prise le 31 décembre. Il montre la valeur de l'entreprise à cet instant précis.

Il se divise en deux colonnes qui doivent toujours, absolument, être parfaitement équilibrées (Actif = Passif) :
1. **L'Actif (Ce que possède l'entreprise) :** C'est la colonne de gauche.
2. **Le Passif (D'où vient l'argent) :** C'est la colonne de droite : capital apporté par les associés, résultat, dettes financières et dettes à court terme.

### L'Actif : Ce qui appartient à la ferme

L'actif est classé du moins liquide (le plus dur à vendre) au plus liquide (l'argent cash).
- **L'Actif Immobilisé :** Ce sont vos investissements durables. La valeur de votre hangar, de votre tracteur, de votre système solaire (valeur qui diminue chaque année à cause des amortissements vus dans le compte de résultat).
- **L'Actif Circulant :** Ce sont les éléments à court terme. 
  - *Les Stocks :* La valeur des oignons stockés dans le hangar qui ne sont pas encore vendus au 31 décembre. La valeur de l'engrais non utilisé.
  - *Les Créances :* L'argent que les clients vous doivent mais qu'ils n'ont pas encore payé.
  - *Les Disponibilités :* L'argent liquide qui se trouve sur le compte bancaire (issu de votre plan de trésorerie).

### Le Passif : D'où vient l'argent (Ce que la ferme doit)

Le passif explique comment les éléments de l'actif ont été financés. L'entreprise "doit" cet argent à ses associés, à la banque ou à ses fournisseurs.
- **Les Capitaux Propres :** C'est l'argent qui appartient aux associés. Il inclut l'Apport Initial (le capital social), mais aussi le Résultat (le bénéfice) de l'année qu'on vient d'ajouter !
- **Les Dettes à long terme :** L'emprunt bancaire qu'il reste à rembourser. (Chaque année, cette ligne diminue au fur et à mesure que vous remboursez la banque).
- **Les Dettes à court terme (Passif circulant) :** L'argent que vous devez à vos fournisseurs (l'engrais acheté à crédit) ou à l'État (impôts à payer).

### Le bilan de Diap au 31 décembre de l'année 1 (en millions de FCFA)

| ACTIF | M | PASSIF | M |
|---|---|---|---|
| Immobilisations nettes (41,0 − 4,2 d'amortissement) | 36,8 | Capital social (apport) | 11,0 |
| Stocks | 0,0 | Résultat de l'année 1 | 6,3 |
| Créances clients | 2,0 | Emprunt bancaire (différé : rien remboursé) | 44,0 |
| Disponibilités | 26,2 | Dettes fournisseurs | 1,0 |
| | | Dettes fiscales (impôt à payer) | 2,7 |
| **TOTAL ACTIF** | **65,0** | **TOTAL PASSIF** | **65,0** |

Hypothèse simplificatrice : toute la récolte est vendue avant le 31 décembre. Si vous stockez, c'est la valeur du stock invendu qui apparaît dans l'actif. Les 26,2 M de disponibilités sont élevés parce que l'emprunt n'est pas encore remboursé : ce coussin servira à l'annuité de 9,8 M de l'année 2.

### L'utilité du Bilan pour le banquier

Le banquier scrute le Bilan Prévisionnel en fin d'Année 1 et d'Année 3 pour observer la santé de votre patrimoine :
- Votre ferme s'enrichit-elle ? (Les capitaux propres augmentent-ils grâce aux bénéfices mis en réserve ?)
- Votre ferme se désendette-t-elle ? (La dette bancaire diminue-t-elle correctement ?)
- Votre trésorerie est-elle suffisante ? (Vos disponibilités couvrent-elles vos dettes à court terme, et vos ressources stables dépassent-elles vos immobilisations ?)

#### Ce qu'il faut retenir
- Le bilan est la photographie du patrimoine de l'entreprise à une date donnée.
- **Actif (Possessions)** : Immobilisations, stocks, argent en banque.
- **Passif (Dettes et Origines des fonds)** : Capitaux propres, dettes bancaires, dettes fournisseurs.
- Total de l'Actif = Total du Passif, toujours. Le bénéfice du compte de résultat fait le lien en venant s'ajouter aux capitaux propres.`,
      quiz_json: QUIZ["lec_5_6"]
    },
    {
      id: "lec_5_7",
      titre: "Calculer votre seuil de rentabilité, la couverture de la dette, la VAN et le TRI",
      duree_minutes: 15,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous saurez calculer et présenter les cinq indicateurs que regardent les comités de crédit : le seuil de rentabilité, la couverture du service de la dette (DSCR), la VAN, le TRI et le délai de récupération. Vous verrez aussi pourquoi un seul chiffre ne suffit jamais : il faut les calculer dans plusieurs scénarios.

Toutes les valeurs ci-dessous viennent du cas de Diap Touré construit depuis le chapitre 5.1 : coût du projet 55 M FCFA, emprunt de 44 M à 9 % sur 7 ans dont 1 an de différé, montants en millions de FCFA (M). Les hypothèses sont pédagogiques : refaites chaque calcul avec VOS chiffres.

### 1. Le seuil de rentabilité (point mort)

Le seuil de rentabilité est le niveau de chiffre d'affaires pour lequel le résultat est nul.

**Seuil de rentabilité = Coûts fixes totaux ÷ Taux de marge sur coûts variables**

*Le piège classique :* les « coûts fixes » ne sont pas seulement les charges fixes du tableau. Il faut y ajouter **le personnel permanent, les amortissements et les intérêts de l'emprunt**, car vous les payez ou les supportez quel que soit le volume vendu.

Calcul pour l'année 2 (croisière) :
- Taux de marge sur coûts variables = (54,4 − 18,1) ÷ 54,4 = **66,7 %**
- Coûts fixes totaux = personnel 6,5 + charges fixes 4,5 + amortissements 4,2 + intérêts 4,0 = **19,2 M**
- Seuil de rentabilité = 19,2 ÷ 0,667 = **28,8 M**, soit 53 % du CA réaliste (environ 141 tonnes sur les 267 tonnes vendables, à répartition de cultures constante)
- Marge de sécurité = (54,4 − 28,8) ÷ 54,4 = **47 %** : les ventes peuvent reculer de près de la moitié avant la perte.

*L'erreur à ne pas faire :* si Diap n'avait compté que ses 4,5 M de charges fixes, il aurait annoncé un seuil de 6,7 M, plus de quatre fois trop bas.

*Limite à connaître :* ce calcul suppose que les charges variables suivent le chiffre d'affaires. En agriculture, la plupart des coûts de culture sont engagés avant que vous sachiez quelle sera la récolte : le seuil est un repère, pas une garantie.

### 2. La couverture du service de la dette (DSCR)

C'est l'indicateur n° 1 de votre banquier : l'argent généré par l'activité suffit-il à payer les échéances ?

**DSCR = Flux disponible avant dette ÷ (Intérêts + Capital remboursé dans l'année)**
avec Flux disponible = EBE − impôt sur les bénéfices.

*L'annuité de Diap :* l'année 1, il ne paie que les intérêts (44 × 9 % ≈ 4,0 M). Ensuite, l'annuité constante sur 6 ans est 44 × 0,09 ÷ (1 − 1,09⁻⁶) ≈ **9,8 M par an**.

| Scénario (année 2) | CA | EBE | Flux disponible | Service de la dette | DSCR |
|---|---|---|---|---|---|
| Réaliste | 54,4 | 25,3 | 20,2 | 9,8 | **2,05** |
| Pessimiste (rendement − 10 %, prix − 10 %, pertes + 3 points) | 42,6 | 13,5 | 11,9 | 9,8 | **1,21** |
| Crise de prix (− 25 % sur tous les prix) | 40,8 | 11,7 | 10,6 | 9,8 | **1,08** |

*Lecture :* les banques demandent en général un DSCR d'au moins 1,2 à 1,3 (à vérifier auprès de la vôtre). Le projet de Diap est solide dans le cas réaliste, juste à la limite dans le cas pessimiste, et trop fragile en cas de crise de prix. Le scénario pessimiste ne « prouve » donc pas que tout va bien : il montre où se trouve la limite.

*Les leviers si le DSCR est trop bas :* allonger la durée du prêt (sur 8 ans, l'annuité tombe à 8,7 M et le DSCR pessimiste monte à 1,36), réduire l'emprunt grâce à une garantie ou à une subvention, constituer une réserve de trésorerie, sécuriser des contrats de vente à prix plancher, souscrire une assurance agricole. N'oubliez pas que l'année 1 est confortable (flux de 14,4 M pour 4,0 M d'intérêts) : ce coussin doit être conservé pour l'année 2.

### 3. La Valeur Actuelle Nette (VAN)

La VAN répond à la question : « Après avoir tenu compte du coût de l'argent et du temps, le projet crée-t-il de la valeur ? »

*Les flux du projet* (avant financement) : année 0 = − 55,0 (coût du projet). Chaque année, flux = EBE − impôt sur le résultat d'exploitation (les intérêts sont exclus, car le financement est déjà dans les 55 M). L'année 5, on ajoute la **valeur résiduelle** : valeur nette comptable des immobilisations (20,0) + BFR récupéré (14,0) = 34,0.

| Année | Flux | Facteur à 10 % | Flux actualisé |
|---|---|---|---|
| 0 | − 55,0 | 1,000 | − 55,0 |
| 1 | 13,3 | 0,909 | 12,1 |
| 2 | 19,0 | 0,826 | 15,7 |
| 3 | 19,0 | 0,751 | 14,3 |
| 4 | 19,0 | 0,683 | 13,0 |
| 5 | 19,0 + 34,0 = 53,0 | 0,621 | 32,9 |
| **VAN à 10 %** | | | **+ 33,0 M** |

*Règle :* VAN > 0 → le projet rémunère l'argent investi au-delà du taux d'actualisation choisi (ici 10 %, un taux à justifier : coût de l'emprunt 9 % plus une prime de risque). VAN < 0 → il le détruit.
*Astuce tableur :* la fonction VAN d'Excel n'actualise pas l'année 0. Calculez =VAN(taux ; flux année 1 à 5) puis ajoutez séparément l'investissement initial négatif.

### 4. Le Taux de Rentabilité Interne (TRI)

Le TRI est le taux d'actualisation pour lequel la VAN est nulle. Sur Excel : =TRI(flux année 0 à 5). Pour Diap : **TRI ≈ 26,9 %** (la VAN est encore de 20,6 M à 15 %).

*Règle :* comparez le TRI au coût de l'argent et aux placements sans risque de votre pays (bons ou obligations du Trésor, taux de la banque). Un TRI de 5 % n'est pas intéressant face à un placement sans risque à 6 %. Un TRI très supérieur au coût de l'emprunt (ici 9 %) compense le risque agricole.

*Ne présentez jamais ces indicateurs dans un seul scénario :*

| | VAN à 10 % | TRI |
|---|---|---|
| Réaliste | + 33,0 M | 26,9 % |
| Pessimiste | + 2,6 M | 11,4 % |
| Crise de prix (− 25 %) | − 2,0 M | 9,0 % |

Le message honnête au banquier : le projet résiste à un recul de 10 %, mais devient fragile si les prix reculent de 25 %. C'est justement pour cela que Diap prévoit le stockage, les contrats de vente et l'assurance (chapitre 6.1).

### 5. Le délai de récupération (payback)

Il indique en combien d'années les flux cumulés remboursent l'investissement. Cumul des flux de Diap (hors valeur résiduelle) : − 41,7 (année 1), − 22,7 (année 2), − 3,7 (année 3), + 15,3 (année 4). Le délai est donc de 3 + 3,7 ÷ 19,0 ≈ **3,2 ans**.

### Le tableau de synthèse à intégrer au business plan

- Coût total du projet : 55 M FCFA (apport 11 M, emprunt 44 M)
- Chiffre d'affaires de croisière : 54,4 M ; EBE : 25,3 M ; résultat net : 12,0 M
- Seuil de rentabilité : 28,8 M de CA (53 % du CA réaliste)
- DSCR : 2,05 (réaliste), 1,21 (pessimiste), 1,08 (crise de prix)
- VAN à 10 % sur 5 ans : + 33,0 M ; TRI : 26,9 % ; payback : 3,2 ans

Ces ratios ne valent que ce que valent vos hypothèses : chaque chiffre doit renvoyer à un devis, une enquête ou une source datée.

**Ressource à télécharger :** le [modèle financier (Excel, pré-rempli avec le cas Diap Touré)](/documents/bp-agricole/Agrolide-modele-financier-business-plan-agricole.xlsx) calcule tous ces indicateurs en quatre scénarios et vous permet de refaire chaque calcul avec vos chiffres.

**Pour vous entraîner :** deux autres [cas chiffrés complets](/membres/formations/form_bp_agricole/cas) (poulet de chair au Togo, transformation du manioc en attiéké en Côte d'Ivoire) appliquent exactement cette méthode, avec un DSCR et une VAN calculés dans trois scénarios.

#### Ce qu'il faut retenir
- Le seuil de rentabilité se calcule avec TOUS les coûts fixes (personnel, amortissements, intérêts compris), pas seulement les charges fixes.
- Le DSCR (flux disponible ÷ service de la dette) est l'indicateur central du banquier ; visez au moins 1,2 à 1,3 et calculez-le en scénario pessimiste.
- La VAN et le TRI se calculent à partir d'un tableau de flux sur 5 ans (investissement, flux annuels, valeur résiduelle), jamais « à l'estime ».
- Présentez chaque indicateur dans plusieurs scénarios et dites honnêtement où se situe la limite du projet.`,
      quiz_json: QUIZ["lec_5_7"]
    }
  ]
};
