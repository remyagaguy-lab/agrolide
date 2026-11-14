import type { Filiere } from './types'

/**
 * Module de filière « Services agricoles ». Chiffres du cas « Prestation de mécanisation (labour et battage) au Burkina Faso »
 * (src/content/cas-chiffres/mecanisation-burkina-faso.ts, calculé par scripts/modeles_bp/cas_chiffres.py) :
 * hypothèses pédagogiques, à remplacer par vos devis, vos tarifs relevés et vos données d'activité datées.
 */
export const servicesAgricoles: Filiere = {
  slug: 'services-agricoles',
  titre: 'Services agricoles',
  resume: "Cinq leçons pour chiffrer une entreprise de services aux producteurs (mécanisation, battage, stockage, logistique) : offre et clients, capacité et taux d'utilisation, coûts du service, crédit client et financement, seuil et risques. Cas chiffré (Burkina Faso) et classeur Excel inclus.",
  statut: 'disponible',
  casSlug: 'mecanisation-burkina-faso',
  gabarit: {
    libelle: "Classeur Excel : activité, tarifs, coûts, financement, seuil et scénarios d'un service",
    url: '/documents/bp-agricole/Agrolide-gabarit-services-agricoles.xlsx',
  },
  lecons: [
    {
      id: 'sa_1',
      titre: 'Vendre un service : l\'offre, le client, le contrat',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez décrire un service agricole comme un produit à part entière : ce que vous vendez, à qui, à quel prix et selon quelle règle.

### Ce qui change quand on vend un service
Un producteur vend des kilos, un transformateur vend des produits. Un prestataire vend **l'usage d'une machine, d'un équipement ou d'un savoir-faire**, par hectare, par tonne, par jour ou par saison. Le même matériel peut servir de nombreux clients, mais **sa capacité est limitée et sa saison est courte** : on ne laboure pas toute l'année.

### Les familles de services
- **La mécanisation :** labour, semis, récolte, battage, décorticage.
- **Le stockage et la conservation :** magasins, chambres froides, séchage.
- **Les intrants :** distribution de semences, d'engrais, de produits de traitement, parfois avec conseil.
- **La logistique :** collecte, transport, mise en marché.

Le cas de ce module est une entreprise de **mécanisation** (labour et battage) dans l'ouest du Burkina Faso ; la méthode vaut pour les autres familles.

### Qui sont vos clients ?
Des petits producteurs isolés, des coopératives, des groupements, parfois un projet ou une grande exploitation. Pour chacun, écrivez :
- ce qu'il paie aujourd'hui pour le même service, ou à défaut ce qu'il perd en ne l'ayant pas ;
- quand il en a besoin (la fenêtre de labour est de quelques semaines) ;
- comment il paie : à la prestation, à la récolte, en nature, par un tiers.

### L'offre à écrire dans le dossier
| Élément | Dans le cas |
|---|---|
| Service 1 | Labour : 35 000 FCFA par hectare |
| Service 2 | Battage : 17 000 FCFA par tonne |
| Capacité | 2 tracteurs, 2 batteuses |
| Zone | Rayon de déplacement du matériel |
| Règle de paiement | À la prestation ou à la récolte, avec suivi des créances |

Les tarifs du cas sont des hypothèses pédagogiques. Les vôtres viennent d'un relevé auprès de prestataires de votre zone, avec la date.

### Le contrat de service
Même simple, il doit dire : la prestation (surface, date, état du sol ou du produit), le prix et les conditions de paiement, ce qui se passe si la machine tombe en panne ou si la pluie empêche le travail, et qui répond des dégâts.

#### Ce qu'il faut retenir
- Un service se décrit comme un produit : offre, clients, prix, règle de paiement.
- La capacité de la machine et la saison fixent le plafond de votre chiffre d'affaires.
- Un contrat écrit, même court, évite la plupart des litiges.

### Exercice
Écrivez la fiche d'offre de votre service (tableau ci-dessus) et listez vos dix premiers clients avec ce que chacun paie aujourd'hui pour le même service.
`,
    },
    {
      id: 'sa_2',
      titre: 'Capacité, taux d\'utilisation et chiffre d\'affaires',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez calculer le chiffre d'affaires d'un service à partir de sa capacité et de son taux d'utilisation, et dire pourquoi l'utilisation est l'hypothèse la plus sensible du plan.

### Le calcul
> Chiffre d'affaires = quantité de prestations réalisées × tarif, moins les impayés.

Dans le cas :
| Service | Capacité utilisée | Tarif | Chiffre d'affaires |
|---|---|---|---|
| Labour | 2 tracteurs × 480 ha = 960 ha | 35 000 FCFA/ha | 33,6 M FCFA |
| Battage | 2 batteuses × 900 t = 1 800 t | 17 000 FCFA/t | 30,6 M FCFA |
| **Total brut** | | | **64,2 M FCFA** |
| Impayés et rabais (5 %) | | | − 3,2 M FCFA |
| **Encaissé** | | | **61,0 M FCFA** |

### Le taux d'utilisation
Une machine ne travaille que quand il y a des clients **et** que le temps le permet. Les 480 hectares par tracteur supposent deux campagnes et un calendrier bien tenu. Posez-vous :
- combien d'hectares ou de tonnes par jour la machine traite-t-elle réellement, pannes et déplacements compris ?
- combien de jours utiles dans la saison ?
- combien de clients faut-il pour remplir ce calendrier ?

Ne retenez jamais la capacité maximale annoncée par un fabricant : retenez **ce que vous traiterez réellement**, justifié par un nombre de clients identifiés.

### La saisonnalité
Les fenêtres de labour et de battage sont courtes. Si trop de clients demandent le service en même temps, vous refusez des chantiers ; s'ils sont trop peu nombreux, la machine dort. Un **calendrier de réservations** avant la saison est le meilleur outil. Une activité hors saison (transport, location) peut compléter le chiffre d'affaires, à chiffrer séparément.

### La montée en charge
L'année 1, le cas retient **65 %** de l'activité de croisière : la clientèle se constitue, les premières saisons servent de rodage. Le chiffre d'affaires encaissé de l'année 1 est de 39,6 M FCFA.

### Les impayés
Les producteurs paient souvent à la récolte, parfois en retard, parfois pas du tout. Le cas retient 5 % d'impayés et de rabais. Cette hypothèse doit venir de votre expérience ou de celle de prestataires comparables, pas d'un souhait.

#### Ce qu'il faut retenir
- Chiffre d'affaires = prestations réalisées × tarif, moins les impayés.
- La capacité utilisée dépend du nombre de clients et du calendrier, pas du maximum de la machine.
- Les 65 % de l'année 1 et les 5 % d'impayés sont des hypothèses à justifier.

### Exercice
Avec la feuille Activité du classeur joint, calculez votre chiffre d'affaires de croisière avec vos hectares ou vos tonnes, vos tarifs relevés et votre taux d'impayés. Notez le nombre de clients nécessaire pour y arriver.
`,
    },
    {
      id: 'sa_3',
      titre: 'Les coûts du service : gasoil, entretien, personnel, amortissements',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez construire les charges d'un service à base de machines et distinguer celles qui suivent l'activité de celles qui restent fixes.

### Les charges variables
Elles suivent l'activité. Dans le cas, en croisière :
| Charge | Calcul | Montant |
|---|---|---|
| Gasoil | (960 ha × 12 L + 1 800 t × 4 L) × 750 FCFA/L | 14,0 M FCFA |
| Pièces et entretien | 10 % de la valeur du matériel (68,0 M FCFA) | 6,8 M FCFA |
| Opérateurs saisonniers | forfait | 3,0 M FCFA |
| Transport du matériel, petits frais | forfait | 1,5 M FCFA |
| **Total** | | **25,3 M FCFA** |

Pour un hectare de labour, le gasoil seul coûte 12 L × 750 = **9 000 FCFA**, soit 26 % du tarif de 35 000 FCFA. Un gasoil à + 10 % ne se voit pas dans un compte, mais il se voit sur chaque chantier.

### L'entretien
Une machine mal entretenue tombe en panne en pleine saison, et on ne rattrape pas un chantier perdu. L'entretien (pièces, vidanges, pneus, main-d'œuvre d'atelier) doit être chiffré **en pourcentage de la valeur du matériel** (10 % dans le cas), avec la source (conseil d'un technicien, historique d'un prestataire comparable).

### Les charges fixes
Elles ne dépendent pas des hectares labourés :
- personnel permanent (deux mécaniciens et un gestionnaire) : 6,0 M FCFA par an ;
- charges fixes (assurance, local, gestion) : 2,6 M FCFA par an ;
- amortissements du matériel : **9,95 M FCFA par an** (tracteurs et batteuses sur 8 ans, hangar sur 20 ans, remorque et outillage sur 5 ans) ;
- intérêts de l'emprunt.

### La marge sur coûts variables
Chiffre d'affaires 61,0 − charges variables 25,3 = 35,7 M FCFA, soit un **taux de marge de 58,5 %**. Chaque franc encaissé laisse environ 58 centimes pour payer les charges fixes. Ce taux est élevé parce que le service ne consomme pas de matière première ; mais les charges fixes sont lourdes à cause des machines.

### L'EBE de croisière
Environ **27,0 M FCFA** par an : le chiffre d'affaires, moins les charges variables, le personnel et les charges fixes.

#### Ce qu'il faut retenir
- Gasoil, entretien et opérateurs suivent l'activité ; personnel, amortissements et intérêts non.
- Le gasoil par hectare est un coût à connaître au franc près.
- Un service à machines a un fort taux de marge et de lourdes charges fixes : l'utilisation fait toute la différence.

### Exercice
Avec la feuille Hypothèses du classeur joint, calculez le coût en gasoil d'un hectare labouré et d'une tonne battue avec **vos** consommations et **vos** prix, puis le coût complet de la machine par heure d'utilisation.
`,
    },
    {
      id: 'sa_4',
      titre: 'Investissement, crédit client et financement',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez établir le coût d'un projet de service, dont le besoin en fonds de roulement lié au crédit accordé aux clients, et le plan de financement associé.

### L'investissement
Dans le cas, **81,0 M FCFA** d'immobilisations :
| Poste | Montant | Amortissement |
|---|---|---|
| Frais d'établissement et immatriculation | 0,5 | 5 ans |
| 2 tracteurs de 75 CV avec charrues à disques | 44,0 | 8 ans |
| 2 batteuses | 24,0 | 8 ans |
| Hangar d'abri et atelier | 6,0 | 20 ans |
| Remorque et outillage d'atelier | 4,0 | 5 ans |
| Imprévus (capitalisés) | 2,5 | 10 ans |
| **Total** | **81,0** | |

Les deux tracteurs et les deux batteuses représentent 68,0 M FCFA, soit 84 % de l'investissement : c'est le matériel qui porte le projet.

### Le besoin en fonds de roulement : le crédit client
Un service est souvent payé **après** la prestation : vous avez labouré en mai, le producteur paie à la récolte. Pendant ce temps, vous avez déjà payé le gasoil, les opérateurs et l'entretien. Le cas retient **10,0 M FCFA** de besoin en fonds de roulement. Plus vous accordez de crédit, plus ce besoin grandit ; des acomptes ou des paiements à la prestation le réduisent.

### Le coût total et le financement
Coût total du projet : 81,0 + 10,0 = **91,0 M FCFA**. Ressources :
- apport : 27,3 M FCFA (30 %) ;
- emprunt : 63,7 M FCFA à 9 % sur 8 ans dont 1 an de différé.

L'année 1, seuls les intérêts sont payés (5,7 M FCFA). À partir de l'année 2, l'annuité constante est d'environ **12,7 M FCFA** par an.

### Acheter, louer, crédit-bail
Acheter le matériel n'est pas la seule solution. La location, le crédit-bail ou l'achat en commun (avec une coopérative) peuvent réduire l'apport ou le risque. Chaque solution a un coût et des conditions : demandez des **devis écrits** et comparez-les dans le plan, avec date et source. Ne présentez jamais un dispositif d'appui à l'équipement sans l'avoir vérifié (voir la fiche Cadre pays).

### Les devis et les droits à l'importation
Le matériel agricole est souvent importé : prix du matériel, transport, droits et taxes, délais de livraison, pièces de rechange disponibles localement. Écrivez chaque poste avec la date du devis.

#### Ce qu'il faut retenir
- Le matériel pèse l'essentiel de l'investissement ; chaque poste vient d'un devis daté.
- Le crédit accordé aux clients se finance : c'est le besoin en fonds de roulement.
- Comparez l'achat, la location et le crédit-bail avant d'engager l'apport.

### Exercice
Avec la feuille Financement du classeur joint, établissez le coût total de votre projet avec **vos** devis, et calculez l'annuité pour trois durées d'emprunt différentes.
`,
    },
    {
      id: 'sa_5',
      titre: 'Seuil, couverture de la dette et risques du service',
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez calculer le seuil de rentabilité et la couverture de la dette d'un service, et présenter les risques propres à une activité de prestation.

### Le seuil de rentabilité
Coûts fixes totaux : personnel 6,0 + charges fixes 2,6 + amortissements 9,95 + intérêts de l'année 2 (5,7) = **24,3 M FCFA**. Taux de marge : 58,5 %. Seuil = 24,3 ÷ 0,585 = **41,5 M FCFA**, soit **68 %** du chiffre d'affaires encaissé de croisière. La marge de sécurité est de 32 %.

### Les trois scénarios (année 2)
| Scénario | Chiffre d'affaires | EBE | DSCR |
|---|---|---|---|
| Réaliste | 61,0 | 27,0 | **1,87** |
| Pessimiste (activité − 15 %, impayés 10 %, gasoil + 10 %, entretien + 15 %) | 49,1 | 15,1 | **1,19** |
| Mauvaise saison (activité − 30 %, impayés 15 %) | 38,2 | 8,5 | **0,67** |

Dans le scénario de mauvaise saison, la dette n'est plus couverte.

### VAN, TRI et récupération
| Scénario | VAN (10 %) | TRI | Récupération |
|---|---|---|---|
| Réaliste | 9,7 | 13,2 % | 4,5 ans |
| Pessimiste | − 20,3 | 3,0 % | au-delà de 5 ans |
| Mauvaise saison | − 38,7 | − 3,7 % | au-delà de 5 ans |

### L'utilisation décide de tout
Testez les facteurs un par un : une **activité inférieure de 15 %** à elle seule ramène le DSCR à 1,48 et rend la VAN négative (− 7,3 M FCFA). Des impayés à 10 % seuls ne font pas passer la VAN sous zéro (2,0 M FCFA). Un gasoil à + 10 % seul laisse une VAN de 6,2. Pour que le DSCR reste supérieur à 1, il faut au moins **70 %** de l'activité prévue, soit environ 672 ha de labour et 1 260 t de battage.

### Les risques propres à un service
- **La panne** en pleine saison : un chantier perdu ne se rattrape pas.
- **La mauvaise saison** : pluie en retard, récolte faible, clients qui annulent.
- **Les impayés** : un client qui ne paie pas vous a coûté le gasoil et l'entretien.
- **La concurrence** : un prestataire moins cher, un projet public ou un don de matériel dans la zone.
- **Le matériel** : disponibilité des pièces, compétence du mécanicien, vol.

Chiffrez chaque risque et écrivez la mesure de mitigation : calendrier de réservations, acomptes, contrat avec une coopérative, stock de pièces, assurance, contrôle de la qualité du travail.

#### Ce qu'il faut retenir
- Le seuil se calcule comme pour une unité de production, avec de lourds amortissements de matériel.
- Un service reste supportable tant que l'activité dépasse environ 70 % de celle prévue.
- Présentez toujours un scénario pessimiste et un scénario de mauvaise saison.

### Exercice
Avec le classeur joint, trouvez le taux d'activité en dessous duquel votre DSCR passe sous 1, puis proposez deux mesures chiffrées pour sécuriser votre calendrier.
`,
    },
  ],
}
