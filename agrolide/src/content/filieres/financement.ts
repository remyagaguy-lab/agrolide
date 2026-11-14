import type { Filiere } from './types'

/**
 * Module facultatif « Choisir son financement » (transversal à toutes les filières). Chiffres : même projet financé de quatre façons,
 * calculés par scripts/modeles_bp/montages_financement.py. Les taux, frais, durées et la subvention sont des exemples pédagogiques :
 * jamais des offres réelles. Remplacez-les par les offres écrites de vos financeurs, avec date et source.
 */
export const financement: Filiere = {
  slug: 'financement',
  titre: 'Choisir son financement',
  resume: "Cinq leçons transversales pour monter le financement d'un projet : les sources, la comparaison de montages chiffrés, garantie, subvention et crédit-bail, le dossier de demande, assurance et risque de change. Classeur Excel de comparaison inclus.",
  statut: 'disponible',
  gabarit: {
    libelle: 'Classeur Excel : comparer quatre montages de financement pour le même projet',
    url: '/documents/bp-agricole/Agrolide-gabarit-financement.xlsx',
  },
  lecons: [
    {
      id: 'fi_1',
      titre: 'Les sources de financement et ce que chacune finance',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez nommer les sources de financement d'un projet agricole, dire ce que chacune peut financer et laquelle correspond à votre besoin.

### Deux besoins différents
Un projet a deux types de besoins, qu'il ne faut pas mélanger :
- **L'investissement** : matériel, bâtiments, plantation. Il se finance sur plusieurs années.
- **Le besoin en fonds de roulement** : intrants, salaires et frais avant la vente. Il se finance sur quelques mois, souvent à chaque campagne.

Financer des intrants par un prêt de 7 ans, ou un tracteur par un crédit de campagne de 6 mois, est une erreur de montage.

### Les sources
| Source | Ce qu'elle finance en général | À savoir |
|---|---|---|
| **Apport personnel** | Part de l'investissement | Les financeurs en demandent presque toujours ; il rassure |
| **Banque** | Investissement et campagne | Garanties exigées, étude du dossier, délais |
| **Microfinance (SFD)** | Petits montants, campagne, parfois investissement | Plus accessible, montants et durées plus courts |
| **Fonds de garantie** | Rien directement : il couvre une partie du risque de la banque | Aide à obtenir un prêt, avec des frais et des conditions |
| **Subvention, don** | Une part d'investissement ou d'appui | Appels à projets, calendrier, critères, justificatifs |
| **Crédit-bail** | Du matériel loué puis éventuellement acquis | Pas de garantie sur autre chose que le matériel |
| **Warrant, récépissé d'entrepôt** | Un crédit gagé sur le stock stocké | Demande un entrepôt agréé et un stock de qualité |
| **Préfinancement par l'acheteur** | Les intrants d'une campagne | Via un contrat de culture ; vous vendez à cet acheteur |
| **Financement participatif** | Petits projets avec un public | Demande une communauté et une présentation soignée |
| **Capital-investissement** | Entreprises à forte croissance | Un investisseur entre au capital et attend une sortie |

Les noms, plafonds, taux et conditions des dispositifs de votre pays sont dans la fiche **Cadre pays** (vérifiée à une date donnée). Ne copiez jamais un taux ou un plafond lu dans une leçon : vérifiez la date de la source.

### Faire correspondre besoin et source
Pour chaque besoin de votre plan, écrivez : montant, durée, source envisagée, ce qu'elle exige, délai pour obtenir la réponse. Si deux besoins n'ont pas la même durée, ils n'ont pas la même source.

#### Ce qu'il faut retenir
- On distingue le financement de l'investissement et celui du besoin en fonds de roulement.
- Chaque source a ses conditions, ses coûts et ses délais : vérifiez-les par écrit.
- Les dispositifs de votre pays sont dans la fiche Cadre pays, avec leur date de vérification.

### Exercice
Dans la feuille Projet du classeur joint, remplacez le coût et le matériel par ceux de votre projet, puis listez vos besoins (investissement, campagne) avec la source envisagée pour chacun.
`,
    },
    {
      id: 'fi_2',
      titre: 'Comparer des montages : un même projet, quatre façons de le financer',
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez comparer plusieurs montages sur trois critères : la part que vous apportez, le poids du remboursement chaque année, le coût du financement.

### Le projet de départ
Un projet qui coûte **80,0 M FCFA** (70,0 d'investissements dont 60,0 de matériel, plus 10,0 de besoin en fonds de roulement) et dégage un **EBE de croisière de 20,0 M FCFA** par an. Les quatre montages ci-dessous sont des **hypothèses pédagogiques** : les taux, frais et durées sont des exemples, jamais des offres réelles.

### Les quatre montages
| | A. Prêt bancaire seul | B. Prêt avec fonds de garantie | C. Crédit-bail du matériel | D. Subvention et prêt |
|---|---|---|---|---|
| Apport | 24,0 (30 %) | 16,0 (20 %) | 20,0 (25 %) | 12,0 (15 %) |
| Subvention | 0 | 0 | 0 | 16,0 (20 %) |
| Prêt | 56,0 | 64,0 | 0 | 52,0 |
| Crédit-bail du matériel | non | non | 60,0 en 5 ans | non |
| Taux | 10 % sur 7 ans, 1 an de différé | 10 % sur 7 ans, 1 an de différé, garantie de 1,5 % du prêt | 12 % implicite | 10 % sur 7 ans, 1 an de différé |

### Ce que le remboursement pèse chaque année
| | A | B | C | D |
|---|---|---|---|---|
| Service de la dette, année 1 | 5,6 | 6,4 | 16,6 | 5,2 |
| Service de la dette, année 2 et suivantes | 12,9 | 14,7 | 16,6 (jusqu'à l'année 5) | 11,9 |
| DSCR simplifié, année 2 (EBE ÷ service) | **1,56** | **1,36** | **1,20** | **1,68** |

Lecture : le montage C n'a pas de différé et concentre le remboursement sur 5 ans : sa couverture est la plus faible (1,20). Le montage D, avec une subvention, est le plus confortable. Le montage B demande moins d'apport mais alourdit l'annuité.

### Le coût du financement
Il se mesure en additionnant tout ce que vous payez au financeur (intérêts, loyers, frais) moins ce que vous avez reçu :
| | A | B | C | D |
|---|---|---|---|---|
| Coût du financement (M FCFA) | 26,7 | 31,5 | 23,2 | 24,8 |
| Par million financé | 0,48 | 0,49 | 0,39 | 0,48 |

Attention : le coût du montage C paraît plus bas parce qu'il est **plus court** (5 ans contre 7). Un coût plus bas ne fait pas un meilleur montage. Comparez aussi la couverture de la dette, ce que le financeur exige, le délai pour obtenir l'argent.

### Ce que le banquier regarde
Beaucoup de banques attendent une couverture d'au moins 1,2 (demandez le seuil de la vôtre) ; sous 1, la dette n'est pas payée par l'exploitation. Testez chaque montage avec un scénario pessimiste de votre plan avant de choisir.

#### Ce qu'il faut retenir
- Comparez les montages sur l'apport, la couverture de la dette et le coût.
- Un coût plus bas peut venir d'une durée plus courte, avec un remboursement plus lourd.
- Un différé et une subvention améliorent la couverture, une garantie peut l'alourdir.

### Exercice
Avec la feuille Montages du classeur joint, remplacez les hypothèses par les offres de vos financeurs. Classez les quatre montages par DSCR de l'année 2, puis par coût du financement : le classement est-il le même ?
`,
    },
    {
      id: 'fi_3',
      titre: 'Garantie, subvention, crédit-bail : fonctionnement, coût, conditions',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez expliquer ce que fait une garantie, une subvention et un crédit-bail, et ce qu'ils coûtent ou exigent en contrepartie.

### Le fonds de garantie
Une garantie n'apporte pas d'argent : elle **couvre une partie de la perte de la banque** si vous ne remboursez pas. La banque accepte alors de prêter à un projet qu'elle aurait refusé faute de garanties suffisantes.
- Elle a un **coût** : dans le montage B, des frais de 1,5 % du prêt (0,96 M FCFA) à payer une fois.
- Elle a des **conditions** : projet éligible, quotité garantie, procédure, parfois plafond.
- Elle ne vous dispense pas de rembourser : le dossier reste évalué par la banque.

### La subvention
Un apport sans remboursement, mais jamais « gratuit » :
- elle suit un **appel à projets** : critères, date limite, montant plafond, part à cofinancer ;
- elle est souvent versée **après** une partie des dépenses ou par tranches : prévoyez de quoi préfinancer ;
- elle demande des **justificatifs** (factures, rapports) et des contrôles ;
- elle peut imposer des obligations (durée d'exploitation, emplois, usage du matériel).
Ne bâtissez jamais un plan dont l'équilibre dépend d'une subvention non encore accordée : présentez le plan avec et sans elle.

### Le crédit-bail
Le financeur achète le matériel et vous le loue pendant plusieurs années, avec une option d'achat à la fin.
- Le matériel sert de garantie : moins de garanties à fournir sur le reste.
- Les loyers commencent tôt et sont constants (16,6 M FCFA par an sur 5 ans dans le montage C).
- Le financeur propose parfois des conditions (assurance du matériel, entretien) à intégrer au coût.
Comparez toujours le **coût total** (loyers, frais, valeur d'option) et le prix d'achat comptant.

### Le warrant et le contrat de culture
- **Warrant ou récépissé d'entrepôt :** vous stockez votre récolte dans un entrepôt agréé et obtenez un crédit sur ce stock, remboursé à la vente. Il évite de vendre à bas prix en période de récolte.
- **Contrat de culture :** un acheteur préfinance des intrants contre une livraison. Vérifiez le prix, la qualité exigée, les pénalités.

### Où trouver les dispositifs de votre pays
Dans la fiche **Cadre pays** de votre pays : fonds de garantie, banques agricoles, programmes de financement, avec la date de vérification. Les plafonds, taux et conditions changent : contactez toujours le financeur et demandez une réponse écrite.

#### Ce qu'il faut retenir
- Une garantie facilite l'accès au prêt mais a un coût et des conditions.
- Une subvention se prépare, se préfinance et se justifie : ne comptez pas dessus avant l'accord.
- Un crédit-bail se juge sur son coût total et sa durée, pas sur le loyer seul.

### Exercice
Pour chacun des trois mécanismes (garantie, subvention, crédit-bail), écrivez dans votre plan : ce qu'il apporte, ce qu'il coûte, les pièces à fournir, le délai pour obtenir la réponse.
`,
    },
    {
      id: 'fi_4',
      titre: 'Monter le dossier de demande et convaincre',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez préparer un dossier de demande de financement complet et anticiper les questions d'un financeur.

### Ce qu'un financeur cherche
Il se pose cinq questions :
1. **Qui êtes-vous ?** Expérience, références, sérieux (le porteur).
2. **Pouvez-vous rembourser ?** Couverture de la dette en scénario réaliste et pessimiste.
3. **Combien mettez-vous ?** L'apport, qui montre votre engagement.
4. **Que se passe-t-il si cela tourne mal ?** Garanties, assurances, plan de repli.
5. **Les conditions sont-elles réunies ?** Terre sûre, autorisations, acheteurs, devis.

### Les pièces d'un dossier type
| Pièce | À vérifier |
|---|---|
| Business plan complet et résumé opérationnel | Mêmes chiffres partout |
| Modèle financier avec les trois scénarios et le DSCR | Hypothèses sourcées et datées |
| Pièces d'identité, statuts et immatriculation | À jour |
| Preuve du droit sur la terre | Valable pour toute la durée du prêt |
| Devis datés des équipements | Plusieurs devis comparés |
| Lettres d'intention ou contrats d'achat | Volumes, prix, signature |
| Relevés de compte, historique d'exploitation | Si l'activité existe déjà |
| Autorisations (eau, sanitaire, environnement) | Selon le pays et l'activité |
| CV du porteur et de l'équipe | Cohérents avec le plan |

Chaque dispositif a sa liste : demandez-la au financeur et suivez-la à la lettre.

### Erreurs fréquentes
- des chiffres qui changent d'une section à l'autre ;
- un plan qui ne couvre pas la dette en scénario pessimiste ;
- un apport qui n'existe pas encore sur un compte ;
- l'absence de devis ou de lettres d'intention ;
- un dossier trop long, sans résumé, ou en retard sur la date limite.

### Après le dépôt
Notez la date, la personne, le numéro de dossier. Relancez poliment, répondez vite aux demandes de pièces. **En cas de refus**, demandez la raison par écrit : elle indique ce qu'il faut corriger avant de redéposer ailleurs.

### Se préparer à l'oral
Préparez les trois réponses les plus difficiles : le prix de vente, la couverture de la dette si la récolte baisse, ce que vous faites si l'acheteur principal part.

#### Ce qu'il faut retenir
- Un financeur évalue le porteur, la capacité de remboursement, l'apport, les garanties et les conditions réunies.
- Un dossier cohérent et complet vaut mieux qu'un dossier long.
- Un refus expliqué par écrit est une information utile.

### Exercice
Avec la liste des pièces ci-dessus, faites votre check-list personnelle : cochez ce que vous avez, datez ce qui manque, nommez la personne qui doit le fournir.
`,
    },
    {
      id: 'fi_5',
      titre: 'Assurance agricole et risque de change',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez présenter l'assurance et la couverture du risque de change comme des mesures de mitigation chiffrées de votre plan.

### Pourquoi en parler dans un dossier
Un financeur prête mieux quand il voit que les gros risques sont **transférés** (assurance) ou **limités** (contrats, prix, marge). Une assurance chiffrée est une mesure de mitigation de la leçon 6.1.

### Les assurances utiles
| Type | Ce qu'elle couvre | Remarque |
|---|---|---|
| Assurance sur indice climatique | Une pluviométrie ou une température hors seuil, pour une zone | Paie selon l'indice, pas selon vos pertes réelles |
| Assurance récolte (multirisque) | Les pertes de rendement par événements listés | Conditions de souscription, franchises |
| Assurance du bétail | Mortalité de certains animaux | Exige un suivi sanitaire |
| Assurance du matériel et des bâtiments | Vol, incendie, accident | Souvent exigée par le financeur |
| Assurance responsabilité | Dégâts causés à des tiers | À étudier pour un service ou une transformation |
Les offres, les prix et les conditions varient selon le pays et l'assureur : demandez un **devis écrit**, avec la date, et mettez la prime dans vos charges fixes. N'écrivez pas qu'une assurance couvre un risque sans avoir lu ce qu'elle exclut.

### Intégrer l'assurance dans le plan
- Ajoutez la **prime** dans les charges (leçon 5.4).
- Dans le scénario pessimiste, calculez ce que l'assurance verse (ou ne verse pas) et son effet sur le DSCR.
- Décrivez la procédure en cas de sinistre : délais, preuves, personne à prévenir.

### Le risque de change
Il existe quand une partie de vos coûts ou de vos ventes est dans une **autre monnaie** que celle de votre plan : intrants importés, matériel acheté à l'étranger, vente dans un pays voisin. Le franc CFA est lié à l'euro à parité fixe, mais cette situation et ses règles doivent être vérifiées à la date de votre dossier, et la parité ne vous protège pas contre un risque vis-à-vis d'une autre monnaie (naira, cedi, dollar).
Pour limiter ce risque :
- facturer dans la monnaie où se trouvent vos coûts, ou indexer le prix du contrat ;
- acheter à l'avance une partie des intrants importés ;
- tester dans votre modèle une variation défavorable de 10 % à 20 % sur les postes concernés ;
- garder une marge de sécurité, au lieu d'un plan qui ne survit qu'à un taux de change précis.

#### Ce qu'il faut retenir
- Une assurance bien choisie transfère un risque important ; une exclusion non lue est un faux sentiment de sécurité.
- Mettez la prime dans les charges et testez l'effet sur le DSCR.
- Le risque de change se limite par les contrats, les achats anticipés et un test de variation de 10 à 20 %.

### Exercice
Choisissez les trois risques les plus coûteux de votre plan. Pour chacun, indiquez s'il peut être assuré, la prime demandée sur devis, et l'effet sur le DSCR avec et sans assurance.
`,
    },
  ],
}
