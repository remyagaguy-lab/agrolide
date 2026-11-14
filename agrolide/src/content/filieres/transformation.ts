import type { Filiere } from './types'

/**
 * Module de filière « Transformation et conditionnement ». Chiffres du cas « Séchage de mangues au Bénin »
 * (src/content/cas-chiffres/mangue-sechee-benin.ts) et du cas attiéké de Côte d'Ivoire, calculés par
 * scripts/modeles_bp/cas_chiffres.py : hypothèses pédagogiques, à remplacer par vos devis, vos rendements mesurés et vos relevés de prix.
 */
export const transformation: Filiere = {
  slug: 'transformation',
  titre: 'Transformation et conditionnement',
  resume: "Cinq leçons pour chiffrer une unité de transformation : rendement matière, capacité et saisonnalité, approvisionnement, équipements et normes, débouchés. Cas chiffré (séchage de mangues, Bénin) prolongeant le cas attiéké, et classeur Excel inclus.",
  statut: 'disponible',
  casSlug: 'mangue-sechee-benin',
  gabarit: {
    libelle: 'Classeur Excel : bilan matière, résultat annuel, sensibilité, calendrier de campagne',
    url: '/documents/bp-agricole/Agrolide-gabarit-transformation.xlsx',
  },
  lecons: [
    {
      id: 'tr_1',
      titre: 'Du produit brut au produit vendu : le rendement matière',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez construire le bilan matière d'une unité de transformation : combien de matière première entre, combien de produit fini sort, et ce que cela change à votre chiffre d'affaires.

### Le rendement matière
Transformer, c'est perdre de la matière : eau évaporée, épluchures, déchets, pertes de tri. Le **rendement matière** est la quantité de produit fini obtenue pour un kilo de matière première.

> Volume vendable = matière première × rendement × (1 − pertes de conditionnement).

Deux cas du module montrent l'écart :
- **Attiéké (Côte d'Ivoire)** : 0,55 kg d'attiéké pour 1 kg de manioc frais, soit environ 1,8 kg de manioc par kg de produit ;
- **Mangue séchée (Bénin)** : 0,11 kg de mangue séchée pour 1 kg de fruits frais, soit environ 9 kg de fruits par kg de produit.

Dans le cas du Bénin : 180 t de fruits × 0,11 × (1 − 4 %) ≈ **19 008 kg** de mangue séchée vendable.

### Pourquoi c'est la première chose à mesurer
Un point de rendement en plus (0,11 devient 0,12) ajoute environ 6,9 M FCFA de chiffre d'affaires dans le cas, sans acheter un kilo de fruits de plus. À l'inverse, un rendement surestimé de quelques points ruine le plan. Ne reprenez jamais le rendement d'un fabricant de matériel ou d'une brochure : **mesurez-le** sur vos propres lots, avec votre matière première, et notez la date.

### Comment le mesurer
1. Pesez un lot de matière première (exemple : 100 kg).
2. Faites-le passer par toutes les étapes (lavage, épluchage, découpe, cuisson ou séchage, tri).
3. Pesez le produit fini et les déchets à chaque étape.
4. Recommencez sur plusieurs lots et à plusieurs dates : le rendement change avec la maturité et la variété.

### Les sous-produits
Épluchures, résidus, eau de cuisson : certains se vendent (aliment pour le bétail, compost, énergie), d'autres coûtent à évacuer. Notez-les dans le plan, même si vous n'en tirez aucun revenu au départ.

#### Ce qu'il faut retenir
- Volume vendable = matière première × rendement × (1 − pertes).
- Mesurez le rendement sur vos lots, avec date et source.
- Chaque point de rendement a une valeur en francs : calculez-la.

### Exercice
Avec le classeur joint, calculez le volume vendable de votre unité pour votre matière première, puis mesurez l'effet d'un rendement inférieur de deux points.
`,
    },
    {
      id: 'tr_2',
      titre: 'Capacité, saisonnalité et taux d\'utilisation',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez dimensionner une unité de transformation en fonction de la matière première disponible et de la saison, et mesurer ce que coûte une machine qui ne travaille qu'une partie de l'année.

### La capacité, journalière et annuelle
La capacité se compte en **quantité traitée par jour** et en **nombre de jours de fonctionnement** :
- attiéké : 1,2 t de manioc par jour × 250 jours = **300 t** par an ;
- mangue séchée : 1,8 t de fruits par jour × 100 jours = **180 t** par an.

Les deux unités traitent des volumes comparables, mais ne travaillent pas le même nombre de jours. Le manioc se récolte toute l'année ; la mangue, quelques mois.

### La saisonnalité
Une unité saisonnière doit faire face à trois difficultés :
1. **Acheter beaucoup, vite** : le fonds de roulement est sollicité en début de campagne (dans le cas, 14,0 M FCFA de besoin initial).
2. **Recruter et former** une équipe saisonnière chaque année : la main-d'œuvre saisonnière coûte 11,0 M FCFA dans le cas.
3. **Amortir des équipements** qui servent 100 jours : les séchoirs (22,0 M FCFA) pèsent lourd par jour de fonctionnement.

### Le taux d'utilisation
> Taux d'utilisation = jours réellement travaillés ÷ jours possibles.

Si l'unité ne tourne que 70 jours au lieu de 100, les coûts fixes (personnel permanent, amortissements, intérêts) restent les mêmes et le chiffre d'affaires baisse. L'année 1 du cas retient 70 % de la pleine capacité.

### Étaler la saison
Pour mieux amortir l'outil, on cherche une **seconde matière première** à traiter hors saison (un autre fruit, un légume séché), ou une **conservation** de la matière première (réfrigération, séchage rapide). Chaque jour de plus de fonctionnement dilue les coûts fixes. Chiffrez-le : ne l'ajoutez au plan que si vous avez une source d'approvisionnement identifiée et un acheteur.

#### Ce qu'il faut retenir
- Capacité annuelle = quantité par jour × jours de fonctionnement.
- Une unité saisonnière supporte des coûts fixes lourds sur peu de jours.
- Un second produit ou une conservation de la matière première étale la saison, à condition de le chiffrer.

### Exercice
Calculez la capacité annuelle de votre unité et son taux d'utilisation prévu, mois par mois, avec le calendrier de campagne du classeur joint.
`,
    },
    {
      id: 'tr_3',
      titre: 'Approvisionnement en matière première : prix, qualité, régularité',
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez sécuriser et chiffrer l'approvisionnement de votre unité, qui conditionne à la fois votre volume, votre qualité et votre marge.

### Le poids de la matière première
- **Attiéké :** manioc acheté 33,0 M FCFA par an, soit plus de la moitié des charges variables.
- **Mangue séchée :** fruits achetés 19,8 M FCFA, soit **44 %** des charges variables du cas.

Le prix de la matière première varie avec la saison, la région et la concurrence d'autres acheteurs (exportateurs, marché frais). Dans le scénario pessimiste du cas, les fruits coûtent 8 % de plus.

### Trois modes d'approvisionnement
| Mode | Atout | Limite |
|---|---|---|
| Achat au marché ou au bord du champ | Souplesse | Prix instable, qualité hétérogène |
| Contrat avec des producteurs (prix et calendrier) | Régularité, qualité | Suivi, risque de vente à un concurrent si le prix monte |
| Production propre | Maîtrise | Investissement et risque agricole en plus |

### Le contrat d'approvisionnement
Un bon contrat précise : le **prix** (fixe, ou formule liée à un indice), la **qualité** exigée (calibre, maturité, absence de défauts), le **calendrier** de livraison, les modalités de **paiement** et de **refus** d'un lot. Un contrat trop dur pour le producteur n'est pas respecté : cherchez un équilibre.

### La qualité entrante
La qualité du produit fini dépend d'abord de celle de la matière première. Définissez des critères de réception (tri, pesée, contrôle visuel), enregistrez chaque lot (origine, date, poids), et refusez ce qui ne convient pas. Le tri rapporte plus qu'il ne coûte.

### Le plan d'approvisionnement
Établissez un plan sur 12 mois : fournisseurs (au moins deux), volumes, prix, calendrier. Prévoyez un plan B en cas de mauvaise récolte chez un fournisseur.

#### Ce qu'il faut retenir
- La matière première est le premier ou le deuxième poste de coûts : sécurisez-la avant d'investir.
- Un contrat équilibré (prix, qualité, calendrier, paiement) vaut mieux qu'un achat au jour le jour.
- Enregistrez et contrôlez chaque lot à l'arrivée.

### Exercice
Établissez le plan d'approvisionnement de votre unité sur 12 mois (fournisseurs, volumes, prix, calendrier) et rédigez les conditions d'un contrat type avec un producteur.
`,
    },
    {
      id: 'tr_4',
      titre: 'Équipements, normes et conditionnement',
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez chiffrer les équipements d'une unité, intégrer le coût du conditionnement et identifier les normes qui conditionnent l'accès à vos acheteurs.

### Les investissements du cas du Bénin
| Poste | Montant (M FCFA) | Durée |
|---|---|---|
| Frais d'établissement, agréments et certification | 2,0 | 5 ans |
| Local de transformation et magasin | 16,0 | 20 ans |
| Séchoirs (solaires et à gaz) | 22,0 | 8 ans |
| Lavage, épluchage, découpe et emballage | 11,0 | 8 ans |
| Véhicule utilitaire | 6,0 | 5 ans |
| Imprévus (capitalisés) | 3,0 | 10 ans |
| **Total immobilisations** | **60,0** | |

Avec le besoin en fonds de roulement initial (14,0 M FCFA), le projet coûte **74,0 M FCFA** ; les amortissements représentent environ 6,8 M FCFA par an. Les séchoirs sont le premier poste : demandez plusieurs devis, vérifiez la capacité réelle (kg de fruits par jour) et le coût de l'énergie.

### Le conditionnement
Le conditionnement protège le produit, le rend vendable et l'identifie. Il a un coût par kilo : dans le cas, **300 FCFA par kg** de produit emballé, soit 5,9 M FCFA par an. Choisissez-le avec votre acheteur : sachets, barquettes, cartons, calibres, étiquette.

### Les normes
Les acheteurs (supermarchés, exportateurs) exigent des règles d'hygiène, de traçabilité et d'étiquetage. Selon le produit et le pays, peuvent s'appliquer : agrément sanitaire de l'unité, analyses de laboratoire, étiquetage obligatoire, numéro de lot, certification (par exemple des systèmes de maîtrise de la sécurité des aliments). **Vérifiez ce qui s'applique auprès de l'administration de votre pays et auprès de vos acheteurs, et notez la date et la source** (voir la fiche Cadre pays).

### Énergie et eau
Séchage, cuisson et lavage consomment énergie et eau. Dans le cas, 5,0 M FCFA d'énergie de séchage. Prévoyez une solution de secours en cas de coupure, un point d'eau potable et le traitement des eaux usées.

#### Ce qu'il faut retenir
- Les équipements dominent l'investissement : comparez plusieurs devis et vérifiez la capacité réelle.
- Le conditionnement a un coût par kilo à intégrer dans les charges variables.
- Identifiez les normes de vos acheteurs avant d'investir, avec date et source.

### Exercice
Établissez le tableau des équipements de votre unité (devis, capacité, durée d'amortissement, entretien) et chiffrez le coût de conditionnement par kilo de produit.
`,
    },
    {
      id: 'tr_5',
      titre: 'Prix, débouchés et indicateurs : une activité saisonnière sous contrat',
      duree_minutes: 10,
      contenu: `### Objectif
Vous saurez construire une hypothèse de prix pour un produit transformé, sécuriser vos débouchés et lire les indicateurs d'une unité de transformation (seuil, DSCR, VAN, TRI).

### Le prix d'un produit transformé
Un produit transformé se vend à un prix qui dépend du calibre, de l'emballage, de la marque et du canal : grossiste, supermarché, exportateur, vente directe. Relevez les prix auprès de plusieurs acheteurs, par qualité, sur plusieurs semaines. Le cas du Bénin retient 4 000 FCFA/kg en gros : **c'est une hypothèse**.

### Les débouchés
Avant d'investir, obtenez des **lettres d'intention** de vos futurs acheteurs (volume, fréquence, prix, normes demandées). Voir la leçon 4.2. Une unité dont les acheteurs ne sont pas identifiés avant la première campagne court un risque majeur.

### Les indicateurs du cas du Bénin
Coût du projet **74,0 M FCFA** ; apport 22,2 M (30 %) ; emprunt 51,8 M à 9 % sur 7 ans dont 1 an de différé ; annuité d'environ 11,5 M FCFA.

| Indicateur | Valeur |
|---|---|
| Chiffre d'affaires de croisière | 76,0 M FCFA |
| EBE de croisière | 20,5 M FCFA |
| Taux de marge sur coûts variables | 41 % |
| Seuil de rentabilité | 54,1 M FCFA, soit 71 % du CA |
| DSCR année 2 : réaliste / pessimiste / crise de prix | 1,54 / 0,99 / 0,79 |
| VAN à 10 % / TRI (réaliste) | 7,9 M FCFA / 13,2 % |

### Lire ces chiffres
L'unité est rentable en réaliste, mais **sensible** : une baisse de 5 % du prix, des pertes un peu plus fortes et des fruits plus chers ramènent le DSCR à 0,99. Une crise de prix de 15 % le fait tomber à 0,79. L'investissement est lourd (74,0 M FCFA) pour une activité de 100 jours.

### Trois leviers à chiffrer
1. **Rendement et pertes** : chaque point de rendement matière vaut environ 6,9 M FCFA de chiffre d'affaires ; chaque point de pertes évité, environ 0,8 M.
2. **Taux d'utilisation** : un second produit ou une saison plus longue dilue les coûts fixes.
3. **Prix** : contrats avec des acheteurs qui paient la qualité, calibrage, marque ; attention aux acheteurs qui paient tard.

Ne retenez un levier dans le plan que si vous l'avez chiffré avec le modèle (classeur joint) et que vous savez comment le mettre en œuvre.

### Risques propres à la transformation
Approvisionnement et prix de la matière première, qualité et normes, panne d'équipement ou d'énergie, saisonnalité, retards de paiement des acheteurs. Reprenez la matrice de la leçon 6.1 et cotez-les.

#### Ce qu'il faut retenir
- Le prix d'un produit transformé est une hypothèse sourcée, datée, assortie d'un scénario de baisse.
- Le rendement matière et le taux d'utilisation font la rentabilité.
- Obtenez vos lettres d'intention d'achat avant d'investir.

### Exercice
Avec le classeur joint, classez l'effet sur l'EBE annuel de : (a) rendement − 0,01, (b) prix − 10 %, (c) fruits + 10 %, (d) pertes + 3 points.
`,
    },
  ],
}
