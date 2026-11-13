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

### Coter vos risques (probabilité × impact)

Une matrice sans chiffres ne permet pas de choisir. Notez chaque risque de 1 à 3 pour sa probabilité et pour son impact, puis multipliez : traitez d'abord les risques dont le score est de 6 ou plus.

| Risque | Probabilité | Impact | Score |
|---|---|---|---|
| Chute des prix à la récolte | 3 | 3 | 9 |
| Ravageurs et maladies | 2 | 3 | 6 |
| Revirement de la politique d'importation | 2 | 3 | 6 |
| Panne de la pompe solaire | 2 | 2 | 4 |
| Départ du chef de culture | 1 | 2 | 2 |
| Vols sur l'exploitation | 2 | 1 | 2 |

### Les risques qu'on oublie souvent

- **Politiques et réglementaires :** ouverture ou suspension des importations, plafonds de prix, changement de règles sur les pesticides.
- **De change :** semences et intrants importés, facturés en devises.
- **De crédit client :** un grossiste qui ne paie pas ou paie en retard.
- **Fonciers :** contestation de la terre, retrait d'une affectation.
- **De financement :** retard de décaissement du prêt, qui décale tout le calendrier.

### L'assurance agricole

L'assurance est la mitigation la plus citée par les financeurs. Des assureurs, publics ou privés, proposent selon les pays des assurances multirisques de récolte ou des assurances indicielles (fondées sur la pluviométrie). Renseignez-vous dans votre pays, demandez un devis et budgétez la prime : Diap prévoit environ 0,9 M FCFA par an, inclus dans ses charges fixes.

#### Ce qu'il faut retenir
- Cacher les risques est la pire stratégie : un banquier sait que l'agriculture est risquée.
- Dressez une matrice des risques (climatiques, techniques, commerciaux, humains, politiques, financiers) et cotez-les : probabilité × impact.
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
        },
        {
          question: "Un risque a une probabilité de 2 sur 3 et un impact de 3 sur 3. Quel est son score et que faut-il en faire ?",
          options: [
            "Score de 5 : on peut l'ignorer",
            "Score de 6 : il faut le traiter en priorité",
            "Score de 9 : il condamne le projet",
            "Score de 1 : il se traite en dernier"
          ],
          correctAnswer: 1,
          explanation: "Le score est la probabilité multipliée par l'impact (2 × 3 = 6). À partir de 6, le risque doit recevoir une mesure de mitigation chiffrée dans le dossier."
        },
        {
          question: "Parmi ces mesures, laquelle transfère une partie du risque climatique vers un tiers ?",
          options: [
            "Souscrire une assurance récolte ou indicielle et budgétiser la prime",
            "Planter plus de surface pour compenser",
            "Retarder tous les semis d'un mois",
            "Ne rien déclarer au banquier"
          ],
          correctAnswer: 0,
          explanation: "L'assurance transfère à un assureur une part des pertes liées au climat. Sa prime est un coût fixe à intégrer dans les charges."
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
   "La filière oignon sénégalaise produit plus de 400 000 tonnes, mais une part se brade ou se perd à la récolte faute de stockage. Le projet 'Touré Niayes' produit 176 tonnes d'oignon et 69 tonnes de pomme de terre sur 10 hectares, et stocke 40 % de l'oignon pour le vendre quand les prix remontent (juin à août)."
2. **Le Marché et l'Avantage concurrentiel :**
   "Notre avantage : un oignon calibré, trié et conditionné en filet, ciblant directement les syndicats de grossistes de Dakar, avec qui des contacts de pré-commande ont été établis."
3. **L'Équipe (Le porteur) :**
   "Le projet est porté par Diap Touré, gestionnaire (licence en réseaux et sécurité informatique) et maraîcher en exploitation familiale depuis plusieurs années, appuyé par un chef de culture spécialisé."
4. **Le Besoin de Financement (Le nerf de la guerre) :**
   "Pour réaliser ce projet sur 10 hectares sécurisés foncièrement, le besoin d'investissement total est de 55 000 000 FCFA."
5. **La Rentabilité et le Retour sur investissement :**
   "Le porteur apporte 11 000 000 FCFA (20%). Nous sollicitons un emprunt de 44 000 000 FCFA. Le crédit (9 %, 7 ans dont 1 an de différé) est remboursé par des flux qui le couvrent 2,0 fois en scénario réaliste et 1,2 fois en scénario pessimiste. Le chiffre d'affaires prévisionnel réaliste est de 54,4M FCFA en année de croisière (46,2M en année 1), pour un résultat net de 12M FCFA. Le TRI du projet est de 26,9 % sur 5 ans (VAN de 33,0M FCFA à 10 %)."

### La règle de forme
- Pas de jargon incompréhensible. 
- Des phrases courtes et percutantes.
- Des chiffres précis, tirés de vos tableaux financiers.
- Un design épuré (une mise en page simple, sans surcharge).

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
- *Slide 2 :* Le problème identifié sur le marché (ex: toute la récolte d'oignon arrive en même temps, les prix s'effondrent à la récolte puis remontent quelques mois plus tard).
- *Slide 3 :* La solution proposée (Le projet de la ferme et son produit phare).
- *Slide 4 :* La taille du marché et la cible (Qui va acheter ?).
- *Slide 5 :* Le modèle d'affaires (Comment vous fixez vos prix et faites vos marges).
- *Slide 6 :* L'itinéraire technique et les opérations (La preuve que vous savez produire).
- *Slide 7 :* L'équipe (La preuve que vous savez gérer).
- *Slide 8 :* Le calendrier d'exécution (Mise en place de la ferme).
- *Slide 9 :* Les données financières clés (Investissement, CA, Rentabilité sur 3 ans).
- *Slide 10 :* La demande (Ce que vous attendez du jury/banquier : "Nous cherchons X millions").

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

Vous avez terminé la théorie de cette formation. Il reste l'essentiel : écrire VOTRE business plan.

### Le plan type d'un business plan agricole (12 sections)

1. Résumé opérationnel (Executive Summary) : 1 à 2 pages, écrit en dernier
2. Contexte, problème et solution
3. Le porteur de projet et l'équipe
4. Étude de marché : environnement, clients, concurrence, FFOM
5. Produits et itinéraire technique
6. Calendrier d'installation et de production
7. Forme juridique, organisation, autorisations
8. Stratégie commerciale et plan de prospection
9. Investissements, plan de financement et BFR
10. Prévisions financières : chiffre d'affaires en 3 scénarios, compte de résultat, trésorerie, bilan
11. Indicateurs : seuil de rentabilité, couverture de la dette (DSCR), VAN, TRI
12. Risques, mitigation et annexes (devis, preuves foncières, lettres d'intention, CV)

Le canevas agrolide téléchargeable (modèle de document et classeur financier) sera ajouté à la plateforme prochainement. En attendant, suivez ce plan type chapitre par chapitre.

### Votre plan d'action en 90 jours

- **Jours 1 à 30 :** enquêtes de terrain (au moins 10 acheteurs), prix relevés et datés, choix des cultures et de la surface, premiers devis.
- **Jours 31 à 60 :** itinéraire technique chiffré, plan de financement, prévisions financières sur tableur, lettres d'intention d'achat, acte foncier.
- **Jours 61 à 90 :** résumé opérationnel, pitch de 10 diapositives, relecture par un professionnel (banquier, comptable, agronome, mentor), dépôt des premiers dossiers.

### Votre checklist avant d'envoyer le dossier

- Chaque chiffre renvoie à un devis, une enquête ou une source datée.
- Le même porteur, les mêmes montants et les mêmes hypothèses reviennent dans toutes les sections.
- Les trois scénarios et la couverture de la dette (DSCR) sont calculés.
- Les risques sont cotés et chacun a une mesure de mitigation.
- L'acte foncier et les devis sont en annexe.

N'oubliez pas : un bon business plan n'est jamais terminé. Il vit, s'adapte, et évolue au fur et à mesure que vous rencontrez le marché réel.

Bonne chance dans votre aventure entrepreneuriale agricole !`,
      quiz_json: []
    }
  ]
};
