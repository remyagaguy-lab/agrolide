import { ParcoursSeed } from './types';
import { QUIZ } from './quiz_banque';

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
      quiz_json: QUIZ["lec_6_1"]
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

**Ressource à télécharger :** le [canevas de business plan (Word, 12 sections)](/documents/bp-agricole/Agrolide-canevas-business-plan-agricole.docx) contient une trame de résumé et de chaque section ; les chiffres à y reporter viennent du [modèle financier (Excel, pré-rempli avec le cas Diap Touré)](/documents/bp-agricole/Agrolide-modele-financier-business-plan-agricole.xlsx).

#### Ce qu'il faut retenir
- L'Executive Summary se place au début du document mais s'écrit à la toute fin du processus.
- C'est la seule partie que tous les décideurs (directeur de banque, membres du comité) liront en entier.
- Il doit résumer l'opportunité de marché, l'équipe, le montant demandé, votre apport personnel, et la rentabilité financière.`,
      quiz_json: QUIZ["lec_6_2"]
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

**Ressource à télécharger :** le [modèle de pitch deck (PowerPoint, 10 diapositives)](/documents/bp-agricole/Agrolide-modele-pitch-deck.pptx) reprend ces dix diapositives, avec des consignes pour chacune dans les notes de l'orateur.

#### Ce qu'il faut retenir
- Les annexes ne sont pas des pages poubelles, ce sont les preuves matérielles de vos affirmations (devis, foncier).
- Ne soumettez jamais un projet si le foncier n'est pas légalement sécurisé par un document en annexe.
- Le Pitch Deck est l'outil visuel de 10 slides qui servira de support à votre présentation orale pour séduire les investisseurs en quelques minutes.`,
      quiz_json: QUIZ["lec_6_3"]
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

### Les modèles à télécharger

- [canevas de business plan (Word, 12 sections)](/documents/bp-agricole/Agrolide-canevas-business-plan-agricole.docx) : le plan type ci-dessus, section par section, avec trames à remplir, pièges à éviter et checklist finale.
- [modèle financier (Excel, pré-rempli avec le cas Diap Touré)](/documents/bp-agricole/Agrolide-modele-financier-business-plan-agricole.xlsx) : investissements, amortissements, BFR, charges, chiffre d'affaires en trois scénarios, compte de résultat, trésorerie mensuelle, tableau de dette avec différé, bilan, seuil de rentabilité, DSCR, VAN et TRI. Remplacez les chiffres du cas par les vôtres (cellules bleues).
- [modèle de pitch deck (PowerPoint, 10 diapositives)](/documents/bp-agricole/Agrolide-modele-pitch-deck.pptx) : dix diapositives (problème, solution, marché, modèle d'affaires, itinéraire technique, équipe, calendrier, chiffres, demande).

Ces trois fichiers sont des modèles pédagogiques : adaptez-les à votre pays, vérifiez les taux (impôt, cotisations, intérêts) et faites relire votre dossier avant envoi.

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
