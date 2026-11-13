// FICHIER GÉNÉRÉ par scripts/quiz_bp_agricole/build.mjs — ne pas modifier à la main.
// Banque de questions du parcours « Business plan agricole » : 6 questions ou plus par leçon,
// 4 tirées au hasard à chaque tentative (voir src/lib/formations/quiz.server.ts).
import { QuizQuestion } from './types';

export const QUIZ: Record<string, QuizQuestion[]> = {
  "lec_1_1": [
    {
      "question": "Un porteur affirme : « Mon plan ne contient que des hypothèses favorables, donc mon projet est viable. » Que lui répondre ?",
      "options": [
        "Il a raison : plus les hypothèses sont favorables, plus la banque est rassurée sur la rentabilité",
        "Il a raison tant que les chiffres du compte de résultat sont positifs chaque année",
        "Il ne prouve rien : un bon plan identifie ses risques et dit comment les gérer",
        "Il a tort seulement si le projet est situé dans une zone sujette aux sécheresses"
      ],
      "correctAnswer": 2,
      "explanation": "L'optimisme non justifié est le piège le plus fréquent : un évaluateur expérimenté le repère en quelques minutes et s'en méfie."
    },
    {
      "question": "Parmi les trois fonctions d'un business plan, laquelle consiste à comparer chaque mois le prévu au réel pour corriger le tir ?",
      "options": [
        "L'outil de pilotage, qui sert de feuille de route une fois le projet lancé",
        "L'outil de réflexion, qui sert à valider l'idée avant d'engager son argent",
        "L'outil de négociation, qui sert à convaincre un financeur de soutenir le projet",
        "L'outil de communication, qui sert à faire connaître l'entreprise aux clients"
      ],
      "correctAnswer": 0,
      "explanation": "Réflexion, pilotage, négociation : le pilotage consiste à suivre l'écart entre prévisionnel et réalisé."
    },
    {
      "question": "Pourquoi rédiger un business plan est-il utile au porteur de projet lui-même, avant tout financeur ?",
      "options": [
        "Il garantit l'obtention du financement dès que le document est complet et bien présenté",
        "Il dispense de faire une étude de marché, puisque les chiffres y figurent déjà",
        "Il remplace le contrat de bail ou le titre foncier pour sécuriser la terre",
        "Il oblige à répondre par écrit aux questions que l'on évitait, avant d'engager son argent"
      ],
      "correctAnswer": 3,
      "explanation": "C'est d'abord un exercice de recherche et de validation d'informations : on apprécie la viabilité avant d'investir."
    },
    {
      "question": "Laquelle de ces contraintes est propre à un business plan agricole, par rapport à un commerce ou un service ?",
      "options": [
        "L'obligation d'avoir au moins dix salariés pour être éligible à un financement bancaire",
        "Des cycles longs avant la première récolte et une saisonnalité qui pèse sur la trésorerie",
        "L'impossibilité de prévoir des ventes, puisque tout dépend uniquement du hasard",
        "L'interdiction d'utiliser un apport personnel pour financer le démarrage de l'activité"
      ],
      "correctAnswer": 1,
      "explanation": "Climat, cycles longs, saisonnalité et foncier distinguent le plan agricole des autres."
    },
    {
      "question": "Dans le cas Diap Touré, quel est le montant total du financement recherché et sa composition ?",
      "options": [
        "55 millions de FCFA : 11 millions d'apport personnel (20 %) et 44 millions d'emprunt",
        "55 millions de FCFA : 44 millions d'apport personnel et 11 millions d'emprunt bancaire",
        "44 millions de FCFA, entièrement financés par l'emprunt auprès d'une seule banque",
        "11 millions de FCFA, financés par une subvention sans apport du porteur du projet"
      ],
      "correctAnswer": 0,
      "explanation": "Le coût du projet est de 55,0 M FCFA : apport 11,0 (20 %) et emprunt 44,0."
    },
    {
      "question": "Un évaluateur voit qu'un dossier agricole ne mentionne ni risque climatique ni risque de prix. Quelle est sa réaction la plus probable ?",
      "options": [
        "Il y voit un gage de confiance du porteur, signe que le projet est maîtrisé de bout en bout",
        "Il ne s'en préoccupe pas, car seuls les chiffres de rentabilité comptent dans l'analyse",
        "Il doute du réalisme du dossier, car aucune activité agricole n'est exempte de ces risques",
        "Il demande uniquement un devis supplémentaire pour le matériel d'irrigation prévu"
      ],
      "correctAnswer": 2,
      "explanation": "Un dossier sans risques identifiés perd en crédibilité : c'est la nature même d'un bon plan de les nommer et de les traiter."
    }
  ],
  "lec_1_2": [
    {
      "question": "Quelle est la bonne succession des quatre temps pour rédiger le contexte et la justification d'un projet ?",
      "options": [
        "Moyens mis en œuvre, constat général, solution proposée, puis problématique identifiée",
        "Solution proposée, moyens mis en œuvre, problématique identifiée, puis constat général",
        "Problématique identifiée, moyens mis en œuvre, constat général, puis solution proposée",
        "Constat général, problématique identifiée, solution proposée, puis moyens mis en œuvre"
      ],
      "correctAnswer": 3,
      "explanation": "On va du général au particulier : constat, problème, solution, moyens."
    },
    {
      "question": "Parmi ces phrases d'un contexte, laquelle est la mieux formulée ?",
      "options": [
        "« L'agriculture est très importante pour le développement de notre pays et de notre continent. »",
        "« La production d'oignon dépasse 400 000 t en 2024, mais jusqu'à 100 000 t se perdent faute de stockage. »",
        "« Beaucoup de gens consomment des légumes et le marché sera forcément porteur pour nous. »",
        "« Le pays a besoin de produire davantage et mon projet va contribuer à cet objectif noble. »"
      ],
      "correctAnswer": 1,
      "explanation": "Un constat chiffré, sourcé et précis vaut mieux qu'une généralité : il prouve la connaissance du secteur."
    },
    {
      "question": "Quel problème précis le projet de Diap Touré cherche-t-il à résoudre ?",
      "options": [
        "Le manque de variétés d'oignon adaptées au climat, qui limite les rendements à l'hectare",
        "L'absence totale de consommateurs d'oignon sur les marchés urbains de la région de Dakar",
        "Le coût trop élevé de la main-d'œuvre qui rend toute culture maraîchère non rentable",
        "Toute la récolte arrive en même temps faute de séchage et de stockage, et les prix chutent"
      ],
      "correctAnswer": 3,
      "explanation": "La solution du projet est justement un hangar pour étaler les ventes sur la campagne."
    },
    {
      "question": "Quel objectif est correctement formulé pour un business plan ?",
      "options": [
        "« Produire davantage d'oignon dans les années à venir pour mieux servir nos clients. »",
        "« Devenir une grande entreprise agricole reconnue dans toute la sous-région d'Afrique. »",
        "« Atteindre 176 t d'oignon sur 7 ha dès l'année 3, avec un hangar opérationnel. »",
        "« Améliorer progressivement la qualité de nos produits et la satisfaction des clients. »"
      ],
      "correctAnswer": 2,
      "explanation": "Un objectif se pilote s'il est chiffré et daté ; « produire davantage » ne se mesure pas."
    },
    {
      "question": "Pourquoi distinguer des objectifs à court terme et à long terme ?",
      "options": [
        "Les premiers visent l'année 1 (surface, volume, CA), les seconds la trajectoire à 3-5 ans",
        "Les premiers servent à la banque et les seconds au porteur, qui n'a pas à les chiffrer",
        "Les seconds remplacent les premiers dès que la première campagne est terminée",
        "Les deux types doivent être identiques pour que le dossier paraisse cohérent aux évaluateurs"
      ],
      "correctAnswer": 0,
      "explanation": "Court et long terme se complètent : l'un cadre le démarrage, l'autre la vision."
    },
    {
      "question": "Dans la méthode en quatre temps, que doit contenir la partie « moyens mis en œuvre » ?",
      "options": [
        "Les chiffres du marché mondial et les statistiques nationales de production agricole",
        "La façon concrète de réaliser la solution : financement, expérience du porteur, équipements",
        "La description du problème rencontré par les petits producteurs de la filière visée",
        "La liste des concurrents et leurs prix de vente moyens sur les marchés de gros"
      ],
      "correctAnswer": 1,
      "explanation": "Les moyens répondent à la question « comment allez-vous réaliser cette solution ? »."
    }
  ],
  "lec_1_3": [
    {
      "question": "Pourquoi un bailleur lit-il avec attention la section « porteur de projet » ?",
      "options": [
        "Elle sert uniquement à vérifier l'identité du porteur et son âge pour des raisons administratives",
        "Elle remplace l'étude de marché lorsque le porteur est déjà connu dans sa région",
        "Il finance une idée portée par une personne : il doit pouvoir lui faire confiance pour la mener à terme",
        "Elle permet de calculer automatiquement le montant maximal de prêt que la banque accordera"
      ],
      "correctAnswer": 2,
      "explanation": "La confiance dans le porteur est un critère décisif de financement."
    },
    {
      "question": "Diap Touré est informaticien de formation. Comment présenter ce parcours atypique ?",
      "options": [
        "Le passer sous silence, puisqu'il n'a aucun rapport direct avec l'activité agricole du projet",
        "Le présenter comme un handicap à compenser par l'embauche d'un directeur plus expérimenté",
        "Mettre en avant uniquement son diplôme pour impressionner l'évaluateur sur le plan académique",
        "L'expliquer comme un atout : expérience de terrain et compétences de gestion au service du projet"
      ],
      "correctAnswer": 3,
      "explanation": "Un parcours atypique n'est pas un handicap si l'on explique en quoi il sert le projet."
    },
    {
      "question": "Parmi les quatre familles de compétences de la leçon, où classer « négociation avec les clients et suivi des commandes » ?",
      "options": [
        "Dans les compétences techniques (fixer les objectifs, organiser, coordonner la réalisation)",
        "Dans les compétences commerciales (négociation, prospection, suivi client)",
        "Dans les compétences de gestion (planifier, diriger, gérer les délais et la qualité)",
        "Dans les compétences transversales (travailler en réseau, s'adapter, apprendre vite)"
      ],
      "correctAnswer": 1,
      "explanation": "Quatre familles : techniques, gestion, commerciales, transversales."
    },
    {
      "question": "Un porteur sait qu'il manque de compétences en comptabilité. Que doit-il faire dans son dossier ?",
      "options": [
        "Le dire et expliquer comment il le comblera (recrutement, partenaire, formation)",
        "Ne pas en parler, pour ne pas donner de raison de refus au comité d'évaluation du dossier",
        "Affirmer qu'il maîtrise tous les domaines, afin de paraître plus crédible auprès des financeurs",
        "Renoncer à présenter le projet tant qu'il n'a pas acquis lui-même toutes les compétences"
      ],
      "correctAnswer": 0,
      "explanation": "Nommer ses contraintes et les compenser est un signe de maturité ; prétendre n'avoir aucune faiblesse est moins crédible."
    },
    {
      "question": "Que faut-il présenter si le projet réunit plusieurs associés ?",
      "options": [
        "Uniquement le curriculum vitae du plus âgé des associés, qui représente le groupe devant la banque",
        "Les statuts complets de l'entreprise, sans aucune explication sur le rôle de chacun des associés",
        "Une liste des fournisseurs de chaque associé pour montrer l'étendue de leurs réseaux respectifs",
        "La répartition des tâches et celle du capital social entre associés (apport financier, en nature)"
      ],
      "correctAnswer": 3,
      "explanation": "Un organigramme simple et la répartition du capital suffisent à ce stade."
    },
    {
      "question": "Quelle formulation de motivation donne le plus de cohérence au projet ?",
      "options": [
        "Un simple objectif de gagner rapidement beaucoup d'argent sans lien avec le territoire visé",
        "Une conviction liée au projet : valoriser sa région, créer de l'emploi pour les jeunes",
        "Une motivation vague, du type « je veux entreprendre parce que c'est à la mode »",
        "Aucune motivation : un dossier sérieux ne doit contenir que des données chiffrées"
      ],
      "correctAnswer": 1,
      "explanation": "Les motivations les plus solides ne sont pas seulement financières."
    },
    {
      "question": "Quelle formulation de preuve rend une compétence crédible dans la fiche porteur de projet ?",
      "options": [
        "Un élément vérifiable : diplôme, expérience chiffrée, réalisation ou attestation",
        "Une affirmation générale du type « je suis motivé et sérieux » dans tous les domaines",
        "Le nombre de personnes que le porteur dit connaître dans la profession agricole",
        "Une liste de qualités personnelles sans rapport avec les besoins du projet"
      ],
      "correctAnswer": 0,
      "explanation": "Chaque compétence annoncée doit s’appuyer sur une preuve concrète : c’est le critère de réussite de l’exercice."
    }
  ],
  "lec_2_1": [
    {
      "question": "Dans la méthode PESTEL appliquée à l'agriculture, dans quelle catégorie classer la salinisation des terres due à l'avancée de la mer ?",
      "options": [
        "Politique : c'est une décision de l'État sur l'aménagement du littoral",
        "Technologique : c'est un problème d'équipement d'irrigation mal choisi",
        "Environnemental : climat, eau, sols et risques naturels de la zone d'implantation",
        "Socioculturel : c'est une évolution des habitudes alimentaires des consommateurs"
      ],
      "correctAnswer": 2,
      "explanation": "Climat, pluviométrie, sols et eau relèvent du facteur environnemental, crucial en agriculture."
    },
    {
      "question": "Pourquoi Diap Touré traite-t-il la suspension des importations d'oignon comme un « bonus incertain » et non comme la base de son modèle ?",
      "options": [
        "Les dates changent chaque année, le marché peut rouvrir plus tôt et des plafonds de prix peuvent tomber",
        "Parce que la suspension est illégale au regard des règles de l'UEMOA et sera annulée",
        "Parce que la suspension profite seulement aux importateurs et jamais aux producteurs locaux",
        "Parce que la banque refuse de financer tout projet qui dépend d'une décision de l'État"
      ],
      "correctAnswer": 0,
      "explanation": "Une protection instable ne peut pas porter un modèle économique : le gain doit venir de l'étalement des ventes."
    },
    {
      "question": "Où se trouve, selon le cas Diap, le vrai gain de son projet sur le marché de l'oignon ?",
      "options": [
        "Dans une pénurie permanente d'oignon qui maintient les prix élevés toute l'année",
        "Dans la vente exclusive à l'export, où les prix sont toujours supérieurs",
        "Dans la baisse du coût des semences importées grâce à la dévaluation de la monnaie",
        "Dans l'étalement des ventes grâce au stockage : surabondance à la récolte, tensions ensuite"
      ],
      "correctAnswer": 3,
      "explanation": "105-110 FCFA/kg à la récolte en 2025, plus de 400 FCFA/kg en rupture : l'écart récompense celui qui stocke."
    },
    {
      "question": "Un porteur de projet au Togo rédige son PESTEL. Quelle démarche est la plus juste ?",
      "options": [
        "Reprendre mot pour mot le PESTEL de Diap Touré, puisque l'agriculture est la même partout",
        "L'appliquer à son propre pays et à sa zone, avec les règles UEMOA/CEDEAO et ses saisons",
        "Se limiter aux facteurs politiques, qui sont les seuls à vraiment déterminer les résultats",
        "Ne traiter que le facteur économique et ignorer le climat, déjà connu des évaluateurs"
      ],
      "correctAnswer": 1,
      "explanation": "Le cas sénégalais est un exemple : chaque dossier doit analyser son propre contexte, y compris le régime des pluies (deux saisons au sud, une seule au nord)."
    },
    {
      "question": "À quoi doit aboutir l'analyse de l'environnement dans un business plan ?",
      "options": [
        "À prouver que le projet n'a aucun risque, grâce à une liste de facteurs tous favorables",
        "À remplacer l'étude de la clientèle et de la concurrence présentée plus loin",
        "À identifier les facteurs clés de succès, c'est-à-dire les conditions pour réussir",
        "À justifier le montant de l'emprunt demandé auprès de l'établissement financier"
      ],
      "correctAnswer": 2,
      "explanation": "Les FCS de Diap : maîtrise du calendrier et du stockage, sécurisation foncière par un acte reconnu."
    },
    {
      "question": "Une même année, un producteur d'oignon vend sa récolte à 110 FCFA/kg. Quel facteur PESTEL explique d'abord ce niveau de prix ?",
      "options": [
        "Légal : l'interdiction de vendre l'oignon au-dessus de 110 FCFA/kg par la loi",
        "Économique : l'offre est abondante et concentrée au moment de la récolte",
        "Technologique : l'absence de téléphone mobile chez les producteurs de la zone",
        "Socioculturel : un rejet de l'oignon local par les consommateurs urbains"
      ],
      "correctAnswer": 1,
      "explanation": "Un prix bas à la récolte traduit une offre abondante concentrée dans le temps."
    }
  ],
  "lec_2_2": [
    {
      "question": "Un porteur écrit : « L'alimentation est un besoin de base, donc tout le monde est mon client. » Quel est le problème ?",
      "options": [
        "Aucun, c'est exactement ce que les évaluateurs veulent lire dans un dossier agricole",
        "La phrase est correcte mais doit être complétée par une liste de tous les marchés du pays",
        "Il n'y a plus de stratégie de vente : chaque type de client s'aborde différemment",
        "Le problème vient uniquement du ton, qui doit être plus formel dans un dossier de banque"
      ],
      "correctAnswer": 2,
      "explanation": "Segmenter, c'est choisir ses batailles : grossistes, supermarchés ou ménages ne demandent pas la même approche."
    },
    {
      "question": "Quelle est la principale différence entre un marché B2B et un marché B2C pour un producteur ?",
      "options": [
        "En B2B, prix plus bas mais gros volumes ; en B2C, marges plus élevées mais petits volumes",
        "En B2B, les marges sont plus élevées et les volumes faibles ; en B2C, les prix sont plus bas",
        "Le B2B concerne uniquement l'export et le B2C uniquement la vente sur les marchés locaux",
        "Il n'y a aucune différence, seul le nom change selon que le client est une personne ou non"
      ],
      "correctAnswer": 0,
      "explanation": "B2C : consommateur final (marges élevées, logistique lourde). B2B : grossistes, supermarchés, usines."
    },
    {
      "question": "Quelle est la production d'oignon vendable de Diap Touré, sachant 7 ha × 28 t/ha et 10 % de pertes ?",
      "options": [
        "Environ 196 tonnes, car les pertes sont déjà comptées dans le rendement de 28 t/ha",
        "Environ 280 tonnes, en comptant les 10 ha de l'exploitation entière",
        "Environ 157 tonnes, en retirant 20 % de pertes au lieu de 10 %",
        "Environ 176 tonnes (196 t brutes moins 10 % de pertes)"
      ],
      "correctAnswer": 3,
      "explanation": "7 × 28 = 196 t ; 196 × 0,9 ≈ 176 t, soit la base du chiffre d'affaires de croisière."
    },
    {
      "question": "Dans le tableau de demande de Diap, 80 % de 176 t vont aux grossistes. Combien de tonnes cela représente-t-il ?",
      "options": [
        "Environ 35 tonnes par an, car les grossistes achètent peu à la fois",
        "Environ 176 tonnes par an, car les grossistes absorbent toute la production",
        "Environ 100 tonnes par an, pour laisser une marge de sécurité",
        "Environ 141 tonnes par an (80 % de 176 t), les 35 t restantes allant aux supermarchés"
      ],
      "correctAnswer": 3,
      "explanation": "176 × 0,8 ≈ 141 t pour les grossistes ; 176 × 0,2 ≈ 35 t pour les supermarchés."
    },
    {
      "question": "Parmi ces sources, laquelle constitue une donnée primaire ?",
      "options": [
        "Les statistiques nationales de consommation publiées par l'agence statistique",
        "Les entretiens que le porteur mène lui-même auprès de cinq grossistes du marché",
        "Un rapport de la FAO sur la filière oignon en Afrique de l'Ouest",
        "Un article de presse économique sur les prix de l'oignon à la récolte"
      ],
      "correctAnswer": 1,
      "explanation": "Primaire = collectée soi-même sur le terrain ; secondaire = déjà publiée par un tiers."
    },
    {
      "question": "Pourquoi les supermarchés ne reçoivent-ils que 20 % de la production de Diap, alors que leurs prix sont meilleurs ?",
      "options": [
        "Parce que les supermarchés refusent de payer à crédit et exigent un paiement avant la récolte",
        "Parce que la loi interdit de vendre plus de 20 % de sa production à un même client",
        "Ils exigent calibrage strict, nettoyage, filets et traçabilité : seuls les plus beaux calibres y vont",
        "Parce que les supermarchés n'achètent jamais d'oignon produit localement"
      ],
      "correctAnswer": 2,
      "explanation": "Les critères d'achat de chaque segment déterminent les volumes que le projet peut y placer."
    }
  ],
  "lec_2_3": [
    {
      "question": "Un porteur écrit « Mon produit est si bon que je n'ai pas de concurrent ». Comment un banquier l'interprète-t-il ?",
      "options": [
        "Soit il a mal cherché, soit le marché n'existe pas : un besoin est toujours déjà satisfait",
        "Comme la preuve d'un produit très innovant qui mérite un financement prioritaire",
        "Comme un signe de confiance, qui réduit le risque perçu par la banque",
        "Comme un détail sans importance, la concurrence n'étant analysée que pour les services"
      ],
      "correctAnswer": 0,
      "explanation": "L'absence de concurrence n'existe pas : nier la concurrence décrédibilise le dossier."
    },
    {
      "question": "Le producteur de patate douce est-il un concurrent du producteur de pomme de terre ?",
      "options": [
        "Oui, indirect : il répond au même besoin (féculent) par un produit de substitution",
        "Oui, direct : il vend exactement le même produit à la même cible",
        "Non, car ce sont deux cultures différentes qui ne se rencontrent jamais sur le marché",
        "Non, sauf s'il cultive sur la même parcelle que le projet"
      ],
      "correctAnswer": 0,
      "explanation": "Un produit de substitution répond au même besoin d'une autre manière : concurrence indirecte."
    },
    {
      "question": "Combien de concurrents principaux faut-il cartographier dans le dossier ?",
      "options": [
        "Tous les agriculteurs du pays, pour prouver l'exhaustivité de l'étude de marché",
        "Un seul, le plus grand producteur, car les autres sont négligeables",
        "Aucun nom : il suffit d'écrire que la concurrence est forte dans la filière",
        "Entre 3 et 5 concurrents principaux, ceux qui ciblent les mêmes clients que le projet"
      ],
      "correctAnswer": 3,
      "explanation": "On sélectionne quelques concurrents pertinents et on analyse forces, faiblesses et stratégie de prix."
    },
    {
      "question": "Quel est le créneau de Diap Touré face à ses concurrents ?",
      "options": [
        "Le prix le plus bas du marché, grâce à une main-d'œuvre familiale non rémunérée",
        "De l'oignon local calibré, en filets de 25 kg, disponible après le pic de récolte grâce au stockage",
        "Une production biologique certifiée, vendue exclusivement aux hôtels de luxe",
        "Un oignon importé revendu avec une meilleure marge sous sa propre marque"
      ],
      "correctAnswer": 1,
      "explanation": "Le créneau répond aux faiblesses des deux concurrents : vrac et surcharge du marché d'un côté, accès incertain de l'autre."
    },
    {
      "question": "Dans le cas de Diap, 60 % de l'oignon est vendu à 160 FCFA/kg à la récolte et 40 % à 260 FCFA/kg après stockage. Quel est le prix moyen obtenu ?",
      "options": [
        "210 FCFA/kg, moyenne simple des deux prix augmentée de la marge de stockage",
        "260 FCFA/kg, car le prix le plus élevé s'applique à toute la production stockée",
        "200 FCFA/kg (0,6 × 160 + 0,4 × 260)",
        "160 FCFA/kg, car la majorité est vendue à la récolte"
      ],
      "correctAnswer": 2,
      "explanation": "0,6 × 160 = 96 ; 0,4 × 260 = 104 ; total 200 FCFA/kg, le prix utilisé dans le chiffre d'affaires de croisière."
    },
    {
      "question": "À quelle condition le créneau « stockage » de Diap reste-t-il crédible ?",
      "options": [
        "Si l'État maintient la suspension des importations pendant toute l'année",
        "Si les concurrents familiaux cessent de produire de l'oignon dans la région",
        "Si le hangar est loué plutôt que construit, pour réduire l'investissement",
        "Si le gain de prix (environ 100 FCFA/kg) dépasse le coût et les pertes du stockage"
      ],
      "correctAnswer": 3,
      "explanation": "Un créneau n'est valable que s'il est rentable : on le vérifie dans les chiffres."
    }
  ],
  "lec_2_4": [
    {
      "question": "Dans la matrice FFOM, quelle est la différence entre une faiblesse et une menace ?",
      "options": [
        "La faiblesse est externe (le marché) et la menace est interne (l'équipe du projet)",
        "Les deux sont internes, la menace étant simplement une faiblesse plus grave",
        "La faiblesse est interne (elle dépend du projet), la menace est externe (marché, environnement)",
        "Les deux sont externes, la faiblesse concernant les concurrents et la menace les clients"
      ],
      "correctAnswer": 2,
      "explanation": "Forces et faiblesses = analyse interne ; opportunités et menaces = analyse externe."
    },
    {
      "question": "Dans l'exemple de Diap, où classer « budget initial élevé nécessitant un fort endettement » ?",
      "options": [
        "Dans les faiblesses, car c'est un handicap interne au projet",
        "Dans les menaces, car l'endettement vient de la banque",
        "Dans les forces, car un gros budget prouve l'ambition du projet",
        "Dans les opportunités, car l'emprunt permet d'investir"
      ],
      "correctAnswer": 0,
      "explanation": "Le niveau d'endettement est une caractéristique du projet lui-même : faiblesse interne."
    },
    {
      "question": "Où classer « revirement de la politique d'importation et chute des prix à la récolte » ?",
      "options": [
        "Dans les faiblesses : le porteur aurait dû mieux anticiper la politique de l'État",
        "Dans les menaces : un facteur externe défavorable, hors du contrôle du porteur",
        "Dans les forces : une baisse des prix attire plus de clients vers le projet",
        "Dans les opportunités : un prix bas à la récolte permet d'acheter moins cher"
      ],
      "correctAnswer": 1,
      "explanation": "Ce qui vient du marché ou de l'État et menace le projet est une menace."
    },
    {
      "question": "Quelle stratégie croisée correspond à « Force + Menace » ?",
      "options": [
        "Attaquer : saisir une opportunité externe grâce à un atout interne",
        "Se protéger : un atout interne contre un danger externe, comme le goutte-à-goutte face à la sécheresse",
        "Se corriger : réduire une faiblesse interne grâce à une opportunité externe",
        "Se défendre : limiter une faiblesse interne exposée à une menace externe"
      ],
      "correctAnswer": 1,
      "explanation": "Force + Opportunité = attaquer ; Force + Menace = se protéger ; Faiblesse + Opportunité = se corriger ; Faiblesse + Menace = se défendre."
    },
    {
      "question": "La faiblesse « fort endettement » face à la menace « chute des prix » appelle quelle réponse dans le dossier ?",
      "options": [
        "Un différé de remboursement et des contrats de prévente pour sécuriser les recettes",
        "Une augmentation du prix de vente pour compenser, quelle que soit la demande",
        "L'abandon de la culture de l'oignon au profit d'une culture sans risque de prix",
        "Une hausse de l'apport personnel jusqu'à supprimer tout recours à l'emprunt"
      ],
      "correctAnswer": 0,
      "explanation": "Faiblesse + Menace : on se défend, ici avec le différé de 1 an prévu dans le plan de financement et des préventes."
    },
    {
      "question": "Pourquoi est-il conseillé d'être honnête sur ses faiblesses et ses menaces ?",
      "options": [
        "Cela permet de justifier un montant de subvention plus élevé de la part du bailleur",
        "Cela dispense de présenter le plan de gestion des risques en fin de dossier",
        "Cela évite que les concurrents ne découvrent les points faibles du projet",
        "Cela prouve la lucidité du porteur, qui surveille ses points fragiles : un gage de crédibilité"
      ],
      "correctAnswer": 3,
      "explanation": "Un SWOT qui ne contient que des forces perd toute valeur aux yeux d'un évaluateur."
    }
  ],
  "lec_3_1": [
    {
      "question": "Pourquoi préciser la variété et le conditionnement dans la fiche produit d'un dossier destiné à un banquier non agriculteur ?",
      "options": [
        "Parce que le banquier choisit lui-même les variétés qui seront cultivées sur l'exploitation",
        "Parce que la loi impose un conditionnement en filets de 25 kg pour toute vente d'oignon",
        "Ils expliquent la qualité et le prix : un oignon calibré en filets neufs se vend mieux",
        "Parce que ces détails remplacent l'itinéraire technique, jugé trop technique pour le dossier"
      ],
      "correctAnswer": 2,
      "explanation": "Le produit brut a peu de valeur ; le conditionnement et la qualité justifient le prix."
    },
    {
      "question": "Qu'est-ce que l'itinéraire technique ?",
      "options": [
        "Le trajet que suivent les camions pour livrer la production aux marchés de gros",
        "La liste des fournisseurs d'intrants avec leurs prix et leurs délais de livraison",
        "Le calendrier des paiements des salaires du personnel permanent et des journaliers",
        "La suite chronologique des opérations menées sur une parcelle, de la préparation du sol à la post-récolte"
      ],
      "correctAnswer": 3,
      "explanation": "Préparation du sol, semis, irrigation, entretien, protection, récolte et post-récolte."
    },
    {
      "question": "À quoi sert surtout l'itinéraire technique aux yeux de l'évaluateur ?",
      "options": [
        "À calculer le montant de l'impôt sur les bénéfices dû par l'exploitation chaque année",
        "À prouver que le porteur possède un tracteur et peut se passer de main-d'œuvre",
        "À vérifier que les rendements annoncés (28 t/ha d'oignon) sont réalistes",
        "À décider de la forme juridique de l'entreprise à créer avant le début de la campagne"
      ],
      "correctAnswer": 2,
      "explanation": "Un rendement ne s'obtient pas par miracle : l'itinéraire technique le justifie."
    },
    {
      "question": "Dans l'itinéraire de Diap, que fait-il avant la récolte de l'oignon pour une bonne conservation ?",
      "options": [
        "Il arrête l'irrigation 15 jours avant, laisse faner 4 jours, puis sèche 3 semaines sous hangar",
        "Il irrigue davantage pendant les 15 derniers jours pour grossir les bulbes avant la récolte",
        "Il récolte à maturité puis met directement les bulbes en filets sans séchage pour gagner du temps",
        "Il traite les bulbes avec un fongicide puis les stocke dans des sacs en plastique fermés"
      ],
      "correctAnswer": 0,
      "explanation": "Le séchage est le point le plus important de la post-récolte : il conditionne la durée de stockage."
    },
    {
      "question": "Les charges variables de l'oignon sont de 1,3 M FCFA/ha. Combien coûte la campagne d'oignon de Diap sur 7 ha ?",
      "options": [
        "13,0 M FCFA (10 ha × 1,3 M)",
        "9,1 M FCFA (7 ha × 1,3 M)",
        "7,0 M FCFA (7 ha × 1,0 M)",
        "1,3 M FCFA (le coût d'un seul hectare)"
      ],
      "correctAnswer": 1,
      "explanation": "7 × 1,3 = 9,1 M ; avec la pomme de terre (3 × 2,4 = 7,2 M) et l'hivernage (3 × 0,6 = 1,8 M), on retrouve 18,1 M de charges variables."
    },
    {
      "question": "Un technicien affirme : « Pour 2,4 M FCFA/ha en pomme de terre, la plus grande part du coût est sans doute la main-d'œuvre. » Dans l'itinéraire technique, quel poste pèse en général le plus lourd ?",
      "options": [
        "Le carburant de la motopompe, qui représente l'essentiel des dépenses de culture",
        "L'assurance récolte, obligatoire dès la première campagne de production",
        "Les frais de commercialisation, payés avant même la plantation",
        "Les intrants, surtout le plant et la fertilisation, bien plus chers que pour l'oignon"
      ],
      "correctAnswer": 3,
      "explanation": "La pomme de terre coûte plus cher à l'hectare que l'oignon, essentiellement à cause du plant et de la fertilisation ; d'où la nécessité de chiffrer chaque poste."
    },
    {
      "question": "Quel est le coût variable au kilo de l’oignon de Diap : 1 300 000 FCFA/ha pour 25,2 t vendables à l’hectare ?",
      "options": [
        "Environ 5,2 FCFA/kg, ce qui rend la culture presque gratuite à produire",
        "Environ 130 FCFA/kg, proche du prix de vente moyen de 200 FCFA/kg",
        "Environ 52 FCFA/kg, très inférieur au prix moyen de vente de 200 FCFA/kg",
        "Environ 1 300 FCFA/kg, ce qui montre que la culture n’est pas rentable"
      ],
      "correctAnswer": 2,
      "explanation": "1 300 000 ÷ 25 200 kg ≈ 52 FCFA/kg."
    },
    {
      "question": "Dans le tableau de coûts de Diap, quel est le total des charges variables des trois cultures (oignon, pomme de terre, hivernage) ?",
      "options": [
        "13,0 M FCFA, en comptant 10 ha à 1,3 M FCFA l’hectare pour toutes les cultures",
        "18,1 M FCFA : 9,1 pour l’oignon, 7,2 pour la pomme de terre et 1,8 pour l’hivernage",
        "16,3 M FCFA, en oubliant les coûts de la culture d’hivernage",
        "25,3 M FCFA, ce qui correspond à l’EBE de la croisière"
      ],
      "correctAnswer": 1,
      "explanation": "7 × 1,3 + 3 × 2,4 + 3 × 0,6 = 9,1 + 7,2 + 1,8 = 18,1."
    }
  ],
  "lec_3_2": [
    {
      "question": "Quelle est la différence entre le calendrier d'installation et le calendrier de production ?",
      "options": [
        "L'installation liste les tâches avant la première mise en terre ; la production organise les cycles de culture",
        "L'installation décrit la récolte et le calendrier de production la préparation du sol",
        "Les deux sont identiques : il suffit d'en fournir un seul dans le dossier de financement",
        "L'installation concerne les cultures et la production concerne le personnel de l'exploitation"
      ],
      "correctAnswer": 0,
      "explanation": "Deux calendriers distincts, souvent présentés en diagramme de Gantt simplifié."
    },
    {
      "question": "Un porteur prévoit de planter au mois 2, alors que l'installation du forage prend souvent 3 mois dans sa région. Que pense la banque ?",
      "options": [
        "Que le plan est irréaliste : les délais d'installation sont sous-estimés",
        "Qu'il est bien organisé : un démarrage rapide est toujours un point positif dans un dossier",
        "Qu'il maîtrise les contraintes climatiques et peut se passer du forage la première année",
        "Rien de particulier : seuls les chiffres financiers sont examinés par les analystes"
      ],
      "correctAnswer": 0,
      "explanation": "Beaucoup d'agriculteurs sous-estiment ce délai : mieux vaut prévoir de la marge pour les imprévus."
    },
    {
      "question": "Dans le plan d'assolement de Diap, que cultive-t-il pendant l'hivernage sur 3 ha et pourquoi ?",
      "options": [
        "De l'oignon, car l'humidité de l'hivernage favorise sa croissance et sa conservation",
        "De la pomme de terre, car elle ne craint pas les maladies fongiques pendant la saison des pluies",
        "Rien : toute l'exploitation reste en jachère nue pendant l'hivernage",
        "Du gombo ou du maïs doux, cultures à cycle court qui supportent la pluie et occupent le personnel permanent"
      ],
      "correctAnswer": 3,
      "explanation": "Le reste des terres (7 ha) se repose en engrais vert : c'est la rotation des cultures."
    },
    {
      "question": "Quelle est l'année 0 dans le projet de Diap ?",
      "options": [
        "La première campagne d'oignon, vendue à 85 % de la pleine production",
        "L'année de croisière où le chiffre d'affaires atteint 54,4 M FCFA",
        "La période d'installation de 5 mois, sans chiffre d'affaires",
        "L'année de remboursement du dernier échéancier du prêt bancaire"
      ],
      "correctAnswer": 2,
      "explanation": "L'année 1 est la première campagne complète, à 85 % de la pleine production."
    },
    {
      "question": "Si le chiffre d'affaires de croisière est de 54,4 M FCFA, quel est celui de l'année 1 à 85 % de la pleine production ?",
      "options": [
        "Environ 54,4 M FCFA, car le chiffre d'affaires ne varie pas d'une année à l'autre",
        "Environ 46,2 M FCFA (0,85 × 54,4)",
        "Environ 40,8 M FCFA, ce qui correspond à une baisse des prix de 25 %",
        "Environ 38,2 M FCFA, c'est-à-dire 70 % de la pleine production"
      ],
      "correctAnswer": 1,
      "explanation": "0,85 × 54,4 ≈ 46,2 M FCFA."
    },
    {
      "question": "Pourquoi Diap contractualise-t-il avec un fournisseur d'intrants avec livraison un mois avant chaque phase critique ?",
      "options": [
        "Pour obtenir une remise sur le prix du carburant de la motopompe solaire",
        "Pour avoir le droit de vendre sa production directement aux supermarchés",
        "Pour éviter une rupture d'engrais en plein cycle, qui peut ruiner la campagne",
        "Pour réduire le nombre d'ouvriers agricoles à recruter pendant l'hivernage"
      ],
      "correctAnswer": 2,
      "explanation": "Le plan d'approvisionnement garantit que les intrants sont disponibles au bon moment sur la ferme."
    },
    {
      "question": "En zone subhumide bimodale (sud du Togo, du Bénin, de la Côte d’Ivoire), que doit montrer le calendrier de production ?",
      "options": [
        "Une seule campagne en hivernage, comme au Sahel, avec une longue période d’inactivité",
        "Une absence totale de culture pendant la petite saison des pluies",
        "Une seule récolte annuelle regroupant tous les produits en novembre",
        "Deux campagnes pluviales par an, avec leurs deux pics de récolte et de main-d’œuvre"
      ],
      "correctAnswer": 3,
      "explanation": "Le plan d’assolement et la trésorerie doivent refléter les deux cycles."
    },
    {
      "question": "Pourquoi préciser la source des dates du calendrier (service agricole, météo, producteurs voisins) ?",
      "options": [
        "Parce que les dates varient selon l’année et le lieu : la source prouve qu’elles ont été vérifiées",
        "Parce que la banque impose un modèle de calendrier identique pour tous les pays",
        "Parce que les dates de semis sont fixées par la loi dans chaque région",
        "Parce que cela dispense de prévoir une marge pour les imprévus d’installation"
      ],
      "correctAnswer": 0,
      "explanation": "Les calendriers de la leçon sont des repères indicatifs à confirmer localement."
    }
  ],
  "lec_3_3": [
    {
      "question": "Quel est le principal inconvénient de l'entreprise individuelle pour un investissement de 55 M FCFA ?",
      "options": [
        "Elle impose un capital social minimal bloqué à la banque pendant toute la durée du prêt",
        "Le patrimoine personnel n'est pas protégé et la banque y voit peu de garanties",
        "Elle interdit l'embauche de salariés permanents et de main-d'œuvre saisonnière",
        "Elle oblige à avoir au moins trois associés pour être inscrite au registre du commerce"
      ],
      "correctAnswer": 1,
      "explanation": "En cas de faillite, les biens personnels de l'exploitant peuvent être saisis."
    },
    {
      "question": "Pourquoi Diap Touré choisit-il la SARLU (SUARL au Sénégal) ?",
      "options": [
        "Elle l'exonère de l'impôt sur les bénéfices les cinq premières années de l'activité",
        "Elle lui permet de lever des fonds en bourse auprès d'investisseurs institutionnels",
        "Elle remplace l'acte foncier pour sécuriser sa terre auprès de la commune",
        "Elle lui permet de gérer seul en protégeant ses biens, avec le sérieux d'une société"
      ],
      "correctAnswer": 3,
      "explanation": "Un seul associé, responsabilité limitée aux apports : adaptée à un porteur individuel avec un gros emprunt."
    },
    {
      "question": "Pour un groupe de 30 producteurs qui veulent acheter leurs intrants ensemble et vendre en commun, quelle forme est souvent adaptée ?",
      "options": [
        "Une société coopérative ou un GIE, très utilisés pour regrouper des producteurs",
        "Une entreprise individuelle, qui évite toute gouvernance collective",
        "Une SAS, qui n'existe que pour les projets à capitaux étrangers",
        "Le statut d'entreprenant, qui n'a aucun plafond de chiffre d'affaires"
      ],
      "correctAnswer": 0,
      "explanation": "Coopérative et GIE regroupent les producteurs ; attention à la solidarité des dettes dans le GIE."
    },
    {
      "question": "Quand la SAS (ou SASU) est-elle particulièrement utile ?",
      "options": [
        "Quand on veut créer l'entreprise au moindre coût administratif, sans comptabilité",
        "Quand on cultive moins de 2 ha et que l'on ne vend qu'au marché local",
        "Quand on prévoit d'accueillir des investisseurs ou de signer un pacte d'associés",
        "Quand le bail de la terre n'est pas encore signé et qu'on veut gagner du temps"
      ],
      "correctAnswer": 2,
      "explanation": "Plus exigeante à tenir, la SAS convient à un projet qui change d'échelle."
    },
    {
      "question": "Dans l'organigramme de Diap, qui fait partie du personnel permanent ?",
      "options": [
        "Les 20 femmes engagées pour le repiquage et les 30 personnes du tri à la récolte",
        "Le gérant, un chef de culture, un responsable maintenance, 2 ouvriers et 1 gardien",
        "Uniquement le gérant, tout le reste étant confié à des journaliers",
        "Les bana-banas qui achètent la production, engagés à l'année par contrat"
      ],
      "correctAnswer": 1,
      "explanation": "Les journaliers sont mobilisés pour les pics : repiquage, récolte et tri."
    },
    {
      "question": "Pourquoi le dossier doit-il détailler le personnel permanent et les journaliers ?",
      "options": [
        "Parce que la loi impose un nombre minimum de journaliers par hectare exploité et fixe leur salaire dans tout le pays",
        "Parce qu'il alimente les tableaux financiers : salaires fixes d'un côté, provision pour journaliers de l'autre",
        "Parce que la banque finance en priorité les entreprises qui ont beaucoup de salariés",
        "Parce que les journaliers sont exonérés de toute cotisation sociale"
      ],
      "correctAnswer": 1,
      "explanation": "Le budget RH se construit à partir de l'organisation décrite dans cette leçon."
    },
    {
      "question": "Un porteur veut démarrer sans identifiant fiscal : « on verra plus tard ». Quelle est la bonne pratique ?",
      "options": [
        "S'inscrire aux impôts (NINEA, NIF, IFU… selon le pays) et au registre du commerce avant de demander un prêt",
        "Attendre la première récolte, car les produits agricoles sont toujours hors du champ de l'impôt et exonérés de toute formalité",
        "Utiliser l'identifiant du fournisseur d'intrants pour émettre les factures de vente",
        "Ne s'inscrire qu'à l'export, seule situation où l'identifiant devient obligatoire"
      ],
      "correctAnswer": 0,
      "explanation": "L'identifiant fiscal est propre à chaque pays ; la fiscalité varie : consultez un expert-comptable local."
    }
  ],
  "lec_4_1": [
    {
      "question": "Quels sont les quatre piliers du mix marketing présentés dans la leçon ?",
      "options": [
        "Production, Personnel, Paiement, Prospection et Plan comptable général",
        "Produit, Profit, Partenaires et Plan comptable",
        "Prix, Pluviométrie, Parcelle et Promotion",
        "Produit, Prix, Distribution (Place) et Communication (Promotion)"
      ],
      "correctAnswer": 3,
      "explanation": "Les 4P adaptés à l'agriculture : Produit, Prix, Place, Promotion."
    },
    {
      "question": "Un producteur vend au même prix que le marché du jour. Quelle stratégie de prix applique-t-il ?",
      "options": [
        "Le prix de pénétration, qui consiste à vendre moins cher pour conquérir des parts de marché",
        "Le prix d'écrémage, qui consiste à vendre plus cher grâce à une qualité supérieure",
        "Le prix d'alignement, la stratégie la plus courante en agriculture",
        "Le prix plancher fixé par la loi pour toute vente de produit agricole"
      ],
      "correctAnswer": 2,
      "explanation": "Trois stratégies : alignement, pénétration (guerre des prix possible) et écrémage (premium)."
    },
    {
      "question": "Pourquoi Diap ne parle-t-il pas de « prime de qualité » dans son prix moyen de 200 FCFA/kg ?",
      "options": [
        "Parce que l'oignon calibré se vend exactement au même prix que l'oignon en vrac",
        "Parce que les supermarchés fixent un prix plafond de 200 FCFA/kg à tous les producteurs",
        "Parce que la prime est reversée aux bana-banas sous forme de ristourne",
        "Parce que le gain vient du stockage (60 % à 160 F, 40 % à 260 F), pas d'une prime"
      ],
      "correctAnswer": 3,
      "explanation": "0,6 × 160 + 0,4 × 260 = 200 FCFA/kg : le gain est expliqué par la vente différée."
    },
    {
      "question": "Dans la stratégie de distribution de Diap, qui assure le transport de l'oignon ?",
      "options": [
        "Diap, avec son tricycle, qui livre chaque grossiste sur les marchés de Dakar à ses propres frais",
        "Le grossiste, qui vient chercher la marchandise avec son camion : Diap limite sa logistique",
        "Une société de transport en contrat exclusif avec la banque qui finance le projet",
        "L'État, qui prend en charge le transport des produits maraîchers vers les marchés"
      ],
      "correctAnswer": 1,
      "explanation": "Circuit indirect court : vente bord-champ, enlèvement par l'acheteur."
    },
    {
      "question": "Parmi ces actions, laquelle relève de la Communication (Promotion) ?",
      "options": [
        "Choisir un filet rouge de 25 kg portant le logo de la ferme pour conditionner l'oignon calibré",
        "Aligner son prix sur celui du marché de gros du jour",
        "Envoyer par WhatsApp des photos des champs aux grossistes et les inviter à visiter le hangar",
        "Faire enlever la marchandise par le camion de l'acheteur"
      ],
      "correctAnswer": 2,
      "explanation": "Photos, échantillons, visites de la ferme et réseaux sociaux : actions de communication."
    },
    {
      "question": "Un producteur affirme : « Mon oignon est si bon qu'il se vendra tout seul le jour de la récolte. » Quel risque principal prend-il ?",
      "options": [
        "Découvrir trop tard le problème de l'écoulement : le produit perd du poids et la négociation est perdue",
        "Aucun risque : la demande en oignon est telle qu'un acheteur se présentera toujours, au bon prix, le jour de la récolte",
        "Un risque juridique : vendre sans contrat écrit est interdit pour les produits agricoles",
        "Un risque d'image uniquement, sans conséquence sur la trésorerie de l'exploitation"
      ],
      "correctAnswer": 0,
      "explanation": "Produire est difficile, vendre au bon prix l'est souvent plus : la stratégie marketing rassure la banque."
    }
  ],
  "lec_4_2": [
    {
      "question": "Quelle est la « règle d'or » de la prospection agricole ?",
      "options": [
        "On prospecte uniquement le jour de la récolte, quand les acheteurs peuvent constater la qualité",
        "On vend toujours à un seul client, pour éviter de gaspiller du temps en prospection",
        "On vend avant de récolter : on cherche et on sécurise les clients avant la maturité des cultures",
        "On fixe le prix après la récolte, car les contrats d'avance sont interdits"
      ],
      "correctAnswer": 2,
      "explanation": "Les produits sont périssables : chaque jour de retard coûte du poids, des pertes et du pouvoir de négociation."
    },
    {
      "question": "Dans quelle phase du plan de prospection cherche-t-on des lettres d'intention d'achat ou des contrats de culture ?",
      "options": [
        "Phase 2, pendant la croissance : le teasing",
        "Phase 1, avant le semis : la sécurisation",
        "Phase 3, un mois avant la récolte : la conclusion",
        "Après la récolte, quand la production est déjà stockée sous le hangar"
      ],
      "correctAnswer": 1,
      "explanation": "Avant le semis, on teste le marché et on sécurise les débouchés."
    },
    {
      "question": "Que fait-on pendant la phase « teasing » (pendant la croissance des cultures) ?",
      "options": [
        "On maintient l'intérêt des acheteurs : photos des champs, visites de la ferme, échantillons",
        "On signe les bons de commande fermes et on organise l'enlèvement des camions",
        "On teste l'existence même d'un marché pour le produit avant d'acheter les semences",
        "On renégocie le prêt avec la banque en fonction de l'évolution des prix"
      ],
      "correctAnswer": 0,
      "explanation": "Le teasing prouve que la récolte sera au rendez-vous."
    },
    {
      "question": "Quelle est l'action prévue un mois avant la récolte (phase 3) ?",
      "options": [
        "Choisir la variété de semence et lancer la pépinière pour préparer la campagne agricole suivante",
        "Lancer les premières études de marché auprès des consommateurs finaux",
        "Inscrire l'entreprise au registre du commerce et obtenir l'identifiant fiscal",
        "Fixer les prix selon les cours du moment, signer les bons de commande fermes, planifier les enlèvements"
      ],
      "correctAnswer": 3,
      "explanation": "Phase de conclusion : appels de relance, négociation finale, logistique."
    },
    {
      "question": "Le budget marketing de Diap est de 1 000 000 FCFA par an : 400 000 d'étiquettes, 350 000 de déplacements, 150 000 de téléphone/internet. Combien reste-t-il pour les échantillons ?",
      "options": [
        "150 000 FCFA, soit autant que le poste téléphone et internet",
        "50 000 FCFA, car 5 % du budget suffisent pour les échantillons",
        "100 000 FCFA (1 000 000 − 400 000 − 350 000 − 150 000)",
        "0 FCFA, car les échantillons sont fournis gratuitement par les grossistes"
      ],
      "correctAnswer": 2,
      "explanation": "400 + 350 + 150 + 100 = 1 000 (en milliers de FCFA)."
    },
    {
      "question": "Où le budget de prospection doit-il apparaître dans le dossier ?",
      "options": [
        "Nulle part : la prospection est gratuite, seul le transport coûte quelque chose",
        "Dans les prévisions financières, par exemple parmi les charges fixes",
        "Dans les annexes uniquement, sans lien avec les tableaux financiers",
        "Dans le plan de financement des investissements, au même titre que le forage"
      ],
      "correctAnswer": 1,
      "explanation": "Prospecter coûte : étiquettes, déplacements, communication, échantillons."
    },
    {
      "question": "Un grossiste signe une lettre d'intention d'achat de 50 t d'oignon. Que prouve ce document dans le dossier ?",
      "options": [
        "Une garantie légale de paiement, qui dispense le vendeur de tout contrôle de solvabilité de l'acheteur",
        "Une obligation pour la banque de financer l'emprunt demandé à 100 %",
        "Une preuve que le prix de vente est définitivement fixé pour la saison",
        "Un intérêt réel d'un acheteur pour le volume et la période, même s'il n'engage pas comme un contrat ferme"
      ],
      "correctAnswer": 3,
      "explanation": "La lettre d'intention rassure sur le débouché ; le contrat ferme ou le bon de commande va plus loin."
    },
    {
      "question": "Un grossiste signe une lettre d’intention d’achat. Comment l’utiliser dans le plan de trésorerie ?",
      "options": [
        "Ne pas la compter comme un encaissement certain : seuls un contrat ou un bon de commande ferme le justifient",
        "La compter comme une vente certaine, puisque l’acheteur a signé et mis son cachet",
        "La compter à 50 % du volume, comme un contrat à moitié ferme",
        "La compter dans le chiffre d’affaires de l’année précédente"
      ],
      "correctAnswer": 0,
      "explanation": "Une lettre d’intention prouve un débouché mais n’engage en général pas l’acheteur."
    },
    {
      "question": "Parmi ces clauses, laquelle protège le producteur en cas de sécheresse ou d’inondation ?",
      "options": [
        "La clause de prix fixé après la récolte, quel que soit le cours du jour",
        "La clause d’exclusivité, qui interdit toute vente à un autre client",
        "La clause de force majeure, qui encadre le défaut de livraison pour cause climatique",
        "La clause de paiement à 90 jours sans acompte ni garantie"
      ],
      "correctAnswer": 2,
      "explanation": "Les pénalités de non-livraison et la force majeure sont à lire attentivement avant de signer."
    }
  ],
  "lec_5_1": [
    {
      "question": "Quelles sont les trois grandes catégories du coût d'un projet ?",
      "options": [
        "Les salaires, les impôts et les intérêts de l'emprunt bancaire de la première année",
        "Les achats de semences, de carburant et d'emballages de la première campagne",
        "Les subventions, les prêts et l'apport personnel des associés du projet",
        "Les frais d'établissement, les investissements et le besoin en fonds de roulement initial"
      ],
      "correctAnswer": 3,
      "explanation": "Coût du projet = frais d'établissement + investissements + BFR initial."
    },
    {
      "question": "Le coût du projet de Diap : établissement 0,6 ; aménagements et forage 12,0 ; matériel 26,0 ; imprévus 2,4 ; BFR 14,0 (en M FCFA). Quel est le total des emplois ?",
      "options": [
        "41,0 M FCFA, en excluant le BFR et les imprévus",
        "55,0 M FCFA",
        "52,6 M FCFA, en excluant les imprévus",
        "38,6 M FCFA, en ne comptant que les investissements et les frais d'établissement"
      ],
      "correctAnswer": 1,
      "explanation": "0,6 + 12,0 + 26,0 + 2,4 + 14,0 = 55,0 M FCFA."
    },
    {
      "question": "Quelle règle doit toujours vérifier un plan de financement initial ?",
      "options": [
        "Le total des emplois est égal au total des ressources",
        "Le total des ressources est toujours supérieur de 10 % au total des emplois",
        "L'emprunt doit représenter exactement 50 % des ressources",
        "L'apport personnel doit couvrir au moins la moitié des investissements"
      ],
      "correctAnswer": 0,
      "explanation": "Besoins et financements s'équilibrent strictement."
    },
    {
      "question": "Diap apporte 11 M FCFA sur 55 M. Quelle part des ressources cela représente-t-il, et est-ce dans la fourchette habituelle des banques (10 à 30 %) ?",
      "options": [
        "25 % : c'est au-dessus de la fourchette et la banque le refusera",
        "11 % : c'est tout juste dans la fourchette, donc insuffisant en pratique",
        "20 % : c'est dans la fourchette habituellement exigée par les banques",
        "5 % : c'est très en dessous de ce que les banques acceptent"
      ],
      "correctAnswer": 2,
      "explanation": "11 ÷ 55 = 20 %."
    },
    {
      "question": "Quel est le montant des intérêts de l'année 1 pour un emprunt de 44 M FCFA à 9 %, avec un an de différé sur le capital ?",
      "options": [
        "Environ 9,8 M FCFA, l'annuité constante complète dès la première année",
        "Environ 0,4 M FCFA, soit 1 % du montant emprunté",
        "Environ 44,0 M FCFA, car tout le capital est exigible en fin d'année",
        "Environ 4,0 M FCFA (44 × 9 %), sans remboursement de capital"
      ],
      "correctAnswer": 3,
      "explanation": "44 × 0,09 ≈ 4,0 M ; l'annuité constante de 9,8 M ne démarre qu'à l'année 2."
    },
    {
      "question": "Pourquoi inclure une ligne « Imprévus » dans le coût du projet ?",
      "options": [
        "Pour prévoir la commission de la banque qui accorde le prêt",
        "Pour faire face aux aléas de l'installation : hausse de prix, retards, travaux sous-estimés",
        "Pour financer la distribution des dividendes aux associés dès l'année 1",
        "Pour augmenter volontairement l'emprunt et négocier un meilleur taux"
      ],
      "correctAnswer": 1,
      "explanation": "Une ligne d'imprévus rassure le bailleur sur le réalisme du budget d'installation."
    }
  ],
  "lec_5_2": [
    {
      "question": "Pourquoi sous-estimer le BFR est-il la première cause de faillite des projets agricoles ?",
      "options": [
        "Parce que les dépenses commencent bien avant la première vente : sans trésorerie, on ne peut plus payer",
        "Parce que le BFR représente toujours plus de la moitié de l'investissement total",
        "Parce que la banque retire alors automatiquement le prêt accordé au projet",
        "Parce que l'administration fiscale impose le paiement de l'impôt avant la récolte"
      ],
      "correctAnswer": 0,
      "explanation": "Le BFR couvre le décalage entre décaissements (semis) et encaissements (récolte vendue)."
    },
    {
      "question": "Quel est le BFR initial de Diap : intrants 11,3 ; journaliers 2,0 ; salaires 2,7 ; charges fixes 1,9 ; crédit fournisseurs − 4,5 ; sécurité 0,6 ?",
      "options": [
        "18,5 M FCFA, en oubliant de déduire le crédit fournisseurs",
        "9,5 M FCFA, en ne retenant que les intrants moins le crédit fournisseurs",
        "11,3 M FCFA, c'est-à-dire seulement les intrants",
        "14,0 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "11,3 + 2,0 + 2,7 + 1,9 − 4,5 + 0,6 = 14,0."
    },
    {
      "question": "Si Diap n'obtenait aucun crédit fournisseur, quel serait son BFR initial ?",
      "options": [
        "14,0 M FCFA, car le crédit fournisseur ne change pas la trésorerie",
        "18,5 M FCFA : le crédit fournisseurs de 4,5 M réduisait le besoin",
        "9,5 M FCFA, car on ajouterait le crédit à la place de le retrancher",
        "11,3 M FCFA, car seuls les intrants entreraient alors dans le calcul"
      ],
      "correctAnswer": 1,
      "explanation": "14,0 + 4,5 = 18,5 : négocier des délais de paiement allège le BFR."
    },
    {
      "question": "Pendant combien de mois la ferme de Diap vit-elle sans encaissement significatif ?",
      "options": [
        "Environ 12 mois, car toute la campagne est financée sans aucune vente ni encaissement client",
        "Environ 1 mois, puisque l'oignon se récolte très vite",
        "Environ 5 mois, de la pépinière d'octobre aux premières ventes de mars-avril",
        "Environ 9 mois, jusqu'à la fin de l'hivernage"
      ],
      "correctAnswer": 2,
      "explanation": "Les 5 mois sans recettes servent de base au calcul des salaires et des charges fixes du BFR."
    },
    {
      "question": "Comment se retrouve le BFR initial dans le plan de trésorerie mensuel ?",
      "options": [
        "Il correspond au creux : le solde cumulé le plus bas avant les premières ventes",
        "Il correspond au solde de fin d'année, une fois toutes les récoltes vendues",
        "Il correspond au montant de l'annuité du prêt bancaire de l'année 2",
        "Il correspond au total des investissements en matériel et en forage"
      ],
      "correctAnswer": 0,
      "explanation": "Le creux de trésorerie est le montant à financer au départ."
    },
    {
      "question": "Le BFR initial doit être financé comment ?",
      "options": [
        "Dès le départ, par l'apport ou l'emprunt, au même titre que l'achat du matériel",
        "Par les premières ventes, une fois la récolte vendue au bon prix",
        "Par un découvert bancaire négocié au fil de l'eau",
        "Il n'a pas à être financé : il se rembourse tout seul avec l'activité"
      ],
      "correctAnswer": 0,
      "explanation": "Sans trésorerie de départ, le projet peut s'arrêter avant la première vente."
    }
  ],
  "lec_5_3": [
    {
      "question": "Quelle est la formule du chiffre d'affaires d'une culture ?",
      "options": [
        "Surface × coût de production × nombre de journaliers engagés pendant toute la campagne agricole",
        "Rendement ÷ prix de vente × surface cultivée",
        "(Surface × rendement − pertes) × prix unitaire : le volume vendable multiplié par le prix",
        "Charges variables + charges fixes + marge souhaitée"
      ],
      "correctAnswer": 2,
      "explanation": "Volume vendu × prix de vente : les deux variables sont instables en agriculture."
    },
    {
      "question": "Diap cultive 7 ha d'oignon à 28 t/ha, avec 10 % de pertes. Quel volume vendable obtient-il ?",
      "options": [
        "Environ 196 tonnes, les pertes étant déjà prises en compte",
        "Environ 176 tonnes (196 t brutes moins 10 %)",
        "Environ 280 tonnes, en cultivant les 10 ha",
        "Environ 98 tonnes, en divisant par 2 pour le stockage"
      ],
      "correctAnswer": 1,
      "explanation": "7 × 28 = 196 ; 196 × 0,9 ≈ 176 t."
    },
    {
      "question": "À 200 FCFA/kg, quel est le chiffre d'affaires de l'oignon (176 t vendables) ?",
      "options": [
        "3,5 M FCFA, en se trompant d'un ordre de grandeur",
        "52,8 M FCFA, avec un prix de 300 FCFA/kg",
        "28,2 M FCFA, avec un prix de 160 FCFA/kg",
        "35,3 M FCFA (176 000 kg × 200 F)"
      ],
      "correctAnswer": 3,
      "explanation": "176 000 × 200 = 35,2 à 35,3 M FCFA."
    },
    {
      "question": "Quel est le chiffre d'affaires de croisière de Diap dans le scénario réaliste ?",
      "options": [
        "46,2 M FCFA, qui correspond à l'année 1 de montée en puissance à 85 % de la production",
        "42,6 M FCFA, qui correspond au scénario pessimiste",
        "54,4 M FCFA : oignon 35,3 + pomme de terre 15,9 + hivernage 3,2",
        "74,2 M FCFA, qui correspond au scénario optimiste"
      ],
      "correctAnswer": 2,
      "explanation": "Les trois autres valeurs sont d'autres scénarios ou l'année 1."
    },
    {
      "question": "Sur quel scénario construire le compte de résultat et la trésorerie ?",
      "options": [
        "Sur le scénario optimiste, pour montrer à la banque le potentiel maximal du projet sur la durée",
        "Sur le scénario réaliste (ou un point entre pessimiste et réaliste), jamais sur l'optimiste",
        "Sur la moyenne des trois scénarios pondérée par le goût du porteur",
        "Sur le scénario pessimiste uniquement, car il est le plus facile à justifier"
      ],
      "correctAnswer": 1,
      "explanation": "L'optimiste sert à montrer le potentiel ; il ne sert jamais de base."
    },
    {
      "question": "Dans le scénario pessimiste de Diap, le CA passe de 54,4 à 42,6 M FCFA. À quoi correspond cette baisse d'environ 22 % ?",
      "options": [
        "À la seule baisse des prix de 10 %, sans aucun effet sur les volumes vendus ni sur les pertes",
        "À la perte d'un hectare de culture à cause d'un litige foncier",
        "À la suspension de l'hivernage pendant l'année de croisière",
        "À une combinaison défavorable : rendements − 10 %, pertes + 3 points, prix − 10 %"
      ],
      "correctAnswer": 3,
      "explanation": "Les trois effets se cumulent : volume, pertes et prix."
    },
    {
      "question": "Pourquoi un seul chiffre fixe de CA (« je ferai 50 M ») inquiète-t-il un banquier ?",
      "options": [
        "Il montre que le porteur ignore l'incertitude sur les rendements et les prix",
        "Il prouve que le porteur a déjà signé tous ses contrats de vente pour la saison",
        "Il est interdit par les règles comptables de l'espace OHADA",
        "Il oblige la banque à financer le projet à 100 % de son montant"
      ],
      "correctAnswer": 0,
      "explanation": "La méthode des trois scénarios répond à cette volatilité."
    }
  ],
  "lec_5_4": [
    {
      "question": "Quelle est la formule fondamentale du résultat net ?",
      "options": [
        "Chiffre d'affaires − seulement les achats de semences et d'engrais consommés pendant la campagne",
        "Encaissements − décaissements de la période",
        "Produits (chiffre d'affaires) − charges (dépenses, amortissements, intérêts, impôts)",
        "Total de l'actif − total du passif de la ferme"
      ],
      "correctAnswer": 2,
      "explanation": "Le compte de résultat oppose produits et charges ; la trésorerie oppose encaissements et décaissements."
    },
    {
      "question": "Calculez l'EBE de Diap en croisière : CA 54,4 ; charges variables 18,1 ; charges fixes 4,5 ; personnel 6,5 (M FCFA).",
      "options": [
        "29,8 M FCFA, en oubliant le personnel",
        "36,3 M FCFA, en ne retranchant que les charges variables",
        "12,0 M FCFA, qui est le résultat net",
        "25,3 M FCFA (54,4 − 18,1 − 4,5 − 6,5)"
      ],
      "correctAnswer": 3,
      "explanation": "54,4 − 29,1 = 25,3."
    },
    {
      "question": "Un tracteur de 10 M FCFA dure 5 ans. Quelle est la charge d'amortissement annuelle (linéaire) ?",
      "options": [
        "10 M FCFA la première année, car l'achat est payé au départ",
        "2 M FCFA par an : c'est une charge comptable sans décaissement",
        "5 M FCFA par an, c'est-à-dire la moitié du prix",
        "0 FCFA, car un tracteur ne perd pas de valeur s'il est entretenu"
      ],
      "correctAnswer": 1,
      "explanation": "10 ÷ 5 = 2 M ; l'amortissement diminue le bénéfice sans sortir d'argent."
    },
    {
      "question": "Pourquoi l'amortissement ne met-il pas d'argent de côté tout seul ?",
      "options": [
        "Parce que c'est une charge calculée : le cash ne reste que si le porteur le met de côté",
        "Parce que la banque bloque automatiquement le montant sur un compte de réserve",
        "Parce que l'administration fiscale rembourse l'amortissement chaque année",
        "Parce qu'il est payé en espèces aux fournisseurs de matériel à la fin de l'année"
      ],
      "correctAnswer": 0,
      "explanation": "Le cash libéré doit être provisionné par le porteur lui-même."
    },
    {
      "question": "Année 1 de Diap : résultat avant impôt 9,0 M FCFA, impôt sur les bénéfices à 30 %. Quel est le résultat net ?",
      "options": [
        "9,0 M FCFA, en oubliant l'impôt sur les bénéfices",
        "2,7 M FCFA, c'est-à-dire seulement le montant de l'impôt",
        "6,3 M FCFA (9,0 − 2,7 d'impôt)",
        "6,0 M FCFA, en appliquant un impôt de 30 % sur le chiffre d'affaires"
      ],
      "correctAnswer": 2,
      "explanation": "Impôt = 30 % × 9,0 = 2,7 ; résultat net = 9,0 − 2,7 = 6,3."
    },
    {
      "question": "Pourquoi les charges variables de culture sont-elles les mêmes (18,1 M) en année 1 et en croisière, alors que le CA de l'année 1 est inférieur ?",
      "options": [
        "Parce que les coûts de culture sont engagés en totalité dès la première campagne",
        "Parce que les charges variables sont toujours fixées par la banque en début de projet",
        "Parce que le chiffre d'affaires de l'année 1 est calculé sans aucune charge",
        "Parce que la comptabilité interdit de faire varier les charges d'une année à l'autre"
      ],
      "correctAnswer": 0,
      "explanation": "La montée en puissance touche les rendements, pas les dépenses de culture."
    }
  ],
  "lec_5_5": [
    {
      "question": "Pourquoi une entreprise agricole rentable peut-elle faire faillite ?",
      "options": [
        "Parce que la rentabilité est toujours entièrement supprimée par l'impôt sur les bénéfices et les cotisations dues",
        "Parce qu'un bénéfice sur le papier n'est pas de l'argent en banque : encaissé trop tard, il ne paie rien",
        "Parce que le compte de résultat ne contient pas les ventes de l'année",
        "Parce que la banque impose des remboursements dès le premier mois"
      ],
      "correctAnswer": 1,
      "explanation": "Le compte de résultat mesure la richesse ; la trésorerie mesure l'argent réellement disponible."
    },
    {
      "question": "Un mois commence avec 4,0 M FCFA en caisse, sans encaissement et avec 2,5 M de décaissements. Quel est le solde final, et que se passe-t-il le mois suivant avec les mêmes dépenses ?",
      "options": [
        "Solde final 6,5 M ; le mois suivant 9,0 M, car les dépenses sont une source de trésorerie",
        "Solde final 1,5 M ; le mois suivant 3,0 M, car le solde se reconstitue seul",
        "Solde final 4,0 M ; le mois suivant 4,0 M, car les dépenses sont compensées",
        "Solde final 1,5 M ; le mois suivant le solde devient − 1,0 M : c'est un découvert"
      ],
      "correctAnswer": 3,
      "explanation": "Solde final = initial + encaissements − décaissements : 4,0 − 2,5 = 1,5 ; puis 1,5 − 2,5 = − 1,0."
    },
    {
      "question": "Le plan de trésorerie de Diap montre un solde négatif au mois 4. Parmi ces solutions, laquelle est cohérente avec la leçon ?",
      "options": [
        "Ne rien changer : le solde se corrigera à la récolte, sans conséquence pour la ferme",
        "Négocier des délais de paiement avec les fournisseurs, ou augmenter le BFR initial",
        "Supprimer la ligne « salaires » du tableau pour que le solde redevienne positif",
        "Réduire l'apport personnel, afin de diminuer le montant à rembourser"
      ],
      "correctAnswer": 1,
      "explanation": "Trois leviers : plus de BFR, délais fournisseurs, calendrier agricole avec rentrées plus précoces."
    },
    {
      "question": "Dans un plan de trésorerie, quand comptabilise-t-on une vente ?",
      "options": [
        "Au mois où le client paie réellement, pas au mois de la facture",
        "Au mois de la semence, car la vente est certaine dès le semis",
        "Au mois de la livraison, même si le client paie trois mois plus tard",
        "Au mois de la signature du contrat, quel que soit le paiement"
      ],
      "correctAnswer": 0,
      "explanation": "La trésorerie suit les flux réels : on compte les encaissements quand l'argent arrive."
    },
    {
      "question": "Parmi ces flux, lequel apparaît en trésorerie mais pas dans le compte de résultat ?",
      "options": [
        "Le salaire du chef de culture, qui est une charge de personnel inscrite au compte de résultat de l'année",
        "L'achat de semences pour la campagne, qui est une charge variable",
        "Le remboursement du capital de l'emprunt : une sortie d'argent, mais pas une charge",
        "Les intérêts de l'emprunt, qui sont des frais financiers"
      ],
      "correctAnswer": 2,
      "explanation": "Seuls les intérêts sont des charges ; le capital remboursé est un décaissement de trésorerie."
    },
    {
      "question": "Quel est le rôle du creux de trésorerie dans le dossier de Diap ?",
      "options": [
        "Il donne le bénéfice net attendu pour l'année 1",
        "Il donne le montant maximal d'emprunt que la banque accepte",
        "Il donne le chiffre d'affaires minimal pour ne pas perdre d'argent",
        "Il donne le montant du BFR à financer au départ : environ 14 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "Le solde cumulé le plus bas avant les premières ventes est le BFR initial."
    }
  ],
  "lec_5_6": [
    {
      "question": "Quelle égalité doit toujours vérifier un bilan ?",
      "options": [
        "Total de l'actif = chiffre d'affaires de l'année",
        "Total du passif = résultat net multiplié par deux",
        "Total de l'actif = total du passif",
        "Total de l'actif = total des dettes uniquement"
      ],
      "correctAnswer": 2,
      "explanation": "L'actif (ce que possède l'entreprise) est financé par le passif (apports, résultat, dettes)."
    },
    {
      "question": "Les immobilisations de Diap sont de 41,0 M FCFA avant amortissement. Quelle est leur valeur nette au bilan de fin d'année 1 (amortissement 4,2 M) ?",
      "options": [
        "36,8 M FCFA (41,0 − 4,2)",
        "41,0 M FCFA, l'amortissement n'apparaissant jamais au bilan",
        "45,2 M FCFA, en ajoutant l'amortissement",
        "4,2 M FCFA, qui est le montant de l'amortissement seul"
      ],
      "correctAnswer": 0,
      "explanation": "La valeur nette comptable diminue chaque année de l'amortissement."
    },
    {
      "question": "Actif de Diap fin année 1 : immobilisations 36,8 ; créances 2,0 ; disponibilités 26,2. Quel est le total ?",
      "options": [
        "55,0 M FCFA, égal au coût du projet",
        "65,0 M FCFA, égal au total du passif",
        "36,8 M FCFA, qui ne compte que les immobilisations",
        "62,9 M FCFA, en oubliant les créances clients"
      ],
      "correctAnswer": 1,
      "explanation": "36,8 + 2,0 + 26,2 = 65,0."
    },
    {
      "question": "Comment le bénéfice du compte de résultat apparaît-il au bilan ?",
      "options": [
        "Il se retranche des immobilisations côté actif",
        "Il se transforme en dette à long terme vis-à-vis de la banque",
        "Il n'apparaît pas au bilan, qui ignore le résultat de l'exercice",
        "Il s'ajoute aux capitaux propres, côté passif : 6,3 M en année 1 pour Diap"
      ],
      "correctAnswer": 3,
      "explanation": "Le résultat relie compte de résultat et bilan : capital 11,0 + résultat 6,3 + dettes = 65,0."
    },
    {
      "question": "Pourquoi les disponibilités de Diap sont-elles élevées (26,2 M) à la fin de l'année 1 ?",
      "options": [
        "Parce que Diap a placé tous ses bénéfices en bourse pendant l'année 1 et que les titres ont été revendus avant décembre",
        "Parce que la banque a versé une subvention supplémentaire non prévue au plan",
        "Parce que l'emprunt n'est pas encore remboursé (différé) : ce coussin paiera l'annuité de 9,8 M de l'année 2",
        "Parce que les ouvriers n'ont pas été payés pendant la première campagne"
      ],
      "correctAnswer": 2,
      "explanation": "Le différé de capital laisse la trésorerie s'accumuler."
    },
    {
      "question": "Si Diap stockait une partie de sa récolte au 31 décembre, comment cela apparaîtrait-il au bilan ?",
      "options": [
        "Dans le passif, comme une dette envers les clients futurs",
        "Dans les immobilisations, au même titre que le hangar de stockage",
        "Nulle part : un stock invendu n'est jamais enregistré en comptabilité",
        "Dans l'actif circulant, sous « Stocks », pour la valeur du stock invendu"
      ],
      "correctAnswer": 3,
      "explanation": "Les stocks (récolte non vendue, engrais) font partie de l'actif circulant."
    }
  ],
  "lec_5_7": [
    {
      "question": "Pourquoi le seuil de rentabilité calculé avec les seules charges fixes (4,5 M) est-il une erreur ?",
      "options": [
        "Parce que les charges fixes ne servent jamais dans le calcul du seuil de rentabilité d'une exploitation agricole",
        "Parce qu'il faut y ajouter le personnel, les amortissements et les intérêts, dus quel que soit le volume",
        "Parce que seuls les amortissements comptent comme coûts fixes",
        "Parce que le seuil se calcule avec les charges variables uniquement"
      ],
      "correctAnswer": 1,
      "explanation": "Coûts fixes totaux de Diap : 6,5 + 4,5 + 4,2 + 4,0 = 19,2 M."
    },
    {
      "question": "Taux de marge sur coûts variables de Diap : (54,4 − 18,1) ÷ 54,4. Quelle valeur et quel seuil de rentabilité en découlent, avec 19,2 M de coûts fixes ?",
      "options": [
        "Taux de marge de 66,7 % et seuil d'environ 28,8 M FCFA",
        "Taux de marge de 33,3 % et seuil d'environ 57,6 M FCFA",
        "Taux de marge de 66,7 % et seuil d'environ 12,8 M FCFA",
        "Taux de marge de 75 % et seuil d'environ 14,4 M FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "19,2 ÷ 0,667 = 28,8 M, soit 53 % du CA réaliste."
    },
    {
      "question": "Si Diap n'avait compté que 4,5 M de charges fixes, quel seuil aurait-il annoncé ?",
      "options": [
        "Environ 6,7 M FCFA, plus de quatre fois trop bas",
        "Environ 28,8 M FCFA, le même qu'avec tous les coûts fixes",
        "Environ 19,2 M FCFA, égal aux coûts fixes totaux",
        "Environ 54,4 M FCFA, égal au chiffre d'affaires de croisière"
      ],
      "correctAnswer": 0,
      "explanation": "4,5 ÷ 0,667 ≈ 6,7 M : une erreur classique qui trompe le banquier."
    },
    {
      "question": "Que mesure le DSCR ?",
      "options": [
        "Le taux de rentabilité interne du projet sur cinq ans, calculé avant tout financement bancaire",
        "Si les flux de l'activité couvrent les échéances de la dette (intérêts et capital de l'année)",
        "Le nombre de jours de stock de l'exploitation à la clôture de l'exercice",
        "Le niveau de chiffre d'affaires pour lequel le résultat est nul"
      ],
      "correctAnswer": 1,
      "explanation": "DSCR = flux disponible ÷ service de la dette."
    },
    {
      "question": "Année 2 réaliste : flux disponible 20,2 M, service de la dette 9,8 M. Quel est le DSCR et que pense une banque exigeant 1,2 à 1,3 ?",
      "options": [
        "Environ 0,49 : en dessous de 1, la dette n'est pas couverte",
        "Environ 1,08 : juste en dessous du seuil exigé par la banque",
        "Environ 2,05 : très au-dessus du seuil, la dette est largement couverte",
        "Environ 11,0 : un chiffre à ne pas croire, car il dépasse toujours 2"
      ],
      "correctAnswer": 2,
      "explanation": "20,2 ÷ 9,8 ≈ 2,06 (2,05 dans le cas de référence)."
    },
    {
      "question": "En scénario pessimiste, le DSCR de Diap est de 1,21. Quelle est la bonne lecture ?",
      "options": [
        "Le projet est parfaitement sûr, car le DSCR est supérieur à 1",
        "Le projet est sûr uniquement si l'État maintient la suspension des importations",
        "Le DSCR n'a aucun sens en scénario pessimiste, on ne le calcule qu'en réaliste",
        "Le projet est juste à la limite : il résiste, mais sans marge"
      ],
      "correctAnswer": 3,
      "explanation": "Le pessimiste ne prouve pas que tout va bien : il montre la limite."
    },
    {
      "question": "En crise de prix (− 25 %), le DSCR de Diap tombe à 1,08. Quelle action est la plus pertinente pour renforcer le dossier ?",
      "options": [
        "Cacher le scénario de crise de prix au comité de crédit pour ne pas inquiéter inutilement la banque",
        "Augmenter le prix de vente de 25 % pour rétablir la rentabilité",
        "Allonger la durée du prêt, sécuriser des prix plancher, ajouter assurance ou réserve de trésorerie",
        "Supprimer le différé de remboursement pour rassurer la banque"
      ],
      "correctAnswer": 2,
      "explanation": "Sur 8 ans, l'annuité tombe à 8,7 M et le DSCR pessimiste monte à 1,36."
    },
    {
      "question": "Quelle est la valeur résiduelle ajoutée au flux de l'année 5 pour la VAN de Diap ?",
      "options": [
        "55,0 M FCFA, c'est-à-dire le coût initial complet du projet, sans tenir compte des amortissements",
        "20,0 M FCFA, sans le BFR récupéré",
        "14,0 M FCFA, sans la valeur des immobilisations",
        "34,0 M FCFA : valeur nette des immobilisations (20,0) plus BFR récupéré (14,0)"
      ],
      "correctAnswer": 3,
      "explanation": "20,0 + 14,0 = 34,0, ajoutés au flux de 19,0 de l'année 5."
    },
    {
      "question": "Quelle est la VAN à 10 % de Diap dans le scénario réaliste, et comment se lit-elle ?",
      "options": [
        "+ 33,0 M FCFA : le projet rémunère l'argent investi au-delà de 10 %",
        "− 2,0 M FCFA : le projet détruit de la valeur dans tous les scénarios",
        "+ 55,0 M FCFA : la VAN est égale au coût du projet",
        "0 FCFA : la VAN est toujours nulle quand le TRI est supérieur à 9 %"
      ],
      "correctAnswer": 0,
      "explanation": "VAN > 0 : création de valeur ; VAN < 0 : destruction."
    },
    {
      "question": "Pourquoi comparer le TRI (26,9 %) au taux de l'emprunt (9 %) et à un placement sans risque ?",
      "options": [
        "Parce que le TRI doit toujours être égal au taux de l'emprunt pour être valable",
        "Pour vérifier qu'il compense le coût de l'argent et le risque agricole",
        "Parce que le TRI mesure le montant des intérêts à payer à la banque",
        "Parce que le TRI n'a de sens qu'en comparaison avec le DSCR de l'année 1"
      ],
      "correctAnswer": 1,
      "explanation": "Un TRI de 5 % ne vaut pas un placement sans risque à 6 % ; 26,9 % compense largement le risque."
    },
    {
      "question": "Cumul des flux de Diap : − 3,7 M à la fin de l'année 3, puis flux de 19,0 M en année 4. Quel est le délai de récupération ?",
      "options": [
        "Environ 4,0 ans, car il faut attendre la fin de l'année 4",
        "Environ 3,2 ans (3 ans + 3,7 ÷ 19,0)",
        "Environ 1,9 an, soit la moitié du délai du prêt",
        "Environ 7,0 ans, la durée de l'emprunt"
      ],
      "correctAnswer": 1,
      "explanation": "3 + 3,7 ÷ 19,0 ≈ 3,2 ans."
    }
  ],
  "lec_6_1": [
    {
      "question": "Pourquoi un porteur qui cache les risques de son projet risque-t-il le refus du dossier ?",
      "options": [
        "Le banquier sait que l'agriculture est risquée : un dossier muet sur les risques paraît naïf",
        "Le banquier refuse tout dossier où figure le mot « risque », même accompagné d'une solution",
        "La loi interdit de présenter un projet sans avoir souscrit d'assurance au préalable",
        "Les risques sont déjà connus du banquier, donc inutiles à mentionner dans un dossier"
      ],
      "correctAnswer": 0,
      "explanation": "Lister les risques ET leur mitigation donne l'image d'un professionnel aguerri."
    },
    {
      "question": "Qu'appelle-t-on « mitigation » d'un risque ?",
      "options": [
        "La suppression complète du risque, qui disparaît définitivement du projet",
        "La déclaration du risque à l'administration fiscale en fin d'exercice",
        "Les actions concrètes qui réduisent la probabilité ou l'impact du risque",
        "Le transfert automatique du risque à la banque qui finance le projet"
      ],
      "correctAnswer": 2,
      "explanation": "Le plan de mitigation prouve que le porteur maîtrise la situation."
    },
    {
      "question": "Quelle mitigation Diap prévoit-il contre le risque d'une chute brutale des prix à la récolte ?",
      "options": [
        "Une assurance qui garantit le prix de vente fixé au moment du semis, quel que soit le cours du marché",
        "Un contrat d'exportation qui absorbe toute la production sans condition",
        "L'abandon de l'oignon au profit d'une culture dont le prix ne varie pas",
        "Un hangar de séchage et de stockage ventilé (environ 3 mois) pour vendre quand les prix remontent"
      ],
      "correctAnswer": 3,
      "explanation": "Le stockage étale les ventes : c'est le cœur du projet."
    },
    {
      "question": "Dans la matrice cotée de Diap, une chute des prix à la récolte a une probabilité de 3 et un impact de 3. Quel est son score et quelle priorité ?",
      "options": [
        "Score 6 : un risque modéré, à traiter après les risques de vol",
        "Score 3 : un risque faible, sans besoin de mitigation particulière",
        "Score 33 : on juxtapose simplement probabilité et impact sans calcul",
        "Score 9 : à traiter en premier, comme tout score de 6 ou plus"
      ],
      "correctAnswer": 3,
      "explanation": "Score = probabilité × impact ; on traite d'abord les scores de 6 ou plus."
    },
    {
      "question": "Le risque « panne de la pompe solaire » a une probabilité de 2 et un impact de 2. Quel est son score et quelle mitigation correspond dans le cas de Diap ?",
      "options": [
        "Score 4 : aucune mitigation n'est nécessaire, car 4 est inférieur au seuil de 6 retenu",
        "Score 6 : il faut abandonner l'irrigation solaire pour revenir à la pluie",
        "Score 4 : une motopompe de secours au diesel sauve les cultures en cas de panne",
        "Score 2 : la panne se règle simplement en changeant d'ouvrier"
      ],
      "correctAnswer": 2,
      "explanation": "2 × 2 = 4 : risque moyen, traité par une pompe de secours."
    },
    {
      "question": "Parmi ces risques, lequel est souvent oublié mais important dans un dossier agricole ?",
      "options": [
        "Le risque de crédit client : un grossiste qui paie en retard ou ne paie pas",
        "Le risque d'avoir trop de clients et de ne pas pouvoir tous les servir à temps pendant la récolte",
        "Le risque que le porteur gagne trop d'argent la première année",
        "Le risque que la banque propose un taux trop avantageux"
      ],
      "correctAnswer": 0,
      "explanation": "S'y ajoutent les risques politiques, de change, fonciers et de financement."
    },
    {
      "question": "Quel est le coût annuel d'assurance agricole prévu par Diap, et comment l'intègre-t-il ?",
      "options": [
        "Environ 9 M FCFA par an, payés par la banque en plus de l'emprunt",
        "Environ 0,9 M FCFA par an, inclus dans ses charges fixes",
        "Environ 0,1 M FCFA par an, uniquement en cas de sinistre",
        "Aucun coût : l'assurance est toujours gratuite pour les exploitations de moins de 20 ha"
      ],
      "correctAnswer": 1,
      "explanation": "Demandez un devis dans votre pays et budgétez la prime ; certaines assurances sont indicielles (pluviométrie)."
    }
  ],
  "lec_6_2": [
    {
      "question": "Pourquoi l'Executive Summary se place-t-il au début du dossier mais s'écrit-il en dernier ?",
      "options": [
        "Parce que les banques exigent de le recevoir après les annexes",
        "Parce qu'il résume tous les chapitres déjà construits",
        "Parce qu'il contient seulement les chiffres de l'année suivante",
        "Parce qu'il est rédigé par la banque à partir des tableaux financiers du porteur"
      ],
      "correctAnswer": 1,
      "explanation": "C'est la partie la plus lue : elle est écrite à la fin, avec tous les chiffres définitifs."
    },
    {
      "question": "Quelle longueur doit avoir l'Executive Summary ?",
      "options": [
        "Entre 15 et 20 pages, pour détailler tous les chapitres",
        "Une seule phrase, qui résume le montant demandé",
        "1 à 2 pages, qui doivent convaincre le lecteur de lire la suite",
        "Autant de pages que le reste du dossier, pour éviter les oublis"
      ],
      "correctAnswer": 2,
      "explanation": "Si l'Executive Summary est mauvais, le reste ne sera jamais lu."
    },
    {
      "question": "Quelles questions l'Executive Summary doit-il traiter ?",
      "options": [
        "Uniquement le détail de l'itinéraire technique de chaque culture, avec les doses d'engrais par parcelle",
        "La liste complète des devis et des documents fonciers",
        "Le calendrier de remboursement mois par mois",
        "Qui, quoi, où, comment, combien : opportunité, équipe, besoin de financement, rentabilité"
      ],
      "correctAnswer": 3,
      "explanation": "Pitch, marché, équipe, besoin de financement, rentabilité."
    },
    {
      "question": "Dans l'exemple de Diap, quelle est la composition du besoin de financement annoncé dans le résumé ?",
      "options": [
        "55 M FCFA : 11 M d'apport personnel (20 %) et 44 M d'emprunt demandé",
        "55 M FCFA, intégralement demandés à la banque sans apport personnel",
        "44 M FCFA d'investissement, financés par 11 M d'emprunt et 33 M d'apport",
        "11 M FCFA de besoin, couverts par une subvention de l'État"
      ],
      "correctAnswer": 0,
      "explanation": "Le résumé doit rappeler des chiffres identiques à ceux des tableaux financiers."
    },
    {
      "question": "Quel indicateur le résumé de Diap donne-t-il pour rassurer la banque sur sa capacité de remboursement ?",
      "options": [
        "Le DSCR : environ 2,0 en scénario réaliste et 1,2 en pessimiste",
        "Le nombre d'hectares cultivés en année 1",
        "Le nombre de grossistes déjà rencontrés sur le marché",
        "Le montant de l'apport demandé aux fournisseurs d'intrants"
      ],
      "correctAnswer": 0,
      "explanation": "Le résumé s'appuie sur les ratios calculés au chapitre 5.7."
    },
    {
      "question": "Parmi ces formulations d'un résumé, laquelle respecte les règles de forme ?",
      "options": [
        "« Nous visons des résultats exceptionnels grâce à notre approche disruptive et innovante. »",
        "« Le chiffre d'affaires réaliste est de 54,4 M FCFA en croisière, pour un résultat net de 12 M FCFA. »",
        "« Le chiffre d'affaires sera élevé et la rentabilité excellente dans le temps. »",
        "« L'agriculture étant au cœur de nos sociétés, ce projet répond à un besoin immense. »"
      ],
      "correctAnswer": 1,
      "explanation": "Phrases courtes, chiffres précis tirés des tableaux, pas de jargon creux."
    }
  ],
  "lec_6_3": [
    {
      "question": "Quel est le rôle des annexes dans un business plan ?",
      "options": [
        "Contenir les réponses aux questions que le jury n'a pas encore posées lors de la présentation orale",
        "Allonger le dossier pour montrer le sérieux du porteur",
        "Remplacer le corps du dossier pour les évaluateurs pressés",
        "Prouver par des documents (devis, titres fonciers, lettres d'intention) ce qui est affirmé dans le dossier"
      ],
      "correctAnswer": 3,
      "explanation": "Dans le corps du dossier on affirme ; dans les annexes, on prouve."
    },
    {
      "question": "Quel document est indispensable avant de soumettre un dossier à une banque ?",
      "options": [
        "Un article de presse sur le projet daté de la semaine du dépôt",
        "Une photo du matériel que le porteur compte acheter",
        "Une preuve de foncier sécurisé : titre, bail ou acte d'affectation",
        "Une lettre de soutien d'un ami du directeur d'agence"
      ],
      "correctAnswer": 2,
      "explanation": "Sans foncier sécurisé, aucune banque ne prête."
    },
    {
      "question": "Un devis annexé au dossier pour le forage doit idéalement dater de :",
      "options": [
        "Moins de 3 mois, pour que les prix soient d'actualité",
        "Moins de 3 ans, les prix du forage variant peu",
        "Plus de 6 mois, pour avoir eu le temps de comparer",
        "Aucune règle : la date d'un devis n'a pas d'importance"
      ],
      "correctAnswer": 0,
      "explanation": "Fournissez des devis récents pour tous les gros investissements."
    },
    {
      "question": "Combien de diapositives contient un pitch deck et en combien de temps le présente-t-on ?",
      "options": [
        "Une trentaine de diapositives, pour tout détailler en une heure",
        "Une seule diapositive de 2 minutes avec le montant demandé",
        "10 à 12 diapositives au maximum, pour environ 10 minutes",
        "Autant de diapositives que de pages dans le business plan"
      ],
      "correctAnswer": 2,
      "explanation": "Le pitch deck sert de support à la présentation orale devant un jury."
    },
    {
      "question": "Dans le pitch deck type, que contient la diapositive 2 ?",
      "options": [
        "La demande de financement et le montant attendu de la part du jury ou de la banque",
        "Les données financières sur trois ans",
        "La présentation de l'équipe et des compétences",
        "Le problème identifié sur le marché, comme la récolte qui arrive d'un coup"
      ],
      "correctAnswer": 3,
      "explanation": "Slide 1 : titre ; 2 : problème ; 3 : solution ; … ; 10 : la demande."
    },
    {
      "question": "Où placer la lettre d'intention d'achat signée par un grossiste ?",
      "options": [
        "Dans la page de garde du dossier, pour impressionner le lecteur dès le premier regard sur le document",
        "Dans les annexes, parmi les preuves commerciales, avec un renvoi depuis la partie commerciale",
        "Nulle part : ces lettres ne comptent pas comme preuves",
        "Dans le plan de trésorerie, comme encaissement certain"
      ],
      "correctAnswer": 1,
      "explanation": "Lettres d'intention et contrats de livraison sont des preuves commerciales."
    }
  ]
};
