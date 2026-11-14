// FICHIER GÉNÉRÉ par scripts/quiz_filieres/build.mjs — ne pas modifier à la main.
// Banques de quiz des modules par filière, par identifiant de leçon. Fichier serveur : ne jamais l'importer côté client
// (les bonnes réponses ne quittent le serveur qu'après correction, voir src/lib/formations/filieres-quiz.server.ts).
export type QuizQuestionFiliere = { question: string; options: string[]; correctAnswer: number; explanation: string };

export const QUIZ_FILIERES: Record<string, QuizQuestionFiliere[]> = {
  "aq_1": [
    {
      "question": "Quel système d'élevage de poissons demande le moins d'eau mais dépend le plus de l'électricité et de la technicité ?",
      "options": [
        "Les bacs hors sol avec circuit d'eau recirculée",
        "Les étangs en terre alimentés par un forage",
        "Les cages flottantes dans un lac",
        "Les étangs de barrage remplis par la pluie"
      ],
      "correctAnswer": 0,
      "explanation": "Un circuit recirculé économise l'eau mais une panne d'énergie peut tuer toute la production en quelques heures."
    },
    {
      "question": "Quel est le principal point de vigilance d'un élevage en cages flottantes ?",
      "options": [
        "Le terrassement de bassins profonds, qui est l'investissement dominant de ce système",
        "Le coût de l'électricité pour remplir les cages chaque semaine",
        "L'absence totale de risque sanitaire grâce au courant naturel de l'eau",
        "L'accès au plan d'eau et son autorisation d'usage, ainsi que la qualité de l'eau"
      ],
      "correctAnswer": 3,
      "explanation": "Sans plan d'eau autorisé et en bon état, la cage ne produit pas."
    },
    {
      "question": "Quelle raison pousse le cas du Sénégal à choisir des étangs ?",
      "options": [
        "Les étangs ne demandent aucune eau une fois remplis la première fois, quelle que soit la saison",
        "Les étangs garantissent un indice de conversion de 1,0 sur tous les cycles",
        "Le site offre du terrain et un forage, et la ferme veut limiter la technicité de départ",
        "Les étangs dispensent de toute autorisation, de tout permis et de toute déclaration"
      ],
      "correctAnswer": 2,
      "explanation": "Le choix du système suit le site, le capital et la technicité du porteur."
    },
    {
      "question": "Avant de bâtir un plan sur une espèce, quelle vérification est indispensable ?",
      "options": [
        "Que l'espèce est la plus vendue dans le monde",
        "Qu'une source fiable d'alevins existe, avec leur prix",
        "Que le porteur l'a déjà mangée",
        "Que son nom figure dans un catalogue de fournisseurs étrangers"
      ],
      "correctAnswer": 1,
      "explanation": "Sans alevins de qualité disponibles, pas de production régulière."
    },
    {
      "question": "Quel critère de site pèse sur la qualité du poisson frais livré au client ?",
      "options": [
        "La couleur des étangs et la forme des digues construites",
        "La distance au marché et la possibilité de le transporter sous glace",
        "Le nombre de voisins qui élèvent déjà des poissons dans la zone",
        "Le nom de la région où se trouve la ferme et son code postal"
      ],
      "correctAnswer": 1,
      "explanation": "Le poisson frais se conserve peu : la chaîne du froid et la distance comptent."
    },
    {
      "question": "Un sol très sableux pose quel problème pour des étangs en terre ?",
      "options": [
        "L'eau s'infiltre et les étangs ne gardent pas leur niveau",
        "Les poissons ne grandissent plus, quelle que soit la qualité de l'aliment",
        "Le forage devient inutile parce que la nappe disparaît à cet endroit",
        "L'aliment perd tout son intérêt nutritionnel au contact du sable"
      ],
      "correctAnswer": 0,
      "explanation": "C'est pourquoi la nature du sol fait partie de l'étude de site avant de creuser."
    }
  ],
  "aq_2": [
    {
      "question": "Le cas compte 12 étangs de 500 m² avec 3 alevins par m². Combien d'alevins par cycle ?",
      "options": [
        "6 000",
        "36 000",
        "1 500",
        "18 000"
      ],
      "correctAnswer": 3,
      "explanation": "12 × 500 × 3 = 18 000 ; avec 2 cycles, 36 000 par an."
    },
    {
      "question": "Avec 36 000 alevins par an et 85 % de survie, combien de poissons sont vendus ?",
      "options": [
        "36 000, la survie ne change rien",
        "5 400, en prenant les morts",
        "30 600",
        "42 353, en divisant par 0,85"
      ],
      "correctAnswer": 2,
      "explanation": "36 000 × 0,85 = 30 600."
    },
    {
      "question": "Si les poissons vendus pèsent 420 g chacun, quelle production annuelle (30 600 poissons) ?",
      "options": [
        "30 600 kg",
        "12 852 kg",
        "1 285 kg",
        "128 520 kg"
      ],
      "correctAnswer": 1,
      "explanation": "30 600 × 0,42 = 12 852 kg."
    },
    {
      "question": "À 2 600 FCFA/kg, que vaut une production de 12 852 kg ?",
      "options": [
        "3,3 millions de FCFA",
        "334 millions de FCFA",
        "33,4 millions de FCFA",
        "12,9 millions de FCFA"
      ],
      "correctAnswer": 2,
      "explanation": "12 852 × 2 600 ≈ 33,4 millions."
    },
    {
      "question": "Pourquoi le cas retient-il 2 cycles par an plutôt que 3 ?",
      "options": [
        "Parce que la loi limite à deux cycles",
        "Parce que le tilapia ne se reproduit qu'en février",
        "Parce que les alevins ne sont vendus que deux fois par an",
        "Chaque cycle dure environ six mois, vide et assec compris"
      ],
      "correctAnswer": 3,
      "explanation": "Un étang doit être vidé, séché et préparé entre deux cycles : annoncer trois cycles demande un calendrier qui le prouve."
    },
    {
      "question": "Quel effet a une baisse de survie de 5 points dans le cas (36 000 alevins, 420 g, 2 600 FCFA/kg) ?",
      "options": [
        "Environ 2,0 millions de FCFA de chiffre d'affaires en moins",
        "Aucun effet, car les coûts baissent d'autant quand il y a moins de poissons vivants",
        "Environ 20 millions de FCFA en moins, soit les deux tiers du chiffre d'affaires",
        "Un gain net, car il y a moins de poissons à nourrir et à soigner"
      ],
      "correctAnswer": 0,
      "explanation": "36 000 × 0,05 × 0,42 × 2 600 ≈ 2,0 millions."
    }
  ],
  "aq_3": [
    {
      "question": "Que mesure l'indice de conversion alimentaire ?",
      "options": [
        "Le prix de l'aliment par poisson vendu, exprimé en francs CFA par tête",
        "Le pourcentage de poissons morts pendant le cycle complet d'élevage",
        "Le poids de l'alevin à la mise en charge, mesuré à l'arrivée à la ferme",
        "Le nombre de kilos d'aliment nécessaires pour produire un kilo de poisson"
      ],
      "correctAnswer": 3,
      "explanation": "Plus il est bas, plus l'élevage est efficace."
    },
    {
      "question": "Pour 12 852 kg de poisson et un indice de 1,6, combien d'aliment faut-il ?",
      "options": [
        "Environ 8 032 kg",
        "Environ 12 852 kg",
        "Environ 20 563 kg",
        "Environ 205 630 kg"
      ],
      "correctAnswer": 2,
      "explanation": "12 852 × 1,6 ≈ 20 563 kg."
    },
    {
      "question": "Quel est le coût de cet aliment à 580 FCFA/kg ?",
      "options": [
        "Environ 1,2 million de FCFA",
        "Environ 11,9 millions de FCFA",
        "Environ 7,5 millions de FCFA",
        "Environ 119 millions de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "20 563 × 580 ≈ 11,9 millions."
    },
    {
      "question": "Quelle part des charges variables représente l'aliment dans le cas ?",
      "options": [
        "Environ 64 %",
        "Environ 15 %",
        "Environ 30 %",
        "Environ 90 %"
      ],
      "correctAnswer": 0,
      "explanation": "11,9 ÷ 18,7 ≈ 64 % : c'est le premier poste."
    },
    {
      "question": "Quelle économie apporte la baisse de l'indice de 1,6 à 1,5 (12 852 kg, 580 FCFA/kg) ?",
      "options": [
        "Environ 7 millions de FCFA par an",
        "Environ 70 000 FCFA par an",
        "Aucune économie notable",
        "Environ 0,7 million de FCFA par an"
      ],
      "correctAnswer": 3,
      "explanation": "12 852 × 0,1 × 580 ≈ 0,75 million."
    },
    {
      "question": "Comment réduire le risque d'une rupture ou d'une hausse brutale du prix de l'aliment ?",
      "options": [
        "Passer à un seul fournisseur pour mieux négocier un prix de volume sur toute l'année",
        "Acheter l'aliment au jour le jour, sans stock, en payant au comptant chaque fois",
        "Avoir au moins deux fournisseurs, un stock de sécurité et un engagement écrit sur prix et livraison",
        "Réduire les rations de moitié dès que le prix de l'aliment monte de quelques points"
      ],
      "correctAnswer": 2,
      "explanation": "Le stock et la diversité des fournisseurs protègent la production."
    }
  ],
  "aq_4": [
    {
      "question": "Combien le cas compte-t-il d'immobilisations au total, avant le fonds de roulement ?",
      "options": [
        "25,5 millions de FCFA",
        "30,5 millions de FCFA",
        "5,0 millions de FCFA",
        "11,0 millions de FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "Les 30,5 millions du coût du projet comprennent 5,0 de besoin en fonds de roulement."
    },
    {
      "question": "Quelle part des immobilisations représentent les étangs et l'eau (10,0 + 4,5 sur 25,5) ?",
      "options": [
        "Environ 10 %",
        "Plus de la moitié, environ 57 %",
        "Environ 25 %",
        "Environ 90 %"
      ],
      "correctAnswer": 1,
      "explanation": "14,5 ÷ 25,5 ≈ 57 % : ce sont les postes à comparer par plusieurs devis."
    },
    {
      "question": "Quelle est la dotation annuelle aux amortissements des étangs (10,0 M FCFA sur 20 ans) ?",
      "options": [
        "0,5 million de FCFA",
        "2,0 millions de FCFA",
        "0,05 million de FCFA",
        "10 millions de FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "10,0 ÷ 20 = 0,5."
    },
    {
      "question": "Que faire avant de creuser les étangs ?",
      "options": [
        "Commander l'aliment pour deux ans",
        "Recruter tout le personnel",
        "Annoncer la production à des grossistes sans lettre d'intention",
        "Faire tester l'eau et vérifier les autorisations de votre pays, avec date et source"
      ],
      "correctAnswer": 3,
      "explanation": "Une erreur sur l'eau ou sur l'autorisation peut coûter plusieurs millions."
    },
    {
      "question": "Quelle précaution limite le risque d'introduire une maladie dans la ferme ?",
      "options": [
        "Doubler la densité de mise en charge pour que la maladie se dilue entre les poissons",
        "Éviter tout nettoyage du matériel pour ne pas stresser les poissons de la ferme",
        "Des alevins d'origine contrôlée, un contrôle des visiteurs et du matériel",
        "Mélanger les lots entre étangs pour homogénéiser la croissance des poissons"
      ],
      "correctAnswer": 2,
      "explanation": "La biosécurité protège plusieurs cycles de production."
    },
    {
      "question": "Pourquoi prévoir une pompe de secours et une énergie de secours ?",
      "options": [
        "Pour doubler la production en doublant le nombre de pompes en marche",
        "Une panne d'eau ou d'énergie peut tuer une production en quelques jours",
        "Parce que la loi l'exige dans tous les pays sans exception pour toute ferme piscicole",
        "Pour éviter de payer l'aliment pendant les semaines de panne"
      ],
      "correctAnswer": 1,
      "explanation": "Le plan de secours figure dans le dossier."
    }
  ],
  "aq_5": [
    {
      "question": "Quel est le seuil de rentabilité du cas, rapporté au chiffre d'affaires ?",
      "options": [
        "Environ 20 %",
        "Environ 50 %",
        "Environ 100 %",
        "Environ 73 %"
      ],
      "correctAnswer": 3,
      "explanation": "24,5 ÷ 33,4 ≈ 73 % : la marge de sécurité est de 27 %."
    },
    {
      "question": "Que signifie un DSCR de 0,76 en scénario pessimiste ?",
      "options": [
        "Les flux disponibles ne couvrent pas l'annuité de l'emprunt",
        "La ferme gagne 76 % de plus que prévu",
        "La banque rembourse l'exploitant",
        "Le projet est sans risque"
      ],
      "correctAnswer": 0,
      "explanation": "Il faut au moins 1 pour couvrir l'annuité ; les banques demandent souvent davantage."
    },
    {
      "question": "Quel levier est le plus à la portée du porteur pour améliorer la marge ?",
      "options": [
        "Augmenter le prix de l'aliment",
        "Supprimer les contrats de vente",
        "Réduire la mortalité et améliorer l'indice de conversion",
        "Allonger le vide sanitaire à un an"
      ],
      "correctAnswer": 2,
      "explanation": "Chaque point de survie et chaque dixième d'indice a un effet chiffrable sur l'EBE."
    },
    {
      "question": "Quelle valeur de chiffre d'affaires représente environ un point de survie dans le cas ?",
      "options": [
        "Environ 4 millions de FCFA",
        "Environ 0,4 million de FCFA",
        "Environ 40 000 FCFA",
        "Environ 0,04 million de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "36 000 × 0,01 × 0,42 × 2 600 ≈ 0,39 million."
    },
    {
      "question": "Pourquoi une lettre d'intention d'un restaurateur vaut-elle mieux qu'un marché annoncé « immense » ?",
      "options": [
        "Elle remplace l'autorisation d'élevage et les démarches auprès de l'administration",
        "Elle garantit à elle seule le remboursement du prêt par la banque",
        "Elle précise volume, fréquence et prix, donc elle se vérifie",
        "Elle dispense l'exploitant de tout scénario de baisse du prix de vente"
      ],
      "correctAnswer": 2,
      "explanation": "Un engagement précis soutient une hypothèse de vente."
    },
    {
      "question": "Pourquoi le prix de 2 600 FCFA/kg est-il à remplacer dans votre dossier ?",
      "options": [
        "Parce que le prix du poisson est fixé par l'État",
        "Parce que le tilapia ne se vend qu'à 2 000 FCFA/kg",
        "Parce que le prix ne change jamais",
        "C'est une hypothèse pédagogique : il faut vos relevés de prix, datés, auprès de plusieurs acheteurs"
      ],
      "correctAnswer": 3,
      "explanation": "Chaque prix d'un plan porte une source et une date."
    }
  ],
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
        "6 bandes (365 ÷ 60 ≈ 6)",
        "24 bandes, en comptant une bande par semaine",
        "4 bandes, en comptant 90 jours par cycle complet"
      ],
      "correctAnswer": 1,
      "explanation": "Cycle complet = 45 + 15 = 60 jours ; 365 ÷ 60 ≈ 6."
    },
    {
      "question": "36 000 poussins sont mis en place avec 6 % de mortalité. Combien de poulets sont vendus ?",
      "options": [
        "36 000 poulets, car les pertes sont couvertes par la banque",
        "30 000 poulets, en retirant 6 000 poussins",
        "2 160 poulets, qui correspondent aux seules pertes",
        "33 840 poulets"
      ],
      "correctAnswer": 3,
      "explanation": "36 000 × (1 − 0,06) = 33 840."
    },
    {
      "question": "À quoi sert le vide sanitaire entre deux bandes ?",
      "options": [
        "À nettoyer et désinfecter pour casser le cycle des maladies",
        "À laisser reposer les ouvriers entre deux lots de poussins",
        "À attendre que le prix de la volaille remonte sur le marché",
        "À sécher la litière pour la revendre aux maraîchers voisins"
      ],
      "correctAnswer": 0,
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
        "Parce que les deux nombres sont toujours identiques en pratique",
        "Parce que seuls les poulets vendus génèrent des coûts d'aliment",
        "Le chiffre d'affaires vient des poulets vendus, alors que les coûts partent des poussins mis en place",
        "Parce que la banque ne finance que les poulets vendus"
      ],
      "correctAnswer": 2,
      "explanation": "La mortalité réduit les ventes sans réduire les coûts engagés."
    }
  ],
  "el_2": [
    {
      "question": "Que mesure l'indice de consommation (IC) d'un élevage de poulets ?",
      "options": [
        "Les kilos d'aliment consommés pour produire un kilo de poids vif",
        "Le nombre de poulets vendus par mètre carré de bâtiment",
        "Le prix payé pour un kilo d'aliment au fournisseur",
        "Le nombre de jours nécessaires pour atteindre 2 kg"
      ],
      "correctAnswer": 0,
      "explanation": "Plus l'IC est bas, moins l'aliment coûte par kilo produit."
    },
    {
      "question": "Avec un IC de 1,75, un poids de vente de 2,0 kg et un aliment à 380 F/kg, quel est le coût d'aliment par poussin ?",
      "options": [
        "760 F, soit 2,0 kg × 380 F",
        "1 330 F",
        "665 F, soit 1,75 × 380 F",
        "1 520 F, soit 4 kg × 380 F"
      ],
      "correctAnswer": 1,
      "explanation": "1,75 × 2,0 × 380 = 1 330 F."
    },
    {
      "question": "L'IC passe de 1,75 à 1,85 (poids 2,0 kg, aliment 380 F/kg). Quel surcoût par poussin ?",
      "options": [
        "10 F par poussin",
        "38 F par poussin",
        "76 F par poussin",
        "190 F par poussin"
      ],
      "correctAnswer": 2,
      "explanation": "0,10 × 2,0 × 380 = 76 F ; × 36 000 poussins = 2,7 M FCFA par an."
    },
    {
      "question": "L'aliment augmente de 10 % (1 330 F par poussin au départ, 36 000 poussins). Quel surcoût annuel ?",
      "options": [
        "Environ 0,5 M FCFA",
        "Environ 13,3 M FCFA",
        "Environ 1,3 M FCFA",
        "Environ 4,8 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "133 F × 36 000 ≈ 4,8 M FCFA."
    },
    {
      "question": "La mortalité passe de 6 % à 8 % sur 36 000 poussins, poulet vendu 3 000 F. Quelle perte de chiffre d'affaires ?",
      "options": [
        "Environ 0,7 M FCFA",
        "Environ 2,2 M FCFA (720 poulets en moins)",
        "Environ 21,6 M FCFA",
        "Aucune perte, car les coûts ne changent pas"
      ],
      "correctAnswer": 1,
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
        "Environ 2 309 F",
        "Environ 780 F, en divisant par 100 000"
      ],
      "correctAnswer": 2,
      "explanation": "78,1 M ÷ 33 840 ≈ 2 309 F (2 170 F est le coût par poussin mis en place)."
    },
    {
      "question": "Un poulet est vendu 3 000 F pour un coût variable de 2 309 F. Quelle marge et quel taux de marge ?",
      "options": [
        "Environ 2 309 F, soit 77 % du prix",
        "Environ 691 F, soit 2,3 % du prix",
        "Environ 300 F, soit 10 % du prix",
        "Environ 691 F, soit 23 % du prix"
      ],
      "correctAnswer": 3,
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
        "Parce que les clients n'achètent que des poussins d'un jour",
        "Parce que la banque refuse de financer sans commande ferme",
        "Parce que le prix du poulet est fixé par l'État avant la bande",
        "Parce que le poulet ne se stocke pas et continue de consommer de l'aliment s'il attend"
      ],
      "correctAnswer": 3,
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
        "Les produits de substitution : volaille importée congelée, œufs, poisson, autres viandes",
        "Aucune, car la volaille locale n'a pas de concurrent"
      ],
      "correctAnswer": 2,
      "explanation": "La concurrence se mesure au besoin satisfait, pas au produit identique."
    },
    {
      "question": "Quelle pièce montre le mieux à un financeur que la demande existe avant de produire ?",
      "options": [
        "Un graphique du marché mondial de la viande de volaille",
        "La liste de toutes les fermes avicoles de la région",
        "Une photo des bâtiments terminés",
        "Des lettres d'intention de rôtisseurs et de restaurants (volume, fréquence, prix)"
      ],
      "correctAnswer": 3,
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
        "9 : traitement prioritaire",
        "6 : à traiter après les petits risques",
        "3 : sans conséquence",
        "33 : le plus élevé possible"
      ],
      "correctAnswer": 0,
      "explanation": "3 × 3 = 9 ; on traite d'abord les scores de 6 et plus."
    },
    {
      "question": "Un épisode de maladie a une probabilité de 2 et un impact de 3. Quel traitement ?",
      "options": [
        "Score 5 : à surveiller seulement",
        "Score 2 : à ignorer",
        "Score 6 : à traiter en priorité, avec biosécurité et plan de vaccination",
        "Score 6 : à traiter seulement si le budget le permet"
      ],
      "correctAnswer": 2,
      "explanation": "2 × 3 = 6 ; le seuil de traitement prioritaire est 6."
    },
    {
      "question": "Dans le scénario de crise, le DSCR de l'année 2 est de 0,66 pour une annuité de 6,6 M FCFA. Que manque-t-il environ ?",
      "options": [
        "Rien, car le DSCR est positif",
        "Environ 6,6 M FCFA, soit l'annuité entière",
        "Environ 0,7 M FCFA",
        "Environ 2,2 M FCFA pour couvrir l'annuité"
      ],
      "correctAnswer": 3,
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
        "La demander à l'administration de l'élevage de son pays, avec date et source dans le dossier",
        "Reprendre les règles d'un autre pays, qui sont les mêmes partout",
        "L'ignorer tant que la bande n'a pas dépassé 10 000 sujets",
        "L'attendre de la banque, qui la fournit avec le prêt"
      ],
      "correctAnswer": 0,
      "explanation": "Les règles varient d'un pays à l'autre et changent : date et source sont indispensables."
    },
    {
      "question": "Quelle mitigation répond au risque de coupure d'électricité pour la ventilation et le chauffage ?",
      "options": [
        "Réduire le nombre de poussins par bande de moitié",
        "Souscrire un prêt supplémentaire à chaque coupure",
        "Un groupe électrogène ou un système solaire de secours, chiffré en investissement",
        "Attendre le retour du courant sans rien prévoir"
      ],
      "correctAnswer": 2,
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
        "30 t, en oubliant la surface",
        "90 t",
        "180 t, en comptant quatre cycles"
      ],
      "correctAnswer": 2,
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
        "Pour recevoir une subvention réservée aux plantations décalées",
        "Pour étaler les récoltes, mieux utiliser la main-d'œuvre et éviter d'inonder le marché",
        "Pour réduire à zéro les pertes après récolte",
        "Pour dispenser le porteur d'irriguer pendant la saison sèche"
      ],
      "correctAnswer": 1,
      "explanation": "Tout planter le même jour, c'est tout récolter et tout vendre en même temps."
    },
    {
      "question": "Un porteur a 1 ha de tomate (1 cycle, 20 t/ha) et 1 ha de gombo (2 cycles, 10 t/ha). Quelle production annuelle ?",
      "options": [
        "30 t, en ne comptant qu'un cycle de gombo",
        "20 t, en ne comptant que la tomate",
        "60 t, en comptant trois cycles de gombo",
        "40 t"
      ],
      "correctAnswer": 3,
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
        "Environ 21 %",
        "Environ 48 %",
        "Environ 9 %",
        "Environ 90 %"
      ],
      "correctAnswer": 1,
      "explanation": "9,0 ÷ 18,8 ≈ 0,48 : l'irrigation est près de la moitié de l'investissement."
    },
    {
      "question": "Ces équipements (9,0 M FCFA) sont amortis sur 8 ans. Quelle dotation annuelle ?",
      "options": [
        "Environ 1,1 M FCFA",
        "Environ 0,9 M FCFA",
        "Environ 72 M FCFA",
        "Environ 9,0 M FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "9,0 ÷ 8 ≈ 1,1."
    },
    {
      "question": "Les charges d'eau et d'énergie du cas sont de 1,2 M FCFA par an. Que comprennent-elles ?",
      "options": [
        "L'amortissement du forage et de la pompe",
        "Le fonctionnement, sans l'amortissement qui figure à part",
        "Le salaire du gardien et du chef de culture",
        "Le remboursement de l'emprunt"
      ],
      "correctAnswer": 1,
      "explanation": "L'amortissement est une ligne séparée du compte de résultat."
    },
    {
      "question": "Quelle mitigation protège contre une panne de pompe ?",
      "options": [
        "Arroser uniquement avec la pluie",
        "Réduire la surface de moitié dès le départ",
        "Une pompe de secours ou des pièces de rechange, et un contrat d'entretien",
        "Attendre la réparation sans rien prévoir"
      ],
      "correctAnswer": 2,
      "explanation": "Sans eau, il n'y a pas de culture de contre-saison : la solution de secours est chiffrée."
    },
    {
      "question": "Que faut-il vérifier avant de forer ?",
      "options": [
        "Les règles de prélèvement d'eau de son pays, avec la date et la source",
        "Uniquement le prix du mètre foré",
        "La couleur des tuyaux autorisés",
        "Le nombre d'employés prévus dans l'équipe"
      ],
      "correctAnswer": 0,
      "explanation": "Un forage demande souvent une étude et une autorisation."
    },
    {
      "question": "Quel est l'avantage du goutte-à-goutte pour des légumes en lignes ?",
      "options": [
        "Il ne demande aucun entretien ni aucune énergie",
        "Il est moins cher que l'aspersion et consomme plus d'eau",
        "Il remplace la nécessité d'un forage",
        "Il économise l'eau, mais coûte plus cher à installer"
      ],
      "correctAnswer": 3,
      "explanation": "Économie d'eau contre investissement plus élevé."
    }
  ],
  "ma_3": [
    {
      "question": "Intrants : tomate 1,6 M FCFA/ha/cycle, chou 1,0 M FCFA/ha/cycle. Avec 1,5 ha de tomate (1 cycle) et 1,5 ha de chou (2 cycles), quels intrants annuels ?",
      "options": [
        "5,4 M FCFA",
        "2,6 M FCFA, en additionnant les deux coûts par hectare",
        "3,9 M FCFA, en comptant un seul cycle de chou",
        "7,8 M FCFA, en comptant deux cycles de tomate"
      ],
      "correctAnswer": 0,
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
        "Environ 9,4 M FCFA, avec la tomate seule",
        "Environ 23,0 M FCFA",
        "Environ 230 M FCFA, en décalant la virgule"
      ],
      "correctAnswer": 2,
      "explanation": "(9,375 + 16,2) × 0,9 ≈ 23,0."
    },
    {
      "question": "Les pertes après récolte passent de 10 % à 7 % sur un CA brut d'environ 25,6 M FCFA. Quel gain de CA ?",
      "options": [
        "Environ 7,7 M FCFA",
        "Environ 0,8 M FCFA",
        "Environ 0,08 M FCFA",
        "Environ 3,0 M FCFA"
      ],
      "correctAnswer": 1,
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
        "Environ 47 %",
        "Environ 53 %",
        "Environ 12 %",
        "Environ 90 %"
      ],
      "correctAnswer": 0,
      "explanation": "(23,0 − 12,2) ÷ 23,0 ≈ 0,47."
    }
  ],
  "ma_4": [
    {
      "question": "L'oignon de Diap : 60 % vendus à 160 F à la récolte, 40 % à 260 F après stockage. Quel prix moyen ?",
      "options": [
        "210 F/kg, moyenne simple des deux prix",
        "260 F/kg, le prix le plus élevé",
        "200 F/kg",
        "100 F/kg, la différence entre les deux prix"
      ],
      "correctAnswer": 2,
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
        "1,41, soit une baisse de 15 % exactement",
        "1,61, le DSCR ne dépend pas des prix",
        "0,89, soit une annuité non couverte",
        "2,5, car les coûts baissent aussi"
      ],
      "correctAnswer": 2,
      "explanation": "En dessous de 1, l'exploitation ne couvre plus l'annuité."
    },
    {
      "question": "Quel produit se stocke assez bien pour vendre plus tard à meilleur prix ?",
      "options": [
        "L'oignon ou la pomme de terre, contrairement à la tomate ou au chou frais",
        "La tomate fraîche, plusieurs mois en magasin",
        "Le chou frais, sans aucune installation",
        "Tous les légumes frais, de la même manière"
      ],
      "correctAnswer": 0,
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
        "14,8 M FCFA, en soustrayant le BFR",
        "22,8 M FCFA",
        "18,8 M FCFA, en oubliant le BFR",
        "75,2 M FCFA, en multipliant les deux"
      ],
      "correctAnswer": 1,
      "explanation": "18,8 + 4,0 = 22,8."
    },
    {
      "question": "Coûts fixes totaux de 7,9 M FCFA et taux de marge de 47 % : quel seuil de rentabilité ?",
      "options": [
        "Environ 3,7 M FCFA, en multipliant",
        "Environ 7,9 M FCFA, soit les coûts fixes seuls",
        "Environ 23,0 M FCFA, soit le CA",
        "Environ 16,8 M FCFA, soit 73 % du CA de 23,0"
      ],
      "correctAnswer": 3,
      "explanation": "7,9 ÷ 0,47 ≈ 16,8 ; 16,8 ÷ 23,0 ≈ 73 %."
    },
    {
      "question": "Pourquoi la marge de sécurité d'une petite exploitation est-elle étroite ?",
      "options": [
        "Parce que des coûts fixes importants se répartissent sur peu de surface et peu de production",
        "Parce que les petites exploitations n'ont pas de charges variables",
        "Parce que les petites surfaces rapportent toujours moins par hectare",
        "Parce que l'emprunt est interdit en dessous de 5 ha"
      ],
      "correctAnswer": 0,
      "explanation": "Le seuil atteint 73 % du CA, contre 53 % chez Diap Touré."
    },
    {
      "question": "En crise de prix, le DSCR de l'année 2 est de 0,89. Que signifie-t-il ?",
      "options": [
        "Les flux couvrent l'annuité avec une grande marge",
        "L'annuité est déjà remboursée en totalité",
        "Les flux ne couvrent pas l'annuité : il faut une réserve, une garantie ou un report",
        "Le DSCR ne peut pas être inférieur à 1"
      ],
      "correctAnswer": 2,
      "explanation": "En dessous de 1, l'exploitation ne rembourse pas la dette avec ses seuls flux."
    },
    {
      "question": "Quel levier améliore la marge d'une petite exploitation sans alourdir les coûts fixes ?",
      "options": [
        "Embaucher un deuxième chef de culture",
        "Construire un second magasin de stockage",
        "Doubler le montant de l'emprunt",
        "Un cycle supplémentaire par an ou une culture à plus forte valeur sur les mêmes surfaces"
      ],
      "correctAnswer": 3,
      "explanation": "Chaque hectare-cycle ajouté apporte du CA pour des coûts fixes quasi inchangés."
    },
    {
      "question": "Dans le cas du Bénin, la VAN à 10 % est de +3,4 M FCFA et le TRI de 14,6 %. Que conclure ?",
      "options": [
        "Le projet rapporte plus que le taux exigé, mais avec une marge de sécurité étroite",
        "Le projet est sans risque, car la VAN est positive",
        "Le projet détruit de la valeur, car le TRI est supérieur à 10 %",
        "Le TRI et la VAN ne permettent aucune conclusion"
      ],
      "correctAnswer": 0,
      "explanation": "TRI > taux d'actualisation ⇔ VAN > 0 ; la fragilité apparaît dans les scénarios de crise."
    }
  ],
  "tr_1": [
    {
      "question": "Une unité traite 180 t de fruits, rendement 0,11, pertes de conditionnement de 4 %. Quel volume vendable ?",
      "options": [
        "19 800 kg, en oubliant les pertes",
        "19 008 kg",
        "1 901 kg, en divisant par dix",
        "172 800 kg, en oubliant le rendement"
      ],
      "correctAnswer": 1,
      "explanation": "180 000 × 0,11 × 0,96 = 19 008 kg."
    },
    {
      "question": "Avec un rendement de 0,11, combien de kilos de fruits faut-il environ pour 1 kg de produit sec ?",
      "options": [
        "Environ 1 kg",
        "Environ 0,9 kg",
        "Environ 9 kg",
        "Environ 110 kg"
      ],
      "correctAnswer": 2,
      "explanation": "1 ÷ 0,11 ≈ 9,1."
    },
    {
      "question": "Dans le cas attiéké, le rendement est de 0,55. Combien de kg de manioc frais par kg d'attiéké ?",
      "options": [
        "Environ 0,55 kg",
        "Environ 5,5 kg",
        "Exactement 2,5 kg",
        "Environ 1,8 kg"
      ],
      "correctAnswer": 3,
      "explanation": "1 ÷ 0,55 ≈ 1,8."
    },
    {
      "question": "Que vaut un point de rendement matière en plus (0,11 devient 0,12) dans le cas du Bénin ?",
      "options": [
        "Environ 69 000 FCFA, car un point de rendement est négligeable",
        "Environ 6,9 millions de FCFA de CA",
        "Environ 0,7 million de FCFA, soit le coût d'un sac de fruits",
        "Rien du tout, car le rendement ne change pas le volume vendu"
      ],
      "correctAnswer": 1,
      "explanation": "180 000 × 0,01 × 0,96 × 4 000 ≈ 6,9 millions."
    },
    {
      "question": "Comment établir le rendement matière de votre unité ?",
      "options": [
        "Reprendre celui de la brochure du fabricant de matériel",
        "Le fixer à 100 % pour simplifier",
        "Le mesurer sur vos propres lots, pesée à l'appui",
        "Copier celui d'un autre pays"
      ],
      "correctAnswer": 2,
      "explanation": "Le rendement dépend de votre matière première et de votre procédé."
    },
    {
      "question": "Que faire des épluchures et résidus dans le plan d'affaires ?",
      "options": [
        "Les noter, avec leur valeur ou coût",
        "Les ignorer car ils n'ont aucune valeur",
        "Les compter comme du produit fini",
        "Les vendre au prix du produit fini"
      ],
      "correctAnswer": 0,
      "explanation": "Un sous-produit peut rapporter un revenu ou coûter à évacuer."
    }
  ],
  "tr_2": [
    {
      "question": "Une unité traite 1,8 t de fruits par jour pendant 100 jours. Quelle capacité annuelle ?",
      "options": [
        "18 t",
        "1 800 t",
        "180 t",
        "100 t"
      ],
      "correctAnswer": 2,
      "explanation": "1,8 × 100 = 180 t."
    },
    {
      "question": "Dans le cas attiéké, 1,2 t de manioc par jour et 250 jours. Quelle capacité annuelle ?",
      "options": [
        "300 t",
        "30 t",
        "250 t",
        "1 200 t"
      ],
      "correctAnswer": 0,
      "explanation": "1,2 × 250 = 300 t."
    },
    {
      "question": "Que devient le coût fixe de l'unité si elle ne tourne que 70 jours au lieu de 100 ?",
      "options": [
        "Il baisse de 30 % comme le chiffre d'affaires",
        "Il reste le même, mais le CA baisse",
        "Il disparaît dès que l'unité cesse de produire",
        "Il double automatiquement dans le calcul du seuil"
      ],
      "correctAnswer": 1,
      "explanation": "Personnel permanent, amortissements et intérêts ne dépendent pas des jours travaillés."
    },
    {
      "question": "Que mesure le taux d'utilisation ?",
      "options": [
        "Le prix de vente rapporté au prix d'achat de la matière",
        "La part de produit fini perdue au conditionnement",
        "Le nombre de clients actifs sur la dernière année",
        "Jours travaillés rapportés aux jours possibles"
      ],
      "correctAnswer": 3,
      "explanation": "Plus il est bas, plus les coûts fixes pèsent par kilo produit."
    },
    {
      "question": "Quel moyen étale la saison d'une unité de séchage de mangues ?",
      "options": [
        "Acheter plus de séchoirs pour traiter la même quantité de fruits plus vite",
        "Vendre moins cher pour écouler plus vite le stock de produit sec",
        "Traiter un second produit hors saison",
        "Réduire le personnel permanent à zéro pendant toute la campagne"
      ],
      "correctAnswer": 2,
      "explanation": "Chaque jour de fonctionnement en plus dilue les coûts fixes."
    },
    {
      "question": "Pourquoi l'année 1 du cas retient-elle 70 % de la pleine capacité ?",
      "options": [
        "Parce que la loi limite la production de l'année 1 à 70 % pour toutes les unités",
        "Parce que les séchoirs neufs ne fonctionnent qu'à 70 % de leur capacité nominale",
        "Parce que les fruits sont fournis gratuitement par l'État cette année-là",
        "Rodage de l'unité et premiers contrats : la production monte progressivement"
      ],
      "correctAnswer": 3,
      "explanation": "Une montée en charge réaliste évite un plan trop optimiste."
    }
  ],
  "tr_3": [
    {
      "question": "Quelle part des charges variables représentent les fruits dans le cas du Bénin (19,8 sur 44,7 M FCFA) ?",
      "options": [
        "Environ 44 %",
        "Environ 4 %",
        "Environ 80 %",
        "Environ 100 %"
      ],
      "correctAnswer": 0,
      "explanation": "19,8 ÷ 44,7 ≈ 44 %."
    },
    {
      "question": "Quelle est la limite principale d'un contrat d'approvisionnement avec des producteurs ?",
      "options": [
        "Le contrat supprime toute variation de qualité des fruits livrés pendant la campagne",
        "Il peut vendre ailleurs si le prix monte",
        "Le contrat dispense l'unité de tout contrôle à l'arrivée des lots de fruits",
        "Le contrat interdit à l'unité de payer le producteur avant la fin de la campagne"
      ],
      "correctAnswer": 1,
      "explanation": "Un contrat équilibré est mieux respecté qu'un contrat trop dur."
    },
    {
      "question": "Combien de fournisseurs de matière première faut-il prévoir au minimum ?",
      "options": [
        "Un seul, afin de négocier un meilleur prix sur tout le volume annuel",
        "Aucun, puisque l'achat se fait au marché au jour le jour",
        "Au moins deux",
        "Cinquante, un par village de la zone de collecte"
      ],
      "correctAnswer": 2,
      "explanation": "Un plan B limite le risque en cas de mauvaise récolte chez l'un d'eux."
    },
    {
      "question": "Que doit préciser un bon contrat d'approvisionnement ?",
      "options": [
        "Uniquement le prix au kilo de la matière première livrée",
        "Prix, qualité, calendrier de livraison et modalités de paiement et de refus d'un lot",
        "Uniquement la quantité totale livrée sur l'année entière",
        "La couleur des sacs et le nom du chauffeur de livraison"
      ],
      "correctAnswer": 1,
      "explanation": "Ces éléments évitent les litiges à la livraison."
    },
    {
      "question": "Que faire à l'arrivée de chaque lot de matière première ?",
      "options": [
        "Contrôler, peser, enregistrer, trier",
        "Tout accepter pour ne pas perdre le fournisseur",
        "Mélanger tous les lots sans trace",
        "Attendre la fin de la campagne pour trier"
      ],
      "correctAnswer": 0,
      "explanation": "La qualité du produit fini dépend d'abord de celle de la matière première."
    },
    {
      "question": "Dans le scénario pessimiste du cas, comment évolue le prix des fruits ?",
      "options": [
        "Il baisse de 8 %",
        "Il reste identique",
        "Il est multiplié par deux",
        "Il augmente de 8 %"
      ],
      "correctAnswer": 3,
      "explanation": "Un scénario pessimiste teste une matière première plus chère."
    }
  ],
  "tr_4": [
    {
      "question": "Quel est le total des immobilisations du cas du Bénin, avant le fonds de roulement ?",
      "options": [
        "74,0 millions de FCFA",
        "60,0 millions de FCFA",
        "14,0 millions de FCFA",
        "22,0 millions de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "Les 74,0 millions du coût du projet incluent 14,0 de besoin en fonds de roulement."
    },
    {
      "question": "Quel est le premier poste d'équipement du cas, et sa dotation annuelle (22,0 M FCFA sur 8 ans) ?",
      "options": [
        "Les séchoirs, 2,75 M FCFA par an",
        "Le véhicule, environ 22 millions par an",
        "Le local, environ 2,75 millions par an",
        "L'emballage, environ 275 000 FCFA par an"
      ],
      "correctAnswer": 0,
      "explanation": "22,0 ÷ 8 = 2,75."
    },
    {
      "question": "Quel est le coût d'emballage retenu dans le cas ?",
      "options": [
        "3 000 FCFA par kg de produit, soit environ 59 millions par an",
        "30 FCFA par kg de produit, soit environ 0,6 million par an",
        "300 FCFA par kg emballé, soit 5,9 M par an",
        "Aucun coût, l'emballage étant fourni par l'acheteur"
      ],
      "correctAnswer": 2,
      "explanation": "19 800 kg × 300 FCFA ≈ 5,9 millions."
    },
    {
      "question": "Que faire avant d'investir à propos des normes sanitaires et d'étiquetage ?",
      "options": [
        "Les ignorer, elles ne concernent que les grandes unités",
        "Attendre le premier contrôle",
        "Copier celles d'un autre produit",
        "Vérifier ce qui s'applique, avec date et source"
      ],
      "correctAnswer": 3,
      "explanation": "Les acheteurs exigent souvent des règles précises."
    },
    {
      "question": "Pourquoi prévoir une énergie de secours ?",
      "options": [
        "La loi l'impose partout pour toute unité de transformation sans exception",
        "Elle double le rendement matière en séchant plus longtemps chaque lot",
        "Elle remplace les séchoirs pendant la saison des pluies et la nuit",
        "Une coupure peut arrêter le séchage et faire perdre un lot"
      ],
      "correctAnswer": 3,
      "explanation": "Un plan de secours chiffré rassure les financeurs."
    },
    {
      "question": "Que faire avant d'acheter des séchoirs ?",
      "options": [
        "Prendre le moins cher sans autre vérification",
        "Comparer les devis et la capacité réelle",
        "Acheter la capacité maximale proposée",
        "Se fier uniquement à la brochure"
      ],
      "correctAnswer": 1,
      "explanation": "Les équipements sont le premier poste d'investissement."
    }
  ],
  "tr_5": [
    {
      "question": "Quel est le seuil de rentabilité du cas, rapporté au chiffre d'affaires ?",
      "options": [
        "Environ 71 %",
        "Environ 25 %",
        "Environ 50 %",
        "Environ 100 %"
      ],
      "correctAnswer": 0,
      "explanation": "54,1 ÷ 76,0 ≈ 71 %, soit une marge de sécurité de 29 %."
    },
    {
      "question": "Que signifie un DSCR de 0,99 en scénario pessimiste ?",
      "options": [
        "La banque est remboursée avec 99 % de marge",
        "Le projet gagne 99 % de plus",
        "L'annuité est à peine couverte",
        "Le scénario est sans risque"
      ],
      "correctAnswer": 2,
      "explanation": "Les banques demandent généralement un DSCR nettement supérieur à 1."
    },
    {
      "question": "Quel est le DSCR du scénario de crise de prix (− 15 %) ?",
      "options": [
        "0,79",
        "1,54",
        "0,99",
        "2,00"
      ],
      "correctAnswer": 0,
      "explanation": "Il tombe sous 1 : l'annuité n'est plus couverte."
    },
    {
      "question": "Pourquoi obtenir des lettres d'intention d'achat avant d'investir ?",
      "options": [
        "Pour remplacer l'agrément sanitaire et les démarches auprès de l'administration",
        "Pour éviter de calculer le seuil de rentabilité et le DSCR du projet",
        "Parce que la banque n'en veut jamais et préfère des promesses orales",
        "Pour avoir des acheteurs identifiés avant d'investir"
      ],
      "correctAnswer": 3,
      "explanation": "Une unité sans acheteurs avant la première campagne est exposée."
    },
    {
      "question": "Pourquoi le prix de 4 000 FCFA/kg est-il à remplacer dans votre dossier ?",
      "options": [
        "Le prix est fixé chaque année par l'État pour tous les produits séchés",
        "C'est une hypothèse : il faut vos relevés datés",
        "Le prix ne change jamais, quelle que soit la saison ou la qualité du produit",
        "Le prix est toujours de 2 000 FCFA/kg, quel que soit l'acheteur"
      ],
      "correctAnswer": 1,
      "explanation": "Chaque prix d'un plan porte une source et une date."
    },
    {
      "question": "Quel levier est le plus utile pour améliorer la marge d'une unité saisonnière ?",
      "options": [
        "Acheter plus de fruits avant d'avoir trouvé des acheteurs",
        "Réduire l'emballage à zéro pour gagner quelques points",
        "Améliorer le rendement et allonger la saison",
        "Supprimer le scénario de crise pour rassurer la banque"
      ],
      "correctAnswer": 2,
      "explanation": "Chaque levier doit être chiffré avec le modèle avant d'entrer dans le plan."
    }
  ]
};
