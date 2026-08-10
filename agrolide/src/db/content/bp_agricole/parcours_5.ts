import { ParcoursSeed } from './types';

export const parcours5: ParcoursSeed = {
  id: "bp_agri_p5",
  titre: "Parcours 5 — Chiffrez votre projet",
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

Pour ses 10 hectares, voici le plan de financement simplifié de Diap :

**EMPLOIS (Besoin) : 55 000 000 FCFA**
- Frais d'établissement : 500 000 FCFA
- Aménagements & Forage : 12 000 000 FCFA
- Matériel (Irrigation solaire, Hangar) : 34 500 000 FCFA
- BFR initial (Trésorerie de départ) : 8 000 000 FCFA

**RESSOURCES (Origine) : 55 000 000 FCFA**
- Apport personnel de Diap : 11 000 000 FCFA (soit 20%)
- Emprunt bancaire demandé : 44 000 000 FCFA (soit 80%)

#### Ce qu'il faut retenir
- Le coût total du projet additionne les frais d'établissement, les investissements durables et le besoin de trésorerie initial (BFR).
- Le plan de financement prouve que vous avez les ressources (fonds propres + emprunt) pour couvrir tous ces coûts.
- Le total de vos besoins (Emplois) doit être strictement égal au total de vos financements (Ressources).`,
      quiz_json: [
        {
          question: "Dans quelle catégorie doit-on classer l'installation d'un forage et l'achat de panneaux solaires ?",
          options: [
            "Frais d'établissement",
            "Besoin en Fonds de Roulement (BFR)",
            "Investissements (Immobilisations)",
            "Charges d'exploitation"
          ],
          correctAnswer: 2,
          explanation: "Ces biens sont durables (plusieurs années d'utilisation), ils constituent donc des investissements."
        },
        {
          question: "Qu'est-ce que l'apport personnel (fonds propres) ?",
          options: [
            "Le montant prêté par la banque",
            "L'argent que l'entrepreneur et ses associés investissent eux-mêmes dans le projet",
            "Les taxes payées à l'État",
            "L'argent gagné après la première récolte"
          ],
          correctAnswer: 1,
          explanation: "C'est l'investissement financier direct du porteur de projet, indispensable pour prouver son engagement et partager le risque avec la banque."
        },
        {
          question: "Si le coût total de votre projet (Emplois) est de 10 millions, quel doit être le montant de vos Ressources dans le plan de financement initial ?",
          options: [
            "5 millions",
            "10 millions (Ressources = Emplois)",
            "15 millions",
            "Cela n'a pas d'importance"
          ],
          correctAnswer: 1,
          explanation: "Le plan de financement doit toujours être équilibré : vous devez trouver exactement le montant de financement correspondant à votre besoin total."
        },
        {
          question: "Pourquoi les banques exigent-elles généralement un apport personnel (ex: 20%) ?",
          options: [
            "Pour vérifier si vous savez compter",
            "Pour que vous partagiez le risque financier avec elles et prouviez votre implication",
            "Pour acheter votre ferme",
            "C'est illégal, les banques doivent financer 100% du projet"
          ],
          correctAnswer: 1,
          explanation: "Un porteur qui n'investit rien de son propre argent abandonnera plus facilement le projet en cas de difficulté. L'apport personnel garantit sa motivation."
        }
      ]
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

En agriculture, le BFR se calcule généralement sur la durée du premier cycle de production (jusqu'à ce que l'argent des clients rentre sur le compte bancaire).

**La formule simplifiée pour le premier cycle :**
BFR = (Stock d'intrants pour le cycle + Total des salaires du cycle + Frais fixes du cycle) 
*(auxquels on ajoute les créances clients si vous vendez à crédit, et on soustrait les dettes fournisseurs si vous achetez à crédit).*

### Le BFR de Diap Touré

Le cycle de l'oignon dure environ 4 mois (1 mois de pépinière, 3 mois au champ) plus 1 mois de séchage avant la première grosse vente. Diap a donc besoin de faire vivre sa ferme pendant 5 mois sans revenus.

- Achat de semences, engrais et produits phytosanitaires pour le cycle : 4 500 000 FCFA
- Salaires de l'équipe (5 mois) : 2 000 000 FCFA
- Carburant, petite maintenance, électricité (5 mois) : 1 000 000 FCFA
- Marge de sécurité (aléas) : 500 000 FCFA

**BFR Initial = 8 000 000 FCFA.**
Diap a donc ajouté cette somme colossale à sa demande de crédit (dans la ligne BFR de ses Emplois, vue au chapitre précédent). Ainsi, le jour où il lance sa ferme, il a l'esprit tranquille : il a l'argent sur le compte pour payer ses ouvriers jusqu'à la récolte.

#### Ce qu'il faut retenir
- Le BFR est l'argent nécessaire pour survivre entre le moment où vous commencez à dépenser pour produire et le moment où les clients vous paient.
- En agriculture, les cycles de production étant longs, le BFR est très élevé.
- Le BFR initial doit absolument être financé dès le départ (par l'apport ou l'emprunt), au même titre que l'achat du tracteur.`,
      quiz_json: [
        {
          question: "Qu'est-ce que le Besoin en Fonds de Roulement (BFR) ?",
          options: [
            "Le prix des roues du tracteur",
            "L'argent nécessaire pour faire tourner l'entreprise pendant le décalage entre les dépenses de production et l'encaissement des ventes",
            "L'argent prêté par la banque",
            "Le bénéfice net de la première année"
          ],
          correctAnswer: 1,
          explanation: "Le BFR comble le trou de trésorerie inhérent à toute activité où l'on doit dépenser (payer des salaires, acheter des semences) bien avant d'être payé par les clients."
        },
        {
          question: "Que se passe-t-il si un agriculteur oublie d'inclure le BFR dans sa demande de financement ?",
          options: [
            "Il fera plus de bénéfices",
            "Il n'aura pas d'argent pour payer ses ouvriers ou son carburant en attendant la récolte, et risque la faillite",
            "La banque lui donnera cet argent gratuitement plus tard",
            "Cela n'a pas d'impact"
          ],
          correctAnswer: 1,
          explanation: "C'est la cause numéro 1 d'échec : des fermes parfaitement équipées qui ferment car elles n'ont plus d'argent pour acheter du carburant pour la pompe au milieu du cycle."
        },
        {
          question: "Sur quelle durée Diap Touré a-t-il calculé son BFR initial ?",
          options: [
            "1 mois",
            "5 mois (durée du cycle de pépinière, croissance et séchage avant la vente)",
            "1 an",
            "10 ans"
          ],
          correctAnswer: 1,
          explanation: "En agriculture, le BFR se calcule généralement sur la durée du cycle d'exploitation, c'est-à-dire jusqu'à la première grosse rentrée d'argent."
        },
        {
          question: "L'argent calculé pour le BFR doit figurer dans...",
          options: [
            "Le total des investissements / Emplois (il doit être financé au démarrage)",
            "Les impôts",
            "Les dividendes",
            "Les pertes de l'entreprise"
          ],
          correctAnswer: 0,
          explanation: "Le BFR initial est un investissement. Il se place dans le tableau des Emplois du plan de financement pour s'assurer que vous levez les fonds nécessaires."
        }
      ]
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

Présenter un seul chiffre fixe au banquier (ex: "Je ferai 50 millions de CA") montre que vous n'avez pas pris conscience des risques de l'agriculture. C'est ici que la méthode des 3 scénarios (empruntée au cas de Diap Touré) s'avère redoutable d'efficacité.

### La méthode des 3 scénarios

Vous devez calculer trois niveaux de chiffre d'affaires.

**1. Le Scénario Réaliste (Le scénario de base)**
C'est celui que vous visez avec vos compétences et votre itinéraire technique.
- *Le calcul de Diap :* 10 hectares × Rendement réaliste de 30 Tonnes/ha = 300 Tonnes récoltées. On enlève 10% de pertes = 270 Tonnes vendables. Prix de marché moyen constaté : 250 FCFA/kg.
- *CA Réaliste = 270 000 kg × 250 FCFA = 67 500 000 FCFA.*

**2. Le Scénario Pessimiste (Le pire cas gérable)**
C'est le scénario qui prouve à la banque que même si tout va mal (maladie, chute des cours), le projet survit et rembourse la dette.
- *Le calcul de Diap :* Problème phytosanitaire faisant chuter le rendement à 22 T/ha, avec 15% de pertes post-récolte = 187 Tonnes vendables. Le marché est inondé, le prix chute à 180 FCFA/kg.
- *CA Pessimiste = 187 000 kg × 180 FCFA = 33 660 000 FCFA.*

**3. Le Scénario Optimiste (Le meilleur cas)**
C'est le scénario "Bonus", si la météo est parfaite et que les prix flambent à cause d'une pénurie. Il sert à montrer le potentiel maximal du projet à des investisseurs en capital.
- *Le calcul de Diap :* Rendement excellent de 35 T/ha, pertes réduites à 5% grâce au hangar = 332 Tonnes vendables. Pénurie sur le marché, le prix monte à 350 FCFA/kg.
- *CA Optimiste = 332 000 kg × 350 FCFA = 116 200 000 FCFA.*

### Quel scénario retenir pour la suite ?

Dans votre business plan, vous détaillerez la justification de ces 3 scénarios dans le texte. Ensuite, pour construire tous vos tableaux financiers finaux (compte de résultat, trésorerie), vous utiliserez exclusivement les chiffres du **Scénario Réaliste** (ou un point milieu entre le Pessimiste et le Réaliste si vous êtes très prudent). Ne construisez jamais un business plan sur le scénario optimiste.

#### Ce qu'il faut retenir
- Le chiffre d'affaires est le résultat de : (Surface × Rendement - Pertes) × Prix Unitaire.
- Utilisez trois scénarios (Pessimiste, Réaliste, Optimiste) pour intégrer la volatilité agricole (climatique et marchande).
- Le scénario pessimiste sert à rassurer le banquier sur la capacité de remboursement en cas de crise.
- Le reste des états financiers se construit toujours sur la base du scénario Réaliste.`,
      quiz_json: [
        {
          question: "Dans une prévision de chiffre d'affaires en 3 scénarios, à quoi sert le scénario pessimiste ?",
          options: [
            "À impressionner le bailleur",
            "À vérifier que le projet reste viable et peut rembourser la banque même si les récoltes ou les prix sont inférieurs aux attentes",
            "À demander plus de financement",
            "Il ne sert à rien, c'est optionnel"
          ],
          correctAnswer: 1,
          explanation: "Le scénario pessimiste prouve la résilience du projet face aux aléas de l'agriculture (climat, effondrement des prix)."
        },
        {
          question: "Comment calcule-t-on le volume de produits effectivement vendables ?",
          options: [
            "Surface plantée × Rendement théorique maximum",
            "(Surface plantée × Rendement espéré) - Le pourcentage de pertes post-récolte (pourritures, invendus)",
            "On devine un chiffre",
            "Volume importé par la concurrence"
          ],
          correctAnswer: 1,
          explanation: "Il faut toujours déduire les pertes post-récolte (très fréquentes en agriculture) du volume récolté pour obtenir le volume réellement vendable."
        },
        {
          question: "Quel scénario de Chiffre d'Affaires faut-il utiliser pour remplir les tableaux financiers finaux (compte de résultat, etc.) ?",
          options: [
            "Le scénario Optimiste (pour faire rêver le banquier)",
            "Le scénario Réaliste (ou un point milieu prudent)",
            "Le scénario le plus bas possible",
            "Une moyenne des trois"
          ],
          correctAnswer: 1,
          explanation: "Les tableaux financiers officiels doivent s'appuyer sur l'estimation la plus probable et rationnelle (le scénario réaliste)."
        },
        {
          question: "Sur quelles variables agricoles la méthode des 3 scénarios joue-t-elle principalement ?",
          options: [
            "Le nombre d'employés et le prix du carburant",
            "Les taux d'intérêt de la banque",
            "Le rendement à l'hectare et le prix de vente sur le marché",
            "La couleur du logo de l'entreprise"
          ],
          correctAnswer: 2,
          explanation: "Le rendement (aléas climatiques/maladies) et le prix (volatilité des marchés locaux) sont les deux plus grandes incertitudes de l'agriculture."
        }
      ]
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
5. **L'Amortissement :** C'est un concept crucial ! Un tracteur acheté 10 millions et qui dure 5 ans perd 2 millions de sa valeur chaque année. Cette perte de valeur (2 millions) est inscrite comme une charge chaque année. C'est une charge *comptable* (vous ne décaissez pas d'argent), mais elle diminue votre bénéfice imposable et permet de mettre de l'argent de côté pour racheter le tracteur dans 5 ans.
6. **Les Frais Financiers :** Les intérêts que vous payez sur votre emprunt bancaire.
7. **Les Impôts sur les bénéfices.**

### L'exemple (simplifié) de l'Année 1 de Diap Touré

- **Chiffre d'affaires (Ventes d'oignons) :** + 67 500 000 FCFA
- **Charges Variables (Semences, Engrais, Eau, Journaliers) :** - 22 000 000 FCFA
- **Charges Fixes (Loyer, Frais fixes) :** - 4 000 000 FCFA
- **Frais de personnel (Équipe permanente) :** - 6 500 000 FCFA
- *On obtient l'EBE (Excédent Brut d'Exploitation) : 35 000 000 FCFA (L'argent généré par l'activité).*
- **Amortissements (Usure du hangar et de l'irrigation) :** - 8 000 000 FCFA
- **Frais financiers (Intérêts d'emprunt) :** - 3 500 000 FCFA
- **Impôts (simplifié) :** - 3 500 000 FCFA
- **RÉSULTAT NET DE L'ANNÉE 1 : + 20 000 000 FCFA (Bénéfice).**

Ce tableau sur 3 ans montre à la banque que non seulement Diap vend beaucoup, mais qu'il génère assez de bénéfice net pour se payer, réinvestir, et être solvable.

#### Ce qu'il faut retenir
- Le compte de résultat donne la rentabilité de l'entreprise sur une année (Produits - Charges).
- Différenciez les charges variables (liées à la quantité produite) des charges fixes (à payer quoi qu'il arrive).
- N'oubliez pas les amortissements : c'est la perte de valeur annuelle de vos investissements.
- Le document se présente sur 3 à 5 ans pour montrer la progression financière du projet.`,
      quiz_json: [
        {
          question: "Quelle est la formule fondamentale du Compte de Résultat ?",
          options: [
            "Bénéfice = Emprunts - Investissements",
            "Bénéfice = Produits (Chiffre d'affaires) - Charges (Dépenses)",
            "Trésorerie = Encaissements - Décaissements",
            "Chiffre d'affaires = Surface × Rendement"
          ],
          correctAnswer: 1,
          explanation: "Le compte de résultat oppose simplement la richesse créée (les ventes) aux richesses détruites (les coûts) pour obtenir le résultat net."
        },
        {
          question: "Parmi ces dépenses, laquelle est une Charge Variable (qui augmente si vous cultivez plus d'hectares) ?",
          options: [
            "L'assurance du tracteur",
            "Le loyer du bail agricole",
            "L'achat d'engrais et de semences",
            "Le salaire du gardien annuel"
          ],
          correctAnswer: 2,
          explanation: "Plus vous cultivez, plus vous avez besoin d'engrais et de semences. C'est une charge qui varie avec le volume de production."
        },
        {
          question: "Qu'est-ce que l'amortissement dans un compte de résultat ?",
          options: [
            "L'argent mis de côté pour payer les impôts",
            "La perte de valeur comptable d'un équipement (ex: tracteur) répartie sur sa durée de vie",
            "Le remboursement du capital de l'emprunt bancaire",
            "Les frais de marketing"
          ],
          correctAnswer: 1,
          explanation: "L'amortissement constate l'usure de vos investissements. Il diminue le bénéfice de l'année pour éviter de payer des impôts sur la dépréciation du matériel."
        },
        {
          question: "Si le Résultat Net est négatif la première année, que cela signifie-t-il ?",
          options: [
            "L'entreprise a fait faillite immédiatement",
            "Le projet est forcément mauvais",
            "L'entreprise a enregistré une perte, ce qui est fréquent en année 1 le temps que la production monte en puissance",
            "Vous avez oublié de compter l'emprunt"
          ],
          correctAnswer: 2,
          explanation: "Beaucoup de projets agricoles sont en perte la première année. Tant que la perte est couverte par la trésorerie et que les années 2 et 3 sont bénéficiaires, le projet reste viable."
        }
      ]
    },
    {
      id: "lec_5_5",
      titre: "Élaborer votre budget de trésorerie mensuel",
      duree_minutes: 9,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous saurez construire l'outil le plus crucial pour la survie d'une ferme : le budget de trésorerie mensuel, qui vérifie que votre compte bancaire n'est jamais à découvert.

### La différence entre la Rentabilité et la Trésorerie

Règle d'or de la finance d'entreprise : **Être rentable ne vous empêche pas de faire faillite.**

Reprenons Diap Touré. Son compte de résultat prévoyait un bénéfice de 20 millions en Année 1. Il est très rentable. 
Mais que se passe-t-il au 4ème mois de son activité ? Il a dû payer 15 millions de charges (semences, pompes, main-d'œuvre), mais ses oignons ne sont pas encore vendus (0 FCFA de chiffre d'affaires encaissé). S'il n'avait pas prévu ce trou d'air, il ne pourrait pas payer l'essence de la pompe au mois 5, les oignons mourraient de soif, et l'entreprise ferait faillite, malgré un projet très "rentable" sur le papier.

Le **Plan de Trésorerie Mensuel** suit les flux réels d'argent sur votre compte bancaire, mois par mois.

### Comment construire le tableau de trésorerie (Année 1)

Ce tableau comprend 12 colonnes (de Janvier à Décembre). Pour chaque mois, vous devez remplir :

1. **Solde Initial :** Combien d'argent y a-t-il sur le compte le 1er du mois ? (Au Mois 1, c'est votre apport + l'emprunt).
2. **Encaissements (Entrées d'argent) :** Les ventes payées *réellement* par les clients, les subventions reçues. En agriculture, cette ligne est souvent à 0 pendant les 3 ou 4 premiers mois du cycle.
3. **Décaissements (Sorties d'argent) :** Les paiements effectifs (achats comptant, loyers, salaires, remboursement de l'emprunt mensuel).
4. **Solde Final du mois :** (Solde initial + Encaissements - Décaissements). Ce solde devient le Solde Initial du mois suivant.

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
      quiz_json: [
        {
          question: "Quelle est la principale différence entre le compte de résultat et le plan de trésorerie ?",
          options: [
            "Il n'y a aucune différence, ce sont deux noms pour le même document",
            "Le compte de résultat regarde la rentabilité annuelle, la trésorerie regarde l'argent réel sur le compte bancaire mois par mois",
            "Le compte de résultat est pour le banquier, la trésorerie pour les impôts",
            "La trésorerie calcule l'usure du matériel"
          ],
          correctAnswer: 1,
          explanation: "La trésorerie s'intéresse exclusivement aux dates où l'argent entre (Encaissement) et sort (Décaissement) du compte bancaire réel."
        },
        {
          question: "Vrai ou faux : Si votre compte de résultat prévoit un gros bénéfice à la fin de l'année, votre entreprise ne peut pas faire faillite.",
          options: [
            "Vrai, la rentabilité garantit la survie",
            "Faux, si vous êtes à court de trésorerie au milieu de l'année (avant de vendre), vous pouvez faire faillite même si le projet est rentable",
            "Vrai, les banques couvriront automatiquement",
            "Faux, l'agriculture ne fait jamais de bénéfices"
          ],
          correctAnswer: 1,
          explanation: "Le trou de trésorerie lié à l'attente de la récolte (le BFR) est la cause majeure des fermetures précoces en agriculture."
        },
        {
          question: "Dans le plan de trésorerie, si le solde de fin de mois est négatif au Mois 4, que devez-vous faire dans votre business plan ?",
          options: [
            "Rien, c'est normal en agriculture",
            "Cacher la ligne au banquier",
            "Trouver une solution : augmenter l'emprunt initial (BFR), décaler des dépenses, ou prévoir une petite culture de rente rapide pour générer du cash",
            "Réduire le taux d'intérêt de la banque"
          ],
          correctAnswer: 2,
          explanation: "Un solde négatif = cessation de paiement. Le but du plan prévisionnel est d'identifier ce trou à l'avance pour l'ajuster."
        },
        {
          question: "En agriculture, pourquoi la ligne 'Encaissements' est-elle souvent à 0 pendant les premiers mois ?",
          options: [
            "Parce que l'agriculteur ne sait pas vendre",
            "À cause de la durée de croissance des cultures : on ne vend rien tant que la plante n'est pas mûre",
            "Parce que les clients refusent de payer",
            "Parce que l'argent est volé"
          ],
          correctAnswer: 1,
          explanation: "La croissance biologique des plantes crée un décalage structurel de plusieurs mois sans aucun revenu, ce qui nécessite une gestion de trésorerie stricte."
        }
      ]
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
2. **Le Passif (Ce que doit l'entreprise) :** C'est la colonne de droite.

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

### L'utilité du Bilan pour le banquier

Le banquier scrute le Bilan Prévisionnel en fin d'Année 1 et d'Année 3 pour observer la santé de votre patrimoine :
- Votre ferme s'enrichit-elle ? (Les capitaux propres augmentent-ils grâce aux bénéfices mis en réserve ?)
- Votre ferme se désendette-t-elle ? (La dette bancaire diminue-t-elle correctement ?)
- Avez-vous une "Trésorerie nette" positive ? (Est-ce que votre Actif circulant est supérieur à votre Passif circulant ?)

#### Ce qu'il faut retenir
- Le bilan est la photographie du patrimoine de l'entreprise à une date donnée.
- **Actif (Possessions)** : Immobilisations, stocks, argent en banque.
- **Passif (Dettes et Origines des fonds)** : Capitaux propres, dettes bancaires, dettes fournisseurs.
- Total de l'Actif = Total du Passif, toujours. Le bénéfice du compte de résultat fait le lien en venant s'ajouter aux capitaux propres.`,
      quiz_json: [
        {
          question: "Dans le bilan, que représente l'Actif ?",
          options: [
            "Les dettes de l'entreprise",
            "Ce que possède l'entreprise (Immobilisations, stocks, argent sur le compte)",
            "Le chiffre d'affaires de l'année",
            "Les impôts payés"
          ],
          correctAnswer: 1,
          explanation: "L'actif liste tout le patrimoine matériel, immatériel et financier détenu par l'entreprise."
        },
        {
          question: "Où inscrit-on le tracteur de la ferme dans le Bilan ?",
          options: [
            "Dans les dettes à court terme",
            "Dans l'Actif Immobilisé",
            "Dans les Capitaux propres",
            "Dans le compte de résultat"
          ],
          correctAnswer: 1,
          explanation: "Le tracteur est un investissement durable qui reste dans l'entreprise, il fait donc partie de l'actif immobilisé."
        },
        {
          question: "La règle fondamentale de présentation du Bilan est que :",
          options: [
            "Le Passif doit toujours être nul",
            "L'Actif doit toujours être supérieur au Passif",
            "Le Total de l'Actif doit toujours être strictement égal au Total du Passif",
            "L'Actif dépend de l'inflation"
          ],
          correctAnswer: 2,
          explanation: "C'est la règle d'or comptable de la partie double : chaque possession (Actif) a forcément une origine de financement (Passif), d'où l'égalité stricte."
        },
        {
          question: "Qu'est-ce que les Capitaux Propres dans le Passif du bilan ?",
          options: [
            "L'argent prêté par la banque",
            "L'apport initial des fondateurs additionné aux bénéfices mis en réserve au fil des années",
            "Le salaire des ouvriers",
            "Le stock de semences"
          ],
          correctAnswer: 1,
          explanation: "Les capitaux propres représentent la véritable richesse nette de l'entreprise, appartenant à ses propriétaires."
        }
      ]
    },
    {
      id: "lec_5_7",
      titre: "Calculer votre Seuil de Rentabilité, la VAN et le TRI",
      duree_minutes: 10,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous maîtriserez les trois indicateurs financiers stars exigés par tous les comités de crédit ou investisseurs professionnels : le Seuil de Rentabilité, la VAN et le TRI.

Ces indicateurs traduisent vos gros tableaux financiers en chiffres simples et décisifs.

### 1. Le Seuil de Rentabilité (Point Mort)

Le seuil de rentabilité est le niveau de Chiffre d'Affaires exact pour lequel l'entreprise ne fait ni perte, ni bénéfice (Résultat = 0). Il vous dit à partir de combien de kilos vendus vous commencez réellement à gagner de l'argent.

**Comment le calculer :**
Seuil de rentabilité = Charges Fixes / Taux de Marge sur Coûts Variables.
(Le Taux de marge sur coûts variables = (CA - Charges Variables) / CA).

*Exemple de Diap :* 
Avec des charges fixes de 4M, et une marge sur coût variable de 67% (sur 67,5M de CA et 22M de charges variables), le seuil est atteint à environ 6 millions de FCFA de CA. Concrètement, Diap sait qu'une fois qu'il a vendu 24 tonnes d'oignon (à 250F/kg = 6M), toutes ses charges fixes sont couvertes. À partir de la 25ème tonne, c'est du pur bénéfice !
Savoir répondre au banquier "Mon point mort est atteint au 4ème mois de vente avec seulement 24 tonnes" démontre une maîtrise absolue de votre rentabilité.

### 2. La Valeur Actuelle Nette (VAN)

La VAN répond à la question : "Le projet crée-t-il de la valeur par rapport à si j'avais laissé mon argent dormir dans une banque ?"
C'est un calcul d'actualisation (que les tableurs comme Excel font avec la formule =VAN). On additionne tous les flux de trésorerie générés par le projet sur 5 ans, et on retire l'investissement initial, en appliquant un "taux d'actualisation" (le taux d'intérêt de l'argent).

**La règle de décision :**
- Si la VAN > 0 : Le projet crée de la valeur, il est financièrement viable et intéressant pour un investisseur.
- Si la VAN < 0 : Le projet détruit de la valeur financière (même s'il fait un petit bénéfice comptable), l'investisseur refusera.

### 3. Le Taux de Rentabilité Interne (TRI)

Le TRI est l'indicateur préféré des fonds d'investissement. Il répond à la question : "Combien d'intérêts cet investissement me rapporte-t-il chaque année ?"
Le TRI est le taux en pourcentage (%) pour lequel la VAN est égale à zéro. 

**La règle de décision :**
- Si votre TRI est de 5%, le banquier vous dira : "Autant acheter des bons du trésor sans risque qui rapportent 6%".
- Si votre TRI est de 25% (un chiffre fréquent pour un bon projet agricole bien structuré), le banquier ou l'investisseur verra que le risque agricole (élevé) est compensé par un rendement financier très attractif.

### Présenter vos ratios

Dans la synthèse financière de votre business plan, intégrez un petit tableau :
- Coût total du projet : 55 000 000 FCFA
- Chiffre d'affaires annuel de croisière : 67 500 000 FCFA
- Seuil de Rentabilité : Atteint avec 24 tonnes vendues.
- VAN (à 10%) : 45 000 000 FCFA (Création de valeur positive)
- TRI : 28% (Forte rentabilité)
- Délai de récupération (Payback period) : 2,5 ans (Temps nécessaire pour rembourser l'investissement).

Avec cette seule demi-page, un expert financier sait que votre projet est robuste.

#### Ce qu'il faut retenir
- Le Seuil de Rentabilité (Point Mort) indique le volume de vente exact pour commencer à faire des bénéfices.
- La VAN prouve que votre projet crée de la richesse à long terme par rapport au coût de l'argent.
- Le TRI donne la rentabilité financière en pourcentage (%) du projet. Il doit être supérieur au taux d'un placement sans risque pour être attractif.`,
      quiz_json: [
        {
          question: "Que signifie atteindre son Seuil de Rentabilité (ou Point Mort) ?",
          options: [
            "Avoir remboursé totalement le crédit bancaire",
            "Faire un bénéfice de 10 millions",
            "Atteindre le niveau de chiffre d'affaires exact où l'entreprise ne fait ni perte ni bénéfice, car elle a couvert toutes ses charges",
            "Vendre toute sa récolte"
          ],
          correctAnswer: 2,
          explanation: "Au seuil de rentabilité, vos ventes couvrent exactement vos charges variables et fixes. Chaque vente supplémentaire génère alors du bénéfice net."
        },
        {
          question: "Pour qu'un projet soit jugé financièrement viable et créateur de valeur par un investisseur, comment doit être la VAN (Valeur Actuelle Nette) ?",
          options: [
            "Inférieure à 0",
            "Égale à 0",
            "Supérieure à 0",
            "Indépendante du taux d'actualisation"
          ],
          correctAnswer: 2,
          explanation: "Une VAN positive (VAN > 0) signifie que la somme des richesses générées dans le futur dépasse l'investissement initial, en tenant compte du coût du temps."
        },
        {
          question: "À quoi sert le TRI (Taux de Rentabilité Interne) pour un investisseur ?",
          options: [
            "À connaître le prix des tracteurs",
            "À comparer la rentabilité (en pourcentage) de ce projet agricole avec d'autres placements financiers (ex: immobilier, bourse)",
            "À calculer les impôts",
            "À mesurer l'humidité du sol"
          ],
          correctAnswer: 1,
          explanation: "Le TRI s'exprime en %, ce qui permet de comparer le rendement du projet avec le rendement d'un placement financier sans risque."
        },
        {
          question: "Si le TRI de votre projet agricole est de 3%, et que les obligations d'État sans risque rapportent 6%...",
          options: [
            "L'investisseur sera très intéressé",
            "L'investisseur refusera, car le risque agricole n'est pas rémunéré (il vaut mieux investir dans l'État sans risque)",
            "L'investisseur demandera une subvention",
            "La banque prêtera plus d'argent"
          ],
          correctAnswer: 1,
          explanation: "Un projet entrepreneurial comporte des risques (climat, maladies). Son TRI doit donc être nettement supérieur aux placements sans risque pour justifier la prise de risque."
        }
      ]
    }
  ]
};
