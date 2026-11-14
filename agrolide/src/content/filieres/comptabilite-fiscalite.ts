import type { Filiere } from './types'

/**
 * Module facultatif « Comptabilité et fiscalité du projet » (transversal). Contenu de méthode : aucun taux, seuil ni plafond fiscal n'est cité
 * (ils changent d'un pays et d'une année à l'autre). L'exemple chiffré est une illustration pédagogique.
 */
export const comptabiliteFiscalite: Filiere = {
  slug: 'comptabilite-fiscalite',
  titre: 'Comptabilité et fiscalité du projet',
  resume: "Quatre leçons transversales : états financiers du plan dans le référentiel comptable de l'OHADA, amortissements et subventions, impôts et taxes à saisir dans le modèle, tenue de la comptabilité au quotidien. Aucun taux n'est cité : vous les lisez dans les textes de votre pays.",
  statut: 'disponible',
  lecons: [
    {
      id: 'ct_1',
      titre: 'Les états financiers du plan dans le référentiel comptable OHADA',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez présenter les états financiers de votre plan comme les attend un comptable ou un banquier de la zone OHADA.

### Un référentiel commun
Les pays de l'OHADA appliquent un même référentiel comptable, le **SYSCOHADA révisé** (acte uniforme sur le droit comptable et l'information financière, applicable depuis 2018). Un banquier de la région y est habitué : présenter vos états dans cet ordre rend votre dossier plus lisible.

### Les états à présenter
| État | Ce qu'il montre | Où il apparaît dans la formation |
|---|---|---|
| **Compte de résultat** | Produits, charges, résultat de l'exercice | Leçon 5.4 |
| **Bilan** | Ce que l'entreprise possède (actif) et ce qu'elle doit ou a reçu (passif) | Leçon 5.6 |
| **Tableau de trésorerie** | Les encaissements et décaissements | Leçon 5.5 |
| **Notes annexes** | Méthodes, détail des postes, engagements | Annexes du dossier |

### Les soldes intermédiaires de gestion
Le SYSCOHADA lit le compte de résultat par étapes : marge commerciale ou production, **valeur ajoutée**, **excédent brut d'exploitation (EBE)**, résultat d'exploitation, résultat financier, résultat avant impôt, résultat net. L'EBE que vous calculez dans le modèle est le solde utilisé pour le DSCR.

### Deux sujets propres à l'agriculture
- **Les actifs biologiques** : plantations, animaux de production. Le plan comptable prévoit un traitement spécifique (évaluation, variation de valeur). Demandez à votre expert-comptable comment les inscrire à l'actif.
- **Les subventions d'investissement** : elles ne sont pas un produit de l'année, elles s'étalent comme l'actif financé (leçon suivante).

### Petites entités
Les très petites entités peuvent tenir une comptabilité allégée (système minimal de trésorerie). Les seuils dépendent du pays : lisez-les dans le code général des impôts et auprès de l'ordre des experts-comptables, avec la date.

#### Ce qu'il faut retenir
- Présentez compte de résultat, bilan, tableau de trésorerie et notes dans l'ordre du référentiel de la zone.
- L'EBE est le solde qui sert à calculer la couverture de la dette.
- Plantations, animaux et subventions demandent un traitement comptable précis : faites-vous accompagner.

### Exercice
Dans votre modèle financier, repérez où se trouvent la valeur ajoutée, l'EBE, le résultat d'exploitation et le résultat net, puis écrivez en une ligne ce que chacun apprend à un banquier.
`,
    },
    {
      id: 'ct_2',
      titre: 'Amortissements, provisions et subventions d\'investissement',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez calculer un amortissement, éviter l'erreur classique « l'amortissement est de l'épargne » et traiter une subvention dans le plan.

### L'amortissement
Un équipement s'use : on répartit son coût sur sa durée d'utilisation. Un tracteur de 22,0 M FCFA amorti sur 8 ans coûte **2,75 M FCFA par an** (22,0 ÷ 8). C'est une **charge sans décaissement** : l'argent est sorti à l'achat, pas chaque année.

### L'erreur classique
« L'amortissement permet de mettre de l'argent de côté » est faux. L'amortissement réduit le résultat imposable ; il ne crée aucun compte d'épargne. Si vous voulez remplacer le tracteur dans 8 ans, il faut **épargner réellement** : chaque année, mettre de côté une somme équivalente sur un compte distinct.

### Amortissement et trésorerie
Dans le tableau de trésorerie, on ne voit pas l'amortissement : on voit l'achat l'année où il a lieu. Dans le compte de résultat, on voit la charge chaque année. Cette différence explique pourquoi un projet peut être bénéficiaire et manquer de trésorerie.

### Les provisions
Une provision anticipe une perte probable (créance douteuse, remise en état, risque identifié). Dans un service qui accorde du crédit aux clients, une provision pour impayés est une bonne pratique : elle montre que vous connaissez votre risque.

### Les subventions d'investissement
Une subvention qui finance un équipement n'est pas un produit de l'année. Elle est reprise au résultat **au rythme de l'amortissement** de l'actif financé. Dans le plan de financement, elle est une ressource ; dans le compte de résultat, elle apparaît étalée. Demandez à votre comptable la présentation exacte.

#### Ce qu'il faut retenir
- Amortissement = coût réparti sur la durée d'usage, sans décaissement.
- L'amortissement ne remplace pas une épargne de renouvellement.
- Une subvention d'investissement est reprise au rythme de l'amortissement de l'équipement financé.

### Exercice
Dans votre modèle, listez vos équipements avec coût, durée et amortissement annuel. Calculez la somme à épargner chaque année pour les renouveler et inscrivez-la dans votre budget de trésorerie.
`,
    },
    {
      id: 'ct_3',
      titre: 'Impôts et taxes du projet : quoi lire, quoi saisir dans le modèle',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez identifier les impôts, taxes et cotisations de votre projet et les saisir dans le modèle avec leur source et leur date, sans citer de taux de mémoire.

### La liste à établir
| Prélèvement | À chercher | Où le lire |
|---|---|---|
| **Impôt sur les bénéfices** | Taux, régime selon la taille, régimes simplifiés pour les petites entreprises | Code général des impôts du pays |
| **TVA** | Traitement des produits agricoles et des intrants, seuil d'assujettissement | Code général des impôts ; administration fiscale |
| **Impôt minimum, patente, taxes locales** | Existence, base de calcul | Administration fiscale, commune |
| **Droits de douane et taxes à l'importation** | Intrants, matériel agricole | Douane ; tarif extérieur commun de la zone |
| **Cotisations sociales** | Taux employeur et salarié, plafond | Caisse de sécurité sociale |
| **Retenues à la source** | Sur loyers, honoraires, prestations | Code général des impôts |

### Ne citez pas de taux de mémoire
Ces valeurs changent chaque année et d'un pays à l'autre. Pour chacune, écrivez dans la feuille Hypothèses de votre modèle : la valeur, la **source** (article du code, site de l'administration) et la **date de lecture**.

### La perte reportable : un exemple
Année 1 : résultat avant impôt de − 10 (perte). Année 2 : + 25. Si le code permet de reporter la perte, le bénéfice imposable de l'année 2 est de 15 et non de 25. Avec un taux de 30 % pris **comme exemple pédagogique**, l'impôt est de 4,5 au lieu de 7,5. Les règles de report (durée, plafond) sont propres à chaque pays : vérifiez-les.

### Les exonérations
Certains pays offrent des exonérations ou des régimes favorables à l'agriculture, souvent avec des conditions et une durée. Ne comptez jamais sur une exonération dans le scénario réaliste sans l'avoir vérifiée par écrit ; présentez le plan avec et sans.

### Se faire accompagner
Un expert-comptable ou un centre de gestion agréé de votre pays relit vos hypothèses fiscales : c'est une dépense utile avant le dépôt du dossier.

#### Ce qu'il faut retenir
- Établissez la liste de vos impôts, taxes et cotisations, et lisez-les dans les textes en vigueur.
- Chaque valeur du modèle porte une source et une date de lecture.
- Une exonération non confirmée par écrit ne se compte pas dans le scénario réaliste.

### Exercice
Remplissez le tableau ci-dessus pour votre pays et votre activité. Pour chaque ligne : valeur, source, date. Notez les lignes à faire confirmer par un professionnel.
`,
    },
    {
      id: 'ct_4',
      titre: 'Tenir sa comptabilité au quotidien et piloter avec des chiffres vrais',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez organiser une comptabilité simple et un tableau de bord mensuel pour comparer vos chiffres réels au plan.

### Séparer l'entreprise et la personne
Un compte bancaire (ou de mobile money) pour l'entreprise, un pour la famille. Sans cette séparation, ni vous ni le banquier ne pouvez lire les comptes de l'entreprise.

### Les pièces à garder
- factures d'achat et de vente, reçus, bons de livraison ;
- relevés de compte ;
- contrats, lettres d'intention, devis ;
- fiches de paie ou de paiement des journaliers.
Un classeur par mois, ou un dossier numérique par mois avec les photos des pièces.

### Les enregistrements minimaux
| Registre | Contenu | Fréquence |
|---|---|---|
| Journal de caisse et de banque | Entrées et sorties | Chaque jour de mouvement |
| Registre des ventes | Date, client, quantité, prix, paiement | À chaque vente |
| Registre des achats | Date, fournisseur, produit, prix | À chaque achat |
| Inventaire des stocks et des animaux | Quantités | Chaque mois |

### Le tableau de bord mensuel
Chaque mois, comparez le réel au plan sur cinq lignes : **chiffre d'affaires, charges variables, EBE, trésorerie en fin de mois, créances clients**. Un écart de plus de 10 % sur une ligne mérite une explication écrite et, si besoin, une action.

### Quand faire appel à un expert-comptable
Pour établir les états de fin d'année, déposer les déclarations dans les délais, relire vos hypothèses fiscales, préparer un dossier de financement. Demandez un devis écrit et mettez les honoraires dans vos charges fixes.

### Le calendrier des déclarations
Établissez la liste de vos échéances (impôts, TVA si applicable, cotisations sociales, renouvellement de documents) avec les dates lues dans les textes du pays, et mettez-les dans un agenda partagé avec votre comptable.

#### Ce qu'il faut retenir
- Séparez les comptes de l'entreprise et ceux de la famille.
- Quelques registres bien tenus valent mieux qu'un logiciel complexe mal alimenté.
- Comparez chaque mois le réel au plan sur cinq lignes.

### Exercice
Préparez votre tableau de bord mensuel avec les cinq lignes ci-dessus, la valeur prévue du plan pour chaque mois et une colonne pour l'écart.
`,
    },
  ],
}
