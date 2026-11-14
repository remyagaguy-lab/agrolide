import type { Filiere } from './types'

/**
 * Module facultatif « Impact, conformité et durabilité » (transversal). Contenu de méthode : aucun seuil, norme ni montant réglementaire
 * n'est cité (ils dépendent du pays et changent). Vérifiez chaque exigence dans la fiche Cadre pays et auprès de l'administration, avec date et source.
 */
export const impactConformite: Filiere = {
  slug: 'impact-conformite',
  titre: 'Impact, conformité et durabilité',
  resume: "Trois leçons transversales : genre, jeunes et inclusion, environnement et climat, conformité réglementaire. Pour présenter l'impact de votre projet avec des indicateurs mesurables et prouver que vous respectez les règles du pays.",
  statut: 'disponible',
  lecons: [
    {
      id: 'im_1',
      titre: 'Genre, jeunes et inclusion : des indicateurs, pas des promesses',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez décrire l'impact social de votre projet avec des indicateurs que vous pouvez mesurer, sans promesse vague.

### Pourquoi les financeurs le demandent
Beaucoup de bailleurs et de programmes évaluent l'impact : emplois créés, place des femmes et des jeunes, revenus des familles. Un dossier qui en parle avec des chiffres vérifiables se démarque ; un dossier qui promet de « changer la vie des jeunes » sans indicateur n'est pas crédible.

### Les indicateurs utiles
| Thème | Indicateur à mesurer | Comment le vérifier |
|---|---|---|
| Emploi | Nombre d'emplois permanents et saisonniers créés, par sexe et par tranche d'âge | Registre du personnel |
| Revenus | Revenu moyen des producteurs fournisseurs avant et après | Enquête simple, deux relevés datés |
| Femmes | Part de femmes parmi les salariés, les fournisseurs, les responsables | Registres |
| Jeunes | Nombre de jeunes formés ou employés | Registre, attestations |
| Accès aux ressources | Terres ou intrants accessibles aux femmes et aux jeunes de votre zone | Entretiens, documents |

### Une cible réaliste
Écrivez ce que vous pouvez atteindre avec vos moyens : « 6 emplois permanents dont 2 occupés par des femmes, dès la deuxième année » vaut mieux qu'un objectif général. Datez chaque cible.

### Les risques à anticiper
- l'accès des femmes à la terre est souvent plus difficile : ne l'ignorez pas dans votre plan foncier ;
- les emplois de jeunes demandent un encadrement et une formation, avec un coût à chiffrer ;
- les conditions de travail (sécurité, âge minimal, paiement à temps) sont des exigences légales autant que des engagements.

### Les mesures concrètes
Formation interne, contrats écrits, horaires adaptés, groupement de producteurs avec règles d'adhésion claires. Chiffrez chaque mesure dans votre budget.

#### Ce qu'il faut retenir
- Un impact se démontre avec des indicateurs mesurables et datés.
- Chaque objectif doit correspondre à des moyens inscrits dans le plan.
- Les conditions de travail et l'accès à la terre sont des sujets à traiter, pas à passer sous silence.

### Exercice
Choisissez quatre indicateurs, donnez la valeur de départ, la cible à 24 mois, la source de mesure et le coût de la mesure qui permet de l'atteindre.
`,
    },
    {
      id: 'im_2',
      titre: 'Environnement et climat : connaître ses impacts et s\'adapter',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez identifier les impacts environnementaux de votre projet, les risques climatiques qu'il subit et les mesures à chiffrer.

### Deux sens à ne pas confondre
- **L'impact de votre projet sur l'environnement** : eau, sols, intrants, déchets.
- **L'impact du climat sur votre projet** : sécheresse, pluies irrégulières, chaleur, inondations.

### L'impact de votre projet
| Thème | Question à se poser |
|---|---|
| Eau | D'où vient l'eau ? Quelle quantité ? Quelle autorisation ? |
| Sols | Fertilité, érosion, rotation, matière organique |
| Intrants | Engrais et produits de traitement : doses, stockage, traitement des emballages |
| Déchets | Résidus de récolte, déchets d'élevage, eaux de lavage |
| Biodiversité | Défrichement, zones protégées voisines |

### Les risques climatiques
Pour chaque risque majeur de votre zone : probabilité, effet sur le rendement, mesure d'adaptation (variétés adaptées, irrigation maîtrisée, calendrier, couverture du sol, assurance). Utilisez des données **datées et sourcées** (service météo, institut de recherche agricole).

### Mesures chiffrées
Une mesure environnementale a un coût et parfois un gain : économie d'eau, baisse des intrants, vente de sous-produits. Mettez les deux dans votre modèle. Une mesure qui rend le plan irréaliste n'est pas applicable ; une mesure qui améliore la couverture de la dette est un argument.

### L'étude d'impact
Selon le pays, la taille et la nature du projet, une notice ou une étude d'impact environnemental peut être exigée. Les seuils sont propres à chaque pays : vérifiez-les auprès de l'administration chargée de l'environnement et notez la date.

#### Ce qu'il faut retenir
- Distinguez l'impact de votre projet et l'effet du climat sur votre projet.
- Chaque mesure d'adaptation a un coût et un effet à chiffrer.
- L'obligation d'étude d'impact dépend du pays et du projet : vérifiez-la tôt.

### Exercice
Listez trois risques climatiques de votre zone, la mesure d'adaptation envisagée, son coût annuel et son effet sur le rendement ou la couverture de la dette.
`,
    },
    {
      id: 'im_3',
      titre: 'Conformité : prouver que votre projet respecte les règles',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez dresser la liste des exigences réglementaires de votre projet et les prouver dans votre dossier.

### Pourquoi c'est un sujet de financement
Un financeur prête à un projet en règle. Une activité sans autorisation, sans foncier sécurisé ou sans respect du droit du travail est un risque qu'il refusera d'assumer.

### Le tableau de conformité
| Domaine | Exigence à vérifier | Preuve à joindre |
|---|---|---|
| Foncier | Droit sur la terre valable pour la durée du projet | Titre, attestation, bail |
| Entreprise | Immatriculation, identifiant fiscal, affiliation sociale | Extrait du registre, attestations |
| Eau | Autorisation de prélèvement ou de forage si exigée | Autorisation, récépissé |
| Phytosanitaire | Produits homologués, stockage sûr, applicateurs formés | Liste des produits, formations |
| Sanitaire (transformation, élevage) | Agrément, normes d'hygiène, contrôle vétérinaire | Agrément, rapports |
| Travail | Contrats, âge minimal, salaires, sécurité | Contrats, registre |
| Étiquetage et normes de vente | Selon le produit et le marché | Certificats, fiches produit |
| Environnement | Notice ou étude si requise | Décision de l'administration |

### Où trouver les exigences
Dans la fiche **Cadre pays** de votre pays, puis auprès des administrations concernées (agriculture, environnement, travail, santé animale ou végétale, commune). Les fiches signalent les points non vérifiés : ne les considérez pas comme confirmés.

### Le coût de la conformité
Autorisations, analyses, formations, équipements de protection, certification : chiffrez-les dans vos investissements ou vos charges fixes. Un plan qui oublie ces coûts sous-estime ses besoins.

### La traçabilité
Pour beaucoup de marchés (supermarchés, export, transformateurs), l'acheteur demande de savoir d'où vient le produit et ce qu'il a reçu comme traitement. Un cahier de culture ou d'élevage tenu au jour le jour est une preuve de conformité.

#### Ce qu'il faut retenir
- Dressez le tableau des exigences de votre projet, avec la preuve de chacune.
- La fiche Cadre pays et les administrations sont vos sources ; notez la date de vérification.
- Les coûts de conformité entrent dans le plan.

### Exercice
Remplissez le tableau de conformité de votre projet : pour chaque ligne, l'exigence, la source, la preuve disponible, la preuve manquante, le coût et le délai pour l'obtenir.
`,
    },
  ],
}
