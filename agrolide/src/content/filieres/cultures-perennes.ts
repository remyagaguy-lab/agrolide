import type { Filiere } from './types'

/**
 * Module de filière « Cultures pérennes et de rente ». Chiffres du cas « Cacaoyère de 20 hectares en Côte d'Ivoire »
 * (src/content/cas-chiffres/cacao-cote-d-ivoire.ts, calculé sur 15 ans par scripts/modeles_bp/cas_chiffres.py) :
 * hypothèses pédagogiques, à remplacer par vos devis, vos rendements mesurés et vos relevés de prix datés.
 */
export const culturesPerennes: Filiere = {
  slug: 'cultures-perennes',
  titre: 'Cultures pérennes et de rente',
  resume: "Cinq leçons pour chiffrer une plantation (cacao, anacarde, café, palmier) : phases de vie, rendement et prix, coût de l'attente, financement long, indicateurs sur 15 ans. Cas chiffré (Côte d'Ivoire) et classeur Excel inclus.",
  statut: 'disponible',
  casSlug: 'cacao-cote-d-ivoire',
  gabarit: {
    libelle: 'Classeur Excel : résultat sur 15 ans, financement avec différé, VAN, TRI, DSCR',
    url: '/documents/bp-agricole/Agrolide-gabarit-cultures-perennes.xlsx',
  },
  lecons: [
    {
      id: 'cp_1',
      titre: 'Un projet à phases : installation, montée en production, croisière',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez décrire les phases de vie d'une plantation et construire le calendrier des recettes sur 15 ans, qui est la base de tout le plan d'une culture pérenne.

### Ce qui change avec une culture pérenne
Pour une culture annuelle, vous plantez, récoltez, vendez dans la même année. Pour un cacaoyer, un anacardier, un caféier ou un palmier, vous investissez **plusieurs années avant la première récolte**, puis la plantation produit pendant des décennies. Le plan d'affaires ne se lit plus sur 3 ou 5 ans : il se lit sur **10 à 20 ans**.

### Les trois phases du cas
Cacaoyère de 20 hectares (Côte d'Ivoire), horizon de 15 ans :
| Phase | Années | Production |
|---|---|---|
| Installation | 1 à 3 | Aucune récolte de fèves ; cultures associées (plantain, vivrier) : 3,0 M FCFA par an |
| Montée en production | 4 à 6 | 25 %, puis 50 %, puis 75 % du rendement de croisière |
| Croisière | 7 à 15 | 100 % : 900 kg/ha, soit 18 t de fèves par an |

### La montée en production
La production n'arrive pas d'un coup. Les jeunes arbres produisent peu, puis de plus en plus. Cette **rampe** doit être documentée : demandez-la à un technicien de la filière, à un organisme de recherche agricole ou à des producteurs de votre zone, avec la source et la date. Une rampe trop optimiste est l'erreur la plus fréquente.

### Cultures associées
Planter du plantain, du manioc ou d'autres vivriers entre les jeunes arbres génère des recettes pendant les années sans récolte et protège les jeunes plants du soleil. Dans le cas : 3,0 M FCFA par an pendant 3 ans. Vérifiez que ces cultures ne concurrencent pas les arbres (eau, lumière, nutriments).

### Les points à écrire dans le dossier
- l'horizon du plan et sa justification ;
- le calendrier de plantation (toute la même année, ou par tranches) ;
- la rampe de production, avec la source ;
- la durée de vie productive de la plantation et la date de renouvellement éventuel.

#### Ce qu'il faut retenir
- Une culture pérenne se lit sur 10 à 20 ans, pas sur 3 à 5 ans.
- Il y a trois phases : installation, montée en production, croisière.
- La rampe de production est une hypothèse à sourcer avec soin.

### Exercice
Construisez le calendrier de votre plantation sur 15 ans (surfaces plantées, part du rendement de croisière par année, cultures associées) avec la feuille Plantation du classeur joint.
`,
    },
    {
      id: 'cp_2',
      titre: 'Rendement et prix : ce qui fait le chiffre d\'affaires de croisière',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez calculer le chiffre d'affaires de croisière d'une plantation et expliquer pourquoi le rendement et le prix sont les deux hypothèses les plus sensibles de votre plan.

### Le calcul
> Chiffre d'affaires de croisière = surface × rendement par hectare × prix au kilo.

Dans le cas : 20 ha × 900 kg/ha = **18 000 kg** de fèves sèches ; à 1 800 FCFA/kg, **32,4 M FCFA** par an.

### Le rendement
Le rendement affiché par un fournisseur de plants est un rendement de potentiel, pas le vôtre. Il dépend de la variété, de la densité, de l'entretien, de l'ombrage, du sol et du climat. Retenez des rendements **mesurés** dans votre zone, par des producteurs comparables, avec la source et la date. Un rendement surestimé de 10 % déforme tout le plan.

### Le prix
Le prix d'une culture de rente est exposé à deux sources d'incertitude :
- **le marché mondial**, qui fluctue d'une campagne à l'autre ;
- **le dispositif national** : dans certains pays, un prix est garanti ou fixé par l'administration ; dans d'autres, le prix est libre. Vérifiez-le pour votre pays et votre produit, avec date et source.

Le prix retenu dans un plan sur 15 ans est une hypothèse **prudente** et **testée**. Dans le cas, le scénario pessimiste retient un rendement et un prix inférieurs de 10 % chacun, soit un chiffre d'affaires de croisière de 26,2 M FCFA au lieu de 32,4 M (− 19 %).

### La qualité
Pour beaucoup de cultures de rente, la qualité détermine l'accès à un acheteur et parfois une prime : fermentation et séchage du cacao, triage de l'anacarde, tri des cerises de café. La post-récolte est donc une partie de l'investissement, pas un détail (voir la leçon suivante).

### Qui achète ?
Coopératives, négociants, exportateurs, usines de transformation : identifiez votre acheteur, ses conditions de paiement, ses exigences de qualité et son éventuel appui (intrants, traçabilité). Une lettre d'intention ou un contrat d'achat vaut mieux qu'une promesse orale (voir la leçon 4.2).

#### Ce qu'il faut retenir
- Chiffre d'affaires = surface × rendement × prix.
- Rendement mesuré, prix testé : ce sont vos deux hypothèses les plus sensibles.
- Identifiez votre acheteur et vos exigences de qualité avant de planter.

### Exercice
Calculez le chiffre d'affaires de croisière de votre plantation avec vos hypothèses sourcées, puis testez avec le classeur joint un rendement et un prix inférieurs de 10 %.
`,
    },
    {
      id: 'cp_3',
      titre: "Le coût de l'attente : installation, entretien et années sans récolte",
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez chiffrer le véritable coût d'une plantation : non seulement l'installation, mais aussi les années d'entretien avant que la récolte ne couvre les charges.

### L'installation
Dans le cas de la cacaoyère, les immobilisations représentent **27,0 M FCFA** :
| Poste | Montant (M FCFA) | Durée |
|---|---|---|
| Frais d'établissement et agréments | 0,5 | 5 ans |
| Installation de la plantation (préparation, plants, ombrage, pare-feu) | 18,0 | 25 ans |
| Fermentoir, séchoir et magasin | 4,0 | 20 ans |
| Forage, outillage et petit matériel | 3,0 | 8 ans |
| Imprévus (capitalisés) | 1,5 | 10 ans |
| **Total** | **27,0** | |

La plantation elle-même (18,0 M) représente les deux tiers de l'investissement.

### L'entretien pendant l'attente
Les arbres ne produisent pas, mais ils demandent du travail : désherbage, taille, fertilisation, traitements, protection contre le feu. Dans le cas : 0,25 M FCFA par hectare et par an (5,0 M FCFA) pendant l'installation, puis 0,30 M FCFA par hectare (6,0 M FCFA) en production. S'y ajoutent le personnel permanent (3,6 M FCFA par an) et les charges fixes (1,2 M FCFA par an).

### Les déficits d'exploitation
Pendant l'installation, les recettes des cultures associées (3,0 M FCFA) ne couvrent pas ces charges : l'EBE est de **− 6,8 M FCFA** par an les années 1 à 3, puis de **− 3,8 M** l'année 4. Au total, **24,2 M FCFA** de déficits à financer avant que l'exploitation ne se paie elle-même.

### Le coût de la récolte
En production, la récolte et la post-récolte (cueillette, fermentation, séchage, sacs, transport) coûtent 250 FCFA par kg, soit 4,5 M FCFA en croisière.

### Comment réduire le coût de l'attente
- planter par tranches, pour étaler les investissements ;
- conserver des cultures associées plus longtemps ;
- réduire le personnel permanent pendant l'installation, ou utiliser du personnel déjà présent ;
- obtenir des plants de bonne qualité (une plantation ratée coûte bien plus qu'un plant plus cher).

#### Ce qu'il faut retenir
- Le coût d'un projet pérenne = immobilisations + déficits d'exploitation des années sans récolte (+ intérêts).
- Chiffrez l'entretien année par année, pas seulement l'installation.
- Une plantation de mauvaise qualité est un coût caché de plusieurs années.

### Exercice
Établissez avec le classeur joint le tableau des immobilisations de votre plantation et calculez vos déficits d'exploitation des premières années.
`,
    },
    {
      id: 'cp_4',
      titre: 'Financer l\'attente : emprunt long, différé et apport',
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez construire un plan de financement adapté à une plantation : emprunt long avec différé, apport plus élevé, et réserve pour passer les années sans récolte.

### Le coût total du projet
Dans le cas de la cacaoyère :
| Poste | M FCFA |
|---|---|
| Immobilisations | 27,0 |
| Déficits d'exploitation (années 1 à 5) | 24,2 |
| Intérêts payés pendant le différé | 18,9 |
| **Coût total du projet** | **70,2** |

Le financement : apport **28,1 M** (40 %), emprunt **42,1 M** à 9 % sur 14 ans dont **5 ans de différé**.

### Pourquoi un long différé
Pendant les cinq premières années, seuls les intérêts sont payés (environ 3,8 M FCFA par an) ; les remboursements de capital commencent l'année 6, quand l'EBE atteint 10,1 M FCFA. L'annuité est alors d'environ 7,0 M FCFA par an.

Un différé plus court étrangle le projet. Dans un essai avec 4 ans de différé et une durée de 12 ans, le DSCR de la première année de remboursement tombait à 0,44 : la plantation n'avait pas encore atteint son rythme.

### Un apport plus élevé
Les banques demandent souvent davantage d'apport pour les cultures pérennes : le risque est long. Le cas retient 40 %. Votre apport peut être en espèces, en terrain (valorisé avec une expertise), en travail déjà investi (à justifier) ou en aide à l'investissement si elle existe. Voir la fiche Cadre pays.

### Les intérêts du différé
Un point souvent oublié : si vous empruntez 42,1 M à 9 % pendant 5 ans de différé, vous payez environ 18,9 M d'intérêts avant le premier remboursement. Ils font partie du coût du projet et doivent être financés dès le départ, par l'emprunt, l'apport ou une réserve de trésorerie.

### Le DSCR sur les années de remboursement
Le DSCR n'a de sens qu'à partir des remboursements de capital. Dans le cas : 1,44 l'année 6, puis au moins 1,9 sur les années suivantes. C'est la première année de remboursement qui est la plus tendue : la banque la regardera de près.

### Réduire la tension
- planter par tranches pour mieux caler les besoins ;
- garder des cultures associées ;
- demander une garantie ou une aide à l'investissement ;
- constituer une réserve de trésorerie pour les années 5 et 6.

#### Ce qu'il faut retenir
- Le coût du projet inclut les déficits d'exploitation et les intérêts du différé.
- Un différé long et un apport élevé sont normaux pour une culture pérenne.
- La première année de remboursement est la plus tendue : calculez-y le DSCR.

### Exercice
Avec la feuille Financement du classeur joint, calculez le coût total de votre projet, l'emprunt, l'apport et l'annuité, puis testez un différé de 3 ans au lieu de 5.
`,
    },
    {
      id: 'cp_5',
      titre: 'VAN, TRI et risques sur 15 ans',
      duree_minutes: 10,
      contenu: `### Objectif
Vous saurez lire la VAN, le TRI et le délai de récupération d'un projet de long terme, comprendre pourquoi ils sont si sensibles au rendement et au prix, et présenter les risques d'une plantation.

### Les indicateurs du cas
| Scénario | EBE de croisière | DSCR le plus bas | VAN (10 %) | TRI | Récupération |
|---|---|---|---|---|---|
| Réaliste | 17,1 | 1,44 | 4,6 | 11,2 % | 9,1 ans |
| Pessimiste (rendement − 10 %, prix − 10 %, entretien + 10 %) | 10,8 | 0,71 | − 16,1 | 5,3 % | 11,8 ans |
| Crise de prix (− 30 %) | 7,4 | 0,37 | − 26,6 | 1,5 % | 14,4 ans |

Les flux sont calculés sur 15 ans avant financement ; l'année 15 comprend la valeur nette comptable restante (8,2 M FCFA).

### Lire ces chiffres
- **Un projet de patience.** En réaliste, la VAN est positive (4,6 M FCFA) et le TRI (11,2 %) dépasse juste le taux d'actualisation de 10 %. Le projet rapporte, sans excès.
- **La récupération est tardive** : 9,1 ans. Un investisseur qui voudrait récupérer sa mise en cinq ans ne trouvera pas son compte.
- **La marge d'erreur est faible.** Un rendement et un prix inférieurs de 10 % chacun suffisent pour faire passer la VAN à − 16,1 M FCFA et le DSCR à 0,71.
- **La force du modèle** : en croisière, le DSCR reste proche de 2 ou au-dessus et l'EBE est élevé. La fragilité est dans les premières années et dans les deux hypothèses de rendement et de prix.

### Pourquoi la VAN est si sensible ici
Sur 15 ans, les recettes arrivent tard et les coûts d'attente tôt : actualiser à 10 % réduit fortement le poids des années lointaines. C'est pourquoi un projet de cultures pérennes est plus sensible aux hypothèses de rendement qu'une culture annuelle.

### Les risques propres aux cultures pérennes
- **Climatiques et sanitaires** : sécheresse, maladies, ravageurs.
- **Prix** : marché mondial ou prix administré, sur une très longue période.
- **Foncier** : un projet de 15 ans suppose un droit sur la terre sûr et durable. Voir la fiche Cadre pays.
- **Vieillissement** : prévoyez le renouvellement des arbres dans le plan.
- **Dépendance à un acheteur**.

Chiffrez chaque risque avec le modèle et écrivez la mesure de mitigation.

### Trois leviers à chiffrer
1. **Le rendement** : plants sélectionnés, entretien, densité, taille.
2. **La qualité et l'acheteur** : fermentation et séchage, contrat d'achat.
3. **Le financement** : apport, différé, aide à l'investissement.

#### Ce qu'il faut retenir
- Sur 15 ans, la VAN et le TRI sont très sensibles au rendement et au prix.
- Présentez toujours un scénario pessimiste et un scénario de crise.
- Un droit foncier sûr pour toute la durée du projet est une condition de base.

### Exercice
Avec le classeur joint, calculez la VAN et le TRI de votre projet en réaliste, puis avec rendement et prix inférieurs de 10 % (facteurs 0,9 / 0,9 / 1,1 dans la feuille Hypothèses). Classez les trois leviers de la leçon par effet sur la VAN.
`,
    },
  ],
}
