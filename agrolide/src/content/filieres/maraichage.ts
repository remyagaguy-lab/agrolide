import type { Filiere } from './types'

/**
 * Module de filière « Maraîchage et cultures vivrières ». Chiffres du cas « Maraîchage irrigué au Bénin »
 * (src/content/cas-chiffres/maraichage-benin.ts, calculé par scripts/modeles_bp/cas_chiffres.py) et du cas Diap Touré :
 * hypothèses pédagogiques, à remplacer par vos devis et vos relevés datés.
 */
export const maraichage: Filiere = {
  slug: 'maraichage',
  titre: 'Cultures vivrières et maraîchage',
  resume: "Cinq leçons pour chiffrer une exploitation de légumes ou de vivriers : cycles courts, eau, coûts par hectare, prix saisonniers, petite surface. Cas chiffré (Bénin) et classeur Excel inclus.",
  statut: 'disponible',
  casSlug: 'maraichage-benin',
  gabarit: {
    libelle: 'Classeur Excel : cultures, calendrier sur 12 mois, résultat annuel, sensibilité',
    url: '/documents/bp-agricole/Agrolide-gabarit-maraichage.xlsx',
  },
  lecons: [
    {
      id: 'ma_1',
      titre: 'Cycles courts et assolement : combien de récoltes par an ?',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez construire le plan de cultures d'une exploitation maraîchère ou vivrière : surfaces, nombre de cycles par an, volumes, et en déduire la production annuelle sur laquelle repose tout le chiffre d'affaires.

### La notion d'hectare-cycle
Un maraîcher ne vend pas « une récolte par an » : une même parcelle peut porter deux ou trois cycles de légumes. On compte donc en **hectares-cycles** : surface × nombre de cycles.

Cas de référence (Rufine Agossou, Bénin, 3 hectares irrigués) :
- 1,5 ha de tomate × 1 cycle = **1,5 hectare-cycle**, à 25 t/ha, soit 37,5 t ;
- 1,5 ha de chou × 2 cycles = **3 hectares-cycles**, à 30 t/ha, soit 90 t.

Au total, 4,5 hectares-cycles sur 3 hectares : le taux d'intensité culturale est de 150 %.

> Production = surface × cycles × rendement par hectare.

### Chaque cycle a ses besoins
Chaque cycle consomme des intrants, de la main-d'œuvre et de l'eau, et demande une période de préparation. Un enchaînement trop serré épuise le sol et favorise les maladies : on alterne les familles de plantes (rotation) et l'on ménage des périodes de repos ou d'engrais vert. Chez Diap Touré, 7 hectares sur 10 passent en engrais vert pendant l'hivernage.

### Trois erreurs à éviter dans le plan de cultures
1. **Compter trop de cycles.** Si votre calendrier ne laisse pas le temps de préparer la parcelle entre deux cultures, le deuxième cycle n'existe pas.
2. **Négliger la saison.** Certaines cultures supportent mal la chaleur ou les pluies fortes. Le calendrier dépend de votre zone agro-climatique (voir la leçon 3.2).
3. **Mettre toute la surface sur une seule culture.** Un prix qui s'effondre vous prendrait toute la production d'un coup. Répartir sur deux ou trois cultures et décaler les plantations limite le risque.

### Planter en décalé
Si vous plantez tout le même jour, tout arrive à maturité en même temps : vous inondez le marché et le prix baisse. Plantez par **fractions** (par exemple un quart de la surface toutes les deux semaines) : les ventes s'étalent, la main-d'œuvre est mieux utilisée et le risque de mévente diminue.

#### Ce qu'il faut retenir
- Production = surface × cycles × rendement.
- Comptez en hectares-cycles et vérifiez que le calendrier laisse le temps de chaque cycle.
- Alternez les cultures, décalez les plantations.

### Exercice
Votre exploitation compte 2 hectares, dont 1 ha de tomate (1 cycle, 20 t/ha) et 1 ha de gombo (2 cycles, 10 t/ha). Calculez les hectares-cycles et la production annuelle. Construisez ensuite votre calendrier sur 12 mois avec le gabarit joint.
`,
    },
    {
      id: 'ma_2',
      titre: "L'eau et l'irrigation : le plus gros investissement",
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez décrire et chiffrer la solution d'irrigation de votre exploitation, expliquer pourquoi elle est le premier poste d'investissement, et prévoir les mesures qui protègent votre production en cas de panne.

### Pourquoi l'eau domine l'investissement
En maraîchage de contre-saison, sans eau il n'y a pas de culture. Dans le cas du Bénin, le forage, la pompe solaire et le goutte-à-goutte pour 3 hectares représentent **9,0 M FCFA sur 18,8 M d'immobilisations**, soit près de la moitié. Chez Diap Touré, forage, aménagements et solaire pèsent aussi une part élevée du coût du projet.

### Les questions à régler avant de chiffrer
- **La ressource :** forage, puits, cours d'eau, retenue ? Un forage demande une étude et souvent une autorisation. Vérifiez dans votre pays les règles de prélèvement (voir la fiche Cadre pays), notez la date et la source.
- **Le débit :** le besoin en eau par hectare dépend de la culture et de la saison ; faites-le valider par un technicien ou un fournisseur de matériel d'irrigation, par écrit.
- **L'énergie :** pompe solaire (investissement élevé, peu de charges), pompe thermique (investissement moindre, carburant à prévoir), réseau électrique là où il existe.
- **La technique :** goutte-à-goutte (économe en eau, plus cher à l'installation, adapté aux légumes en lignes) ou aspersion ou irrigation gravitaire (moins chères, plus gourmandes en eau).

### Ce que vous écrivez dans le dossier
Un tableau des équipements avec devis, durée d'amortissement et charges d'entretien. Dans le cas : forage, pompe solaire et goutte-à-goutte 9,0 M FCFA, amortis sur 8 ans, soit environ 1,1 M FCFA par an de dotation.

> Les **charges d'eau et d'énergie** du cas sont de 1,2 M FCFA par an. Elles ne comprennent pas l'amortissement, qui apparaît à part.

### Mitigations
- **Panne de pompe :** pompe de secours ou pièces de rechange stockées ; contrat d'entretien avec le fournisseur.
- **Baisse de la nappe ou du débit :** suivi du niveau, calendrier adapté, réduction de surface en saison critique.
- **Vol de matériel :** clôture, gardien (Rufine prévoit un gardien et 2,0 M FCFA de clôture).

#### Ce qu'il faut retenir
- L'irrigation est souvent le premier poste d'investissement : demandez plusieurs devis.
- Vérifiez la réglementation de l'eau de votre pays, avec date et source.
- Prévoyez une solution de secours chiffrée.

### Exercice
Établissez le tableau des équipements d'irrigation de votre projet (devis, durée d'amortissement, entretien annuel) et calculez la dotation annuelle aux amortissements.
`,
    },
    {
      id: 'ma_3',
      titre: "Coûts par hectare et par cycle, rendements et pertes",
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez construire la fiche de coûts d'une culture par hectare et par cycle, et la transformer en charges variables annuelles de l'exploitation.

### La fiche par hectare et par cycle
Pour chaque culture, listez ce qu'elle consomme, pour un hectare et un cycle : semences ou plants, engrais, produits de traitement, main-d'œuvre, emballages, transport. Cette fiche reprend l'itinéraire technique de la leçon 3.1.

Dans le cas du Bénin, les intrants (hors main-d'œuvre) coûtent **1,6 M FCFA par hectare pour la tomate** et **1,0 M FCFA par hectare pour le chou**, par cycle.

> Intrants annuels = 1,5 ha × 1 cycle × 1,6 + 1,5 ha × 2 cycles × 1,0 = 2,4 + 3,0 = **5,4 M FCFA**.

S'y ajoutent la main-d'œuvre saisonnière (4,0), les caisses et le transport (1,6), l'eau et l'énergie (1,2) : **12,2 M FCFA de charges variables** pour 3 hectares.

### Rendement et pertes
Le rendement affiché par un fournisseur de semences est un rendement de station, pas le vôtre. Retenez les rendements que vous avez **mesurés**, ou que des producteurs voisins ont obtenus, avec leur source et leur date.

Les **pertes après récolte** (tri, manutention, transport, invendus) sont souvent sous-estimées. Le cas retient 10 % :

> Chiffre d'affaires = (37,5 t × 250 F/kg + 90 t × 180 F/kg) × (1 − 10 %) = **23,0 M FCFA**.

Réduire les pertes de 10 % à 7 % ajoute environ 0,8 M FCFA de chiffre d'affaires sans aucun coût de production supplémentaire : c'est souvent le levier le plus rentable.

### Les coûts de main-d'œuvre
La main-d'œuvre est le deuxième grand poste après les intrants. Distinguez le **personnel permanent** (chef de culture, gardien : 3,0 M FCFA dans le cas) du **personnel saisonnier** (4,0 M FCFA) qui suit le calendrier de plantation et de récolte. Le décalage des plantations lisse les besoins et réduit le recours aux pointes de main-d'œuvre.

### Du ratio au budget
Faites toujours la boucle : fiche par hectare → charges variables annuelles → comparaison avec le chiffre d'affaires. Dans le cas : 12,2 M FCFA de charges pour 23,0 M de chiffre d'affaires, soit un taux de marge de 47 %.

#### Ce qu'il faut retenir
- Une fiche par culture, par hectare et par cycle.
- Utilisez vos rendements mesurés, pas ceux du catalogue.
- Réduire les pertes est souvent le levier le plus rentable.

### Exercice
Établissez la fiche de coûts par hectare et par cycle de votre culture principale, puis calculez vos charges variables annuelles avec le classeur joint.
`,
    },
    {
      id: 'ma_4',
      titre: 'Prix saisonniers, ventes et conditionnement',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez construire une hypothèse de prix crédible pour des produits dont le cours varie fortement dans l'année, et organiser vos ventes pour en tirer le meilleur prix.

### Le prix d'un légume n'existe pas
Le prix d'un légume change avec la saison, la région et même la semaine. Un prix unique dans un plan est toujours un **prix moyen pondéré**. Chez Diap Touré, l'oignon est vendu à 200 FCFA/kg en moyenne : 60 % à la récolte à 160 FCFA, 40 % après stockage à 260 FCFA (0,6 × 160 + 0,4 × 260 = 200).

Relevez les prix de votre marché sur **au moins douze mois**, auprès de grossistes et de détaillantes, en notant la date. Les statistiques d'organismes publics donnent le contexte, mais ne remplacent pas vos relevés.

### Vendre au bon moment
Trois leviers, du moins au plus coûteux :
1. **Décaler les plantations** pour récolter hors du pic de l'offre.
2. **Conditionner** : tri, calibrage, emballage propre (caisses plutôt que sacs) ; un produit bien présenté se vend mieux et subit moins de pertes. Le cas retient 1,6 M FCFA de caisses et de transport par an.
3. **Stocker** les produits qui le permettent (oignon, pomme de terre, ail) ; la tomate et le chou frais se conservent peu : pour eux, c'est le calendrier et le débouché qui comptent.

### Les canaux
| Canal | Atout | Limite |
|---|---|---|
| Grossistes de marché | Volumes, paiement rapide | Prix de marché, peu de pouvoir de négociation |
| Restaurateurs, hôtels | Prix plus stable, régularité | Exigence de qualité et de livraison |
| Supermarchés | Volumes | Délais de paiement, cahier des charges |
| Vente directe | Meilleur prix | Temps et logistique |

### Sécuriser avant de planter
Une lettre d'intention d'un restaurateur ou d'un grossiste (volume, fréquence, prix) vaut mieux qu'un marché annoncé « immense ». Voir la leçon 4.2.

### Vos hypothèses de prix, comment les écrire
Écrivez pour chaque produit : prix retenu, source, date, fourchette observée. Testez toujours un scénario de baisse. Le cas du Bénin teste une crise de prix de − 15 % : le DSCR tombe de 1,61 à 0,89, ce qui montre à quel point la marge de sécurité est étroite.

#### Ce qu'il faut retenir
- Un prix de plan est un prix moyen pondéré, sourcé et daté.
- Décalez les plantations, soignez le conditionnement, stockez ce qui peut l'être.
- Testez toujours un scénario de baisse des prix.

### Exercice
Relevez pendant un mois les prix de vos trois principaux produits sur votre marché (date, lieu, prix), puis calculez le prix moyen que vous retiendrez dans votre plan et la fourchette.
`,
    },
    {
      id: 'ma_5',
      titre: 'Petite surface : seuil, dette et leviers',
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez lire les indicateurs d'une petite exploitation maraîchère (seuil de rentabilité, DSCR, VAN, TRI) et chiffrer des leviers pour la rendre plus robuste.

### Les indicateurs du cas du Bénin
Coût du projet : **22,8 M FCFA** (immobilisations 18,8 + BFR 4,0) ; apport 6,8 M (30 %) ; emprunt 16,0 M à 9 % sur 7 ans dont 1 an de différé ; annuité d'environ 3,6 M FCFA.

| Indicateur | Valeur |
|---|---|
| Chiffre d'affaires de croisière | 23,0 M FCFA |
| EBE de croisière | 6,6 M FCFA |
| Taux de marge sur coûts variables | 47 % |
| Seuil de rentabilité | 16,8 M FCFA, soit 73 % du CA |
| DSCR année 2 : réaliste / pessimiste / crise | 1,61 / 1,08 / 0,89 |
| VAN à 10 % / TRI (réaliste) | 3,4 M FCFA / 14,6 % |

### Pourquoi la marge de sécurité est étroite
Le taux de marge est bon (47 %), mais les coûts fixes totaux (personnel, charges fixes, amortissements, intérêts) atteignent 7,9 M FCFA. Sur une petite surface, ces coûts pèsent lourd : le seuil de rentabilité atteint 73 % du chiffre d'affaires, contre 53 % chez Diap Touré. **Plus la surface est petite, plus les coûts fixes se répartissent mal.**

### Trois leviers à chiffrer
1. **Augmenter la production sans augmenter les coûts fixes** : un cycle supplémentaire par an sur une parcelle, ou une culture à plus forte valeur. Chaque hectare-cycle de chou ajoute du chiffre d'affaires à des coûts fixes quasi inchangés.
2. **Réduire les pertes après récolte** : chaque point de pertes évité vaut environ 0,26 M FCFA de chiffre d'affaires.
3. **Réduire l'emprunt** : apport plus élevé, subvention d'équipement si elle existe (voir la fiche Cadre pays), ou investissement en deux temps.

Ne retenez un levier dans le plan que si vous l'avez **chiffré** avec le même modèle (classeur joint) et que vous savez comment le mettre en œuvre.

### Lire le scénario de crise
En crise de prix (− 15 %), le DSCR est de 0,89 : l'exploitation ne couvre plus l'annuité. Une banque demandera : quelle réserve de trésorerie ? quelle garantie ? quel report possible des échéances ? Préparez la réponse avant l'entretien.

### Risques propres au maraîchage
Les risques principaux sont climatiques (pluies fortes, chaleur), phytosanitaires (maladies, ravageurs), commerciaux (baisse des prix à la récolte) et d'approvisionnement en eau. Reprenez la matrice de la leçon 6.1 et cotez-les.

#### Ce qu'il faut retenir
- Une petite surface = des coûts fixes lourds = une marge de sécurité étroite.
- Chiffrez chaque levier avec le modèle avant de l'écrire.
- Préparez la réponse au scénario de crise.

### Exercice
Avec le classeur joint, mesurez l'effet sur le résultat annuel de : (a) + 1 hectare-cycle de chou, (b) pertes ramenées de 10 % à 6 %, (c) prix − 10 %. Classez les trois effets.
`,
    },
  ],
}
