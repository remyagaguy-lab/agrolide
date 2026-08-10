import { ParcoursSeed } from './types';

export const parcours6: ParcoursSeed = {
  id: "bp_agri_p6",
  titre: "Parcours 6 — Sécurisez et finalisez le dossier",
  description: "Dernière étape : prouver que vous maîtrisez les risques, rédiger le résumé exécutif (la partie la plus lue) et préparer les documents annexes.",
  lecons: [
    {
      id: "lec_6_1",
      titre: "L'analyse des risques et le plan de mitigation",
      duree_minutes: 8,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable d'identifier les risques majeurs de votre projet et de proposer un plan d'action (mitigation) pour rassurer les banquiers, qui détestent l'imprévu.

### Pourquoi parler de ce qui peut mal tourner ?

Un entrepreneur inexpérimenté cache les risques de son projet, pensant que la banque refusera le prêt si elle sait que la culture peut attraper une maladie. C'est faux. Le banquier *sait* que l'agriculture est risquée (sécheresse, insectes, chute des prix, vols). 

Si vous ne parlez pas des risques, le banquier conclura que vous êtes naïf et refusera le dossier. Si vous listez les risques ET que vous expliquez comment vous allez vous en protéger (c'est ce qu'on appelle la **mitigation**), vous passerez pour un professionnel aguerri.

### La matrice des risques agricoles

Vous devez construire un tableau listant les risques selon 4 catégories, en y associant votre plan de protection.

**1. Les risques Climatiques et Naturels**
- *Le risque :* Sécheresse, manque de pluie, ou inondations détruisant la récolte.
- *La mitigation de Diap :* "Le projet ne dépend pas de la pluie. Nous avons prévu un forage profond et une irrigation goutte-à-goutte avec pompage solaire. Pour contrer les inondations de l'hivernage, des canaux de drainage sont budgétisés."

**2. Les risques Techniques et Biologiques**
- *Le risque :* Attaque de ravageurs (ex: le Thrips de l'oignon) ou maladie fongique (mildiou). Panne de la pompe à eau.
- *La mitigation de Diap :* "Application d'un itinéraire technique strict avec traitements préventifs. Achat d'une motopompe de secours (backup) au diesel en cas de panne du système solaire pour garantir la survie des plantes."

**3. Les risques Commerciaux et Financiers**
- *Le risque :* Chute brutale des prix de l'oignon au moment de la récolte (surproduction locale).
- *La mitigation de Diap :* "Construction d'un hangar de séchage et stockage ventilé permettant de conserver l'oignon 3 mois. Ainsi, nous pourrons stocker la production et attendre que les prix remontent sur le marché."

**4. Les risques Humains et Opérationnels**
- *Le risque :* Démission du chef de culture en plein cycle, ou vols sur l'exploitation.
- *La mitigation de Diap :* "Le chef de culture est intéressé aux bénéfices (prime de rendement) pour le fidéliser. Le site est clôturé et surveillé par un gardien avec des chiens de garde."

#### Ce qu'il faut retenir
- Cacher les risques est la pire stratégie : un banquier sait que l'agriculture est risquée.
- Dressez une matrice des risques (climatiques, techniques, commerciaux, humains).
- Pour chaque risque identifié, vous devez proposer une action concrète et chiffrée de **mitigation** (solution de secours) pour prouver que vous maîtrisez la situation.`,
      quiz_json: [
        {
          question: "Pourquoi est-il crucial d'inclure une analyse des risques dans un business plan agricole ?",
          options: [
            "Pour faire peur aux concurrents",
            "Pour prouver au banquier que vous êtes conscient des dangers de l'agriculture et que vous avez prévu des solutions de secours",
            "Pour expliquer pourquoi le projet va sûrement échouer",
            "C'est optionnel, mieux vaut ne montrer que les aspects positifs"
          ],
          correctAnswer: 1,
          explanation: "Les banquiers financent des entrepreneurs qui anticipent les problèmes, pas des rêveurs qui croient que tout sera facile."
        },
        {
          question: "Qu'est-ce que la 'mitigation' d'un risque ?",
          options: [
            "L'action de nier le risque",
            "L'ensemble des mesures prises pour empêcher le risque de se réaliser ou pour en limiter les conséquences",
            "Le fait de transférer la responsabilité aux employés",
            "Le nom d'une maladie de l'oignon"
          ],
          correctAnswer: 1,
          explanation: "La mitigation (ou atténuation), c'est la solution apportée. Exemple : avoir un groupe électrogène de secours mitige le risque de coupure de courant."
        },
        {
          question: "Quelle est la meilleure mitigation pour un risque commercial de chute des prix à la récolte dans le cas de l'oignon ?",
          options: [
            "Brûler la récolte pour créer une pénurie",
            "Faire un procès aux concurrents",
            "Avoir investi dans une infrastructure de stockage (hangar) pour conserver le produit jusqu'à la remontée des cours",
            "Demander à la banque d'effacer la dette"
          ],
          correctAnswer: 2,
          explanation: "Le stockage est l'arme commerciale la plus puissante en agriculture pour échapper à la volatilité des prix au moment des récoltes massives."
        },
        {
          question: "Un panneau solaire qui tombe en panne au milieu de la saison sèche menace toute la culture. Quelle est la mitigation opérationnelle appropriée ?",
          options: [
            "Attendre le retour de la pluie",
            "Prévoir une motopompe diesel de secours dans les investissements initiaux",
            "Arroser 10 hectares à l'arrosoir",
            "Prier très fort"
          ],
          correctAnswer: 1,
          explanation: "En agriculture irriguée, la redondance (avoir un équipement de secours) est obligatoire pour sécuriser l'investissement, même si cela coûte un peu plus cher au départ."
        }
      ]
    },
    {
      id: "lec_6_2",
      titre: "Rédiger l'Executive Summary (Le résumé opérationnel)",
      duree_minutes: 8,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable de rédiger l'Executive Summary, la partie la plus importante de votre business plan (qui s'écrit toujours en dernier).

### Qu'est-ce que l'Executive Summary ?

L'Executive Summary (ou Résumé Opérationnel) est un texte de 1 à 2 pages placé **tout au début** de votre business plan. 
Pourquoi l'écrit-on en dernier s'il est au début ? Parce que c'est le résumé de tous les chapitres que vous venez de construire !

Un banquier reçoit des dizaines de dossiers par semaine. Il ne lira pas vos 40 pages détaillées sur l'itinéraire technique si les 2 premières pages (le résumé) ne le convainquent pas. **Si l'Executive Summary est mauvais, le reste ne sera jamais lu.**

### La structure de l'Executive Summary qui accroche

Il doit répondre en quelques paragraphes aux questions fondamentales de l'investisseur (Le Qui, Quoi, Où, Comment, et Combien).

1. **Le Pitch (L'opportunité) :**
   "Le Sénégal importe chaque année X tonnes d'oignons. Le projet 'Touré Niayes' propose de réduire cette dépendance en produisant localement 270 tonnes d'oignons de haute qualité, stockables pour cibler la période de pénurie (contre-saison)."
2. **Le Marché et l'Avantage concurrentiel :**
   "Notre avantage : un oignon calibré, trié et conditionné en filet, ciblant directement les syndicats de grossistes de Dakar, avec qui des contacts de pré-commande ont été établis."
3. **L'Équipe (Le porteur) :**
   "Le projet est porté par Diap Touré, ingénieur agronome justifiant de 5 ans d'expérience dans les Niayes, appuyé par un chef de culture spécialisé."
4. **Le Besoin de Financement (Le nerf de la guerre) :**
   "Pour réaliser ce projet sur 10 hectares sécurisés foncièrement, le besoin d'investissement total est de 55 000 000 FCFA."
5. **La Rentabilité et le Retour sur investissement :**
   "Le porteur apporte 11 000 000 FCFA (20%). Nous sollicitons un emprunt de 44 000 000 FCFA. Le chiffre d'affaires prévisionnel réaliste en Année 1 est de 67,5M FCFA, générant un résultat net de 20M FCFA. Le TRI financier estimé est de 28%, permettant un remboursement intégral du crédit sur 3 ans."

### La règle de forme
- Pas de jargon incompréhensible. 
- Des phrases courtes et percutantes.
- Des chiffres précis, tirés de vos tableaux financiers.
- Un design épuré (utilisez le canevas agrolide).

#### Ce qu'il faut retenir
- L'Executive Summary se place au début du document mais s'écrit à la toute fin du processus.
- C'est la seule partie que tous les décideurs (directeur de banque, membres du comité) liront en entier.
- Il doit résumer l'opportunité de marché, l'équipe, le montant demandé, votre apport personnel, et la rentabilité financière.`,
      quiz_json: [
        {
          question: "À quel moment de la préparation du business plan doit-on rédiger l'Executive Summary ?",
          options: [
            "En tout premier, avant l'étude de marché",
            "Au milieu du processus",
            "À la toute fin, car il résume les données de tous les autres modules (y compris financiers)",
            "On ne l'écrit jamais, c'est l'expert comptable qui le fait"
          ],
          correctAnswer: 2,
          explanation: "Même s'il est placé au début du document final, vous ne pouvez le rédiger qu'une fois que tous vos tableaux financiers, votre stratégie et vos coûts sont définitifs."
        },
        {
          question: "Pourquoi l'Executive Summary est-il souvent considéré comme la partie la plus importante du document ?",
          options: [
            "Parce qu'il comporte le plus de pages",
            "Parce que c'est la première impression de l'investisseur ; si ce résumé ne le convainc pas, il ne lira pas le reste",
            "Parce qu'il coûte cher à imprimer",
            "Ce n'est pas la partie la plus importante"
          ],
          correctAnswer: 1,
          explanation: "Un décideur financier manque de temps. Le résumé de 2 pages détermine s'il accepte de plonger dans les détails de votre projet ou s'il le rejette."
        },
        {
          question: "Quelles données financières DOIVENT impérativement figurer dans l'Executive Summary ?",
          options: [
            "Le prix du litre d'essence",
            "Le détail des salaires des ouvriers agricoles",
            "Le besoin d'investissement total, l'apport personnel, le montant du crédit demandé et le chiffre d'affaires prévisionnel",
            "La facture de la clôture"
          ],
          correctAnswer: 2,
          explanation: "Le résumé doit donner une image macro-économique claire : Combien coûte le projet, d'où vient l'argent, et combien il va rapporter globalement."
        },
        {
          question: "Quel ton doit-on adopter dans l'Executive Summary ?",
          options: [
            "Très technique, avec beaucoup de mots latins pour les plantes",
            "Romantique, pour raconter son rêve d'enfant",
            "Clair, percutant, orienté 'business' et compréhensible par un non-agriculteur",
            "Plaintif, pour demander de la pitié"
          ],
          correctAnswer: 2,
          explanation: "Le banquier n'est pas un agronome. Il faut utiliser un langage 'business' clair qui met en évidence l'opportunité de marché et la rentabilité."
        }
      ]
    },
    {
      id: "lec_6_3",
      titre: "Structurer les annexes et préparer le Pitch Deck",
      duree_minutes: 7,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous saurez quels documents justificatifs fournir en annexe et comment préparer la présentation orale (Pitch Deck) pour défendre votre projet.

### L'importance des Annexes (Les preuves matérielles)

Dans le corps de votre business plan (les 30 à 40 pages), vous faites des affirmations. Dans les annexes, vous **prouvez** ces affirmations. C'est ce qui donne du poids à votre demande.

Voici les annexes indispensables d'un bon projet agricole :
1. **Les preuves juridiques du Foncier :** Titre foncier, bail emphytéotique signé, ou acte de délibération de la mairie. Sans foncier sécurisé, aucune banque ne prêtera.
2. **Les devis :** Vous avez dit que le forage coûte 12 millions ? Mettez la facture proforma de l'entreprise de forage en annexe. Fournissez des devis récents (moins de 3 mois) pour tous vos gros investissements (tracteur, panneaux solaires, hangar).
3. **Les études techniques :** Étude de sol, qualité de l'eau, débit du forage, données climatiques de la zone.
4. **Les preuves commerciales :** Lettres d'intention d'achat signées par les grossistes, copie d'un contrat de livraison pour un supermarché.
5. **Les CV :** Le vôtre et celui de votre chef de culture.

### Le Pitch Deck (Pour la présentation orale)

Souvent, on ne vous demande pas d'envoyer le document complet dans un premier temps. On vous demande de venir "pitcher" (présenter) votre projet en 10 minutes devant un jury ou un directeur d'agence bancaire.

Pour cela, vous utilisez un **Pitch Deck**, une présentation (PowerPoint ou PDF) de 10 à 12 diapositives maximum.

**La structure type du Pitch Deck Agrolide :**
- *Slide 1 :* La page de garde (Titre, logo, contact).
- *Slide 2 :* Le problème identifié sur le marché (ex: Le pays manque d'oignons secs d'avril à septembre).
- *Slide 3 :* La solution proposée (Le projet de la ferme et son produit phare).
- *Slide 4 :* La taille du marché et la cible (Qui va acheter ?).
- *Slide 5 :* Le modèle d'affaires (Comment vous fixez vos prix et faites vos marges).
- *Slide 6 :* L'itinéraire technique et les opérations (La preuve que vous savez produire).
- *Slide 7 :* L'équipe (La preuve que vous savez gérer).
- *Slide 8 :* Le calendrier d'exécution (Mise en place de la ferme).
- *Slide 9 :* Les données financières clés (Investissement, CA, Rentabilité sur 3 ans).
- *Slide 10 :* La demande (Ce que vous attendez du jury/banquier : "Nous cherchons X millions").

### Félicitations !

Vous êtes arrivé au terme de la théorie de cette formation. Vous avez désormais toutes les clés, de l'étude de marché à la structuration financière, en passant par les aspects techniques culturaux.
L'étape suivante ? Télécharger le canevas agrolide vierge, et commencer à rédiger VOS idées, module après module, pour donner vie à votre exploitation agricole !

#### Ce qu'il faut retenir
- Les annexes ne sont pas des pages poubelles, ce sont les preuves matérielles de vos affirmations (devis, foncier).
- Ne soumettez jamais un projet si le foncier n'est pas légalement sécurisé par un document en annexe.
- Le Pitch Deck est l'outil visuel de 10 slides qui servira de support à votre présentation orale pour séduire les investisseurs en quelques minutes.`,
      quiz_json: [
        {
          question: "À quoi servent les documents en Annexe d'un business plan ?",
          options: [
            "À alourdir le document pour qu'il ait l'air plus sérieux",
            "À apporter les preuves matérielles des affirmations faites dans le texte (devis justifiant les coûts, preuves foncières)",
            "À y mettre les brouillons de l'étude de marché",
            "À y écrire les CV des concurrents"
          ],
          correctAnswer: 1,
          explanation: "L'annexe est le lieu de la preuve. Si vous annoncez un besoin de 12 millions pour l'irrigation, la banque veut voir le devis (facture proforma) en annexe."
        },
        {
          question: "Quel document en annexe est une condition sine qua non (obligatoire) pour qu'une banque étudie un financement agricole ?",
          options: [
            "Le diplôme de baccalauréat",
            "La preuve de sécurisation du foncier (titre foncier, bail, délibération locale)",
            "Une lettre de recommandation du chef du village",
            "Le devis d'achat d'un ordinateur"
          ],
          correctAnswer: 1,
          explanation: "Sans preuve irréfutable que vous avez le droit d'exploiter la terre sur le long terme, aucune banque ne financera d'infrastructures dessus."
        },
        {
          question: "Qu'est-ce qu'un Pitch Deck ?",
          options: [
            "Un logiciel de gestion de ferme",
            "Une présentation visuelle courte (environ 10 diapositives) utilisée pour soutenir la présentation orale du projet face à des investisseurs",
            "Le plan de masse du terrain",
            "Un contrat de vente"
          ],
          correctAnswer: 1,
          explanation: "Le Pitch Deck est l'outil de communication (type PowerPoint) pour l'oral, résumant de manière très visuelle l'opportunité de votre projet."
        },
        {
          question: "Dans un Pitch Deck, que doit impérativement contenir la dernière diapositive (la demande) ?",
          options: [
            "Des remerciements basiques",
            "La demande claire et chiffrée (ex: 'Nous recherchons un financement de 44 millions contre X garanties ou parts de capital')",
            "La bibliographie de l'étude de marché",
            "Le menu du déjeuner"
          ],
          correctAnswer: 1,
          explanation: "Ne finissez jamais une présentation sans énoncer clairement votre 'Call to action' : ce que vous attendez concrètement de votre auditoire (l'argent !)."
        }
      ]
    },
    {
      id: "lec_6_4",
      titre: "Conclusion et passage à l'action",
      duree_minutes: 5,
      contenu: `### Félicitations !

Vous êtes arrivé au terme de la théorie de cette formation *Rédiger un business plan agricole qui convainc*. Vous avez désormais toutes les clés, de l'étude de marché à la structuration financière, en passant par les aspects techniques culturaux.

L'étape suivante ? Télécharger le canevas agrolide vierge, et commencer à rédiger VOS idées, module après module, pour donner vie à votre exploitation agricole !

N'oubliez pas : un bon business plan n'est jamais terminé. Il vit, s'adapte, et évolue au fur et à mesure que vous rencontrez le marché réel.

Bonne chance dans votre aventure entrepreneuriale agricole !`,
      quiz_json: []
    }
  ]
};
