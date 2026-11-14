import type { Filiere } from './types'

/**
 * Module facultatif « Dossiers de financement et calendrier des appels » (transversal). Méthode uniquement : aucune liste de pièces,
 * condition, délai, taux ni plafond d'un dispositif précis n'est citée, car aucune source officielle de ce type n'a pu être confirmée
 * le 14/11/2026. Les faits datés sur les dispositifs vivent dans les fiches Cadre pays (src/content/cadre-pays/).
 */
export const dossiersFinancement: Filiere = {
  slug: 'dossiers-financement',
  titre: 'Dossiers de financement et calendrier des appels',
  resume: "Trois leçons transversales pour déposer un dossier solide : le dossier type et ses pièces, une fiche à compléter par dispositif (aucune condition recopiée de mémoire), le rétroplanning et la veille des appels. Classeur Excel inclus : registre des dispositifs, liste des pièces, rétroplanning.",
  statut: 'disponible',
  gabarit: {
    libelle: "Classeur Excel : registre des dispositifs, liste des pièces, rétroplanning à rebours",
    url: '/documents/bp-agricole/Agrolide-gabarit-dossiers-financement.xlsx',
  },
  lecons: [
    {
      id: 'df_1',
      titre: 'Le dossier type : ce que demande presque tout financeur',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez réunir un dossier de base que vous adapterez ensuite à chaque banque, fonds de garantie ou programme.

### Un dossier, plusieurs guichets
Une banque, un fonds de garantie, un projet financé par un partenaire du développement ou un programme public demandent chacun leur liste de pièces. Mais l'essentiel se recoupe. Préparez un **dossier de base** une fois, puis ajoutez ce que chaque guichet exige en plus.

### Le dossier de base en huit blocs
| Bloc | Contenu | Où le préparer dans la formation |
|---|---|---|
| 1. Le projet | Business plan et résumé d'une à deux pages | Modules 1 à 6 et canevas Word |
| 2. Les chiffres | Modèle financier, hypothèses sourcées et datées, trois scénarios | Module 5 et classeur Excel |
| 3. L'entreprise | Statuts, extrait du registre du commerce, identifiants fiscaux et sociaux | Fiche Cadre pays |
| 4. Les personnes | Pièces d'identité, parcours, expérience des dirigeants | Module 4 |
| 5. La terre et les actifs | Preuve du droit sur la terre ou le local, devis des investissements | Fiche Cadre pays, module 3 |
| 6. Le marché | Lettres d'intention, contrats, relevés de prix datés | Leçon 4.2, module Prix et saisonnalité |
| 7. La situation financière | États ou relevés des exercices passés, relevés bancaires, crédits en cours | Module Comptabilité et fiscalité |
| 8. Les risques et l'assurance | Risques chiffrés, mesures, devis d'assurance | Leçon 6.1 |

### Ce qui change d'un guichet à l'autre
- les **conditions d'éligibilité** (âge, statut, secteur, taille, localisation) ;
- les **pièces supplémentaires** (attestations, formulaire propre au guichet) ;
- le **format** (formulaire en ligne, dossier papier, passage par une banque partenaire) ;
- les **délais** d'instruction et de décaissement.

### Règle de ce module : rien de mémoire
Les conditions, les pièces, les délais et les montants d'un dispositif changent. Ce module **ne les recopie pas** : il vous apprend à les relever à la source, à la date où vous écrivez. Un dossier qui cite un plafond ou une condition périmée est refusé ou, pire, mal compris.

### Les erreurs classiques
- un modèle financier dont on ne retrouve pas les hypothèses ;
- un apport annoncé sans preuve ;
- des devis anciens ou sans date ;
- un dossier qui répond à un autre dispositif que celui visé ;
- des pièces périmées (attestations, extraits).

#### Ce qu'il faut retenir
- Préparez un dossier de base en huit blocs, puis adaptez-le à chaque guichet.
- Les conditions, pièces, délais et montants d'un dispositif se relèvent à la source, avec la date.
- Un dossier daté, sourcé et complet évite les allers-retours.

### Exercice
Avec la feuille Pièces du classeur joint, indiquez pour chacune des douze pièces si vous l'avez, sa date, et ce qui manque. Calculez le nombre de pièces à obtenir.
`,
    },
    {
      id: 'df_2',
      titre: 'Une fiche par dispositif : relever, dater, décider',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez construire la fiche d'un dispositif de financement ou de garantie, avec des faits sourcés et datés, et décider si vous déposez ou non.

### La fiche à compléter
Pour chaque dispositif envisagé, remplissez une ligne du registre (feuille Registre du classeur joint) :
| Champ | Ce que vous écrivez |
|---|---|
| Dispositif | Nom exact et sigle |
| Organisme et contact | Qui reçoit le dossier, adresse, personne jointe |
| Ce qu'il finance ou garantit | Prêt, garantie d'un prêt bancaire, subvention, assistance technique |
| Conditions d'éligibilité | Telles que lues à la source, avec le lien ou le nom du document |
| Pièces demandées | La liste fournie par le guichet lui-même |
| Délai annoncé | En jours, donné par le guichet |
| Date de la dernière vérification | Jour, mois, année |
| Statut | Actif, en transition, non confirmé |
| Prochaine échéance | Date limite connue, sinon « non confirmé » |
| Décision | Déposer ou écarter, avec la raison |

### D'où viennent les faits
Par ordre de fiabilité :
1. **le guichet lui-même** (site officiel, courrier, rendez-vous) ;
2. **le texte** qui crée le dispositif (loi, décret, convention) ;
3. **la banque ou l'institution partenaire** qui instruit le dossier ;
4. **la presse** : utile pour repérer un sujet, jamais pour fixer une condition ou un montant.

### Un exemple de statut honnête
Les fiches Cadre pays listent les dispositifs repérés par pays, avec leur statut vérifié et daté. Par exemple, la fiche du Togo indique que le FAIEJ est « en transition » vers l'ADTPME, avec une promulgation non confirmée à la date de vérification. C'est ce statut-là qu'il faut écrire dans votre fiche, pas « actif » par habitude.

Pour plusieurs dispositifs cités dans ces fiches (garanties ANPGF au Togo, FONGIP et DER/FJ au Sénégal), **la liste détaillée des pièces et les conditions actuelles n'ont pas pu être confirmées** à la date de rédaction de ce module, faute de source officielle accessible : elles figurent dans votre registre comme « à demander au guichet ». Demandez-les par écrit, et conservez la réponse.

### Décider de déposer
Posez-vous trois questions :
- suis-je **éligible** selon le texte, pas selon un ouï-dire ?
- le dispositif **finance ou garantit-il** ce dont mon projet a besoin (investissement, campagne, apport) ?
- le **délai** est-il compatible avec mon calendrier (voir la leçon suivante) ?

Un dossier déposé à un guichet auquel on n'est pas éligible coûte du temps et peut brûler une occasion.

#### Ce qu'il faut retenir
- Chaque dispositif a sa fiche : conditions, pièces, délai, source, date.
- Le guichet est la source première ; la presse ne fixe pas une condition.
- Un statut « non confirmé » honnête vaut mieux qu'un statut « actif » supposé.

### Exercice
Choisissez deux dispositifs de votre pays dans la fiche Cadre pays, remplissez leur ligne du registre à partir de la source officielle, et rédigez le message écrit par lequel vous demandez au guichet la liste des pièces et le délai.
`,
    },
    {
      id: 'df_3',
      titre: 'Le calendrier : rétroplanning et veille des appels',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez calculer à rebours la date à laquelle commencer votre dossier, et organiser une veille pour ne pas manquer un appel.

### Le rétroplanning
Partez de la date à laquelle **vous avez besoin des fonds** (début de la campagne, livraison du matériel). Remontez le temps :
1. retirez une **marge de sécurité** ;
2. retirez le **délai de décaissement** après l'accord ;
3. retirez le **délai d'instruction** du dossier ;
4. retirez le **temps pour réunir les pièces**.

Avec les délais d'exemple du classeur joint (hypothèses pédagogiques, à remplacer par les délais annoncés par le guichet) : fonds nécessaires le 1er mai, décaissement 30 jours, instruction 60 jours, pièces 45 jours, marge 15 jours. Résultat : accord à obtenir au plus tard le 17 mars, dossier à déposer au plus tard le 16 janvier, début de la constitution du dossier le 2 décembre, soit **150 jours** au total. Si vous partez trop tard, la campagne se fera sans le financement ou avec un crédit d'urgence plus cher.

### Le calendrier des appels
Certains dispositifs fonctionnent **au guichet ouvert** toute l'année ; d'autres lancent des **appels à candidatures** avec une date limite. Pour chacun, notez dans le registre :
- s'il y a un appel ouvert, sa date de clôture et la date de publication des résultats ;
- sinon, « non confirmé » ou « guichet ouvert, à confirmer ».

N'inventez jamais une date d'appel : une date approximative dans un plan ne rassure personne.

### Organiser la veille
- **Une fois par mois**, consultez les pages officielles de vos dispositifs et notez la date de consultation.
- **Abonnez-vous** aux lettres d'information ou aux pages d'actualité des guichets, de votre chambre d'agriculture, de votre coopérative, de votre fédération.
- **Posez la question** à la banque qui vous suit : elle connaît souvent les lignes ouvertes.
- **Revérifiez** toute ligne du registre vieille de plus de 90 jours : la feuille Registre du classeur les compte pour vous.

### Quand le calendrier ne tient pas
- Demandez-vous si un **financement-relais** (crédit de campagne, avance de l'acheteur) permet de ne pas attendre la décision : voyez le module Choisir son financement.
- Décalez une partie de l'investissement : commencez par ce qui est indispensable à la première campagne.
- Gardez le dossier prêt : un dossier complet se redépose en quelques jours.

#### Ce qu'il faut retenir
- On calcule le calendrier à rebours depuis la date où les fonds sont nécessaires.
- Une date d'appel non confirmée s'écrit « non confirmé ».
- Une veille mensuelle, datée, évite de manquer un appel.

### Exercice
Avec la feuille Rétroplanning du classeur joint, entrez la date à laquelle vous avez besoin des fonds et les délais demandés au guichet, lisez la date de début de constitution du dossier, et rédigez votre plan de veille mensuelle.
`,
    },
  ],
}
