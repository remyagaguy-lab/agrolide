import type { Filiere } from './types'

/**
 * Module de filière « Aquaculture ». Chiffres du cas « Pisciculture de tilapia en étangs au Sénégal »
 * (src/content/cas-chiffres/aquaculture-senegal.ts, calculé par scripts/modeles_bp/cas_chiffres.py) :
 * hypothèses pédagogiques, à remplacer par vos devis, vos relevés de prix et vos performances mesurées.
 */
export const aquaculture: Filiere = {
  slug: 'aquaculture',
  titre: 'Aquaculture',
  resume: "Cinq leçons pour chiffrer une ferme piscicole : choix du système et de l'espèce, cycle de production, aliment, eau et aménagements, débouchés. Cas chiffré (Sénégal) et classeur Excel inclus.",
  statut: 'disponible',
  casSlug: 'aquaculture-senegal',
  gabarit: {
    libelle: 'Classeur Excel : cycle de production, résultat annuel, sensibilité, calendrier des cycles',
    url: '/documents/bp-agricole/Agrolide-gabarit-aquaculture.xlsx',
  },
  lecons: [
    {
      id: 'aq_1',
      titre: "Système d'élevage et espèce : étang, cage ou bac ?",
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez comparer les grands systèmes d'élevage de poissons, choisir celui qui convient à votre site et à votre capital, et justifier le choix de l'espèce dans votre plan.

### Trois grandes familles de systèmes
| Système | Principe | Investissement | Atout | Limite |
|---|---|---|---|---|
| **Étangs** en terre | Bassins creusés, alimentés en eau | Moyen (terrassement) | Coût d'exploitation modéré, grande surface possible | Demande du terrain, de l'eau et une bonne gestion de l'eau |
| **Cages** flottantes | Cages dans un plan d'eau, un lac ou une retenue | Moyen | Pas de terrassement, forte densité | Dépend d'un plan d'eau et d'une autorisation d'usage, risque d'eau de mauvaise qualité |
| **Bacs et circuits recirculés** | Bassins hors sol, eau traitée et recyclée | Élevé (matériel, énergie) | Peu d'eau consommée, production très intensive | Dépendance à l'électricité, technicité élevée, pannes fatales |

Dans le cas du Sénégal, le choix se porte sur des **étangs** : douze bassins de 500 m², parce que le site offre du terrain et un forage, et que la ferme préfère limiter la technicité de départ.

### Le choix de l'espèce
Le choix de l'espèce suit le **marché** et les **conditions du site** :
- **Le tilapia** est l'espèce la plus élevée en Afrique : croissance régulière, tolérance de l'eau, aliment commercial disponible, forte demande.
- **Le silure** (clarias) supporte des eaux pauvres en oxygène et des fortes densités, mais certains marchés l'acceptent moins bien.
- D'autres espèces locales peuvent convenir ; vérifiez qu'une **source fiable d'alevins** existe pour elles avant de bâtir un plan.

Avant de choisir : combien coûte un alevin, d'où vient-il, quelle est sa qualité, quel est le prix du poisson sur votre marché ? Notez la date et la source.

### Les questions de site
- **L'eau :** quantité disponible toute l'année, qualité, température.
- **Le terrain :** nature du sol (un sol trop sableux fuit), pente, risque d'inondation.
- **L'énergie :** réseau, solaire ou groupe électrogène pour pomper ou aérer.
- **La distance au marché** : le poisson frais supporte mal un long trajet sans glace.

#### Ce qu'il faut retenir
- Choisissez le système selon le site, le capital et votre technicité, pas selon la mode.
- Le choix de l'espèce suit le marché et la disponibilité d'alevins de qualité.
- Documentez la source de l'eau, du terrain et des alevins dans le dossier.

### Exercice
Décrivez en une page le système et l'espèce de votre projet, avec la raison du choix, et listez les trois principales contraintes de votre site.
`,
    },
    {
      id: 'aq_2',
      titre: 'Le cycle de production : alevins, densité, survie, poids de vente',
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez calculer la production annuelle d'une ferme piscicole à partir de la surface, de la densité, de la survie et du poids de vente, et en déduire le chiffre d'affaires.

### La chaîne de calcul
La production d'une ferme de poissons se construit étape par étape :

> Alevins mis en charge = surface × densité × nombre de cycles.
> Poissons vendus = alevins × taux de survie.
> Production (kg) = poissons vendus × poids moyen de vente.
> Chiffre d'affaires = production × prix au kilo.

Dans le cas du Sénégal :
- 12 étangs de 500 m² = 6 000 m² ;
- 3 alevins par m², soit 18 000 alevins par cycle ;
- 2 cycles par an, soit **36 000 alevins** par an ;
- survie de 85 %, soit 30 600 poissons vendus ;
- poids de vente de 420 g, soit environ **12 852 kg** par an ;
- prix de 2 600 FCFA/kg, soit **33,4 M FCFA** de chiffre d'affaires de croisière.

### Les quatre paramètres qui font le résultat
1. **La densité.** Plus elle est élevée, plus le rendement par étang augmente, mais plus la qualité de l'eau et la santé des poissons sont fragiles. Retenez la densité que votre système et votre technicité permettent réellement.
2. **La survie.** Chaque poisson mort est un poisson payé (alevin, aliment consommé) et jamais vendu. Cinq points de survie en moins coûtent environ 2,0 M FCFA de chiffre d'affaires dans le cas.
3. **Le poids de vente** et la durée du cycle. Un poisson plus lourd se vend plus cher au kilo, mais demande plus de temps, donc moins de cycles par an.
4. **Le nombre de cycles.** Il dépend du climat, de l'eau et du temps de vide sanitaire entre deux cycles (vider, sécher, chauler l'étang).

### Ne pas oublier le vide
Un étang ne produit pas toute l'année : il faut le vider, le laisser sécher, le préparer, puis le remplir de nouveau. Dans le cas, deux cycles de six mois comprennent ce vide. Si vous annoncez trois cycles par an, prouvez-le avec le calendrier.

### Année 1
La première année est rarement une année pleine : mise en eau, décalage du premier cycle, apprentissage. Le cas retient 70 % de la production pour l'année 1.

#### Ce qu'il faut retenir
- Production = surface × densité × cycles × survie × poids de vente.
- La survie et le poids de vente sont vos paramètres les plus sensibles : sourcez-les.
- Comptez le vide sanitaire dans votre calendrier.

### Exercice
Avec le classeur joint, calculez la production et le chiffre d'affaires de votre ferme (surface, densité, cycles, survie, poids, prix), puis testez une survie réduite de cinq points.
`,
    },
    {
      id: 'aq_3',
      titre: "L'aliment et l'indice de conversion : le premier poste de coûts",
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez calculer le coût de l'aliment d'une ferme piscicole, comprendre l'indice de conversion et chiffrer ce que vaut chaque amélioration.

### L'indice de conversion
L'**indice de conversion alimentaire** (parfois noté IC ou FCR) est la quantité d'aliment nécessaire pour produire un kilo de poisson.

> Aliment (kg) = production (kg) × indice de conversion.

Dans le cas du Sénégal, l'indice retenu est de 1,6 : pour 12 852 kg de poisson, il faut environ 20 563 kg d'aliment, soit, à 580 FCFA/kg, **11,9 M FCFA**.

### Le poste dominant
Sur 18,7 M FCFA de charges variables, l'aliment en représente **64 %**. Aucun autre poste n'a un tel poids : une hausse de 20 % du prix de l'aliment augmente les charges d'environ 2,4 M FCFA, soit plus que l'EBE d'un trimestre (8,1 M FCFA par an).

### Ce qui fait varier l'indice
- La **qualité et le type d'aliment** (aliment flottant, protéines adaptées au stade de croissance).
- Le **rationnement** : trop nourrir gaspille l'aliment et dégrade l'eau ; trop peu freine la croissance.
- La **qualité de l'eau**, la température et la santé des poissons.
- La **régularité** des distributions.

Un technicien expérimenté ou un fournisseur d'aliment sérieux peut vous donner une table de rationnement. Demandez-la par écrit.

### Aliment du commerce ou fabriqué à la ferme ?
Fabriquer l'aliment à partir de matières locales peut réduire le prix au kilo, mais demande équipement, formulation et contrôle de la qualité. Chiffrez les deux options avec vos devis avant de décider. Un aliment moins cher mais moins efficace peut coûter plus cher par kilo de poisson produit.

### Sécuriser l'approvisionnement
L'aliment peut être importé ou livré de loin : prix instable, ruptures possibles. Prévoyez :
- au moins **deux fournisseurs** ;
- un **stock de sécurité** dans un magasin sec et ventilé ;
- un contrat ou une lettre d'intention sur le prix et la livraison.

#### Ce qu'il faut retenir
- Aliment = production × indice de conversion × prix du kilo.
- C'est le premier poste : testez toujours un scénario de hausse du prix de l'aliment.
- Sécurisez l'approvisionnement avec deux fournisseurs et un stock.

### Exercice
Calculez l'aliment nécessaire pour la production de votre ferme, puis mesurez l'effet sur l'EBE d'une hausse de 10 % du prix de l'aliment et d'une baisse de 0,1 point de l'indice de conversion.
`,
    },
    {
      id: 'aq_4',
      titre: "Eau, aménagements et autorisations : investir sans se tromper",
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez chiffrer les aménagements d'une ferme piscicole, prévoir la gestion de l'eau et vérifier les autorisations nécessaires avant d'investir.

### Les postes d'investissement du cas
Pour 12 étangs de 500 m² :
| Poste | Montant (M FCFA) | Durée |
|---|---|---|
| Frais d'établissement et autorisations | 0,5 | 5 ans |
| Creusement et aménagement des étangs | 10,0 | 20 ans |
| Forage, pompe et réseau d'eau | 4,5 | 10 ans |
| Magasin d'aliment et local de conditionnement | 4,0 | 20 ans |
| Équipements (filets, balance, aérateurs, glacières) | 3,5 | 5 ans |
| Clôture et gardiennage | 1,5 | 10 ans |
| Imprévus (capitalisés) | 1,5 | 10 ans |
| **Total immobilisations** | **25,5** | |

Avec le besoin en fonds de roulement initial (5,0 M FCFA, surtout l'aliment des premiers mois), le projet coûte **30,5 M FCFA**. Les étangs et l'eau représentent plus de la moitié de l'investissement.

### L'eau, première condition
- **Quantité :** remplir les étangs, compenser l'évaporation et les infiltrations. Faites évaluer le besoin par un technicien.
- **Qualité :** oxygène, température, acidité, absence de pollution en amont. Un test de l'eau avant tout creusement évite une erreur de plusieurs millions.
- **Continuité :** un forage en panne ou une nappe qui baisse peuvent tuer une production en quelques jours. Prévoyez pompe de secours et énergie de secours.

### Autorisations et règles à vérifier
Selon le pays et le système, plusieurs démarches peuvent s'appliquer : droit sur le terrain, autorisation de prélèvement d'eau, étude d'impact ou déclaration environnementale, agrément pour l'activité d'aquaculture, règles sanitaires de vente. **Vérifiez-les auprès de l'administration compétente de votre pays et notez la date et la source.** Voir la fiche Cadre pays.

### Biosécurité
Limitez l'entrée d'agents pathogènes : alevins d'origine contrôlée, contrôle des visiteurs, nettoyage du matériel, quarantaine d'un nouveau lot si possible. Une maladie introduite sur une ferme peut ruiner plusieurs cycles.

#### Ce qu'il faut retenir
- Les étangs, l'eau et l'énergie dominent l'investissement : demandez plusieurs devis.
- Faites tester l'eau avant d'investir.
- Vérifiez les autorisations de votre pays avec date et source.

### Exercice
Établissez le tableau des investissements de votre ferme (devis, durée d'amortissement) et calculez la dotation annuelle aux amortissements. Ajoutez votre plan de secours en cas de panne d'eau ou d'énergie.
`,
    },
    {
      id: 'aq_5',
      titre: 'Débouchés, prix et indicateurs : une marge de sécurité étroite',
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez construire une hypothèse de prix crédible pour le poisson, lire les indicateurs d'une ferme piscicole (seuil, DSCR, VAN, TRI) et chiffrer des leviers pour la rendre plus robuste.

### Vendre du poisson frais
Le poisson frais se conserve peu : il faut l'écouler vite, en glace, sans casser la chaîne du froid. Les canaux classiques :
| Canal | Atout | Limite |
|---|---|---|
| Grossistes et mareyeurs | Volumes, paiement rapide | Prix tiré vers le bas |
| Poissonneries et marchés | Meilleur prix | Plus de temps et de logistique |
| Restaurants, hôtels | Prix stable, régularité | Exigences de calibre et de livraison |
| Vente à la ferme | Pas de transport | Clientèle limitée |

Une lettre d'intention d'un restaurateur ou d'un grossiste (volume, fréquence, prix) vaut mieux qu'un marché annoncé « immense ». Voir la leçon 4.2.

### Le prix du poisson dans votre plan
Relevez les prix auprès d'au moins trois acheteurs, sur plusieurs semaines, par calibre de poisson. Le cas retient 2 600 FCFA/kg : **c'est une hypothèse**, à remplacer par vos relevés datés.

### Les indicateurs du cas du Sénégal
Coût du projet **30,5 M FCFA** ; apport 9,2 M (30 %) ; emprunt 21,3 M à 9 % sur 7 ans dont 1 an de différé ; annuité d'environ 4,7 M FCFA.

| Indicateur | Valeur |
|---|---|
| Chiffre d'affaires de croisière | 33,4 M FCFA |
| EBE de croisière | 8,1 M FCFA |
| Taux de marge sur coûts variables | 44 % |
| Seuil de rentabilité | 24,5 M FCFA, soit 73 % du CA |
| DSCR année 2 : réaliste / pessimiste / crise de l'aliment | 1,46 / 0,76 / 0,85 |
| VAN à 10 % / TRI (réaliste) | 2,6 M FCFA / 12,4 % |

### Lire ces chiffres
La ferme est rentable, mais **fragile** : un recul de cinq points de survie, une hausse de l'aliment de 8 % et un prix en baisse de 5 % font passer le DSCR sous 1. Le retour sur investissement est lent (au-delà de cinq ans) parce que l'aquaculture immobilise beaucoup avant de produire.

### Trois leviers à chiffrer
1. **Réduire la mortalité** : chaque point de survie gagné vaut environ 0,4 M FCFA de chiffre d'affaires.
2. **Améliorer l'indice de conversion** : chaque dixième de point économisé réduit les charges d'aliment d'environ 0,7 M FCFA.
3. **Réduire l'emprunt ou allonger sa durée** : apport plus élevé, subvention d'équipement si elle existe (voir la fiche Cadre pays), investissement en deux temps.

Ne retenez un levier dans le plan que si vous l'avez chiffré avec le même modèle (classeur joint) et que vous savez comment le mettre en œuvre.

### Risques propres à l'aquaculture
Qualité de l'eau et mortalité, maladie, panne d'énergie ou d'eau, vol, hausse du prix de l'aliment, baisse du prix du poisson. Reprenez la matrice de la leçon 6.1 et cotez-les.

#### Ce qu'il faut retenir
- Le prix du poisson est une hypothèse sourcée et datée, avec un scénario de baisse.
- Survie et aliment font la marge : mesurez-les, suivez-les.
- Chiffrez chaque levier avec le modèle avant de l'écrire.

### Exercice
Avec le classeur joint, classez l'effet sur l'EBE annuel de : (a) survie + 5 points, (b) aliment + 10 %, (c) prix − 10 %, (d) indice de conversion − 0,1.
`,
    },
  ],
}
