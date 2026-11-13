import { ParcoursSeed } from './types';
import { QUIZ } from './quiz_banque';

export const parcours4: ParcoursSeed = {
  id: "bp_agri_p4",
  titre: "Parcours 4 — Élaborez votre stratégie commerciale",
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
- Actions : Rencontre physique avec les gérants de supermarchés, les usines de transformation ou les grands grossistes. On leur demande : "Si je vous produis telle quantité, avec tel calibre, à telle période, seriez-vous prêt à l'acheter ?"

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

#### Ce qu'il faut retenir
- On ne cherche pas ses clients le jour de la récolte, on vend avant de récolter.
- Segmentez votre prospection en 3 phases : Sécurisation (avant semis), Teasing (pendant la croissance) et Conclusion (avant la récolte).
- La prospection commerciale génère des frais (déplacement, communication, emballage) qui doivent obligatoirement figurer dans votre budget prévisionnel.`,
      quiz_json: QUIZ["lec_4_2"]
    }
  ]
};
