// FICHIER GÉNÉRÉ par scripts/examen_bp_agricole/build.mjs — ne pas modifier à la main.
// Banque de l'examen final « Business plan agricole » : 150 questions, 30 tirées par tentative
// (5 par module, voir src/lib/formations/examen.server.ts). Ne jamais importer côté client.
export type QuestionExamen = { module: number; question: string; options: string[]; correctAnswer: number; explanation: string };

export const EXAMEN_BANQUE: QuestionExamen[] = [
  {
    "module": 1,
    "question": "Quelles sont les trois fonctions d'un business plan agricole ?",
    "options": [
      "Document administratif, support publicitaire et déclaration fiscale pour l'État",
      "Contrat de vente, preuve d'identité du porteur et garantie bancaire pour le prêt",
      "Réflexion personnelle, pilotage et négociation avec les financeurs",
      "Plan de recrutement, règlement intérieur et calendrier de formation du personnel"
    ],
    "correctAnswer": 2,
    "explanation": "Réflexion (valider la viabilité), pilotage (comparer prévu et réalisé), négociation (convaincre un financeur)."
  },
  {
    "module": 1,
    "question": "Un porteur rédige son business plan uniquement parce que la banque l'exige, puis le range après le dépôt. Que perd-il ?",
    "options": [
      "Les fonctions de réflexion et de pilotage : il ne saura pas comparer le prévu au réalisé",
      "Rien du tout, car seule la fonction de négociation compte une fois le prêt accordé",
      "Uniquement le droit de modifier ses prévisions financières en cours d'année",
      "La possibilité de présenter son projet à d'autres banques, par obligation de confidentialité"
    ],
    "correctAnswer": 0,
    "explanation": "Le plan sert aussi de feuille de route : sans lui, un problème de trésorerie se découvre trop tard."
  },
  {
    "module": 1,
    "question": "Quel est le « piège numéro un » dans la rédaction d'un business plan ?",
    "options": [
      "L'excès de prudence : un plan trop sombre décourage forcément tous les financeurs",
      "L'excès de détails techniques sur l'itinéraire cultural dans la première page",
      "L'usage de chiffres arrondis plutôt que de montants exacts au franc près",
      "L'excès d'optimisme : des hypothèses irréalistes qui desservent le porteur"
    ],
    "correctAnswer": 3,
    "explanation": "Un banquier connaît les risques de l'agriculture : un plan sans prudence perd sa crédibilité."
  },
  {
    "module": 1,
    "question": "Un porteur écrit : « Mon oignon est si bon que je n'aurai aucun concurrent ». Quelle est la réaction probable d'un évaluateur ?",
    "options": [
      "Il y verra un avantage concurrentiel solide et validera l'étude de marché sans réserve",
      "Un manque de connaissance du marché : substituts et importations existent toujours",
      "Il demandera seulement une photo du produit pour juger de sa qualité réelle",
      "Il y verra une preuve que le marché est trop petit pour intéresser un investisseur"
    ],
    "correctAnswer": 1,
    "explanation": "L'absence de concurrence est un mythe : il y a des concurrents directs, des substituts et des importations."
  },
  {
    "module": 1,
    "question": "Dans le contexte d'un business plan, quelle est la bonne structure en quatre temps ?",
    "options": [
      "Objectifs, budget détaillé, calendrier de travail, équipe de direction",
      "Historique familial, diplômes, expériences passées, projets futurs",
      "Constat général, problématique, solution proposée, objectifs",
      "Marché visé, concurrence directe, prix de vente, promotion du produit"
    ],
    "correctAnswer": 2,
    "explanation": "Le contexte part du constat, pose le problème, présente la solution puis fixe les objectifs."
  },
  {
    "module": 1,
    "question": "Parmi ces phrases de contexte, laquelle est la plus convaincante ?",
    "options": [
      "« Le pays a besoin de plus de production agricole pour se développer rapidement »",
      "« L'agriculture est la base de l'économie et il faut absolument la soutenir »",
      "« Beaucoup de jeunes veulent s'installer dans l'agriculture de nos jours »",
      "« Plus de 400 000 t d'oignon produites, dont une part perdue faute de stockage »"
    ],
    "correctAnswer": 3,
    "explanation": "Un contexte fort cite un fait chiffré et sourcé qui débouche sur un problème précis."
  },
  {
    "module": 1,
    "question": "Pourquoi un chiffre de contexte doit-il être accompagné de sa source et de sa date ?",
    "options": [
      "Pour que le lecteur puisse le vérifier et juger s'il est encore valable",
      "Pour allonger le texte et atteindre le nombre de pages demandé par le financeur",
      "Parce que la loi interdit de citer un chiffre sans l'autorisation de son auteur",
      "Parce que seuls les chiffres publiés par l'État sont acceptés par les banques"
    ],
    "correctAnswer": 0,
    "explanation": "Un chiffre sans source ni date est invérifiable, donc peu crédible."
  },
  {
    "module": 1,
    "question": "Un porteur n'a ni diplôme agricole ni expérience du projet. Comment doit-il présenter son parcours ?",
    "options": [
      "En cachant ses lacunes et en ne listant que ses points forts, sans aucune explication",
      "En reliant son parcours au projet et en comblant ses lacunes par un appui technique",
      "En renonçant au financement tant qu'il n'a pas obtenu un diplôme agricole reconnu",
      "En allongeant son CV jusqu'à couvrir toutes ses expériences passées sans lien avec le projet"
    ],
    "correctAnswer": 1,
    "explanation": "Le financeur juge la capacité à réussir : on relie parcours, compétences et équipe."
  },
  {
    "module": 1,
    "question": "Diap Touré est gestionnaire commercial de formation et embauche un chef de culture. Que montre ce choix au financeur ?",
    "options": [
      "Que le porteur ne s'investira pas personnellement dans le travail quotidien de l'exploitation",
      "Que le projet est trop petit pour que le porteur ait besoin de s'occuper de la gestion",
      "Qu'il identifie sa lacune technique et la comble par une compétence complémentaire",
      "Que le porteur délègue toute la gestion financière à un tiers par manque de confiance"
    ],
    "correctAnswer": 2,
    "explanation": "Compléter ses compétences est un point positif ; l'équipe est un critère d'évaluation majeur."
  },
  {
    "module": 1,
    "question": "Un porteur travaille seul sur son projet. Que doit-il écrire dans la partie organisation ?",
    "options": [
      "Rien du tout : cette partie ne concerne que les entreprises de plus de dix salariés",
      "Qu'il est seul et comment il couvrira les pics de travail (journaliers, entraide)",
      "Qu'il recrutera dix salariés dès la première année pour rassurer la banque",
      "Qu'il n'a besoin d'aucun appui car l'agriculture se pratique naturellement seul"
    ],
    "correctAnswer": 1,
    "explanation": "Travailler seul est acceptable à condition d'expliquer comment on couvre la charge de travail."
  },
  {
    "module": 1,
    "question": "Diap prévoit un coût du projet de 55,0 M FCFA et apporte 11,0 M FCFA. Quel est le montant de l'emprunt demandé ?",
    "options": [
      "44,0 M FCFA",
      "11,0 M FCFA, soit le montant de son apport personnel",
      "55,0 M FCFA, soit la totalité du coût du projet",
      "49,5 M FCFA, soit 90 % du coût du projet"
    ],
    "correctAnswer": 0,
    "explanation": "55,0 − 11,0 = 44,0 M FCFA."
  },
  {
    "module": 1,
    "question": "Dans le cas de Diap, le CA est de 54,4 M FCFA en croisière et de 46,2 M FCFA en année 1. Que représente l'année 1 par rapport à la croisière ?",
    "options": [
      "Environ 50 % de la pleine production, la moitié des surfaces étant installée",
      "La totalité de la pleine production, sans aucune différence entre les années",
      "Environ 100 % de la production mais avec des prix inférieurs de 15 %",
      "Environ 85 % de la pleine production"
    ],
    "correctAnswer": 3,
    "explanation": "46,2 ÷ 54,4 ≈ 0,85 : l'année 1 est à 85 % de la pleine production."
  },
  {
    "module": 1,
    "question": "Qu'est-ce qui rend un business plan agricole différent d'un plan pour un commerce de ville ?",
    "options": [
      "L'absence totale de coûts fixes pendant toute l'année de production agricole",
      "Le décalage entre dépenses et ventes, la saisonnalité et les aléas climatiques",
      "L'impossibilité de prévoir un chiffre d'affaires, même approximatif, avant la récolte",
      "L'interdiction de recourir à un crédit bancaire pour financer une exploitation"
    ],
    "correctAnswer": 1,
    "explanation": "Entre le semis et la vente, il y a des mois de dépenses sans recette : d'où le BFR et la saisonnalité."
  },
  {
    "module": 1,
    "question": "Pourquoi un porteur doit-il préciser le statut de la terre (titre, bail, affectation) dès le cadrage ?",
    "options": [
      "Parce que la terre est la seule garantie acceptée par toutes les banques de la région",
      "Parce que le statut de la terre détermine le prix de vente de la récolte",
      "Parce que l'État choisit les cultures autorisées selon le statut du terrain",
      "Parce que la sécurité foncière conditionne investissements et financement"
    ],
    "correctAnswer": 3,
    "explanation": "Investir dans un forage et un hangar sur un terrain contesté est un risque majeur."
  },
  {
    "module": 1,
    "question": "Parmi les objectifs suivants, lequel est correctement formulé ?",
    "options": [
      "« Devenir le meilleur producteur du pays un jour ou l'autre dans l'avenir »",
      "« Faire beaucoup de chiffre d'affaires et de bénéfices dans les prochaines années »",
      "« Produire 176 t d'oignon par an à partir de l'année de croisière »",
      "« Travailler dur et avec passion pour réussir dans le secteur agricole »"
    ],
    "correctAnswer": 2,
    "explanation": "Un objectif est précis, mesurable et daté."
  },
  {
    "module": 1,
    "question": "Un porteur présente son projet à trois lecteurs : une banque, un bailleur de subvention, un investisseur. Que doit-il faire ?",
    "options": [
      "Adapter l'accent du dossier à chaque lecteur tout en gardant les mêmes chiffres",
      "Écrire trois plans avec des chiffres différents selon ce que chacun veut lire",
      "Envoyer le même résumé sans aucun changement, quel que soit le lecteur",
      "Supprimer toute la partie financière pour les bailleurs de subvention"
    ],
    "correctAnswer": 0,
    "explanation": "Le fond et les chiffres restent identiques ; l'angle varie (remboursement, impact, rendement)."
  },
  {
    "module": 1,
    "question": "Quel est le rôle d'un « fil rouge » chiffré, comme le cas de Diap Touré, dans cette formation ?",
    "options": [
      "Imposer au porteur de copier les chiffres de Diap dans son propre dossier",
      "Prouver que le projet de Diap est le seul modèle rentable en agriculture",
      "Dispenser le porteur de réaliser sa propre étude de marché sur le terrain",
      "Montrer à chaque notion à quoi ressemble une bonne réponse"
    ],
    "correctAnswer": 3,
    "explanation": "Le cas est un exemple de méthode ; chacun doit produire ses propres chiffres sourcés."
  },
  {
    "module": 1,
    "question": "Un jeune diplômé sans capital veut un prêt de 50 M FCFA pour un projet de 50 M FCFA. Que lui répondra le plus souvent une banque ?",
    "options": [
      "Qu'il peut emprunter 100 % sans condition s'il présente un joli business plan",
      "Qu'un apport personnel est attendu, habituellement de 10 à 30 % du projet",
      "Qu'il doit d'abord rembourser un autre prêt pour prouver sa solvabilité",
      "Que seule une subvention d'État peut couvrir un projet de cette taille"
    ],
    "correctAnswer": 1,
    "explanation": "L'apport montre l'engagement du porteur ; Diap apporte 20 %."
  },
  {
    "module": 1,
    "question": "Un évaluateur lit un plan où tous les prix augmentent chaque année et où aucune perte n'est prévue. Quel est son jugement probable ?",
    "options": [
      "Le plan manque de réalisme : il faut un scénario défavorable",
      "Le plan est exemplaire car il montre une croissance régulière et rassurante",
      "Le plan est trop détaillé pour être lu en entier par un comité de crédit",
      "Le plan n'a pas besoin de scénarios puisque tout y est déjà prévu"
    ],
    "correctAnswer": 0,
    "explanation": "L'optimisme sans scénario pessimiste est le piège numéro un."
  },
  {
    "module": 1,
    "question": "À quel moment le porteur doit-il comparer ses prévisions à la réalité ?",
    "options": [
      "Une seule fois, à la fin de la dernière année couverte par le business plan",
      "Jamais : le plan est un document figé après le dépôt du dossier de financement",
      "Chaque mois ou chaque campagne, pour corriger avant la crise de trésorerie",
      "Uniquement quand la banque le demande par courrier officiel à l'exploitant"
    ],
    "correctAnswer": 2,
    "explanation": "La fonction de pilotage suppose un suivi régulier prévu / réalisé."
  },
  {
    "module": 1,
    "question": "Sur 55,0 M FCFA de ressources, l'emprunt de Diap (44,0 M FCFA) représente quelle part ?",
    "options": [
      "80 %",
      "20 %, la part de l'apport personnel",
      "44 %, en confondant montant et pourcentage",
      "55 %, soit la totalité des emplois"
    ],
    "correctAnswer": 0,
    "explanation": "44,0 ÷ 55,0 = 0,80."
  },
  {
    "module": 1,
    "question": "Pourquoi tester une idée par un business plan avant d'y engager son argent ?",
    "options": [
      "Parce que la banque rembourse les pertes si le plan a été validé par un conseiller",
      "Parce que le plan remplace l'étude de marché et dispense de rencontrer les clients",
      "Parce que l'écrire oblige à répondre aux questions de marché, de prix et de trésorerie",
      "Parce que l'État interdit de lancer un projet agricole sans plan officiellement approuvé"
    ],
    "correctAnswer": 2,
    "explanation": "La première fonction du plan est de tester la viabilité avant de s'engager."
  },
  {
    "module": 1,
    "question": "Quelle formulation du problème est la plus utile pour un business plan ?",
    "options": [
      "« Les agriculteurs rencontrent beaucoup de difficultés de toutes sortes dans leur métier »",
      "« Les producteurs bradent à la récolte, faute de stockage, et les prix remontent après »",
      "« Il y a un problème dans la filière et il faut agir rapidement pour le résoudre »",
      "« Le manque de moyens est le problème de tous les porteurs de projet de la région »"
    ],
    "correctAnswer": 1,
    "explanation": "Un problème précis, causal et chiffrable appelle une solution précise."
  },
  {
    "module": 1,
    "question": "Le porteur doit-il indiquer qu'une partie de ses données est estimée plutôt que mesurée ?",
    "options": [
      "Non : toute incertitude doit être cachée pour ne pas inquiéter le financeur",
      "Non : seules les données mesurées ont le droit d'apparaître dans un plan",
      "Oui, mais uniquement à l'oral et jamais par écrit dans le dossier remis",
      "Oui : distinguer les chiffres vérifiés des estimations renforce la crédibilité"
    ],
    "correctAnswer": 3,
    "explanation": "La transparence sur les hypothèses est un signe de professionnalisme."
  },
  {
    "module": 2,
    "question": "À quoi sert l'analyse PESTEL dans un business plan agricole ?",
    "options": [
      "À calculer le prix de revient exact de chaque kilo produit sur l'exploitation, poste par poste",
      "À comparer les prix pratiqués par chacun des concurrents directs sur les marchés de gros",
      "À structurer l'étude des six familles de facteurs externes qui pèsent sur le projet",
      "À répartir les tâches entre les membres de l'équipe selon leur ancienneté et leurs talents"
    ],
    "correctAnswer": 2,
    "explanation": "PESTEL = Politique, Économique, Social, Technologique, Environnemental, Légal."
  },
  {
    "module": 2,
    "question": "Le gel temporaire des importations d'oignon décidé par l'État est un facteur de quel type, et comment le traiter ?",
    "options": [
      "Technologique : un acquis durable qu'on peut intégrer comme hypothèse centrale",
      "Politique : une opportunité instable, à ne jamais présenter comme une rente",
      "Social : un changement d'habitudes de consommation sans effet sur les prix",
      "Environnemental : un risque climatique couvert par l'assurance récolte"
    ],
    "correctAnswer": 1,
    "explanation": "Les décisions d'importation se renversent (suspensions, levées) : il faut tester le plan sans elles."
  },
  {
    "module": 2,
    "question": "Le déficit de stockage dans la zone est un facteur clé de succès. Quelle conclusion le porteur peut-il en tirer ?",
    "options": [
      "Il doit vendre toute sa récolte le jour même pour éviter les pertes de stockage",
      "Il doit renoncer à la culture de l'oignon, trop périssable pour un projet bancable",
      "Il doit attendre que l'État construise des entrepôts publics avant de lancer le projet",
      "Investir dans un hangar ventilé lui permet de vendre quand les prix remontent"
    ],
    "correctAnswer": 3,
    "explanation": "Le stockage transforme une contrainte du marché en avantage concurrentiel."
  },
  {
    "module": 2,
    "question": "Pourquoi « tout le monde mange de l'oignon » est-elle une erreur fatale dans une étude de marché ?",
    "options": [
      "Parce qu'une cible aussi large n'est pas un client : il faut segmenter",
      "Parce que l'oignon n'est consommé que par une minorité de ménages urbains",
      "Parce que la phrase est trop courte pour figurer dans un dossier sérieux",
      "Parce que les banques n'acceptent que des projets destinés à l'exportation"
    ],
    "correctAnswer": 0,
    "explanation": "Segmenter, c'est diviser le marché en sous-groupes aux besoins homogènes et en choisir quelques-uns."
  },
  {
    "module": 2,
    "question": "Quel exemple de segmentation d'un marché de légumes est correct ?",
    "options": [
      "Grossistes de marché, supermarchés, restauration collective, ménages en vente directe",
      "Légumes frais, légumes secs, légumes en conserve, légumes surgelés pour tous publics",
      "Clients du matin, clients de l'après-midi, clients du week-end et clients du soir",
      "Clients qui aiment le produit, clients indifférents et clients qui ne l'ont jamais goûté"
    ],
    "correctAnswer": 0,
    "explanation": "Une segmentation utile distingue des acheteurs qui n'ont ni les mêmes volumes, ni les mêmes exigences, ni les mêmes prix."
  },
  {
    "module": 2,
    "question": "Quelle est la différence entre données primaires et données secondaires ?",
    "options": [
      "Les primaires viennent de l'État ; les secondaires viennent des seuls clients privés",
      "Les primaires sont les chiffres récents ; les secondaires, les chiffres de plus de cinq ans",
      "Les primaires sont recueillies sur le terrain ; les secondaires existent déjà",
      "Les primaires concernent le marché local ; les secondaires, le marché d'exportation"
    ],
    "correctAnswer": 2,
    "explanation": "Une mini-enquête auprès de grossistes est une donnée primaire ; une statistique ministérielle est secondaire."
  },
  {
    "module": 2,
    "question": "Le marché local d'une zone est estimé à 500 t par an. Le porteur vise 50 t. Quelle part de marché vise-t-il ?",
    "options": [
      "1 %, en confondant tonnes et pourcentages",
      "10 %",
      "25 %, soit la moitié de la part du premier concurrent",
      "50 %, soit le nombre de tonnes visées"
    ],
    "correctAnswer": 1,
    "explanation": "50 ÷ 500 = 0,10 soit 10 %."
  },
  {
    "module": 2,
    "question": "Diap vise un petit nombre de gros acheteurs (B2B) plutôt que des ménages. Quel est l'avantage principal de ce choix pour une production de 176 t d'oignon ?",
    "options": [
      "Des prix toujours plus élevés qu'en vente directe au consommateur",
      "Aucun besoin de calibrer ni de trier le produit avant la vente",
      "Une absence totale de risque d'impayé auprès des gros clients",
      "Des volumes écoulés par gros lots, avec moins de transactions"
    ],
    "correctAnswer": 3,
    "explanation": "Un petit nombre de gros clients simplifie la logistique mais crée une dépendance et un risque de crédit client."
  },
  {
    "module": 2,
    "question": "Quel risque accompagne le choix de quelques gros clients ?",
    "options": [
      "L'obligation de vendre à un prix imposé par l'État pour chaque client",
      "L'impossibilité de signer des lettres d'intention avec les acheteurs",
      "L'obligation de recruter un vendeur par client dès la première année",
      "La dépendance : perdre un client ou un retard de paiement pèse lourd"
    ],
    "correctAnswer": 3,
    "explanation": "La concentration de la clientèle est un risque à citer dans le FFOM et la matrice des risques."
  },
  {
    "module": 2,
    "question": "Quel type de concurrence est souvent oublié par les porteurs de projet agricole ?",
    "options": [
      "Les agriculteurs voisins cultivant une plante complètement différente",
      "Les substituts et les importations qui satisfont le même besoin",
      "Les marchands de semences et d'engrais qui fournissent les intrants",
      "Les banques qui proposent des prêts à d'autres porteurs de projet"
    ],
    "correctAnswer": 1,
    "explanation": "La concurrence se mesure par le besoin satisfait : produit identique, substitut ou importé."
  },
  {
    "module": 2,
    "question": "Que cherche-t-on à identifier en analysant la concurrence ?",
    "options": [
      "Un créneau : ce qu'il offre de différent (qualité, période, service)",
      "Le nom du concurrent à imiter exactement pour sécuriser les ventes",
      "Le moyen de baisser ses prix au niveau le plus bas du marché",
      "La liste de tous les producteurs du pays pour les contacter un par un"
    ],
    "correctAnswer": 0,
    "explanation": "L'analyse de la concurrence sert à définir une proposition de valeur, pas à copier."
  },
  {
    "module": 2,
    "question": "Un porteur calcule un prix de revient de 140 F/kg pour 30 t produites. Quel est le coût total correspondant ?",
    "options": [
      "42 M FCFA, en décalant la virgule d'un rang",
      "0,42 M FCFA, en divisant par dix",
      "4,2 M FCFA",
      "140 M FCFA, en ignorant le volume produit"
    ],
    "correctAnswer": 2,
    "explanation": "30 000 kg × 140 F = 4 200 000 F = 4,2 M FCFA."
  },
  {
    "module": 2,
    "question": "Avec un prix de revient de 140 F/kg et un prix de vente de 175 F/kg, quelle est la marge unitaire par kilo ?",
    "options": [
      "15 F, en appliquant un taux de 10 % au prix de revient",
      "140 F, qui correspond au coût et non à la marge",
      "35 F",
      "315 F, en additionnant coût et prix de vente"
    ],
    "correctAnswer": 2,
    "explanation": "175 − 140 = 35 F/kg."
  },
  {
    "module": 2,
    "question": "Le prix de l'oignon de Diap est de 200 F/kg en moyenne : 60 % de la production vendue à 160 F à la récolte, 40 % stockée et vendue à 260 F. Pourquoi ce prix moyen est-il de 200 F ?",
    "options": [
      "Parce que (160 + 260) ÷ 2 = 210 F, arrondi à 200 F",
      "Parce que 0,6 × 160 + 0,4 × 260 = 96 + 104 = 200 F/kg",
      "Parce que l'État fixe le prix de l'oignon à 200 F/kg toute l'année",
      "Parce que 260 − 160 = 100 F, doublé pour obtenir 200 F"
    ],
    "correctAnswer": 1,
    "explanation": "La moyenne doit être pondérée par les volumes vendus à chaque prix, non simple."
  },
  {
    "module": 2,
    "question": "Si Diap vendait tout à la récolte à 160 F/kg au lieu de stocker 40 % de l'oignon, que deviendrait son prix moyen ?",
    "options": [
      "200 F/kg, car le prix moyen ne dépend pas de la date de vente",
      "260 F/kg, car le prix le plus élevé s'applique à toute la production",
      "120 F/kg, car l'oignon perd 25 % de sa valeur à la récolte",
      "160 F/kg : le gain du stockage disparaît"
    ],
    "correctAnswer": 3,
    "explanation": "Le stockage rapporte 40 % × (260 − 160) = 40 F/kg en plus sur l'ensemble de l'oignon."
  },
  {
    "module": 2,
    "question": "Diap évalue à 40 F/kg le gain moyen apporté par le stockage sur 176 t d'oignon. Quel gain annuel cela représente-t-il ?",
    "options": [
      "Environ 7,0 M FCFA",
      "Environ 0,7 M FCFA, en ratant une décimale",
      "Environ 70 M FCFA, en confondant F et millions",
      "Environ 4,0 M FCFA, soit le montant des intérêts de l'année 1"
    ],
    "correctAnswer": 0,
    "explanation": "176 000 kg × 40 F = 7 040 000 F ≈ 7,0 M FCFA."
  },
  {
    "module": 2,
    "question": "Dans un FFOM, que désignent les « forces » et les « faiblesses » ?",
    "options": [
      "Des éléments extérieurs que le porteur ne maîtrise pas",
      "Des éléments internes à l'entreprise du porteur",
      "Des éléments passés qui ne sont plus d'actualité",
      "Les seuls éléments qui concernent les clients de l'entreprise"
    ],
    "correctAnswer": 1,
    "explanation": "Forces et faiblesses = interne ; opportunités et menaces = externe."
  },
  {
    "module": 2,
    "question": "Dans un FFOM, une baisse des prix à la récolte due à la surproduction locale relève de quelle case ?",
    "options": [
      "Faiblesse : un défaut interne de l'exploitation",
      "Force : un avantage dont dispose l'exploitation",
      "Opportunité : une chance de gagner des clients",
      "Menace : un facteur externe défavorable"
    ],
    "correctAnswer": 3,
    "explanation": "Un événement extérieur défavorable est une menace."
  },
  {
    "module": 2,
    "question": "Un forage équipé en pompage solaire est, pour Diap, plutôt :",
    "options": [
      "Une menace : un équipement toujours en panne en saison chaude",
      "Une opportunité externe offerte par la météo de la région",
      "Une force : une eau maîtrisée, moins dépendante de la pluie",
      "Une faiblesse : un coût fixe sans aucun avantage"
    ],
    "correctAnswer": 2,
    "explanation": "L'irrigation maîtrisée est un atout interne, créé par l'investissement."
  },
  {
    "module": 2,
    "question": "À quoi sert le croisement du FFOM (forces × opportunités, faiblesses × menaces) ?",
    "options": [
      "À en déduire des stratégies concrètes, pas une simple liste",
      "À additionner les points positifs et négatifs pour obtenir une note sur 20",
      "À classer les concurrents par ordre alphabétique de leurs faiblesses",
      "À remplacer l'analyse des risques par une seule matrice simplifiée"
    ],
    "correctAnswer": 0,
    "explanation": "Un bon FFOM débouche sur des actions : s'appuyer sur ses forces pour saisir les opportunités, réduire les faiblesses face aux menaces."
  },
  {
    "module": 2,
    "question": "Comment présenter un FFOM crédible devant un banquier ?",
    "options": [
      "Avec uniquement des forces, pour montrer que le projet n'a aucun défaut",
      "Avec une liste très longue de menaces et sans aucune réponse prévue",
      "Avec des éléments chiffrés et des faiblesses assorties d'une réponse",
      "Avec des formules générales valables pour n'importe quel projet agricole"
    ],
    "correctAnswer": 2,
    "explanation": "Reconnaître ses faiblesses et y répondre inspire confiance."
  },
  {
    "module": 2,
    "question": "Pourquoi l'étude de marché doit-elle inclure l'évolution des prix dans l'année (saisonnalité) ?",
    "options": [
      "Parce que la date de vente détermine le prix de la même récolte",
      "Parce que les prix sont identiques toute l'année et qu'il faut seulement le prouver",
      "Parce que l'administration fiscale exige un graphique des prix pour chaque campagne",
      "Parce que les prix de la saison sèche s'appliquent à toutes les ventes de l'année"
    ],
    "correctAnswer": 0,
    "explanation": "La saisonnalité des prix justifie le stockage et conditionne le calendrier de vente."
  },
  {
    "module": 2,
    "question": "Un porteur observe que le prix de l'oignon est passé de 105 F/kg à plus de 400 F/kg en quelques mois. Quelle conclusion de plan est la plus prudente ?",
    "options": [
      "Le prix de 400 F/kg est devenu la norme : il faut l'utiliser comme prix de base",
      "Prix très volatils : retenir un prix moyen prudent et tester une baisse",
      "Le prix de 105 F/kg est un accident : il faut l'ignorer dans le plan",
      "Le prix n'a aucune importance si le volume produit est suffisant"
    ],
    "correctAnswer": 1,
    "explanation": "Un plan solide ne repose ni sur le prix le plus haut ni sur le plus bas observés."
  },
  {
    "module": 2,
    "question": "Pourquoi dater et sourcer chaque donnée de marché dans le dossier ?",
    "options": [
      "Parce qu'une donnée datée a toujours plus de valeur qu'une donnée récente",
      "Parce que la source remplace l'analyse du porteur et le dispense d'interpréter",
      "Parce que l'administration fiscale contrôle toutes les sources du dossier",
      "Parce que les prix et les politiques commerciales changent vite : le lecteur doit savoir quand et où chaque donnée a été relevée"
    ],
    "correctAnswer": 3,
    "explanation": "Une donnée de marché est périssable : sans date, on ne peut ni la vérifier ni l'actualiser."
  },
  {
    "module": 3,
    "question": "Pourquoi un évaluateur non agronome doit-il comprendre votre fiche produit ?",
    "options": [
      "Parce que le dossier est jugé par des financiers : variété, calibre et qualité doivent être clairs",
      "Parce que l'évaluateur est toujours un ingénieur agronome qui vérifiera chaque variété",
      "Parce qu'il suffit de citer le nom botanique de la plante pour être crédible",
      "Parce que les banques refusent les produits dont la fiche contient des termes techniques"
    ],
    "correctAnswer": 0,
    "explanation": "Le lecteur est souvent financier : la fiche produit doit être claire, précise et argumentée."
  },
  {
    "module": 3,
    "question": "Qu'est-ce que l'itinéraire technique d'une culture ?",
    "options": [
      "Le trajet du camion qui transporte la récolte jusqu'au marché de gros de la région",
      "La liste des clients à visiter pendant la campagne de vente, mois après mois",
      "La suite des opérations (sol, semis, fertilisation, traitements, récolte) avec leurs coûts",
      "L'ensemble des démarches administratives à accomplir pour créer l'exploitation agricole"
    ],
    "correctAnswer": 2,
    "explanation": "L'itinéraire technique est le cœur du métier : il justifie les rendements et les coûts du plan."
  },
  {
    "module": 3,
    "question": "Pourquoi chiffrer l'itinéraire technique poste par poste ?",
    "options": [
      "Parce que la banque demande de justifier le prix de chaque outil manuel",
      "Parce que chaque opération a un coût qui alimente les charges et le prix de revient",
      "Parce que les coûts sont identiques d'une culture à l'autre et qu'il faut le prouver",
      "Parce que seuls les coûts de main-d'œuvre sont pris en compte dans le plan"
    ],
    "correctAnswer": 1,
    "explanation": "Sans coût par poste, on ne peut calculer ni la marge, ni le seuil, ni le BFR."
  },
  {
    "module": 3,
    "question": "Une culture coûte 1,2 M FCFA par hectare à produire. Quel est le coût de production pour 7 hectares ?",
    "options": [
      "1,7 M FCFA, en divisant au lieu de multiplier",
      "7,2 M FCFA, en ajoutant 6 hectares seulement",
      "84 M FCFA, en décalant la virgule",
      "8,4 M FCFA"
    ],
    "correctAnswer": 3,
    "explanation": "1,2 × 7 = 8,4 M FCFA."
  },
  {
    "module": 3,
    "question": "Un porteur cultive 3 ha de pomme de terre et 7 ha d'oignon, avec un rendement de 25 t/ha pour chacune des deux cultures. Quelle est la production totale ?",
    "options": [
      "250 t",
      "75 t, en ne comptant que la pomme de terre",
      "175 t, en ne comptant que l'oignon",
      "25 t, en oubliant de multiplier par la surface"
    ],
    "correctAnswer": 0,
    "explanation": "(3 + 7) × 25 = 250 t."
  },
  {
    "module": 3,
    "question": "Pour la pomme de terre de Diap, 69 t sont produites sur 3 ha. Quel est le rendement par hectare ?",
    "options": [
      "20 t/ha, en arrondissant à la dizaine inférieure",
      "207 t/ha, en multipliant au lieu de diviser",
      "3 t/ha, en confondant surface et rendement",
      "23 t/ha"
    ],
    "correctAnswer": 3,
    "explanation": "69 ÷ 3 = 23 t/ha."
  },
  {
    "module": 3,
    "question": "Pourquoi le plan présente-t-il d'abord un calendrier d'installation, puis un calendrier de production ?",
    "options": [
      "Parce que les deux calendriers sont identiques et qu'on les présente deux fois",
      "Parce que l'installation précède la première récolte et mobilise de la trésorerie sans recettes",
      "Parce que le calendrier d'installation ne concerne que les entreprises avec salariés",
      "Parce que le calendrier de production n'existe qu'en agriculture irriguée"
    ],
    "correctAnswer": 1,
    "explanation": "Pendant l'installation, il n'y a pas de chiffre d'affaires : c'est l'année 0 du plan."
  },
  {
    "module": 3,
    "question": "Que montre un calendrier de production annuel bien construit ?",
    "options": [
      "Uniquement les jours fériés et les congés du personnel de l'exploitation, mois après mois",
      "Les cours mondiaux de chaque matière première agricole, relevés chaque semaine",
      "Les mois de semis, de récolte, de vente et de pic de main-d'œuvre",
      "La liste des formations suivies par le porteur au cours de l'année écoulée"
    ],
    "correctAnswer": 2,
    "explanation": "Le calendrier relie technique, ventes et trésorerie."
  },
  {
    "module": 3,
    "question": "Pourquoi un calendrier valable dans les Niayes ne s'applique-t-il pas tel quel ailleurs ?",
    "options": [
      "Parce que les semences changent de nom d'une région à l'autre",
      "Parce que climat, saisons, sols et pluviométrie diffèrent selon la zone",
      "Parce que chaque banque impose son propre calendrier à ses clients",
      "Parce que le calendrier dépend uniquement de la forme juridique de l'entreprise"
    ],
    "correctAnswer": 1,
    "explanation": "Les dates de semis et de récolte dépendent de la zone ; le porteur doit adapter son calendrier."
  },
  {
    "module": 3,
    "question": "Un porteur prévoit des récoltes de pomme de terre en janvier, mais ses semis sont programmés en février. Quelle est l'erreur ?",
    "options": [
      "Une incohérence : on ne peut pas récolter avant d'avoir semé",
      "Aucune erreur : la pomme de terre pousse sans cycle de culture",
      "Une erreur de présentation uniquement, sans conséquence sur le plan",
      "Une erreur de forme juridique à corriger avant le dépôt du dossier"
    ],
    "correctAnswer": 0,
    "explanation": "Le cycle de culture impose un délai entre semis et récolte ; le plan doit le respecter."
  },
  {
    "module": 3,
    "question": "Quel est l'intérêt du plan d'approvisionnement ?",
    "options": [
      "Remplacer le plan de production pour gagner du temps de rédaction",
      "Obliger le porteur à acheter tous ses intrants à la même date pour réduire le prix",
      "Prévoir les achats d'intrants au bon moment et la trésorerie nécessaire",
      "Dispenser le porteur de comparer plusieurs fournisseurs"
    ],
    "correctAnswer": 2,
    "explanation": "Les intrants s'achètent avant les ventes : leur calendrier alimente le BFR et la trésorerie mensuelle."
  },
  {
    "module": 3,
    "question": "Un porteur veut cultiver sept hectares d'oignon et trois de pomme de terre en contre-saison. Quel est le principe d'un assolement ?",
    "options": [
      "Cultiver la même plante partout, tout le temps, pour économiser des semences",
      "Laisser toutes les parcelles en jachère une année sur deux",
      "Choisir les cultures selon la couleur du produit attendu par le client",
      "Alterner les cultures dans le temps et l'espace pour préserver le sol"
    ],
    "correctAnswer": 3,
    "explanation": "L'assolement répartit les cultures pour la fertilité, les maladies et la trésorerie."
  },
  {
    "module": 3,
    "question": "Pourquoi Diap garde-t-il 7 ha en engrais vert pendant l'hivernage ?",
    "options": [
      "Pour revendre l'engrais vert aux exploitations voisines à bon prix",
      "Pour réduire le nombre d'hectares déclarés à l'administration fiscale",
      "Pour entretenir la fertilité du sol et limiter les maladies",
      "Parce que l'oignon ne peut pas être récolté en hivernage"
    ],
    "correctAnswer": 2,
    "explanation": "L'engrais vert est un choix technique de gestion de la fertilité."
  },
  {
    "module": 3,
    "question": "Quelle forme juridique convient à un porteur qui se lance seul avec un emprunt de 44 M FCFA ?",
    "options": [
      "Aucune forme : le porteur emprunte en son nom propre sans immatriculer l'entreprise ni ouvrir de compte",
      "Une association à but non lucratif, car elle ne paie jamais d'impôt sur ses activités",
      "Une tontine familiale, car elle évite toute formalité auprès des banques de la zone",
      "Une société à responsabilité limitée à associé unique (SARLU), qui sépare les patrimoines"
    ],
    "correctAnswer": 3,
    "explanation": "Une société limite la responsabilité du porteur au capital apporté, ce qui rassure aussi le banquier par sa transparence."
  },
  {
    "module": 3,
    "question": "Pourquoi choisir une forme juridique avant de déposer un dossier de financement ?",
    "options": [
      "Parce que la banque finance une entreprise identifiée : statut, immatriculation et comptes séparés sont attendus",
      "Parce que la forme juridique détermine la couleur de l'emballage du produit",
      "Parce que le choix du statut fixe automatiquement le prix de vente",
      "Parce que la banque ne finance que les associations de producteurs"
    ],
    "correctAnswer": 0,
    "explanation": "Le statut conditionne le financement, la fiscalité et la responsabilité du porteur."
  },
  {
    "module": 3,
    "question": "Un groupement de producteurs veut financer un équipement collectif. Quel avantage d'une structure collective est le plus important pour le plan ?",
    "options": [
      "Supprimer toute charge de gestion et de comptabilité",
      "Mutualiser les coûts et peser davantage face aux acheteurs et aux financeurs",
      "Garantir que chaque membre recevra la même part du bénéfice, quelle que soit sa production",
      "Obtenir automatiquement l'accord de la banque sans étudier le dossier"
    ],
    "correctAnswer": 1,
    "explanation": "La mutualisation est un avantage réel, mais elle exige des règles de gouvernance claires."
  },
  {
    "module": 3,
    "question": "L'organigramme d'une exploitation sert d'abord à :",
    "options": [
      "Afficher le nom du porteur sur la première page du dossier",
      "Justifier un salaire plus élevé pour le dirigeant",
      "Montrer qui fait quoi, qui décide et qui supervise",
      "Remplacer la présentation de l'équipe par un schéma sans commentaire"
    ],
    "correctAnswer": 2,
    "explanation": "Un organigramme clair rassure sur l'organisation et les responsabilités."
  },
  {
    "module": 3,
    "question": "Un chef de culture est payé 250 000 F par mois pendant 12 mois. Quel est son coût annuel, hors charges sociales ?",
    "options": [
      "0,25 M FCFA, soit un seul mois de salaire",
      "3,0 M FCFA",
      "30 M FCFA, en décalant la virgule",
      "2,5 M FCFA, en comptant 10 mois seulement"
    ],
    "correctAnswer": 1,
    "explanation": "250 000 × 12 = 3 000 000 F = 3,0 M FCFA."
  },
  {
    "module": 3,
    "question": "Un journalier est payé 3 000 F par jour. Pour 500 journées de travail sur l'année, quel est le coût ?",
    "options": [
      "1,5 M FCFA",
      "0,15 M FCFA, en perdant un zéro",
      "15 M FCFA, en ajoutant un zéro",
      "3,5 M FCFA, en additionnant les deux nombres"
    ],
    "correctAnswer": 0,
    "explanation": "3 000 × 500 = 1 500 000 F = 1,5 M FCFA."
  },
  {
    "module": 3,
    "question": "Quel aspect réglementaire un projet agricole oublie-t-il souvent de mentionner ?",
    "options": [
      "La couleur réglementaire des sacs d'emballage utilisés pour le conditionnement du produit",
      "Le calendrier des fêtes religieuses de la zone d'implantation de l'exploitation",
      "La liste des concurrents officiellement agréés par l'État dans la zone concernée",
      "Les autorisations liées à l'eau (forage), aux phytosanitaires et au droit du travail"
    ],
    "correctAnswer": 3,
    "explanation": "Forage, pesticides et contrats de travail relèvent de règles à connaître et à budgétiser."
  },
  {
    "module": 3,
    "question": "Un porteur investit dans un forage sur une terre attribuée verbalement par un chef coutumier, sans document. Quel est le principal risque ?",
    "options": [
      "Aucun risque : la parole d'un chef coutumier est toujours acceptée par les banques",
      "Perdre l'investissement si la terre est contestée, et ne pas convaincre la banque",
      "Un risque uniquement fiscal, sans effet sur le financement",
      "Un risque lié à la couleur des cultures installées"
    ],
    "correctAnswer": 1,
    "explanation": "Sans titre, bail ou affectation écrite, la sécurité foncière est faible, ce qui pèse sur l'investissement et la garantie."
  },
  {
    "module": 3,
    "question": "Quels coûts sont proportionnels à la production et donc « variables » dans une exploitation ?",
    "options": [
      "Assurance annuelle, salaire du chef de culture, amortissement du matériel",
      "Loyer du bureau, frais de comptabilité et frais bancaires fixes",
      "Semences, engrais, traitements, emballages et main-d'œuvre saisonnière",
      "Remboursement du capital de l'emprunt et intérêts de la dette"
    ],
    "correctAnswer": 2,
    "explanation": "Les charges variables augmentent avec le volume produit et vendu."
  },
  {
    "module": 3,
    "question": "Pourquoi distinguer coûts fixes et coûts variables dès la présentation de l'exploitation ?",
    "options": [
      "Parce qu'elle permet de calculer la marge sur coûts variables et le seuil de rentabilité",
      "Parce que les coûts fixes ne sont jamais payés par le porteur",
      "Parce que la comptabilité interdit de mélanger les deux types de charges",
      "Parce que les coûts variables sont toujours supérieurs aux coûts fixes"
    ],
    "correctAnswer": 0,
    "explanation": "Seuil de rentabilité = coûts fixes ÷ taux de marge sur coûts variables."
  },
  {
    "module": 4,
    "question": "Pourquoi le marketing est-il indispensable à un producteur agricole ?",
    "options": [
      "Parce qu'un bon produit se vend toujours tout seul sur le marché",
      "Parce que le marketing remplace la nécessité de bien produire",
      "Parce que seuls les produits transformés ont besoin d'être vendus",
      "Parce que produire ne suffit pas : il faut des acheteurs, un prix et un moment de vente"
    ],
    "correctAnswer": 3,
    "explanation": "Le mythe du bon produit qui se vend tout seul ruine beaucoup de projets."
  },
  {
    "module": 4,
    "question": "Que désignent les « 4P » du marketing mix ?",
    "options": [
      "Produit, Prix, Place (distribution), Promotion",
      "Production, Personnel, Patrimoine, Pertes",
      "Planification, Prévision, Pilotage, Paiement",
      "Prospection, Pépinière, Paysan, Partenaire"
    ],
    "correctAnswer": 0,
    "explanation": "Produit, Prix, Place, Promotion."
  },
  {
    "module": 4,
    "question": "Pour l'oignon de Diap, calibrer, trier et conditionner en filets relève de quel P ?",
    "options": [
      "Le Prix : le conditionnement fixe le tarif au kilo",
      "La Place : le filet détermine le lieu de vente",
      "La Promotion : le filet remplace toute publicité",
      "Le Produit : la qualité et la présentation font partie de l'offre"
    ],
    "correctAnswer": 3,
    "explanation": "Le produit ne se limite pas à la plante : calibre, tri et emballage comptent."
  },
  {
    "module": 4,
    "question": "Diap stocke 40 % de son oignon pour le vendre plus tard. Quel P est concerné en premier lieu ?",
    "options": [
      "La Promotion : le stockage remplace toute publicité auprès des clients",
      "Le Prix : le stockage permet de viser une période où le prix est meilleur",
      "Le Produit : le stockage change la variété d'oignon",
      "La Place : le stockage modifie le nom de l'exploitation"
    ],
    "correctAnswer": 1,
    "explanation": "Vendre au bon moment est une décision de prix et de calendrier."
  },
  {
    "module": 4,
    "question": "Quel est le piège d'un prix fixé uniquement à partir du prix de revient ?",
    "options": [
      "Obtenir un prix trop bas pour couvrir les coûts, par définition",
      "Ne jamais pouvoir proposer de remise à un gros acheteur",
      "Ignorer le prix que le marché accepte et celui des concurrents",
      "Devoir obligatoirement vendre à perte sur la première année"
    ],
    "correctAnswer": 2,
    "explanation": "Le prix se fixe entre le coût (plancher) et ce que le marché accepte (plafond)."
  },
  {
    "module": 4,
    "question": "Un prix « plancher » est :",
    "options": [
      "Le prix sous lequel le porteur ne vend pas, car il ne couvrirait plus ses coûts",
      "Le prix maximum autorisé par l'État pour un produit agricole",
      "Le prix moyen observé pendant la période de pénurie",
      "Le prix payé par le consommateur final dans les grandes surfaces"
    ],
    "correctAnswer": 0,
    "explanation": "Le prix plancher protège le porteur contre une vente à perte lors des périodes de surproduction."
  },
  {
    "module": 4,
    "question": "Pourquoi la prospection doit-elle commencer avant le semis ?",
    "options": [
      "Parce que la loi interdit de contacter des clients après le semis",
      "Parce que les clients n'achètent que des produits non encore cultivés",
      "Parce qu'on sécurise les ventes avant de produire : lettres d'intention, contrats",
      "Parce que la prospection est gratuite avant le semis et payante après"
    ],
    "correctAnswer": 2,
    "explanation": "On ne cherche pas ses clients le jour de la récolte : on vend avant de produire."
  },
  {
    "module": 4,
    "question": "Quelles sont les phases du plan de prospection d'un producteur ?",
    "options": [
      "Uniquement la récolte et le lendemain de la récolte",
      "Avant le semis (sécuriser), pendant la culture (fidéliser et confirmer), à la récolte (livrer et encaisser)",
      "Uniquement les mois de pénurie quand les prix sont élevés",
      "Une seule phase, au moment de l'ouverture du compte bancaire"
    ],
    "correctAnswer": 1,
    "explanation": "Le plan couvre tout le cycle, de la pré-vente à l'encaissement."
  },
  {
    "module": 4,
    "question": "Quelle est la valeur d'une lettre d'intention d'achat pour la banque ?",
    "options": [
      "Elle remplace entièrement l'étude de marché et dispense des visites de terrain",
      "Elle oblige l'acheteur à payer même si la récolte échoue",
      "Elle remplace la garantie bancaire exigée sur le prêt",
      "Un signal de demande : un acheteur est prêt à acheter, sans engagement ferme"
    ],
    "correctAnswer": 3,
    "explanation": "La lettre d'intention est un signal de demande ; le contrat ferme engage davantage."
  },
  {
    "module": 4,
    "question": "Quelle différence entre lettre d'intention et contrat de vente ?",
    "options": [
      "La lettre est plus contraignante que le contrat car elle est signée à l'avance",
      "Le contrat précise quantités, prix et dates et engage les deux parties",
      "Il n'y a aucune différence juridique entre les deux documents",
      "Le contrat n'existe que pour les produits exportés"
    ],
    "correctAnswer": 1,
    "explanation": "Un contrat de culture ou de vente fixe les engagements réciproques."
  },
  {
    "module": 4,
    "question": "Un porteur prévoit un CA de 54,4 M FCFA. Il a des lettres d'intention couvrant 38,1 M FCFA. Quelle part du CA est ainsi appuyée par des intentions d'achat ?",
    "options": [
      "Environ 30 %, en prenant le complément",
      "Environ 100 %, car toute lettre vaut vente",
      "Environ 70 %",
      "Environ 20 %, en divisant par le nombre de lettres"
    ],
    "correctAnswer": 2,
    "explanation": "38,1 ÷ 54,4 ≈ 0,70."
  },
  {
    "module": 4,
    "question": "Quel est le risque principal d'un acheteur unique représentant 80 % des ventes ?",
    "options": [
      "La dépendance : une renégociation, un retard de paiement ou son départ met le projet en danger",
      "Un excès de remises demandées à tous les autres clients",
      "Un coût de publicité plus élevé pour atteindre le marché",
      "Un risque purement fiscal sans lien avec la trésorerie"
    ],
    "correctAnswer": 0,
    "explanation": "Diversifier les clients limite le risque commercial."
  },
  {
    "module": 4,
    "question": "Un grossiste propose de payer à 60 jours. Le porteur vend 6 M FCFA par mois à ce client. Quel montant de créances clients le porteur finance-t-il en permanence ?",
    "options": [
      "Environ 6 M FCFA, soit un mois de ventes",
      "Environ 36 M FCFA, soit six mois de ventes",
      "Aucun montant, car la vente est faite",
      "Environ 12 M FCFA (deux mois de ventes)"
    ],
    "correctAnswer": 3,
    "explanation": "60 jours = 2 mois ; 2 × 6 = 12 M FCFA de BFR supplémentaire."
  },
  {
    "module": 4,
    "question": "Pour le porteur de l'exemple précédent, quelle mesure réduit le plus directement le besoin de financement ?",
    "options": [
      "Négocier un acompte à la commande ou raccourcir le délai de paiement",
      "Multiplier les photos du produit dans le dossier pour convaincre davantage l'acheteur",
      "Reporter la récolte de deux mois pour attendre le paiement du client concerné",
      "Supprimer le calendrier de production du plan afin d'alléger le dossier à déposer"
    ],
    "correctAnswer": 0,
    "explanation": "Un acompte ou un délai plus court réduit les créances et le BFR."
  },
  {
    "module": 4,
    "question": "Quel canal de vente est le mieux adapté à un gros volume d'oignon calibré ?",
    "options": [
      "La vente à l'unité au détail sur un étal personnel",
      "Le colportage porte à porte en petits sachets",
      "La vente en ligne de colis de 500 g",
      "Les grossistes, les centrales d'achat et la restauration collective"
    ],
    "correctAnswer": 3,
    "explanation": "Volume élevé = acheteurs capables d'absorber des lots importants."
  },
  {
    "module": 4,
    "question": "La vente directe aux ménages de petites quantités de produits frais est souvent :",
    "options": [
      "Toujours moins rentable que la vente à un grossiste",
      "Interdite pour les producteurs qui possèdent un hangar",
      "Bien payée, mais coûteuse en temps et en logistique pour de faibles volumes",
      "Réservée aux exploitations de plus de 100 ha"
    ],
    "correctAnswer": 2,
    "explanation": "Le prix au détail est plus élevé, mais les volumes sont faibles et les coûts de distribution importants."
  },
  {
    "module": 4,
    "question": "Le budget marketing doit apparaître dans le plan financier sous quelle forme ?",
    "options": [
      "Une ligne d'investissement amortie sur vingt ans",
      "Une ligne de charges (prospection, déplacements, échantillons) dans le compte de résultat",
      "Aucune ligne : le marketing est gratuit pour un agriculteur",
      "Une ligne de subvention d'exploitation reçue de l'État"
    ],
    "correctAnswer": 1,
    "explanation": "Prospecter coûte de l'argent : il faut le budgéter."
  },
  {
    "module": 4,
    "question": "Sur un CA de 54,4 M FCFA, un porteur dépense 1,6 M FCFA en prospection et promotion. Quelle part du CA cela représente-t-il ?",
    "options": [
      "Environ 30 %",
      "Environ 3 %",
      "Environ 0,3 %",
      "Environ 16 %"
    ],
    "correctAnswer": 1,
    "explanation": "1,6 ÷ 54,4 ≈ 0,029."
  },
  {
    "module": 4,
    "question": "Quel intérêt a un contrat de culture entre un producteur et un transformateur ?",
    "options": [
      "Obliger le producteur à vendre au prix le plus bas du marché",
      "Dispenser le transformateur de contrôler la qualité",
      "Garantir un débouché et un prix, souvent avec un appui en intrants",
      "Supprimer tout risque de mauvaise récolte"
    ],
    "correctAnswer": 2,
    "explanation": "Le contrat de culture sécurise le débouché ; le porteur doit rester attentif aux clauses de prix et de qualité."
  },
  {
    "module": 4,
    "question": "Un acheteur impose un prix inférieur au prix plancher du porteur. Quelle est la bonne décision ?",
    "options": [
      "Refuser ou négocier : vendre sous le plancher détruit la marge",
      "Accepter quand même, car un client vaut mieux qu'une vente perdue",
      "Augmenter les coûts de production pour réduire le prix de revient",
      "Cacher la perte dans le bilan de fin d'année"
    ],
    "correctAnswer": 0,
    "explanation": "Un prix plancher n'a de sens que s'il est respecté."
  },
  {
    "module": 4,
    "question": "Quel message de promotion convient à un producteur d'oignon stocké ?",
    "options": [
      "Un oignon moins cher que tous les autres, à tout moment de l'année",
      "Un oignon vendu uniquement à ceux qui connaissent personnellement le porteur",
      "Un oignon qui ne demande aucune qualité particulière",
      "Un oignon local, calibré et disponible hors saison, livré régulièrement"
    ],
    "correctAnswer": 3,
    "explanation": "Le message met en avant ce qui différencie : régularité, calibre, disponibilité."
  },
  {
    "module": 4,
    "question": "Dans le cas du poulet de chair au Togo, le CA de croisière est de 101,5 M FCFA. Pourquoi la prospection doit-elle viser des clients réguliers (restaurateurs, grossistes de volaille) ?",
    "options": [
      "Parce que le poulet peut attendre plusieurs semaines après l'abattage",
      "Parce qu'il n'y a pas de saisonnalité pour la demande de volaille, ni de concurrence",
      "Parce que seuls les restaurateurs peuvent acheter des poulets de chair",
      "Parce que les lots sont à date fixe et le produit se conserve peu : il faut des débouchés assurés"
    ],
    "correctAnswer": 3,
    "explanation": "Un lot de poulets vendu en retard continue à coûter de l'aliment : le débouché doit être prévu."
  },
  {
    "module": 4,
    "question": "Quelle erreur de présentation commerciale est la plus pénalisante dans un dossier ?",
    "options": [
      "Citer trois acheteurs potentiels avec leurs volumes estimés",
      "Mentionner un prix plancher et un prix cible",
      "Annoncer un marché immense sans clients nommés, sans volumes ni prix",
      "Présenter un calendrier de ventes mois par mois"
    ],
    "correctAnswer": 2,
    "explanation": "Un marché « immense » non documenté est un signal d'alerte pour un évaluateur."
  },
  {
    "module": 5,
    "question": "Dans le projet de poulet de chair au Togo, les immobilisations s'élèvent à 29,5 M FCFA et le BFR initial à 10,0 M FCFA. Quel est le coût du projet ?",
    "options": [
      "39,5 M FCFA",
      "29,5 M FCFA, en oubliant le BFR initial",
      "49,5 M FCFA, en ajoutant 20 M FCFA par erreur",
      "19,5 M FCFA, en soustrayant le BFR au lieu de l'ajouter"
    ],
    "correctAnswer": 0,
    "explanation": "Coût du projet = investissements + BFR initial (+ frais d'établissement) : 29,5 + 10,0 = 39,5."
  },
  {
    "module": 5,
    "question": "Le projet de poulet de chair coûte 39,5 M FCFA, avec un apport de 9,9 M FCFA. Quelle est la part de l'apport et le montant à emprunter ?",
    "options": [
      "Environ 10 % d'apport ; emprunt de 35,6 M FCFA",
      "Environ 25 % d'apport ; emprunt de 29,6 M FCFA",
      "Environ 50 % d'apport ; emprunt de 19,8 M FCFA",
      "Environ 25 % d'apport ; emprunt de 9,9 M FCFA"
    ],
    "correctAnswer": 1,
    "explanation": "9,9 ÷ 39,5 ≈ 25 % ; 39,5 − 9,9 = 29,6 M FCFA."
  },
  {
    "module": 5,
    "question": "Pour le projet d'attiéké en Côte d'Ivoire, le coût est de 70,7 M FCFA et l'apport de 21,2 M FCFA. Quelle part du financement le porteur apporte-t-il ?",
    "options": [
      "Environ 21 %, en prenant le montant comme pourcentage",
      "Environ 70 %, soit la part de l'emprunt",
      "Environ 3 %, en divisant par dix",
      "Environ 30 %"
    ],
    "correctAnswer": 3,
    "explanation": "21,2 ÷ 70,7 ≈ 0,30 ; l'emprunt est de 49,5 M FCFA, soit environ 70 %."
  },
  {
    "module": 5,
    "question": "Un tricycle coûte 4,5 M FCFA et s'amortit linéairement sur 5 ans. Quelle est sa valeur nette comptable à la fin de l'année 2 ?",
    "options": [
      "2,7 M FCFA",
      "0,9 M FCFA, soit une seule annuité d'amortissement",
      "3,6 M FCFA, soit la valeur après un seul amortissement",
      "1,8 M FCFA, soit le total des amortissements cumulés"
    ],
    "correctAnswer": 0,
    "explanation": "Amortissement annuel = 4,5 ÷ 5 = 0,9 ; valeur nette après 2 ans = 4,5 − 1,8 = 2,7."
  },
  {
    "module": 5,
    "question": "Diap prévoit 2,4 M FCFA d'imprévus sur 38,6 M FCFA d'investissements et de frais. Quel pourcentage de marge de sécurité cela représente-t-il ?",
    "options": [
      "Environ 24 %",
      "Environ 0,6 %",
      "Environ 6 %",
      "Environ 16 %"
    ],
    "correctAnswer": 2,
    "explanation": "2,4 ÷ 38,6 ≈ 0,062."
  },
  {
    "module": 5,
    "question": "Le BFR de Diap est de 14,0 M FCFA. Quels éléments le composent ?",
    "options": [
      "Investissements 26,0 + forage 12,0 + imprévus 2,4 − apport 11,0 − subvention 15,4",
      "Intrants 11,3 + journaliers 2,0 + salaires 2,7 + charges fixes 1,9 + sécurité 0,6 − crédit fournisseurs 4,5",
      "Chiffre d'affaires 54,4 − charges variables 18,1 − charges fixes 4,5 − personnel 6,5",
      "Emprunt 44,0 − apport 11,0 − remboursements 9,8 − intérêts 4,0 − impôt 5,2"
    ],
    "correctAnswer": 1,
    "explanation": "11,3 + 2,0 + 2,7 + 1,9 + 0,6 − 4,5 = 14,0 M FCFA."
  },
  {
    "module": 5,
    "question": "Les fournisseurs de Diap financent 40 % des intrants, qui coûtent 11,3 M FCFA. Quel est ce crédit fournisseurs, et que fait-il au BFR ?",
    "options": [
      "Environ 4,5 M FCFA ; il réduit le besoin à financer",
      "Environ 6,8 M FCFA ; il augmente le besoin à financer",
      "Environ 4,5 M FCFA ; il augmente le besoin à financer",
      "Environ 0,4 M FCFA ; il n'a aucun effet sur le BFR"
    ],
    "correctAnswer": 0,
    "explanation": "0,4 × 11,3 ≈ 4,5 ; plus les fournisseurs attendent d'être payés, moins le porteur finance de stock."
  },
  {
    "module": 5,
    "question": "Un projet a un BFR de 9 M FCFA pour un CA annuel de 54 M FCFA. Combien de jours de CA le BFR représente-t-il (année de 360 jours) ?",
    "options": [
      "6 jours",
      "60 jours",
      "90 jours",
      "30 jours"
    ],
    "correctAnswer": 1,
    "explanation": "9 ÷ 54 × 360 = 60 jours."
  },
  {
    "module": 5,
    "question": "Diap produit 69 t de pomme de terre vendues 230 F/kg. Quel est le CA correspondant ?",
    "options": [
      "Environ 1,6 M FCFA",
      "Environ 159 M FCFA",
      "Environ 15,9 M FCFA",
      "Environ 9,2 M FCFA"
    ],
    "correctAnswer": 2,
    "explanation": "69 000 kg × 230 F = 15 870 000 F ≈ 15,9 M FCFA."
  },
  {
    "module": 5,
    "question": "Un scénario pessimiste combine un rendement inférieur de 10 % et un prix inférieur de 10 % (volume vendu = rendement). Le CA est alors de combien de % du CA réaliste ?",
    "options": [
      "80 %, en additionnant simplement les deux baisses",
      "90 %, en ne retenant que la plus forte des deux",
      "100 %, car les deux effets se compensent",
      "81 %"
    ],
    "correctAnswer": 3,
    "explanation": "0,9 × 0,9 = 0,81 : les baisses se multiplient, elles ne s'additionnent pas."
  },
  {
    "module": 5,
    "question": "Le CA de croisière de Diap est de 54,4 M FCFA. Une crise de prix de −25 % le ramène à combien (volumes inchangés) ?",
    "options": [
      "29,4 M FCFA",
      "51,7 M FCFA",
      "40,8 M FCFA",
      "13,6 M FCFA"
    ],
    "correctAnswer": 2,
    "explanation": "54,4 × 0,75 = 40,8 ; la perte de CA est de 13,6 M FCFA."
  },
  {
    "module": 5,
    "question": "Diap en croisière : CA 54,4 ; charges variables 18,1 ; charges fixes 4,5 ; personnel 6,5. Quel est l'EBE ?",
    "options": [
      "36,3 M FCFA, en ne retirant que les charges variables",
      "25,3 M FCFA",
      "21,1 M FCFA, en retirant aussi les amortissements",
      "12,0 M FCFA, soit le résultat net"
    ],
    "correctAnswer": 1,
    "explanation": "54,4 − 18,1 − 4,5 − 6,5 = 25,3 M FCFA."
  },
  {
    "module": 5,
    "question": "Avec un EBE de 25,3 M FCFA et 4,2 M FCFA d'amortissements, quel est le résultat d'exploitation (REX) ?",
    "options": [
      "21,1 M FCFA",
      "29,5 M FCFA, en ajoutant les amortissements",
      "25,3 M FCFA, car les amortissements sont des charges non payées",
      "4,2 M FCFA, soit le montant des amortissements seuls"
    ],
    "correctAnswer": 0,
    "explanation": "REX = EBE − dotations aux amortissements = 25,3 − 4,2 = 21,1."
  },
  {
    "module": 5,
    "question": "En année de croisière, Diap a un résultat avant impôt de 17,1 M FCFA et un impôt de 30 %. Quel est son résultat net ?",
    "options": [
      "Environ 5,1 M FCFA, soit seulement l'impôt",
      "Environ 17,1 M FCFA, car l'IS est payé par l'acheteur",
      "Environ 14,4 M FCFA, en retirant 15 % au lieu de 30 %",
      "Environ 12,0 M FCFA"
    ],
    "correctAnswer": 3,
    "explanation": "IS = 30 % × 17,1 ≈ 5,1 ; résultat net = 17,1 − 5,1 = 12,0."
  },
  {
    "module": 5,
    "question": "Diap emprunte 44 M FCFA à 9 % avec un an de différé du capital. Quelle charge financière paie-t-il en année 1, et que remboursera-t-il ensuite ?",
    "options": [
      "Environ 4,0 M FCFA d'intérêts en année 1, puis une annuité d'environ 9,8 M FCFA par an",
      "Environ 9,8 M FCFA dès l'année 1, puis des remboursements décroissants",
      "Aucun paiement en année 1, puis 44 M FCFA en une fois à l'année 2",
      "Environ 4,0 M FCFA par an pendant toute la durée, capital compris"
    ],
    "correctAnswer": 0,
    "explanation": "44 × 9 % ≈ 4,0 ; le différé retarde le capital, pas les intérêts."
  },
  {
    "module": 5,
    "question": "Quel est le piège d'un différé de capital d'un an pour la trésorerie de l'année 2 ?",
    "options": [
      "Le différé augmente automatiquement le taux d'intérêt de toute la dette",
      "L'annuité complète démarre en année 2, avec l'exploitation encore en montée en charge",
      "Le différé annule les intérêts de l'année 1 par la banque",
      "Le différé est interdit pour les projets agricoles"
    ],
    "correctAnswer": 1,
    "explanation": "Un différé soulage l'année d'installation mais décale le poids de la dette."
  },
  {
    "module": 5,
    "question": "Un mois de trésorerie : solde initial 10 M FCFA, encaissements 20 M FCFA, décaissements 26 M FCFA. Quel est le solde final ?",
    "options": [
      "−4 M FCFA, en inversant l'ordre de la soustraction",
      "56 M FCFA, en additionnant tout",
      "4 M FCFA",
      "6 M FCFA, en oubliant le solde initial"
    ],
    "correctAnswer": 2,
    "explanation": "10 + 20 − 26 = 4."
  },
  {
    "module": 5,
    "question": "Un mois présente un solde initial de 3 M FCFA, des encaissements de 5 et des décaissements de 9. Que doit prévoir le porteur ?",
    "options": [
      "Un solde de +1 M FCFA : aucune action n'est nécessaire",
      "Un solde de −4 M FCFA : le compte est automatiquement remboursé",
      "Un solde de 17 M FCFA : il faut placer l'excédent",
      "Un solde de −1 M FCFA : il faut financer ce trou (découvert, report de dépense, apport)"
    ],
    "correctAnswer": 3,
    "explanation": "3 + 5 − 9 = −1. La trésorerie mensuelle sert à repérer ces mois critiques, même si le résultat annuel est positif."
  },
  {
    "module": 5,
    "question": "Au bilan de Diap en fin d'année 1 : immobilisations nettes 36,8 ; créances 2,0 ; actif total 65,0. Quel est le montant des disponibilités ?",
    "options": [
      "28,2 M FCFA, en oubliant les créances",
      "65,0 M FCFA, soit le total de l'actif",
      "26,2 M FCFA",
      "36,8 M FCFA, soit les immobilisations"
    ],
    "correctAnswer": 2,
    "explanation": "65,0 − 36,8 − 2,0 = 26,2 M FCFA."
  },
  {
    "module": 5,
    "question": "Un projet a des coûts fixes totaux de 12 M FCFA et un taux de marge sur coûts variables de 40 %. Quel est son seuil de rentabilité en chiffre d'affaires ?",
    "options": [
      "4,8 M FCFA, en multipliant au lieu de diviser",
      "12 M FCFA, soit les coûts fixes seuls",
      "52 M FCFA, en additionnant coûts fixes et marge",
      "30 M FCFA"
    ],
    "correctAnswer": 3,
    "explanation": "Seuil = coûts fixes ÷ taux de marge = 12 ÷ 0,40 = 30."
  },
  {
    "module": 5,
    "question": "Le seuil de rentabilité de Diap est de 28,8 M FCFA pour un CA de croisière de 54,4 M FCFA. Que signifie ce résultat ?",
    "options": [
      "Le CA doit baisser de 53 % pour que le projet atteigne la rentabilité",
      "Le CA peut baisser d'environ 47 % avant que le projet ne perde de l'argent",
      "Le projet est déjà en perte, car le seuil est inférieur au CA",
      "Le projet est rentable seulement s'il double son CA"
    ],
    "correctAnswer": 1,
    "explanation": "(54,4 − 28,8) ÷ 54,4 ≈ 47 % de marge de sécurité."
  },
  {
    "module": 5,
    "question": "Dans le cas du poulet de chair au Togo, le seuil est de 57,4 M FCFA pour un CA de 101,5 M FCFA. Quelle est la marge de sécurité ?",
    "options": [
      "Environ 43 %, plus étroite que celle d'une culture à forte marge",
      "Environ 57 %, comme le seuil rapporté au CA",
      "Environ 90 %, car le seuil est très bas",
      "Environ 4 %, car le projet est tout juste rentable"
    ],
    "correctAnswer": 0,
    "explanation": "1 − 57,4 ÷ 101,5 ≈ 0,43 : la marge sur coûts variables n'est que de 23 %, donc très sensible au prix."
  },
  {
    "module": 5,
    "question": "Poulet de chair : CA 101,5 M FCFA, charges variables 78,1 M FCFA. Si le prix baisse de 10 % sans que les charges variables ne changent, que devient la marge sur coûts variables ?",
    "options": [
      "Elle passe de 23,4 à environ 21,1 M FCFA, soit −10 %",
      "Elle reste à 23,4 M FCFA car les coûts n'ont pas changé",
      "Elle passe de 23,4 à environ 13,3 M FCFA, presque −43 %",
      "Elle passe de 23,4 à environ 0 M FCFA, soit −100 %"
    ],
    "correctAnswer": 2,
    "explanation": "101,5 × 0,9 = 91,35 ; 91,35 − 78,1 ≈ 13,3 : une baisse de 10 % du prix coupe presque la moitié de la marge."
  },
  {
    "module": 5,
    "question": "Un projet dégage un EBE de 15 M FCFA et paie 3 M FCFA d'impôt. L'annuité de la dette est de 6 M FCFA. Quel est son DSCR ?",
    "options": [
      "0,5",
      "2,0",
      "2,5",
      "3,0"
    ],
    "correctAnswer": 1,
    "explanation": "DSCR = flux disponible ÷ service de la dette = (15 − 3) ÷ 6 = 2,0."
  },
  {
    "module": 5,
    "question": "Dans le projet de poulet de chair, le DSCR de l'année 2 est de 0,66 en scénario de crise, pour une annuité de 6,6 M FCFA. Que signifie ce résultat ?",
    "options": [
      "Les flux (environ 4,4) ne couvrent pas l'annuité : il manquerait environ 2,2 M FCFA",
      "Les flux couvrent une fois et demie l'annuité : la banque sera rassurée",
      "Les flux équivalent exactement à l'annuité : aucune marge de manœuvre",
      "Le DSCR est trop bas pour être pris en compte : il faut l'ignorer"
    ],
    "correctAnswer": 0,
    "explanation": "0,66 × 6,6 ≈ 4,4 ; 6,6 − 4,4 ≈ 2,2 : sous 1, la dette n'est pas remboursée par l'exploitation."
  },
  {
    "module": 5,
    "question": "Le flux de Diap est de −55 en année 0, puis 13,3 ; 19,0 ; 19,0 ; 19,0. Au bout de combien d'années l'investissement est-il récupéré (payback) ?",
    "options": [
      "Environ 2,0 ans",
      "Environ 4,0 ans",
      "Environ 1,0 an",
      "Environ 3,2 ans"
    ],
    "correctAnswer": 3,
    "explanation": "Cumul après 3 ans : −55 + 13,3 + 19,0 + 19,0 = −3,7 ; il faut 3,7 ÷ 19,0 ≈ 0,2 an de plus."
  },
  {
    "module": 5,
    "question": "Un investissement de 100 rapporte 60 en année 1 et 60 en année 2. Avec un taux d'actualisation de 10 %, la VAN est :",
    "options": [
      "Positive, d'environ +4,1",
      "Négative, d'environ −4,1",
      "Nulle, car 60 + 60 = 120 > 100",
      "Positive, d'environ +20, soit 120 − 100"
    ],
    "correctAnswer": 0,
    "explanation": "60 ÷ 1,10 + 60 ÷ 1,21 ≈ 54,5 + 49,6 = 104,1 ; 104,1 − 100 ≈ +4,1. Il faut actualiser les flux."
  },
  {
    "module": 5,
    "question": "Dans le projet d'attiéké, le scénario pessimiste donne une VAN de −5,8 M FCFA et un TRI de 7,5 %, pour un taux d'actualisation de 10 %. Que conclure ?",
    "options": [
      "Le projet est excellent, car le TRI est positif",
      "Le projet rapporte moins que le taux exigé : il détruit de la valeur",
      "Le projet est neutre, car un TRI de 7,5 % est proche de 10 %",
      "La VAN négative prouve une erreur de calcul à corriger"
    ],
    "correctAnswer": 1,
    "explanation": "TRI < taux d'actualisation ⇔ VAN < 0 : le résultat dépend de la solidité des hypothèses prudentes."
  },
  {
    "module": 6,
    "question": "Pourquoi un porteur doit-il parler des risques de son projet dans le business plan ?",
    "options": [
      "Parce que la loi oblige à lister au moins dix risques dans tout dossier agricole",
      "Parce que les risques réduisent le montant du prêt demandé automatiquement",
      "Parce que les banques ne financent que les projets sans aucun risque identifié",
      "Parce qu'un banquier sait que l'agriculture est risquée : se taire fait passer pour naïf"
    ],
    "correctAnswer": 3,
    "explanation": "Lister les risques et leur réponse (mitigation) rassure plus qu'un silence."
  },
  {
    "module": 6,
    "question": "Qu'est-ce que la « mitigation » d'un risque ?",
    "options": [
      "La suppression complète du risque par l'État grâce à une subvention",
      "Le transfert automatique du risque à la banque qui finance le projet",
      "Une action concrète, de préférence chiffrée, qui réduit la probabilité ou l'impact",
      "Le fait d'ignorer volontairement un risque jugé peu probable"
    ],
    "correctAnswer": 2,
    "explanation": "Chaque risque identifié appelle une réponse précise (équipement de secours, stockage, assurance, formation…)."
  },
  {
    "module": 6,
    "question": "Pour la pompe solaire de Diap, quelle mitigation est citée dans le cas ?",
    "options": [
      "Un arrêt de la culture jusqu'à la réparation du matériel",
      "Un recours systématique à l'irrigation par la pluie",
      "Un contrat d'assurance qui rembourse la panne de la pompe",
      "Une motopompe de secours au diesel en cas de panne"
    ],
    "correctAnswer": 3,
    "explanation": "Un équipement de secours (backup) est une mitigation technique concrète."
  },
  {
    "module": 6,
    "question": "Dans la matrice de risques, comment calcule-t-on le score d'un risque ?",
    "options": [
      "Probabilité additionnée à l'impact, divisée par deux",
      "Probabilité (1 à 3) multipliée par impact (1 à 3)",
      "Impact seul, sans tenir compte de la probabilité",
      "Coût du risque divisé par le chiffre d'affaires de l'année"
    ],
    "correctAnswer": 1,
    "explanation": "Le score va de 1 à 9 ; il aide à choisir quoi traiter d'abord."
  },
  {
    "module": 6,
    "question": "Un risque a une probabilité de 3 et un impact de 3. Quel est son score et comment le traiter ?",
    "options": [
      "6 : à traiter après les risques de score 2",
      "3 : sans conséquence, à ignorer",
      "9 : traitement prioritaire",
      "9 : à traiter seulement si le budget le permet"
    ],
    "correctAnswer": 2,
    "explanation": "3 × 3 = 9 ; les scores à partir de 6 sont traités d'abord."
  },
  {
    "module": 6,
    "question": "Quels risques ont un score de 6 ou plus dans cette liste : (a) probabilité 2 × impact 3, (b) probabilité 1 × impact 2, (c) probabilité 2 × impact 1, (d) probabilité 3 × impact 2 ?",
    "options": [
      "(a) et (d)",
      "(a) et (b)",
      "(b) et (c)",
      "(c) et (d)"
    ],
    "correctAnswer": 0,
    "explanation": "(a) = 6 ; (b) = 2 ; (c) = 2 ; (d) = 6."
  },
  {
    "module": 6,
    "question": "Parmi ces risques, lequel est souvent oublié dans les projets agricoles ?",
    "options": [
      "Le risque de crédit client : un grossiste qui paie en retard",
      "Le risque de soleil trop agréable pendant la saison de récolte",
      "Le risque que les concurrents augmentent leurs salaires",
      "Le risque que les clients refusent un emballage de couleur rouge"
    ],
    "correctAnswer": 0,
    "explanation": "Le risque de crédit client pèse directement sur la trésorerie."
  },
  {
    "module": 6,
    "question": "Un porteur importe ses semences en devise étrangère. Quel risque supplémentaire faut-il coter ?",
    "options": [
      "Le risque de sécheresse, car les semences importées ont besoin d'eau",
      "Le risque de fidélisation des salariés saisonniers",
      "Le risque de change : une hausse de la devise renchérit les intrants",
      "Aucun risque, car l'importation de semences est libre de tout coût"
    ],
    "correctAnswer": 2,
    "explanation": "Les intrants importés exposent à la variation des taux de change."
  },
  {
    "module": 6,
    "question": "À quoi sert l'assurance agricole dans le dossier de financement ?",
    "options": [
      "Elle garantit un bénéfice même en l'absence de récolte",
      "L'une des mitigations les plus appréciées, à condition de budgéter la prime",
      "Elle dispense de tout autre plan de gestion des risques",
      "Elle remplace l'apport personnel du porteur auprès de la banque"
    ],
    "correctAnswer": 1,
    "explanation": "Diap prévoit environ 0,9 M FCFA par an de prime, dans ses charges fixes."
  },
  {
    "module": 6,
    "question": "La prime annuelle d'assurance de Diap est d'environ 0,9 M FCFA pour un CA de croisière de 54,4 M FCFA. Quelle part du CA cela représente-t-il ?",
    "options": [
      "Environ 17 %",
      "Environ 0,17 %",
      "Environ 9 %",
      "Environ 1,7 %"
    ],
    "correctAnswer": 3,
    "explanation": "0,9 ÷ 54,4 ≈ 0,0165."
  },
  {
    "module": 6,
    "question": "Où se place l'Executive Summary dans le dossier, et quand l'écrit-on ?",
    "options": [
      "Au début du dossier, mais écrit en dernier, puisqu'il résume tous les chapitres",
      "À la fin du dossier, et on l'écrit en premier pour cadrer le travail",
      "Au début du dossier, et on l'écrit avant toute étude de marché",
      "En annexe, et on l'écrit après le dépôt de la demande"
    ],
    "correctAnswer": 0,
    "explanation": "Résumé du plan : placé en tête, rédigé en dernier."
  },
  {
    "module": 6,
    "question": "Quelle longueur convient à un Executive Summary ?",
    "options": [
      "Une demi-page pour tout le projet",
      "Dix pages détaillant chaque calcul",
      "Une à deux pages",
      "Un paragraphe de deux lignes"
    ],
    "correctAnswer": 2,
    "explanation": "Il doit être lu en entier par les décideurs, donc court et dense."
  },
  {
    "module": 6,
    "question": "Quels éléments doivent obligatoirement figurer dans l'Executive Summary ?",
    "options": [
      "Le détail complet de l'itinéraire technique et des fiches de paie",
      "Uniquement la biographie du porteur de projet",
      "La liste de toutes les annexes avec leur numéro de page",
      "L'opportunité, le marché, l'équipe, le montant demandé, l'apport et la rentabilité"
    ],
    "correctAnswer": 3,
    "explanation": "Qui, quoi, où, comment, combien : l'essentiel de la décision."
  },
  {
    "module": 6,
    "question": "Quelle phrase d'Executive Summary est la plus convaincante ?",
    "options": [
      "« Nous cherchons un financement conséquent pour un projet très prometteur et rentable à moyen terme »",
      "« Nous sollicitons 44,0 M FCFA ; apport 11,0 M FCFA (20 %) ; dette couverte 2,0 fois en réaliste, 1,2 fois en pessimiste »",
      "« Le porteur est passionné et motivé par l'agriculture depuis son enfance, avec beaucoup d'énergie »",
      "« Le marché est immense et sans aucun concurrent, la réussite du projet est donc garantie »"
    ],
    "correctAnswer": 1,
    "explanation": "Des chiffres précis, issus du modèle financier, et un scénario prudent."
  },
  {
    "module": 6,
    "question": "Quelles pièces justificatives place-t-on utilement en annexe ?",
    "options": [
      "Les photos de famille du porteur et ses diplômes scolaires de primaire",
      "Lettres d'intention, titre foncier ou bail, devis, CV de l'équipe, tableaux détaillés",
      "Un seul document : le tableau de trésorerie du premier mois",
      "Des articles de presse sur l'agriculture mondiale sans lien avec le projet"
    ],
    "correctAnswer": 1,
    "explanation": "Les annexes prouvent ce que le texte affirme."
  },
  {
    "module": 6,
    "question": "Pourquoi joindre des devis fournisseurs pour les investissements ?",
    "options": [
      "Pour contraindre le porteur à n'acheter que chez ces fournisseurs pendant toute la durée du prêt",
      "Pour dispenser le porteur de prévoir des imprévus dans son plan d'investissement",
      "Pour prouver que les prix du matériel baisseront dans les années suivant l'achat",
      "Pour justifier les montants par des prix vérifiables"
    ],
    "correctAnswer": 3,
    "explanation": "Un montant sans devis est une estimation ; un devis le rend vérifiable."
  },
  {
    "module": 6,
    "question": "Comment structurer un pitch oral devant un comité de financement ?",
    "options": [
      "Un problème, une solution, un marché, l'équipe, les chiffres, le besoin de financement, en peu de diapositives",
      "Cinquante diapositives détaillant chaque ligne du bilan et chaque variété cultivée sur l'exploitation",
      "Uniquement des photos de l'exploitation, sans aucun chiffre ni explication de la demande",
      "Une lecture du business plan page par page, sans diapositive ni temps de questions"
    ],
    "correctAnswer": 0,
    "explanation": "Le pitch donne envie de lire le dossier ; le détail reste dans le plan."
  },
  {
    "module": 6,
    "question": "Un membre du jury demande : « Que se passe-t-il si les prix baissent de 25 % ? » Quelle est la meilleure réponse de Diap ?",
    "options": [
      "« Cela n'arrivera pas, car les prix de l'oignon ne baissent jamais sur les marchés de gros »",
      "« Je ne sais pas, je n'ai pas préparé de scénario de crise pour la présentation de ce jour »",
      "« Le CA passerait de 54,4 à 40,8 M FCFA et le DSCR de l'année 2 serait de 1,08, avec stockage et vente différée »",
      "« Dans ce cas, la banque devra réduire elle-même le taux d'intérêt de la dette contractée »"
    ],
    "correctAnswer": 2,
    "explanation": "Un scénario de crise préparé se chiffre et s'accompagne d'une réponse."
  },
  {
    "module": 6,
    "question": "Dans le dossier de Diap, les DSCR de l'année 2 sont de 2,05 (réaliste), 1,21 (pessimiste) et 1,08 (crise). Que montre cette série ?",
    "options": [
      "Que la dette n'est remboursée dans aucun scénario, quelles que soient les hypothèses retenues",
      "Que le scénario de crise est meilleur que le scénario réaliste pour le remboursement",
      "Que la dette reste couverte dans les trois scénarios, avec une marge qui fond en cas de crise",
      "Que le DSCR ne dépend pas des hypothèses de prix et de rendement du plan financier"
    ],
    "correctAnswer": 2,
    "explanation": "Un DSCR supérieur à 1 signifie que les flux couvrent l'annuité ; plus il s'en approche, plus le projet est fragile."
  },
  {
    "module": 6,
    "question": "Quels résultats de VAN (à 10 %) pour Diap en réaliste, pessimiste et crise ?",
    "options": [
      "+33,0 ; +33,0 ; +33,0, car la VAN ne dépend pas du scénario",
      "+33,0 ; +2,6 ; −2,0 (en M FCFA)",
      "−33,0 ; −2,6 ; −2,0, car la VAN est toujours négative",
      "+2,6 ; +33,0 ; +2,0, car le scénario pessimiste est le meilleur"
    ],
    "correctAnswer": 1,
    "explanation": "La VAN baisse à mesure que les hypothèses deviennent défavorables."
  },
  {
    "module": 6,
    "question": "Pour Diap, le TRI est de 26,9 % en réaliste et de 9,0 % en crise, avec un taux d'actualisation de 10 %. Que peut-on en dire ?",
    "options": [
      "Rentable dans les deux scénarios, car les deux TRI sont positifs",
      "Non rentable dans les deux scénarios, car 9,0 % est inférieur à 26,9 %",
      "Le TRI ne permet pas de comparer les scénarios",
      "Très rentable en réaliste ; en crise, un peu moins que le taux exigé"
    ],
    "correctAnswer": 3,
    "explanation": "TRI de 9,0 % < 10 % : VAN légèrement négative (−2,0)."
  },
  {
    "module": 6,
    "question": "Dans le projet d'attiéké, la VAN à 10 % est de +28,7 en réaliste et −23,4 en crise. Quel message transmettre au financeur ?",
    "options": [
      "Le projet est très sensible aux hypothèses : sécuriser prix et approvisionnement, prévoir un repli",
      "Le projet est sans risque, car la VAN réaliste est positive",
      "Le projet est à abandonner, car une seule VAN est négative",
      "Les scénarios ne servent à rien, car le réaliste suffit pour décider"
    ],
    "correctAnswer": 0,
    "explanation": "La transparence sur la sensibilité est un signe de maîtrise ; elle appelle des mesures concrètes."
  },
  {
    "module": 6,
    "question": "Un dossier annonce un CA de 80 M FCFA dans le résumé et 72 M FCFA dans le tableau financier. Quelle conséquence ?",
    "options": [
      "Aucune conséquence, car un résumé est toujours plus optimiste qu'un tableau",
      "Une preuve de rigueur, car les deux chiffres sont différents",
      "Une erreur sans importance, car personne ne lit les tableaux",
      "Une incohérence qui détruit la crédibilité : tous les chiffres doivent venir d'une même source"
    ],
    "correctAnswer": 3,
    "explanation": "Le résumé reprend les chiffres du modèle financier ; toute contradiction fait douter du reste."
  },
  {
    "module": 6,
    "question": "Quel est l'objectif d'un plan d'action à 90 jours après le dépôt du dossier ?",
    "options": [
      "Montrer les premières étapes concrètes : démarches, achats, recrutement, clients",
      "Promettre que le projet atteindra sa pleine production dans 90 jours",
      "Remplacer le calendrier d'installation de l'année 0",
      "Retarder le déblocage des fonds de trois mois"
    ],
    "correctAnswer": 0,
    "explanation": "Un plan d'action concret prouve la capacité d'exécution."
  },
  {
    "module": 6,
    "question": "Avant de remettre le dossier, quelle vérification est la plus importante ?",
    "options": [
      "Vérifier que la couverture est de la couleur préférée du directeur de la banque",
      "Que résumé, textes et tableaux donnent les mêmes chiffres, et que emplois = ressources",
      "Supprimer les scénarios pessimistes pour ne pas inquiéter le lecteur",
      "Remplacer tous les chiffres par des pourcentages arrondis à la dizaine"
    ],
    "correctAnswer": 1,
    "explanation": "Cohérence et équilibre du plan de financement : emplois = ressources."
  },
  {
    "module": 6,
    "question": "Un dossier mentionne un projet de 39,5 M FCFA avec 9,9 M FCFA d'apport et 28,0 M FCFA d'emprunt. Que faut-il en conclure ?",
    "options": [
      "Le plan est équilibré, car 9,9 + 28,0 = 39,5",
      "Le plan est équilibré, car l'emprunt est supérieur à l'apport",
      "Les ressources (37,9) ne couvrent pas les emplois (39,5) : il manque 1,6 M FCFA",
      "Le plan a un excédent de 1,6 M FCFA qu'il faudra placer"
    ],
    "correctAnswer": 2,
    "explanation": "9,9 + 28,0 = 37,9 ≠ 39,5 : emplois = ressources est la règle de base."
  },
  {
    "module": 6,
    "question": "Après dépôt, la banque demande un complément d'information. Quelle attitude est la plus professionnelle ?",
    "options": [
      "Ignorer la demande tant que le dossier n'est pas rejeté",
      "Répondre vite, avec des pièces datées et sourcées, et mettre à jour le plan si besoin",
      "Modifier discrètement les chiffres pour répondre à la question sans prévenir",
      "Envoyer un nouveau dossier complet sans lien avec le premier"
    ],
    "correctAnswer": 1,
    "explanation": "La réactivité et la transparence renforcent la confiance."
  },
  {
    "module": 6,
    "question": "Que faut-il faire du business plan une fois le financement obtenu ?",
    "options": [
      "L'utiliser pour piloter : comparer chaque mois le réalisé au prévu",
      "L'archiver définitivement, car il a rempli son rôle",
      "Le publier tel quel sur internet pour attirer des concurrents",
      "Le détruire pour protéger la confidentialité du projet"
    ],
    "correctAnswer": 0,
    "explanation": "Le plan reste une feuille de route : c'est sa fonction de pilotage."
  }
];
