// FICHIER GÉNÉRÉ par scripts/quiz_filieres/build.mjs — ne pas modifier à la main.
// Banques de quiz des modules par filière, par identifiant de leçon. Fichier serveur : ne jamais l'importer côté client
// (les bonnes réponses ne quittent le serveur qu'après correction, voir src/lib/formations/filieres-quiz.server.ts).
export type QuizQuestionFiliere = { question: string; options: string[]; correctAnswer: number; explanation: string };

export const QUIZ_FILIERES: Record<string, QuizQuestionFiliere[]> = {
  "el_1": [
    {
      "question": "Une ferme compte 3 bâtiments de 2 000 places et fait 6 bandes par an dans chacun. Combien de poussins sont mis en place par an ?",
      "options": [
        "36 000 poussins",
        "12 000 poussins, soit une bande de chaque bâtiment",
        "6 000 poussins, soit les places d'un seul bâtiment",
        "216 000 poussins, en multipliant par le nombre de jours"
      ],
      "correctAnswer": 0,
      "explanation": "3 × 2 000 × 6 = 36 000."
    },
    {
      "question": "Un élevage a 45 jours d'élevage et 15 jours de vide sanitaire. Combien de bandes par an et par bâtiment ?",
      "options": [
        "8 bandes, en ne comptant que les jours d'élevage",
        "24 bandes, en comptant une bande par semaine",
        "4 bandes, en comptant 90 jours par cycle complet",
        "6 bandes (365 ÷ 60 ≈ 6)"
      ],
      "correctAnswer": 3,
      "explanation": "Cycle complet = 45 + 15 = 60 jours ; 365 ÷ 60 ≈ 6."
    },
    {
      "question": "36 000 poussins sont mis en place avec 6 % de mortalité. Combien de poulets sont vendus ?",
      "options": [
        "36 000 poulets, car les pertes sont couvertes par la banque",
        "30 000 poulets, en retirant 6 000 poussins",
        "33 840 poulets",
        "2 160 poulets, qui correspondent aux seules pertes"
      ],
      "correctAnswer": 2,
      "explanation": "36 000 × (1 − 0,06) = 33 840."
    },
    {
      "question": "À quoi sert le vide sanitaire entre deux bandes ?",
      "options": [
        "À laisser reposer les ouvriers entre deux lots de poussins",
        "À nettoyer et désinfecter pour casser le cycle des maladies",
        "À attendre que le prix de la volaille remonte sur le marché",
        "À sécher la litière pour la revendre aux maraîchers voisins"
      ],
      "correctAnswer": 1,
      "explanation": "Le vide sanitaire fait partie du cycle ; le supprimer expose les bandes suivantes."
    },
    {
      "question": "Pourquoi décale-t-on la mise en place des bandes d'un bâtiment à l'autre ?",
      "options": [
        "Pour que les trois bâtiments se remplissent exactement en même temps",
        "Pour étaler les ventes et la trésorerie sur l'année plutôt que tout vendre le même jour",
        "Pour éviter de payer des intérêts sur l'emprunt pendant l'année",
        "Pour permettre de vendre plus cher qu'au prix de marché"
      ],
      "correctAnswer": 1,
      "explanation": "Avec des bandes décalées, on vend environ 2 800 poulets par mois au lieu de 5 640 d'un coup tous les 60 jours."
    },
    {
      "question": "Pourquoi distinguer poussins mis en place et poulets vendus ?",
      "options": [
        "Le chiffre d'affaires vient des poulets vendus, alors que les coûts partent des poussins mis en place",
        "Parce que les deux nombres sont toujours identiques en pratique",
        "Parce que seuls les poulets vendus génèrent des coûts d'aliment",
        "Parce que la banque ne finance que les poulets vendus"
      ],
      "correctAnswer": 0,
      "explanation": "La mortalité réduit les ventes sans réduire les coûts engagés."
    }
  ],
  "el_2": [
    {
      "question": "Que mesure l'indice de consommation (IC) d'un élevage de poulets ?",
      "options": [
        "Le nombre de poulets vendus par mètre carré de bâtiment",
        "Le prix payé pour un kilo d'aliment au fournisseur",
        "Le nombre de jours nécessaires pour atteindre 2 kg",
        "Les kilos d'aliment consommés pour produire un kilo de poids vif"
      ],
      "correctAnswer": 3,
      "explanation": "Plus l'IC est bas, moins l'aliment coûte par kilo produit."
    },
    {
      "question": "Avec un IC de 1,75, un poids de vente de 2,0 kg et un aliment à 380 F/kg, quel est le coût d'aliment par poussin ?",
      "options": [
        "760 F, soit 2,0 kg × 380 F",
        "665 F, soit 1,75 × 380 F",
        "1 330 F",
        "1 520 F, soit 4 kg × 380 F"
      ],
      "correctAnswer": 2,
      "explanation": "1,75 × 2,0 × 380 = 1 330 F."
    },
    {
      "question": "L'IC passe de 1,75 à 1,85 (poids 2,0 kg, aliment 380 F/kg). Quel surcoût par poussin ?",
      "options": [
        "10 F par poussin",
        "76 F par poussin",
        "38 F par poussin",
        "190 F par poussin"
      ],
      "correctAnswer": 1,
      "explanation": "0,10 × 2,0 × 380 = 76 F ; × 36 000 poussins = 2,7 M FCFA par an."
    },
    {
      "question": "L'aliment augmente de 10 % (1 330 F par poussin au départ, 36 000 poussins). Quel surcoût annuel ?",
      "options": [
        "Environ 0,5 M FCFA",
        "Environ 13,3 M FCFA",
        "Environ 4,8 M FCFA",
        "Environ 1,3 M FCFA"
      ],
      "correctAnswer": 2,
      "explanation": "133 F × 36 000 ≈ 4,8 M FCFA."
    },
    {
      "question": "La mortalité passe de 6 % à 8 % sur 36 000 poussins, poulet vendu 3 000 F. Quelle perte de chiffre d'affaires ?",
      "options": [
        "Environ 0,7 M FCFA",
        "Environ 21,6 M FCFA",
        "Aucune perte, car les coûts ne changent pas",
        "Environ 2,2 M FCFA (720 poulets en moins)"
      ],
      "correctAnswer": 3,
      "explanation": "2 % × 36 000 = 720 poulets ; 720 × 3 000 = 2,16 M FCFA."
    },
    {
      "question": "Par poussin, l'aliment coûte 1 330 F sur un coût variable total de 2 170 F. Quelle part représente-t-il ?",
      "options": [
        "Environ 61 %",
        "Environ 16 %",
        "Environ 33 %",
        "Environ 95 %"
      ],
      "correctAnswer": 0,
      "explanation": "1 330 ÷ 2 170 ≈ 0,61 : c'est la première variable à surveiller."
    }
  ],
  "el_3": [
    {
      "question": "Charges variables de 78,1 M FCFA pour 33 840 poulets vendus. Quel est le coût variable par poulet vendu ?",
      "options": [
        "Environ 2 170 F, qui est le coût par poussin mis en place",
        "Environ 3 000 F, qui est le prix de vente",
        "Environ 780 F, en divisant par 100 000",
        "Environ 2 309 F"
      ],
      "correctAnswer": 3,
      "explanation": "78,1 M ÷ 33 840 ≈ 2 309 F (2 170 F est le coût par poussin mis en place)."
    },
    {
      "question": "Un poulet est vendu 3 000 F pour un coût variable de 2 309 F. Quelle marge et quel taux de marge ?",
      "options": [
        "Environ 2 309 F, soit 77 % du prix",
        "Environ 691 F, soit 2,3 % du prix",
        "Environ 691 F, soit 23 % du prix",
        "Environ 300 F, soit 10 % du prix"
      ],
      "correctAnswer": 2,
      "explanation": "3 000 − 2 309 = 691 ; 691 ÷ 3 000 ≈ 23 %."
    },
    {
      "question": "CA 101,5 ; charges variables 78,1 ; charges fixes 2,4 ; personnel 5,4 (M FCFA). Quel est l'EBE ?",
      "options": [
        "23,4 M FCFA, avant les charges fixes et le personnel",
        "15,6 M FCFA",
        "18,0 M FCFA, avant le personnel seul",
        "8,2 M FCFA, après amortissements"
      ],
      "correctAnswer": 1,
      "explanation": "101,5 − 78,1 − 2,4 − 5,4 = 15,6."
    },
    {
      "question": "Le prix de vente baisse de 5 % (150 F) sur 33 840 poulets vendus. Quelle perte annuelle ?",
      "options": [
        "Environ 5,1 M FCFA",
        "Environ 0,5 M FCFA",
        "Environ 50,8 M FCFA",
        "Environ 1,7 M FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "150 × 33 840 = 5,08 M FCFA, sans économie sur les coûts."
    },
    {
      "question": "Une bande de 2 000 poussins à 2 170 F de coût variable par poussin engage combien de charges variables ?",
      "options": [
        "Environ 43 M FCFA",
        "Environ 0,4 M FCFA",
        "Environ 2,2 M FCFA",
        "Environ 4,3 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "2 000 × 2 170 = 4,34 M FCFA."
    },
    {
      "question": "Le BFR initial est de 10,0 M FCFA ; une bande engage environ 4,3 M FCFA. Combien de bandes cela couvre-t-il ?",
      "options": [
        "Moins d'une bande",
        "Environ dix bandes",
        "Un peu plus de deux bandes",
        "Exactement une bande"
      ],
      "correctAnswer": 2,
      "explanation": "10,0 ÷ 4,3 ≈ 2,3."
    }
  ],
  "el_4": [
    {
      "question": "Pourquoi faut-il sécuriser les débouchés avant la mise en place des poussins ?",
      "options": [
        "Parce que le poulet ne se stocke pas et continue de consommer de l'aliment s'il attend",
        "Parce que les clients n'achètent que des poussins d'un jour",
        "Parce que la banque refuse de financer sans commande ferme",
        "Parce que le prix du poulet est fixé par l'État avant la bande"
      ],
      "correctAnswer": 0,
      "explanation": "Un lot vendu en retard coûte de l'aliment sans recette supplémentaire."
    },
    {
      "question": "Un client paie à 30 jours et achète 8 M FCFA par mois. Quelle somme immobilise-t-il dans le BFR ?",
      "options": [
        "Environ 0,8 M FCFA",
        "Environ 8 M FCFA",
        "Environ 240 M FCFA",
        "Aucune somme, la vente est faite"
      ],
      "correctAnswer": 1,
      "explanation": "Un mois de ventes non encore payées = 8 M FCFA."
    },
    {
      "question": "Avec 33 840 poulets vendus par an, quel volume mensuel moyen viser ?",
      "options": [
        "Environ 2 800 poulets par mois",
        "Environ 340 poulets par mois",
        "Environ 28 000 poulets par mois",
        "Environ 5 640 poulets par mois"
      ],
      "correctAnswer": 0,
      "explanation": "33 840 ÷ 12 ≈ 2 820."
    },
    {
      "question": "Quelle concurrence ne faut-il pas oublier pour la volaille ?",
      "options": [
        "Uniquement les éleveurs de la même commune",
        "Les seuls fournisseurs d'aliment pour animaux",
        "Aucune, car la volaille locale n'a pas de concurrent",
        "Les produits de substitution : volaille importée congelée, œufs, poisson, autres viandes"
      ],
      "correctAnswer": 3,
      "explanation": "La concurrence se mesure au besoin satisfait, pas au produit identique."
    },
    {
      "question": "Quelle pièce montre le mieux à un financeur que la demande existe avant de produire ?",
      "options": [
        "Un graphique du marché mondial de la viande de volaille",
        "La liste de toutes les fermes avicoles de la région",
        "Des lettres d'intention de rôtisseurs et de restaurants (volume, fréquence, prix)",
        "Une photo des bâtiments terminés"
      ],
      "correctAnswer": 2,
      "explanation": "Quelques clients nommés valent mieux qu'un marché « immense » annoncé."
    },
    {
      "question": "Les ventes sont meilleures lors des fêtes. À quel moment mettre en place la bande concernée (42 jours d'élevage) ?",
      "options": [
        "La veille de la fête, pour vendre frais",
        "Environ six semaines avant la date de vente visée",
        "Six mois avant, pour stocker les poulets",
        "Après la fête, pour profiter de la demande suivante"
      ],
      "correctAnswer": 1,
      "explanation": "42 jours = 6 semaines d'élevage : il faut anticiper la mise en place."
    }
  ],
  "el_5": [
    {
      "question": "Dans la matrice de risques, la hausse du prix de l'aliment a une probabilité de 3 et un impact de 3. Quel score ?",
      "options": [
        "6 : à traiter après les petits risques",
        "3 : sans conséquence",
        "33 : le plus élevé possible",
        "9 : traitement prioritaire"
      ],
      "correctAnswer": 3,
      "explanation": "3 × 3 = 9 ; on traite d'abord les scores de 6 et plus."
    },
    {
      "question": "Un épisode de maladie a une probabilité de 2 et un impact de 3. Quel traitement ?",
      "options": [
        "Score 6 : à traiter en priorité, avec biosécurité et plan de vaccination",
        "Score 5 : à surveiller seulement",
        "Score 2 : à ignorer",
        "Score 6 : à traiter seulement si le budget le permet"
      ],
      "correctAnswer": 0,
      "explanation": "2 × 3 = 6 ; le seuil de traitement prioritaire est 6."
    },
    {
      "question": "Dans le scénario de crise, le DSCR de l'année 2 est de 0,66 pour une annuité de 6,6 M FCFA. Que manque-t-il environ ?",
      "options": [
        "Rien, car le DSCR est positif",
        "Environ 6,6 M FCFA, soit l'annuité entière",
        "Environ 2,2 M FCFA pour couvrir l'annuité",
        "Environ 0,7 M FCFA"
      ],
      "correctAnswer": 2,
      "explanation": "0,66 × 6,6 ≈ 4,4 ; 6,6 − 4,4 ≈ 2,2."
    },
    {
      "question": "Pourquoi présenter la biosécurité comme une mitigation chiffrée ?",
      "options": [
        "Parce que la loi exige un budget de 10 % pour la biosécurité",
        "Parce que vide sanitaire, vaccins et accès contrôlé ont un coût prévu dans le plan",
        "Parce qu'elle remplace l'assurance et les autres mesures",
        "Parce qu'elle augmente automatiquement le prix de vente"
      ],
      "correctAnswer": 1,
      "explanation": "Une mesure chiffrée est crédible ; une mesure vague ne l'est pas."
    },
    {
      "question": "Quelle est la bonne démarche pour la réglementation d'un élevage avicole ?",
      "options": [
        "Reprendre les règles d'un autre pays, qui sont les mêmes partout",
        "L'ignorer tant que la bande n'a pas dépassé 10 000 sujets",
        "La demander à l'administration de l'élevage de son pays, avec date et source dans le dossier",
        "L'attendre de la banque, qui la fournit avec le prêt"
      ],
      "correctAnswer": 2,
      "explanation": "Les règles varient d'un pays à l'autre et changent : date et source sont indispensables."
    },
    {
      "question": "Quelle mitigation répond au risque de coupure d'électricité pour la ventilation et le chauffage ?",
      "options": [
        "Réduire le nombre de poussins par bande de moitié",
        "Souscrire un prêt supplémentaire à chaque coupure",
        "Attendre le retour du courant sans rien prévoir",
        "Un groupe électrogène ou un système solaire de secours, chiffré en investissement"
      ],
      "correctAnswer": 3,
      "explanation": "Une panne prolongée peut perdre une bande : l'énergie de secours est un investissement du plan."
    }
  ],
  "ma_1": [
    {
      "question": "Un porteur cultive 1,5 ha de tomate (1 cycle) et 1,5 ha de chou (2 cycles). Combien d'hectares-cycles par an ?",
      "options": [
        "4,5 hectares-cycles",
        "3 hectares-cycles, soit la surface seule",
        "2,25 hectares-cycles, en divisant par deux",
        "6 hectares-cycles, en comptant deux cycles partout"
      ],
      "correctAnswer": 0,
      "explanation": "1,5 × 1 + 1,5 × 2 = 4,5."
    },
    {
      "question": "Le chou donne 30 t/ha sur 1,5 ha avec 2 cycles par an. Quelle production annuelle ?",
      "options": [
        "45 t, en ne comptant qu'un cycle",
        "90 t",
        "30 t, en oubliant la surface",
        "180 t, en comptant quatre cycles"
      ],
      "correctAnswer": 1,
      "explanation": "1,5 × 2 × 30 = 90 t."
    },
    {
      "question": "Quelle est l'intensité culturale d'une exploitation de 3 ha qui réalise 4,5 hectares-cycles ?",
      "options": [
        "45 %",
        "67 %",
        "450 %",
        "150 %"
      ],
      "correctAnswer": 3,
      "explanation": "4,5 ÷ 3 = 1,5, soit 150 %."
    },
    {
      "question": "Pourquoi planter par fractions décalées plutôt que tout le même jour ?",
      "options": [
        "Pour étaler les récoltes, mieux utiliser la main-d'œuvre et éviter d'inonder le marché",
        "Pour recevoir une subvention réservée aux plantations décalées",
        "Pour réduire à zéro les pertes après récolte",
        "Pour dispenser le porteur d'irriguer pendant la saison sèche"
      ],
      "correctAnswer": 0,
      "explanation": "Tout planter le même jour, c'est tout récolter et tout vendre en même temps."
    },
    {
      "question": "Un porteur a 1 ha de tomate (1 cycle, 20 t/ha) et 1 ha de gombo (2 cycles, 10 t/ha). Quelle production annuelle ?",
      "options": [
        "30 t, en ne comptant qu'un cycle de gombo",
        "40 t",
        "20 t, en ne comptant que la tomate",
        "60 t, en comptant trois cycles de gombo"
      ],
      "correctAnswer": 1,
      "explanation": "20 + (2 × 10) = 40 t."
    },
    {
      "question": "Quelle erreur courante gonfle un plan de cultures ?",
      "options": [
        "Répartir les surfaces sur plusieurs cultures",
        "Alterner les familles de plantes d'un cycle à l'autre",
        "Compter plus de cycles que le calendrier n'en permet réellement",
        "Prévoir un engrais vert en période de repos"
      ],
      "correctAnswer": 2,
      "explanation": "Entre deux cultures, il faut le temps de préparer la parcelle."
    }
  ],
  "ma_2": [
    {
      "question": "Le forage, la pompe solaire et le goutte-à-goutte coûtent 9,0 M FCFA sur 18,8 M d'immobilisations. Quelle part ?",
      "options": [
        "Environ 48 %",
        "Environ 21 %",
        "Environ 9 %",
        "Environ 90 %"
      ],
      "correctAnswer": 0,
      "explanation": "9,0 ÷ 18,8 ≈ 0,48 : l'irrigation est près de la moitié de l'investissement."
    },
    {
      "question": "Ces équipements (9,0 M FCFA) sont amortis sur 8 ans. Quelle dotation annuelle ?",
      "options": [
        "Environ 0,9 M FCFA",
        "Environ 1,1 M FCFA",
        "Environ 72 M FCFA",
        "Environ 9,0 M FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "9,0 ÷ 8 ≈ 1,1."
    },
    {
      "question": "Les charges d'eau et d'énergie du cas sont de 1,2 M FCFA par an. Que comprennent-elles ?",
      "options": [
        "L'amortissement du forage et de la pompe",
        "Le salaire du gardien et du chef de culture",
        "Le fonctionnement, sans l'amortissement qui figure à part",
        "Le remboursement de l'emprunt"
      ],
      "correctAnswer": 2,
      "explanation": "L'amortissement est une ligne séparée du compte de résultat."
    },
    {
      "question": "Quelle mitigation protège contre une panne de pompe ?",
      "options": [
        "Arroser uniquement avec la pluie",
        "Réduire la surface de moitié dès le départ",
        "Attendre la réparation sans rien prévoir",
        "Une pompe de secours ou des pièces de rechange, et un contrat d'entretien"
      ],
      "correctAnswer": 3,
      "explanation": "Sans eau, il n'y a pas de culture de contre-saison : la solution de secours est chiffrée."
    },
    {
      "question": "Que faut-il vérifier avant de forer ?",
      "options": [
        "Uniquement le prix du mètre foré",
        "Les règles de prélèvement d'eau de son pays, avec la date et la source",
        "La couleur des tuyaux autorisés",
        "Le nombre d'employés prévus dans l'équipe"
      ],
      "correctAnswer": 1,
      "explanation": "Un forage demande souvent une étude et une autorisation."
    },
    {
      "question": "Quel est l'avantage du goutte-à-goutte pour des légumes en lignes ?",
      "options": [
        "Il économise l'eau, mais coûte plus cher à installer",
        "Il ne demande aucun entretien ni aucune énergie",
        "Il est moins cher que l'aspersion et consomme plus d'eau",
        "Il remplace la nécessité d'un forage"
      ],
      "correctAnswer": 0,
      "explanation": "Économie d'eau contre investissement plus élevé."
    }
  ],
  "ma_3": [
    {
      "question": "Intrants : tomate 1,6 M FCFA/ha/cycle, chou 1,0 M FCFA/ha/cycle. Avec 1,5 ha de tomate (1 cycle) et 1,5 ha de chou (2 cycles), quels intrants annuels ?",
      "options": [
        "2,6 M FCFA, en additionnant les deux coûts par hectare",
        "3,9 M FCFA, en comptant un seul cycle de chou",
        "5,4 M FCFA",
        "7,8 M FCFA, en comptant deux cycles de tomate"
      ],
      "correctAnswer": 2,
      "explanation": "1,5 × 1,6 + 1,5 × 2 × 1,0 = 2,4 + 3,0 = 5,4."
    },
    {
      "question": "Aux intrants de 5,4 s'ajoutent main-d'œuvre saisonnière 4,0, caisses et transport 1,6, eau et énergie 1,2 (M FCFA). Quelles charges variables ?",
      "options": [
        "5,4 M FCFA, soit les intrants seuls",
        "6,8 M FCFA, en omettant la main-d'œuvre",
        "23,0 M FCFA, qui est le chiffre d'affaires",
        "12,2 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "5,4 + 4,0 + 1,6 + 1,2 = 12,2."
    },
    {
      "question": "37,5 t de tomate à 250 F/kg et 90 t de chou à 180 F/kg, avec 10 % de pertes. Quel CA ?",
      "options": [
        "Environ 25,6 M FCFA, sans retirer les pertes",
        "Environ 23,0 M FCFA",
        "Environ 9,4 M FCFA, avec la tomate seule",
        "Environ 230 M FCFA, en décalant la virgule"
      ],
      "correctAnswer": 1,
      "explanation": "(9,375 + 16,2) × 0,9 ≈ 23,0."
    },
    {
      "question": "Les pertes après récolte passent de 10 % à 7 % sur un CA brut d'environ 25,6 M FCFA. Quel gain de CA ?",
      "options": [
        "Environ 0,8 M FCFA",
        "Environ 7,7 M FCFA",
        "Environ 0,08 M FCFA",
        "Environ 3,0 M FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "3 points × 25,6 M ≈ 0,77 M FCFA, sans coût de production en plus."
    },
    {
      "question": "Quels rendements retenir dans un plan ?",
      "options": [
        "Ceux du catalogue du fournisseur de semences",
        "Les meilleurs rendements jamais observés dans le pays",
        "Des rendements arrondis à la dizaine supérieure",
        "Ceux que l'on a mesurés ou que des voisins ont obtenus, avec source et date"
      ],
      "correctAnswer": 3,
      "explanation": "Un rendement de station n'est pas le vôtre."
    },
    {
      "question": "CA de 23,0 M FCFA et charges variables de 12,2 M FCFA : quel taux de marge sur coûts variables ?",
      "options": [
        "Environ 53 %",
        "Environ 12 %",
        "Environ 47 %",
        "Environ 90 %"
      ],
      "correctAnswer": 2,
      "explanation": "(23,0 − 12,2) ÷ 23,0 ≈ 0,47."
    }
  ],
  "ma_4": [
    {
      "question": "L'oignon de Diap : 60 % vendus à 160 F à la récolte, 40 % à 260 F après stockage. Quel prix moyen ?",
      "options": [
        "210 F/kg, moyenne simple des deux prix",
        "260 F/kg, le prix le plus élevé",
        "100 F/kg, la différence entre les deux prix",
        "200 F/kg"
      ],
      "correctAnswer": 3,
      "explanation": "0,6 × 160 + 0,4 × 260 = 200 : la moyenne est pondérée."
    },
    {
      "question": "Sur quelle durée relever les prix de son marché pour construire un prix de plan ?",
      "options": [
        "Un seul jour, le jour de la récolte",
        "Au moins douze mois, avec la date de chaque relevé",
        "Une semaine, en saison sèche",
        "Aucune durée : les statistiques publiques suffisent"
      ],
      "correctAnswer": 1,
      "explanation": "Les prix varient avec la saison : il faut couvrir un cycle annuel."
    },
    {
      "question": "Dans le cas du Bénin, une crise de prix de − 15 % fait passer le DSCR de 1,61 à :",
      "options": [
        "0,89, soit une annuité non couverte",
        "1,41, soit une baisse de 15 % exactement",
        "1,61, le DSCR ne dépend pas des prix",
        "2,5, car les coûts baissent aussi"
      ],
      "correctAnswer": 0,
      "explanation": "En dessous de 1, l'exploitation ne couvre plus l'annuité."
    },
    {
      "question": "Quel produit se stocke assez bien pour vendre plus tard à meilleur prix ?",
      "options": [
        "La tomate fraîche, plusieurs mois en magasin",
        "Le chou frais, sans aucune installation",
        "L'oignon ou la pomme de terre, contrairement à la tomate ou au chou frais",
        "Tous les légumes frais, de la même manière"
      ],
      "correctAnswer": 2,
      "explanation": "Pour la tomate et le chou, ce sont le calendrier et le débouché qui comptent."
    },
    {
      "question": "Pourquoi décaler les plantations aide-t-il à vendre ?",
      "options": [
        "Pour que tous les clients achètent le même jour",
        "Pour éviter de calibrer et de trier les légumes",
        "Pour supprimer le besoin d'un débouché",
        "Pour récolter hors du pic de l'offre locale, quand les prix sont plus bas"
      ],
      "correctAnswer": 3,
      "explanation": "Moins de produit au même moment = moins de pression sur le prix."
    },
    {
      "question": "Quelle pièce rassure le mieux sur la demande avant de planter ?",
      "options": [
        "Un article de presse sur l'agriculture en général",
        "Une lettre d'intention d'un restaurateur ou d'un grossiste (volume, fréquence, prix)",
        "Une photo du terrain préparé",
        "Le prix des semences chez le fournisseur"
      ],
      "correctAnswer": 1,
      "explanation": "Un acheteur nommé vaut mieux qu'un marché « immense »."
    }
  ],
  "ma_5": [
    {
      "question": "Immobilisations 18,8 M FCFA et BFR 4,0 M FCFA : quel coût du projet ?",
      "options": [
        "22,8 M FCFA",
        "14,8 M FCFA, en soustrayant le BFR",
        "18,8 M FCFA, en oubliant le BFR",
        "75,2 M FCFA, en multipliant les deux"
      ],
      "correctAnswer": 0,
      "explanation": "18,8 + 4,0 = 22,8."
    },
    {
      "question": "Coûts fixes totaux de 7,9 M FCFA et taux de marge de 47 % : quel seuil de rentabilité ?",
      "options": [
        "Environ 3,7 M FCFA, en multipliant",
        "Environ 7,9 M FCFA, soit les coûts fixes seuls",
        "Environ 16,8 M FCFA, soit 73 % du CA de 23,0",
        "Environ 23,0 M FCFA, soit le CA"
      ],
      "correctAnswer": 2,
      "explanation": "7,9 ÷ 0,47 ≈ 16,8 ; 16,8 ÷ 23,0 ≈ 73 %."
    },
    {
      "question": "Pourquoi la marge de sécurité d'une petite exploitation est-elle étroite ?",
      "options": [
        "Parce que les petites exploitations n'ont pas de charges variables",
        "Parce que les petites surfaces rapportent toujours moins par hectare",
        "Parce que l'emprunt est interdit en dessous de 5 ha",
        "Parce que des coûts fixes importants se répartissent sur peu de surface et peu de production"
      ],
      "correctAnswer": 3,
      "explanation": "Le seuil atteint 73 % du CA, contre 53 % chez Diap Touré."
    },
    {
      "question": "En crise de prix, le DSCR de l'année 2 est de 0,89. Que signifie-t-il ?",
      "options": [
        "Les flux couvrent l'annuité avec une grande marge",
        "Les flux ne couvrent pas l'annuité : il faut une réserve, une garantie ou un report",
        "L'annuité est déjà remboursée en totalité",
        "Le DSCR ne peut pas être inférieur à 1"
      ],
      "correctAnswer": 1,
      "explanation": "En dessous de 1, l'exploitation ne rembourse pas la dette avec ses seuls flux."
    },
    {
      "question": "Quel levier améliore la marge d'une petite exploitation sans alourdir les coûts fixes ?",
      "options": [
        "Un cycle supplémentaire par an ou une culture à plus forte valeur sur les mêmes surfaces",
        "Embaucher un deuxième chef de culture",
        "Construire un second magasin de stockage",
        "Doubler le montant de l'emprunt"
      ],
      "correctAnswer": 0,
      "explanation": "Chaque hectare-cycle ajouté apporte du CA pour des coûts fixes quasi inchangés."
    },
    {
      "question": "Dans le cas du Bénin, la VAN à 10 % est de +3,4 M FCFA et le TRI de 14,6 %. Que conclure ?",
      "options": [
        "Le projet est sans risque, car la VAN est positive",
        "Le projet détruit de la valeur, car le TRI est supérieur à 10 %",
        "Le projet rapporte plus que le taux exigé, mais avec une marge de sécurité étroite",
        "Le TRI et la VAN ne permettent aucune conclusion"
      ],
      "correctAnswer": 2,
      "explanation": "TRI > taux d'actualisation ⇔ VAN > 0 ; la fragilité apparaît dans les scénarios de crise."
    }
  ]
};
