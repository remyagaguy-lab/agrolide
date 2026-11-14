import { ParcoursSeed } from './types';
import { QUIZ } from './quiz_banque';

export const parcours4: ParcoursSeed = {
  id: "bp_agri_p4",
  titre: "Parcours 4 : Élaborez votre stratégie commerciale",
  description: "Définir comment vous allez vendre votre production et à qui, en structurant votre marketing mix et votre plan de prospection.",
  lecons: [
    {
      id: "lec_4_1",
      titre: "Construire votre stratégie marketing (Les 4P)",
      duree_minutes: 10,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable de rédiger votre politique des 4P (Produit, Prix, Place/Distribution, Promotion) pour un produit agricole, afin de montrer comment vous passerez du champ au client final.

### Le mythe du "Bon produit qui se vend tout seul"

En agriculture, produire est difficile, mais vendre au bon prix est souvent le plus grand défi. Beaucoup de projets échouent car l'agriculteur pense que le marché va venir à lui le jour de la récolte. La stratégie marketing (le Mix Marketing ou les 4P) prouve à la banque que vous avez réfléchi à l'écoulement de votre production.

### La méthode des 4P adaptée à l'agriculture

**1. Le Produit (Product)**
Ce n'est pas seulement ce qui sort de terre, c'est l'ensemble de l'offre.
- Quel est l'emballage ? (Filet de 25kg, sac de 100kg, barquette de 500g).
- Quel est le calibrage ?
- Y a-t-il une certification (Bio, équitable) ?
- Quelle est l'image de marque (votre logo sur le filet) ?

**2. Le Prix (Price)**
En agriculture, le prix fluctue selon l'offre et la demande. Comment fixez-vous le vôtre ?
- *Prix d'alignement :* Vous vendez au même prix que le marché du jour (le plus courant).
- *Prix de pénétration :* Vous vendez légèrement moins cher pour arracher des parts de marché (attention à la guerre des prix).
- *Prix d'écrémage (Premium) :* Vous vendez plus cher en justifiant par une qualité supérieure (tri, nettoyage, livraison incluse).

**3. La Distribution (Place)**
Comment le produit va-t-il du champ au client ?
- *Vente directe :* Vente bord-champ, marchés locaux, livraison directe aux restaurants. (Marge forte, logistique lourde).
- *Vente indirecte (circuit court ou long) :* Vente à des grossistes (bana-banas), des centrales d'achat de supermarchés, ou des coopératives. (Marge plus faible, gros volumes).

**4. La Communication (Promotion)**
Comment faites-vous connaître votre produit ?
- Échantillonnage gratuit auprès des restaurateurs.
- Présence sur les réseaux sociaux (très efficace pour le B2C et B2B aujourd'hui).
- Visites de la ferme organisées pour les acheteurs (grossistes).

### Le cas de Diap Touré : Une stratégie 4P claire

Voici comment Diap a défini son Mix Marketing pour son oignon :

- **Produit :** Oignon sec, trié sans pourriture, de calibre moyen à gros (45-70mm), conditionné dans des filets neufs rouges de 25 kg étiquetés "Ferme Touré Niayes".
- **Prix :** Alignement sur le marché du jour à la récolte (environ 160 FCFA/kg pour 60 % du volume), puis vente différée de la part stockée (40 % du volume) à environ 260 FCFA/kg quand les prix remontent : soit un prix moyen pondéré d'environ 200 FCFA/kg. Le gain vient du stockage, pas d'une prime : le tri et la ventilation évitent seulement les oignons pourris au fond du sac.
- **Distribution :** Circuit indirect court. Vente bord-champ, mais l'acheteur (le grossiste) doit venir chercher la marchandise avec son propre camion. Diap ne gère pas le transport pour limiter ses risques logistiques.
- **Communication :** Prospection téléphonique directe des grands grossistes des marchés de Dakar avec envoi de photos via WhatsApp pendant le cycle de culture (pour "teaser" la récolte) et invitation à visiter le hangar de stockage.

#### Ce qu'il faut retenir
- Le marketing agricole est indispensable : produire ne sert à rien si on ne sait pas vendre.
- Déclinez votre offre en 4 piliers : Produit (qualité/emballage), Prix (stratégie), Distribution (circuits) et Communication (visibilité).
- Justifiez toujours un prix de vente supérieur par une valeur ajoutée réelle (tri, emballage, certification).`,
      quiz_json: QUIZ["lec_4_1"]
    },
    {
      id: "lec_4_2",
      titre: "Élaborer votre plan de prospection et de mise en marché",
      duree_minutes: 8,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable de construire un calendrier de prospection réaliste et de budgétiser vos actions marketing pour prouver que vous n'attendez pas la récolte pour chercher des clients.

### Le timing de la prospection agricole

La pire erreur d'un agri-preneur est de commencer à chercher des clients le jour où la tomate est rouge. En agriculture, les produits sont périssables. Chaque jour de retard dans la vente entraîne des pertes de poids (déshydratation), des pourritures, et fait chuter votre pouvoir de négociation.

**La règle d'or : On vend avant de récolter.**

Votre plan de prospection est un calendrier qui indique quand et comment vous allez contacter vos clients potentiels (identifiés dans votre segmentation au Module 2).

### Les 3 phases du plan de prospection

**Phase 1 : Avant le semis (La sécurisation)**
- Objectif : Tester le marché et, si possible, signer des contrats de culture ou des lettres d'intention d'achat.
- Actions : Rencontre physique avec les gérants de supermarchés, les usines de transformation ou les grands grossistes. On leur demande : « Si je vous produis telle quantité, avec tel calibre, à telle période, seriez-vous prêt à l'acheter ? »

**Phase 2 : Pendant la croissance (Le teasing)**
- Objectif : Maintenir l'intérêt de l'acheteur et prouver que la récolte sera au rendez-vous.
- Actions : Envois réguliers de photos de l'évolution des champs via WhatsApp. Invitation des acheteurs clés à visiter la ferme. Distribution de premiers échantillons (si récolte échelonnée).

**Phase 3 : Un mois avant la récolte (La conclusion)**
- Objectif : Fixer les prix (selon les cours du moment), signer les bons de commande fermes et organiser la logistique des camions.
- Actions : Appels de relance, négociation finale, planification des enlèvements bord-champ.

### Le budget marketing

Prospecter coûte de l'argent. Ce coût doit être intégré dans votre plan de financement initial, sans quoi vous n'aurez pas les moyens de vendre !
Vous devez créer un petit tableau budgétaire prévoyant :
- Les frais de déplacement (carburant, péage) pour aller voir les acheteurs en ville.
- Les frais de communication (crédit téléphonique, internet).
- La création d'outils marketing (cartes de visite, conception et impression d'étiquettes pour vos emballages).
- L'envoi d'échantillons gratuits.

**Le budget de Diap Touré :** 
Diap a budgétisé 1 000 000 FCFA par an (inclus dans ses charges fixes) : 400 000 FCFA pour la conception et l'impression d'étiquettes à coudre sur ses filets (pour créer sa marque "Touré Niayes"), 350 000 FCFA de frais de déplacement vers les marchés de Dakar pour rencontrer les syndicats de grossistes, 150 000 FCFA de crédit téléphonique et d'internet, et 100 000 FCFA d'échantillons. 
Ce budget modeste, inséré dans ses prévisions financières, a prouvé à la banque son grand pragmatisme.

### Sécuriser la vente : lettres d'intention et contrats

Vendre avant de récolter suppose de transformer l'intérêt d'un acheteur en engagement écrit. Il en existe plusieurs niveaux, du plus souple au plus ferme.

| Document | Ce que c'est | Force | Usage dans le dossier |
|---|---|---|---|
| Lettre d'intention d'achat | L'acheteur exprime son intérêt pour un produit, un volume et une période | Faible : en général non contraignante | Preuve d'un débouché, à joindre en annexe |
| Bon de commande | Commande précise (quantité, calibre, date, prix) | Moyenne à forte, selon les conditions | Prouve la demande à court terme |
| Contrat de vente ou de prévente | Engagement réciproque : le producteur livre, l'acheteur paie | Forte | Sécurise le prix et les volumes ; rassure fortement la banque |
| Contrat de culture (agriculture contractuelle) | L'acheteur commande à l'avance une production, parfois avec des intrants ou une avance | Forte | Courant avec les transformateurs et les exportateurs |

**Les clauses à prévoir dans un contrat de vente :**

1. les parties (identité complète, statut juridique, représentants) ;
2. le produit : variété, calibre, qualité, conditionnement ;
3. la quantité et le calendrier des livraisons ;
4. le prix : prix fixe, prix plancher, ou formule liée à un cours de référence, et sa date de révision ;
5. le lieu et les modalités d'enlèvement ou de livraison, et qui supporte le transport ;
6. les conditions de paiement : acompte, solde, délai ;
7. les pénalités en cas de retard ou de défaut de livraison, et les cas de force majeure (sécheresse, inondation) ;
8. la durée, les conditions de résiliation et le règlement des litiges.

**Modèle de lettre d'intention d'achat** (à faire signer et tamponner par l'acheteur) :

> **Objet : intention d'achat d'oignon de la campagne [année]**
>
> Nous, [nom de l'entreprise de l'acheteur], représentée par [nom, fonction], déclarons notre intention d'acheter à [nom de l'exploitation] les quantités suivantes : [produit, calibre, conditionnement], environ [quantité] tonnes, à livrer ou à enlever entre [mois] et [mois], au prix de référence de [prix] FCFA/kg, révisable selon les conditions du marché à la date de la récolte. Cette lettre exprime notre intérêt commercial ; elle sera suivie d'un contrat ou d'un bon de commande ferme au plus tard [délai] avant la récolte.
>
> Fait à [lieu], le [date]. Signature et cachet.

**Les pièges à éviter :**

- compter une lettre d'intention comme une vente certaine dans le plan de trésorerie ;
- accepter un prix fixé uniquement après la récolte, sans plancher ni formule ;
- ignorer la solvabilité de l'acheteur : demandez des références et limitez le crédit accordé ;
- signer sans avoir lu les pénalités de non-livraison, alors que la récolte dépend du climat ;
- oublier de faire relire le contrat par un juriste ou un conseiller local : les règles de la vente, de la preuve et des contrats varient selon les pays.

### Exercice : vos lettres d'intention et votre contrat type

**Consigne.**

1. Identifiez trois acheteurs réels (ou potentiels) de votre segment principal, avec leur volume annuel et leurs exigences de qualité.
2. Rédigez, pour chacun, une lettre d'intention adaptée (produit, volume, période, prix de référence) et faites-la signer.
3. Rédigez un projet de contrat de vente d'une page avec les huit clauses de la liste.
4. Dans votre plan de prospection, indiquez le pourcentage de votre production couvert par des engagements écrits, par niveau (lettre, bon de commande, contrat).

**Critères de réussite :**

- chaque lettre indique le produit, le volume, la période, un prix de référence, et elle est signée par une personne habilitée ;
- le projet de contrat contient les huit clauses et prévoit un traitement de la force majeure ;
- le total des volumes engagés est comparé à votre production prévisible, sans la dépasser ;
- le plan de trésorerie ne traite comme encaissements certains que les ventes sous contrat ou bon de commande ferme ;
- le budget de prospection couvre les déplacements et les relances nécessaires à ces signatures.

#### Ce qu'il faut retenir
- On ne cherche pas ses clients le jour de la récolte, on vend avant de récolter.
- Segmentez votre prospection en 3 phases : Sécurisation (avant semis), Teasing (pendant la croissance) et Conclusion (avant la récolte).
- La prospection commerciale génère des frais (déplacement, communication, emballage) qui doivent obligatoirement figurer dans votre budget prévisionnel.
- Une lettre d'intention prouve un débouché sans engager l'acheteur ; seuls un bon de commande ferme ou un contrat sécurisent prix et volumes.
- Un contrat de vente doit fixer produit, quantité, prix, enlèvement, paiement, pénalités et force majeure.`,
      quiz_json: QUIZ["lec_4_2"]
    }
  ]
};
