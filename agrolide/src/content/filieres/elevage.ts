import type { Filiere } from './types'

/**
 * Module de filière « Élevage : poulet de chair ». Tous les chiffres viennent du cas « Poulet de chair au Togo »
 * (src/content/cas-chiffres/poulet-togo.ts, calculé par scripts/modeles_bp/cas_chiffres.py) : hypothèses pédagogiques,
 * à remplacer par vos devis et vos relevés datés.
 */
export const elevage: Filiere = {
  slug: 'elevage',
  titre: 'Élevage : le poulet de chair',
  resume: "Cinq leçons pour chiffrer un élevage avicole : bandes, indicateurs techniques, coûts, débouchés, risques sanitaires. Cas chiffré et classeur Excel inclus.",
  statut: 'disponible',
  casSlug: 'poulet-togo',
  gabarit: {
    libelle: 'Classeur Excel : coût et marge par bande, résultat annuel, sensibilité',
    url: '/documents/bp-agricole/Agrolide-gabarit-elevage-poulet-de-chair.xlsx',
  },
  lecons: [
    {
      id: 'el_1',
      titre: "Le cycle d'un élevage : bandes, vide sanitaire, capacité",
      duree_minutes: 8,
      contenu: `### Objectif
À la fin de cette leçon, vous saurez calculer la capacité annuelle d'un élevage de poulets de chair à partir de ses bâtiments et de la durée de ses bandes, et expliquer pourquoi un élevage ne se planifie pas comme une culture.

### Une bande, un cycle
Un élevage de poulets de chair fonctionne par **bandes** : on met en place un lot de poussins d'un jour dans un bâtiment, on les élève, on les vend, puis on **vide, nettoie et désinfecte** le bâtiment avant d'accueillir le lot suivant. Cette pause s'appelle le **vide sanitaire**. Elle n'est pas une perte de temps : c'est ce qui casse le cycle des maladies.

Dans notre cas de référence (Ama Koffi, Togo) : 42 jours d'élevage, puis un vide sanitaire d'environ 18 jours. Un cycle complet dure donc environ 60 jours.

> 365 jours ÷ 60 jours ≈ **6 bandes par an et par bâtiment**.

### Calculer la capacité
Ama construit 3 bâtiments de 2 000 places.

> 3 bâtiments × 2 000 places × 6 bandes = **36 000 poussins mis en place par an.**

Attention : ce sont des poussins **mis en place**, pas des poulets vendus. Avec 6 % de mortalité, il en reste 36 000 × 0,94 = **33 840 poulets vendus** par an. Tout votre chiffre d'affaires vient de ce second nombre, alors que vos coûts (poussins, une partie de l'aliment) viennent du premier.

### Ce qui change par rapport à une culture
- **Le cycle est court et répété.** Vous encaissez six fois par an, pas une fois par saison. La trésorerie est plus régulière, mais chaque bande engage des dépenses lourdes dès le premier jour (poussins, aliment).
- **Le produit ne se stocke pas.** Un poulet prêt à vendre qui attend continue de consommer de l'aliment. Le débouché doit être prévu avant la mise en place.
- **Le capital est dans les bâtiments.** Chez Ama, 18 M FCFA de bâtiments sur 29,5 M d'immobilisations. Un bâtiment vide ne rapporte rien : le taux d'occupation compte.
- **La biosécurité remplace l'assolement.** Là où le maraîcher fait tourner ses cultures, l'éleveur protège son lot par l'hygiène.

### Mise en place décalée
Si les trois bâtiments démarraient le même jour, il faudrait vendre 5 640 poulets en même temps, tous les 60 jours, puis ne rien vendre pendant des semaines. On **décale** les bandes de bâtiment à bâtiment : la production se répartit sur l'année, soit environ **2 800 poulets par mois** (33 840 ÷ 12). C'est aussi plus facile à vendre à des restaurants et à des revendeurs.

#### Ce qu'il faut retenir
- Capacité annuelle = bâtiments × places × nombre de bandes par an.
- Le vide sanitaire fait partie du cycle ; ne l'oubliez pas dans le calcul.
- Distinguez poussins mis en place (coûts) et poulets vendus (chiffre d'affaires).
- On décale les bandes pour lisser les ventes et la trésorerie.

### Exercice
1. Votre élevage compte 2 bâtiments de 1 500 places, avec 45 jours d'élevage et 15 jours de vide sanitaire. Combien de bandes par an et par bâtiment ? Combien de poussins mis en place par an ?
2. Avec 7 % de mortalité, combien de poulets vendez-vous ?
3. Proposez un calendrier de mise en place décalé pour vos deux bâtiments.
`,
    },
    {
      id: 'el_2',
      titre: "Les indicateurs techniques : mortalité, poids, indice de consommation",
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez lire les trois indicateurs qui font ou défont la rentabilité d'une bande (mortalité, poids de vente, indice de consommation) et mesurer en francs ce que vaut un point d'écart.

### Les trois indicateurs
1. **La mortalité** : part des poussins qui meurent avant la vente. Cas de référence : 6 %.
2. **Le poids de vente** : poids vif d'un poulet à la sortie. Cas de référence : 2,0 kg à 42 jours.
3. **L'indice de consommation (IC)** : kilos d'aliment consommés pour produire un kilo de poids vif. Cas de référence : 1,75.

Ces chiffres ne sont pas des promesses : ils dépendent de la souche, de l'aliment, de la température, de l'eau et surtout de la discipline sanitaire. Un banquier attend que vous cite **vos relevés** (ou ceux d'un élevage comparable) avec leur source et leur date.

### Pourquoi l'aliment domine
Par poussin mis en place, Ama dépense :
- poussin d'un jour : 550 F
- aliment : 1,75 × 2,0 kg × 380 F = **1 330 F**
- produits vétérinaires : 90 F
- litière : 100 F
- eau, énergie, divers : 100 F

Total : **2 170 F**, dont l'aliment représente environ **61 %**.

### Un point d'écart, combien ça coûte ?
- **IC de 1,85 au lieu de 1,75** : l'aliment passe à 1,85 × 2,0 × 380 = 1 406 F, soit **+ 76 F par poussin**, donc **+ 2,7 M FCFA par an** pour 36 000 poussins.
- **Aliment à 418 F/kg au lieu de 380 F (+ 10 %)** : + 133 F par poussin, soit **+ 4,8 M FCFA par an**. L'EBE de 15,6 M FCFA tomberait vers 10,8 M.
- **Mortalité de 8 % au lieu de 6 %** : 720 poulets vendus en moins, soit **2,2 M FCFA de chiffre d'affaires** perdus (720 × 3 000 F), alors que les coûts engagés restent à peu près les mêmes.

Moralité : sur 15,6 M FCFA d'EBE, ces trois dérives cumulées suffisent à mettre l'élevage en difficulté. C'est ce que montre le scénario pessimiste du cas (DSCR de 1,15).

### Les relevés à tenir
Pour chaque bande : date de mise en place, nombre de poussins, mortalité par semaine, aliment distribué, poids moyen à la vente, nombre de poulets vendus. Le classeur Excel joint reprend ces lignes. Un élevage sans relevés ne peut ni se piloter ni convaincre.

#### Ce qu'il faut retenir
- Mortalité, poids de vente et IC déterminent coûts et chiffre d'affaires.
- Mesurez l'effet d'un écart en francs, pas en pourcentages abstraits.
- Citez vos relevés, datés et sourcés ; des normes de souche ne sont pas des relevés.

### Exercice
Avec un poids de vente de 2,0 kg, un prix d'aliment de 380 F/kg et 36 000 poussins, calculez le coût annuel supplémentaire d'un IC de 1,90 au lieu de 1,75.
`,
    },
    {
      id: 'el_3',
      titre: 'Chiffrer : coût par sujet, marge par poulet, sensibilité',
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez construire le compte d'exploitation d'un élevage avicole, calculer la marge par poulet vendu et repérer les variables qui menacent la rentabilité. Tout se fait avec la même méthode que le cas Diap Touré (leçon 5.7).

### Du coût par poussin au coût par poulet vendu
Charges variables du cas : 2 170 F par poussin mis en place, soit 78,1 M FCFA pour 36 000 poussins. Mais on vend seulement 33 840 poulets.

> Coût variable par poulet vendu = 78,1 M ÷ 33 840 ≈ **2 309 F**.
> Prix de vente : 3 000 F. **Marge par poulet vendu : environ 691 F**, soit 23 % du prix.

Une marge de 23 % : une variation de 5 % du prix de vente (150 F) retire presque le quart de la marge. À comparer avec Diap Touré, dont le taux de marge atteint 67 %.

### Le compte d'exploitation en croisière
| | M FCFA |
|---|---|
| Chiffre d'affaires | 101,5 |
| Charges variables | − 78,1 |
| Charges fixes | − 2,4 |
| Personnel | − 5,4 |
| **EBE** | **15,6** |

Le seuil de rentabilité est de 57,4 M FCFA (voir le cas), soit 57 % du chiffre d'affaires : la marge de sécurité est de 43 %. Elle paraît confortable, mais comme le taux de marge n'est que de 23 %, une petite baisse de prix la consomme vite.

### Sensibilité : trois tests à faire systématiquement
1. **Aliment + 10 %** : l'EBE perd environ 4,8 M FCFA.
2. **Prix de vente − 5 %** : environ 5,1 M FCFA de chiffre d'affaires en moins (150 F × 33 840), sans économie sur les coûts ; l'EBE perd autant.
3. **Mortalité + 2 points** : environ 2,2 M FCFA de chiffre d'affaires en moins.

Si les trois arrivent ensemble, l'EBE chute de plus de moitié. D'où trois scénarios obligatoires dans le dossier (réaliste, pessimiste, crise) et une trésorerie de sécurité : c'est le BFR initial de 10 M FCFA du cas, soit deux bandes d'avance de poussins et d'aliment.

### Le BFR d'un élevage
Avant la première vente, il faut financer l'aliment et les poussins de la première bande. Dans le cas, une bande de 2 000 poussins engage 2 000 × 2 170 F = **4,3 M FCFA** de charges variables (78,1 M ÷ 18 bandes par an). Le BFR initial de 10,0 M FCFA couvre donc un peu plus de deux bandes. Ce qui compte : le BFR doit couvrir **la première bande complète, les bandes lancées avant la première vente, et le délai de paiement de vos clients**.

#### Ce qu'il faut retenir
- Calculez le coût et la marge **par poulet vendu**, pas seulement par poussin.
- Marge fine = sensibilité forte : testez aliment, prix et mortalité.
- Le BFR d'un élevage se dimensionne en bandes d'avance.

### Exercice
Refaites le tableau du coût variable par poussin avec **vos** prix de poussin et d'aliment, puis calculez la marge par poulet vendu et le prix de vente minimal qui couvre le seuil de rentabilité.
`,
    },
    {
      id: 'el_4',
      titre: 'Débouchés et mise en marché de la volaille',
      duree_minutes: 7,
      contenu: `### Objectif
Vous saurez construire un plan de vente pour un produit qui ne se stocke pas, choisir vos canaux et sécuriser des clients avant de mettre en place la première bande.

### Un produit à date limite
Un poulet vendu trop tard ne vaut pas seulement un prix plus bas : il continue à consommer de l'aliment. Chaque jour de retard sur un lot de 2 000 poulets, c'est un jour d'aliment de plus à payer, sans recette supplémentaire. **Le débouché se sécurise avant la mise en place des poussins.**

### Les canaux, avec leurs forces et leurs limites
| Canal | Force | Limite |
|---|---|---|
| Rôtisseurs et restaurants | Volumes réguliers, paiement rapide | Peu nombreux ; exigence de calibre et de régularité |
| Revendeurs et marchés | Débouché large, souple | Prix négocié, paiements parfois différés |
| Grandes surfaces, collectivités | Gros volumes | Délais de paiement longs, cahier des charges |
| Vente directe (ferme, livraison) | Meilleur prix | Beaucoup de temps et de logistique |

### Votre concurrence
La concurrence ne vient pas seulement des autres éleveurs locaux. Elle vient aussi des **produits de substitution** (viande de volaille importée et conservée congelée, œufs, poisson, autres viandes). Documentez les prix **datés** de ces produits sur votre marché, avec leur source, et situez votre offre : poulet frais, calibré, livré à date fixe.

### Un calendrier de ventes réaliste
Avec des bandes décalées, visez un volume régulier d'environ 2 800 poulets par mois. Construisez un tableau mensuel : bande, date de mise en place, date de vente prévue, volume, clients concernés, prix. Pensez aux **pics de demande** (fêtes, saison des cérémonies) : c'est là que se vend le mieux, mais il faut avoir mis en place ses bandes six semaines plus tôt.

### Sécuriser avant de produire
Des lettres d'intention de rôtisseurs et de restaurants (volume, fréquence, prix) valent mieux qu'un grand marché annoncé. Le classeur joint comprend une feuille de suivi de vos engagements. Prévoyez aussi le **délai de paiement** : un client qui paie à 30 jours sur 8 M FCFA de ventes mensuelles immobilise environ 8 M FCFA dans votre BFR.

#### Ce qu'il faut retenir
- Vendez avant de produire : le poulet ne se stocke pas.
- Documentez vos prix de marché, datés et sourcés, y compris ceux des produits de substitution.
- Décalez les bandes et visez des clients réguliers.
- Le délai de paiement augmente le BFR.

### Exercice
Dressez la liste de dix clients potentiels de votre zone, avec le volume mensuel que chacun pourrait acheter et le prix qu'il accepterait, relevé auprès de lui et daté.
`,
    },
    {
      id: 'el_5',
      titre: 'Sécurité sanitaire, risques et mitigation',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez coter les risques propres à un élevage avicole, présenter vos mesures de biosécurité comme des mitigations chiffrées et intégrer les réserves nécessaires dans votre plan.

### Les risques propres à l'élevage
Reprenez la matrice de la leçon 6.1 (probabilité × impact, notes de 1 à 3). Pour un élevage avicole, voici une base de départ à adapter :

| Risque | Probabilité | Impact | Score |
|---|---|---|---|
| Hausse du prix de l'aliment | 3 | 3 | 9 |
| Maladie (épisode sanitaire sur une bande) | 2 | 3 | 6 |
| Coupure d'électricité ou d'eau (ventilation, chauffage) | 2 | 3 | 6 |
| Mévente ou retard de paiement d'un gros client | 2 | 2 | 4 |
| Vol, intrusion | 2 | 1 | 2 |

Traitez d'abord les scores de 6 et plus.

### Biosécurité : la première assurance
- **Vide sanitaire respecté** entre chaque bande, nettoyage et désinfection documentés.
- **Accès contrôlé** : pédiluve, vêtements dédiés, pas de visiteurs sans nécessité.
- **Plan de vaccination** défini avec un vétérinaire ou un technicien agréé, avec le calendrier dans le dossier.
- **Eau et aliment** de qualité contrôlée.

Ces mesures coûtent : prévoyez-les dans les produits vétérinaires (90 F par poussin dans le cas) et dans les charges fixes.

### Mitigations chiffrées
- **Aliment** : contrat d'approvisionnement à prix connu pour plusieurs bandes, stock tampon de quelques jours, comparaison de deux fournisseurs.
- **Énergie** : groupe électrogène ou solaire de secours pour la ventilation ; son coût figure en investissement.
- **Marché** : contrats avec plusieurs clients, aucun ne dépassant la moitié des ventes.
- **Assurance** : renseignez-vous sur les offres existantes dans votre pays (voir la fiche Cadre pays) ; ne comptez une prime que si vous avez un devis.

### Réglementation à vérifier
Un élevage avicole relève de règles sanitaires et d'implantation (déclaration ou autorisation, distances avec les habitations, gestion des déchets, contrôle vétérinaire). Elles varient d'un pays à l'autre et changent : **demandez-les à l'administration de l'élevage de votre pays, notez la date et la source**, et mettez-les dans l'annexe du dossier.

### Lire le scénario de crise
Dans le cas Togo, le scénario de crise (aliment + 15 %, prix − 4 %) donne un DSCR de 0,66 : l'exploitation ne couvre pas l'annuité de 6,6 M FCFA, il manquerait environ 2,2 M FCFA. Un financeur voudra savoir **comment vous comblez ce trou** : réserve de trésorerie, garantie, rééchelonnement, ajustement du nombre de bandes. Préparez la réponse avant l'entretien.

#### Ce qu'il faut retenir
- Cotez les risques propres à l'élevage et traitez d'abord les scores élevés.
- La biosécurité est une mitigation chiffrée, pas une formalité.
- Vérifiez la réglementation de votre pays, datez et sourcez.
- Préparez la réponse au scénario de crise.

### Exercice
Complétez la matrice avec vos propres risques, proposez pour chaque risque de score 6 ou plus une mesure chiffrée, et indiquez comment votre trésorerie absorberait deux mois de mévente.
`,
    },
  ],
}
