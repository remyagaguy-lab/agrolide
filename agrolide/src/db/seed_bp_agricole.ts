import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from './index.js';
import { formations, formation_modules, formation_lecons } from './schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

async function seedBusinessPlan() {
  console.log('Seeding ultra-detailed Business Plan Agricole course...');

  const formationId = 'form_bp_agricole';

  // Check if exists
  const existing = await db.query.formations.findFirst({
    where: eq(formations.id, formationId),
  });

  if (existing) {
    console.log('Formation exists, deleting old data to replace with ultra-detailed version...');
    await db.delete(formations).where(eq(formations.id, formationId));
  }

  // 1. Insert Formation
  await db.insert(formations).values({
    id: formationId,
    titre: "Rédaction de Business Plan Agricole",
    description: "Formation ultra-détaillée pour concevoir, structurer et rédiger un plan d'affaires professionnel pour vos projets agricoles (maraîchage, élevage, agrobusiness). Maîtrisez l'étude de marché, l'étude technique, les aspects juridiques et l'ingénierie financière. Basé sur des modèles institutionnels réels.",
    thematique: "Agrobusiness",
    niveau: "Avancé",
    modalite: "En ligne",
    prix_fcfa: 0,
    cover_image_url: "/images/formations/cover_bp_agricole_2.png",
    statut: "publie",
    acces: "public",
  });
  console.log('Formation inserted.');

  // MODULES & LECON
  const modulesData = [
    {
      titre: "Module 1 : Introduction et Résumé Opérationnel",
      ordre: 1,
      lecons: [
        {
          titre: "1.1 Comprendre l'enjeu du Business Plan Agricole",
          ordre: 1,
          duree_minutes: 20,
          contenu: `
# L'enjeu du Business Plan Agricole

Le Business Plan (ou plan d'affaires) est le document stratégique fondateur pour tout entrepreneur agricole. Il ne s'agit pas seulement d'un document pour obtenir un financement (banque, ANPGF, investisseurs), c'est avant tout **votre feuille de route**.

## À quoi sert-il ?
- **Opportunité financière** : L'autofinancement étant souvent insuffisant en agriculture (coûts élevés des forages, serres, etc.), la présentation d'un bon plan d'affaires aux banques ou organismes publics permet d'obtenir les fonds nécessaires.
- **Opportunité commerciale** : C'est un moyen de développer des partenariats (fournisseurs d'intrants, supermarchés, grossistes).
- **Document de référence et de recherche** : Il démontre la faisabilité du projet depuis le management jusqu'au financement, en passant par l'étude des sols, la pluviométrie, et le choix des spéculations (ex: oignon, pomme de terre).

> *"Le secret de la réussite est la planification. Tout ce qui est planifié a toujours du succès, et même les obstacles et imprévus deviennent des opportunités à saisir."*

## Les facteurs clés de succès en agriculture
D'après les études sectorielles, la réussite d'une exploitation repose sur :
1. Une forte demande (locale ou export).
2. L'accès à des terres fertiles et surtout à l'**eau** (ex: Vallée du fleuve, zone des Niayes).
3. Une main-d'œuvre disponible et des coûts de production maîtrisés.
4. Une bonne planification financière pour supporter le Besoin en Fonds de Roulement (BFR) jusqu'aux premières récoltes.
          `,
        },
        {
          titre: "1.2 Le Résumé Opérationnel (Executive Summary)",
          ordre: 2,
          duree_minutes: 25,
          contenu: `
# Le Résumé Opérationnel (Fiche Synthétique)

Bien qu'il soit placé au début du document, le résumé opérationnel **s'écrit en dernier**. C'est le "teaser" de votre projet. Il doit convaincre le lecteur de lire la suite.

## Que doit contenir la fiche synthétique ?
Voici un modèle de présentation synthétique d'un projet d'exploitation agricole :

1. **Identité du promoteur** : Nom, prénom, contacts, adresse.
2. **Profession et compétences** : L'expérience du promoteur est cruciale. Avez-vous des compétences techniques (agronomie), de gestion (planification) ou commerciales (négociation) ?
3. **Nom du projet / Enseigne commerciale** : Ex: *Ferme Agro-écologique de Mbour*
4. **Forme Juridique** : GIE, SARL, SUARL, Coopérative.
5. **Activité (description)** : Spécialisation (ex: "Culture maraîchère de produits comme l'oignon et la pomme de terre").
6. **Clientèle cible** : Niveau local (ménages, supermarchés, grossistes) et international (exportation).
7. **Localisation** : Zone d'implantation (ex: Zone des Niayes, Vallée du Fleuve).
8. **Chiffre d'Affaires Prévisionnel** : Indiquer le CA attendu pour la première année pleine.
9. **Coût total du projet & Financement** : 
   - Apport personnel (ex: 15% à 20%)
   - Besoin de financement externe (Emprunt)

### La Vision et la Mission
Prenez également le temps de définir :
- **Votre Vision** : Quel est votre apport dans la communauté ? (Ex: Contribuer à l'autosuffisance alimentaire, inciter les jeunes au retour à la terre).
- **Votre Mission** : Ce que votre ferme va réaliser concrètement.
          `
        }
      ]
    },
    {
      titre: "Module 2 : L'Étude de Marché et Stratégie Commerciale",
      ordre: 2,
      lecons: [
        {
          titre: "2.1 L'Environnement du Projet et la Demande",
          ordre: 1,
          duree_minutes: 35,
          contenu: `
![Marché Agricole](/images/formations/bp_agri_market.png)

# Analyse de l'Environnement et de la Demande

Dans l'agrobusiness, l'environnement est crucial. Vous devez analyser la demande pour vos produits avant même de planter la première graine.

## 1. L'Environnement (Potentiel Naturel et Économique)
Pour un projet au Sénégal, par exemple, on analyse les différentes zones agro-écologiques :
- **La Zone des Niayes** : Bande côtière de Dakar à Saint-Louis. Le poumon horticole du pays (80% des besoins nationaux en légumes frais) car elle bénéficie de nappes d'eau peu profondes (0,5 à 5m) et d'un climat favorable.
- **La Vallée du Fleuve** : Dominée par la riziculture et la culture de décrue (Walo / Diéri).
- **Le Bassin Arachidier** : Agriculture paysanne, élevage, et production arachidière.
- **La Casamance** : Pluviométrie abondante (riz pluvial, fruitiers).

## 2. Analyse de la Demande Actuelle et Future
- **La demande nationale** : De plus en plus importante en fruits et légumes, surtout en zone urbaine.
- **Les exportations** : L'Europe (France, Belgique, Espagne) représente une opportunité majeure.
- **La dynamique de l'État** : Volonté d'atteindre l'autosuffisance alimentaire (réduction des importations d'oignons et de pommes de terre).

## 3. Définir sa Cible
Qui peut consommer vos produits ?
- Grossistes (Bana-banas)
- Détaillants (Marchés locaux)
- Supermarchés (Auchan, Casino, Citydia, Carrefour)
- Hôtellerie et restauration
- Transformateurs industriels
          `
        },
        {
          titre: "2.2 L'Offre, la Concurrence et la Matrice SWOT",
          ordre: 2,
          duree_minutes: 40,
          contenu: `
# L'Analyse de l'Offre et le SWOT

## 1. L'Offre Locale et les Importations
Analysez la production existante.
- **Production locale** : Essentiellement familiale, avec de petites exploitations (1 à 5 hectares). Identifier les rendements moyens actuels (ex: Oignon 24t/ha).
- **Importations** : Souvent, les pays africains importent massivement (Europe, Maroc, Afrique du Sud). Ces produits concurrents dictent souvent le prix de marché.

## 2. La Concurrence
Identifiez vos concurrents directs et les grandes entreprises exportatrices du secteur (ex: SAFINA, SEPAM, etc.).
- Quel est leur volume d'affaires ?
- Quelle est leur zone de couverture ?
- Quelles sont leurs faiblesses ? (Qualité inconstante, problèmes de livraison).

## 3. La Matrice SWOT (FFOM)
C'est le tableau de synthèse incontournable pour un projet agricole.

| Origine | Éléments Positifs | Éléments Négatifs |
|---------|-------------------|-------------------|
| **Interne** | **Forces (Strengths)** : Bonne expérience du promoteur, accès à l'eau garanti, choix de variétés hybrides rentables. | **Faiblesses (Weaknesses)** : Faible niveau de mécanisation initiale, budget limité, manque de main-d'œuvre qualifiée. |
| **Externe** | **Opportunités (Opportunities)** : Forte demande urbaine, subventions de l'État pour l'autosuffisance, hausse des prix de l'importé. | **Menaces (Threats)** : Aléas climatiques (irrégularité pluviométrique), concurrence de l'UE, maladies et ravageurs. |
          `,
          quiz_json: [
            {
              "question": "Dans la matrice SWOT, à quelle catégorie appartient 'l'irrégularité pluviométrique' ?",
              "options": ["Une Force", "Une Faiblesse", "Une Opportunité", "Une Menace"],
              "correctAnswer": 3,
              "explanation": "C'est un élément externe à l'entreprise qui peut impacter négativement l'activité, il s'agit donc d'une Menace."
            }
          ]
        },
        {
          titre: "2.3 Stratégie Marketing : Produit, Prix et Distribution",
          ordre: 3,
          duree_minutes: 30,
          contenu: `
# La Stratégie Marketing (Les 4 P)

## 1. Le Produit (Product)
Votre produit n'est pas "juste un oignon" ou "juste une pomme de terre".
Vous devez définir le **calibrage**, la **qualité** (bio, sans résidus chimiques), et l'**emballage** (filets aérés, cageots de 25kg, cartons personnalisés avec votre logo).

## 2. Le Prix (Price)
En agriculture, les prix sont souvent très instables et dictés par la loi de l'offre et de la demande.
- Exemple pour l'oignon : Minimum 150 FCFA/kg (en pleine période de récolte), Maximum 450 FCFA/kg (en période de pénurie).
- Stratégie : Stocker les récoltes (bâtiments ventilés) pour vendre au moment où les prix remontent, plutôt que de brader à la récolte.

## 3. La Distribution (Place)
Évitez le circuit informel long si possible (grossiste -> demi-grossiste -> détaillant -> consommateur) car il rogne vos marges.
Trois approches possibles :
- **Circuit direct** : Livraison aux supermarchés (Auchan, Casino) avec qui vous signez des contrats annuels.
- **Circuit court** : Distributeurs rémunérés à la commission sur les marchés urbains.
- **Vente à la ferme** : Les clients ou bana-banas viennent s'approvisionner sur place.

## 4. La Communication (Promotion)
Créez une véritable marque agricole (ex: "BEUGUE BAMBA").
- Ayez un logo, des emballages reconnaissables.
- Utilisez les réseaux sociaux (Facebook, WhatsApp professionnels) pour montrer la traçabilité et la beauté de votre champ.
- Faites des campagnes B2B pour cibler les hôtels et restaurateurs.
          `
        }
      ]
    },
    {
      titre: "Module 3 : Étude Technique et Exploitation",
      ordre: 3,
      lecons: [
        {
          titre: "3.1 Localisation, Foncier et Équipements",
          ordre: 1,
          duree_minutes: 40,
          contenu: `
![Étude Technique](/images/formations/bp_agri_technical.png)

# Le Site de Production et les Équipements

C'est ici que l'ingénieur agronome intervient. Vous devez prouver que techniquement, le projet tient la route.

## 1. Localisation et Choix du Site
Justifiez le choix de la parcelle (ex: 10 hectares) :
- Climat favorable, proximité des points d'eau (nappe phréatique à 5m).
- Existence de réseaux de transport (routes praticables pour évacuer la récolte).
- Accès à l'électricité (ou bon ensoleillement pour le solaire).
- Abondance de main-d'œuvre locale.

## 2. L'Approvisionnement en Équipements
Vous devez détailler tout le matériel nécessaire pour l'exploitation. 
Exemples d'investissements matériels :
- **Matériel lourd** : Tracteur agricole, faucheuse, charrue à disques, herse rotative.
- **Irrigation** : Forage, groupe motopompe, panneaux solaires, système d'irrigation goutte-à-goutte complet.
- **Matériel léger** : Pulvérisateurs, bascules, cageots de collecte, matériel phytosanitaire.
- **Infrastructures** : Clôture du champ (indispensable contre les animaux), bâtiment d'exploitation, magasin de stockage aéré.

Dressez un tableau complet : Fournisseur, Équipement, Quantité, Coût, Utilité.
          `
        },
        {
          titre: "3.2 Itinéraires Techniques (Fiches de Culture)",
          ordre: 2,
          duree_minutes: 45,
          contenu: `
# L'Itinéraire Technique de Production

Un bon business plan inclut les "fiches techniques" des cultures choisies pour démontrer votre maîtrise agronomique.

## Exemple 1 : Culture de l'Oignon
- **Calendrier** : Culture hâtive (octobre), de pleine saison (novembre-décembre), ou tardive.
- **Préparation du sol** : Labour, offsetage, billonnage (billon espacé de 80 cm).
- **Semis & Repiquage** : Pépinière pendant 45 jours. Repiquage avec densité de 66 600 pieds/ha.
- **Irrigation** : Besoin hydrique précis (ex: 3 à 5 mm/jour en goutte-à-goutte).
- **Fertilisation** : Fumure de fond (20t organique/ha, phosphogypse, NPK), puis fumure de couverture (urée, DAP, potasse) tous les 20 jours.
- **Phytosanitaire** : Traitement contre thrips, chenilles, mildiou, alternariose.
- **Récolte et Conservation** : Entre 90 et 105 jours après repiquage. Rendement attendu : 40 à 70 tonnes/ha (en intensif). Conservation 4 à 8 mois en magasin sec et aéré.

## Exemple 2 : Culture de la Pomme de Terre
- **Précédent cultural** : Éviter de planter après des Solanacées (tomate, aubergine).
- **Préparation** : Labour profond (25-35 cm), billons de 20-30 cm de haut.
- **Plantation** : Utilisation de tubercules pré-germés. Densité selon calibre (ex: 16kg/100m² pour calibre 28/35).
- **Entretien** : Buttage progressif indispensable. Arrosages réguliers cruciaux lors de la tubérisation.
- **Rendement et Conservation** : 20 à 30 tonnes/ha. Conservation très délicate (1 à 3 mois maximum sous abri frais ventilé). Taux de perte estimé : jusqu'à 30%.
          `,
          quiz_json: [
            {
              "question": "En agriculture, qu'appelle-t-on 'itinéraire technique' ?",
              "options": [
                "Le trajet emprunté par les camions de livraison",
                "La suite logique et ordonnée des opérations agricoles pour produire une culture",
                "Le plan du système d'irrigation",
                "Le calendrier de paiement des fournisseurs"
              ],
              "correctAnswer": 1,
              "explanation": "L'itinéraire technique est l'ensemble des interventions appliquées à une culture, de la préparation du sol jusqu'à la récolte et la conservation."
            }
          ]
        }
      ]
    },
    {
      titre: "Module 4 : Organisation Administrative et Juridique",
      ordre: 4,
      lecons: [
        {
          titre: "4.1 Le Cadre Juridique et Fiscal",
          ordre: 1,
          duree_minutes: 25,
          contenu: `
# Structure Juridique de l'Entreprise Agricole

Le choix du statut juridique impacte votre responsabilité, votre fiscalité et votre capacité à emprunter.

## 1. La Société à Responsabilité Limitée (SARL ou SUARL)
C'est le statut le plus recommandé si les investissements sont importants.
- **Capital Social** : Minimum requis (ex: 100 000 FCFA à 1 000 000 FCFA selon les pays), libéré à la création.
- **Responsabilité** : Limitée aux apports. Vos biens personnels (maison, voiture) sont protégés.
- **Direction** : Un gérant (associé ou non).
- **Fiscalité** : Soumis à l'Impôt sur les Sociétés (ex: 30% des bénéfices nets).
- **Frais de constitution** : Frais de notaire (obligatoire au-delà d'un certain capital), frais d'immatriculation au RCCM, NINEA, annonces légales.

## 2. Alternatives
- **Groupement d'Intérêt Économique (GIE)** : Souvent utilisé par les groupements paysans. Frais de création faibles, mais responsabilité solidaire et indéfinie des membres.
- **Coopérative Agricole** : Idéal pour mutualiser des moyens de production.

## 3. Le Foncier (L'enjeu majeur)
Avant d'investir, sécurisez la terre !
- **Titre Foncier** : Propriété définitive, peut servir de garantie bancaire (hypothèque). Difficile et cher à obtenir.
- **Bail Emphytéotique** : Location longue durée (18 à 99 ans) par l'État. Offre de fortes garanties.
- **Délibération du Conseil Municipal** : Droit d'usage, très commun en zone rurale, mais souvent rejeté par les banques comme garantie solide.
          `
        },
        {
          titre: "4.2 Les Ressources Humaines et l'Organigramme",
          ordre: 2,
          duree_minutes: 25,
          contenu: `
# La Gestion des Ressources Humaines

Une erreur commune est de sous-estimer le coût et l'organisation de la main-d'œuvre.

## L'Organigramme Type d'une Ferme Moderne
1. **Coordinateur de Projet (Directeur)** : Stratégie, finances, partenariats.
2. **Ingénieur Agronome / Technicien Supérieur** : Définit les méthodes, les traitements, supervise la qualité.
3. **Chef d'Exploitation Agricole** : Présent en permanence sur le site. Planifie les opérations au quotidien.
4. **Responsable Commercial** : Gère la vente, la logistique (chauffeur) et les recouvrements.
5. **Responsable Administratif et Financier (Comptable)** : Paie, déclarations fiscales, facturation.
6. **Le Personnel de Terrain** :
   - Gardiens (Sécurité H24, vols fréquents en milieu rural).
   - Ouvriers maraîchers permanents (Irrigation, entretien quotidien).
   - Saisonniers (Journaliers recrutés massivement pour le désherbage et la récolte).

## Budgétisation (La Masse Salariale)
Créez un tableau annuel regroupant :
- Effectif par poste.
- Salaire mensuel net.
- Charges sociales (cotisations patronales).
- Mois de travail (les saisonniers ne sont payés que 3 ou 4 mois par an).
          `
        }
      ]
    },
    {
      titre: "Module 5 : Ingénierie Financière et Rentabilité",
      ordre: 5,
      lecons: [
        {
          titre: "5.1 Plan d'Investissement et Plan de Financement Initial",
          ordre: 1,
          duree_minutes: 40,
          contenu: `
![Étude Financière](/images/formations/bp_agri_finance.png)

# Le Plan de Financement Initial

Ce tableau fondamental compare vos Besoins et vos Ressources à l'année 0. **Le total des besoins doit toujours être égal au total des ressources.**

## 1. Les Besoins Durables
- **Frais d'établissement** : (Notaire, études, ouvertures compte).
- **Investissements Incorporels** : Logiciels, droit au bail.
- **Investissements Corporels** : 
  - Terrains, clôture, forages.
  - Bâtiments d'exploitation.
  - Matériels lourds (tracteurs, irrigation).
  - Matériel de transport.
- **Le Besoin en Fonds de Roulement (BFR)** : Trésorerie indispensable pour payer les premières charges d'exploitation (salaires, intrants, électricité, gasoil) avant de percevoir les recettes de la première récolte.

## 2. Les Ressources Durables
Comment payez-vous ces investissements ?
- **Capital Social / Apport personnel** : Ce que le promoteur amène (numéraire ou équipement valorisé). Souvent, les banques exigent 15% à 30% d'apport.
- **Subventions / Aides** : État, ONG.
- **Emprunt bancaire à moyen/long terme** : Le reste du montant.

## 3. Le Tableau d'Amortissement de l'Emprunt
Si vous empruntez à la banque, vous devez calculer l'annuité de remboursement (Capital + Intérêts) pour l'intégrer dans vos charges financières futures.
          `
        },
        {
          titre: "5.2 Les Charges d'Exploitation Prévisionnelles",
          ordre: 2,
          duree_minutes: 35,
          contenu: `
# Les Charges d'Exploitation (Dépenses de fonctionnement)

Vous devez projeter ces dépenses sur 3 à 5 ans. 

## Classification des charges agricoles
1. **ACHATS (Intrants directs)** :
   - Préparation des sols (location tracteur si non acquis).
   - Semences (Oignons, Pommes de terre).
   - Engrais (Urée, NPK, Fumure organique).
   - Produits phytosanitaires (Fongicides, insecticides, herbicides).
2. **TRAITEMENT ET ENTRETIEN** :
   - Carburant et lubrifiants (Motopompes, tracteurs).
   - Entretien du réseau d'irrigation et des machines.
   - Achat d'emballages (sacs vides, filets, cageots).
3. **FRAIS DE PERSONNEL** :
   - Salaires bruts + Charges sociales (La plus grosse ligne de dépense avec les intrants).
4. **AUTRES CHARGES EXTERNES** :
   - Transport des récoltes.
   - Redevances d'eau ou électricité.
   - Assurances (très recommandées en agriculture contre les sinistres).
   - Location de terres (si bail).
   - Communication / Publicité.
5. **DOTATIONS AUX AMORTISSEMENTS** :
   - L'usure comptable du matériel. Par exemple, si un tracteur coûte 10 millions et dure 10 ans, on provisionne une charge de 1 million par an pour le renouveler.
6. **FRAIS FINANCIERS** :
   - Les intérêts de votre emprunt bancaire.
          `
        },
        {
          titre: "5.3 Le Compte de Résultat et les Ratios Financiers",
          ordre: 3,
          duree_minutes: 45,
          contenu: `
# Compte de Résultat Prévisionnel et Analyse Financière

Le compte de résultat détermine si, à la fin de l'année, vous avez fait des bénéfices ou des pertes.

## 1. Structure du Compte de Résultat
\`Chiffre d'Affaires (Ventes HT)\`
- \`Coût d'achat des intrants consommés\`
= **Marge de Production**
- \`Services extérieurs (transport, loyers)\`
= **Valeur Ajoutée (VA)**
- \`Impôts et Taxes\`
- \`Frais de Personnel\`
= **Excédent Brut d'Exploitation (EBE)** *(C'est la performance économique pure de la ferme).*
- \`Dotations aux Amortissements\`
= **Résultat d'Exploitation**
- \`Frais Financiers (Intérêts)\`
= **Résultat Courant Avant Impôt (RCAI)**
- \`Impôt sur les Sociétés (IS)\`
= **RÉSULTAT NET** (Le bénéfice final).

## 2. Le Plan de Trésorerie Mensuel
Vital en agriculture ! Vos dépenses sont étalées sur les mois de culture (semis, engrais, arrosage), mais vos recettes n'arrivent qu'en fin de cycle (mois 4, 5). Le tableau de trésorerie mensuel permet de s'assurer que le compte en banque ne sera jamais dans le rouge (solde négatif) durant cette période de carence.

## 3. Analyse des Ratios
Les banquiers analyseront ces indicateurs :
- **Rentabilité commerciale** : \`Résultat Net / Chiffre d'Affaires HT\`.
- **Rentabilité financière** : \`Résultat Net / Capitaux Propres\`.
- **Poids de l'endettement** : \`Charges financières / Chiffre d'Affaires\`.
- **Capacité de Remboursement** : \`Dettes à Moyen-Long Terme / Capacité d'Autofinancement\`. Doit idéalement être inférieur à 3 ou 4 ans.

## La Gestion des Risques
Terminez votre plan d'affaires par un tableau de mitigation des risques :
- **Risques Climatiques / Eau** -> *Solution : Forage profond + assurance récolte + Goutte-à-goutte.*
- **Risque de marché (effondrement des prix)** -> *Solution : Contrats pré-négociés avec supermarchés + Chambre froide pour stocker.*
- **Risque de maladies** -> *Solution : Suivi rigoureux par l'ingénieur agronome, rotation des cultures.*
          `,
          quiz_json: [
            {
              "question": "Lequel de ces indicateurs mesure la performance économique 'pure' générée par l'exploitation, indépendamment de sa politique de financement et d'amortissement ?",
              "options": [
                "Le Résultat Net",
                "Le Chiffre d'Affaires",
                "L'Excédent Brut d'Exploitation (EBE)",
                "Le Besoin en Fonds de Roulement (BFR)"
              ],
              "correctAnswer": 2,
              "explanation": "L'EBE est le flux de trésorerie généré par l'activité principale de l'entreprise, avant de payer les investissements (amortissements) et la banque (frais financiers)."
            },
            {
              "question": "En agriculture, pourquoi le plan de trésorerie mensuel est-il particulièrement critique ?",
              "options": [
                "Parce qu'il permet de calculer les impôts mensuels",
                "Parce qu'il y a un décalage temporel important entre les mois de dépenses (semis, entretien) et le mois d'encaissement (récolte)",
                "Pour savoir combien payer le banquier chaque semaine",
                "Pour calculer l'amortissement des tracteurs"
              ],
              "correctAnswer": 1,
              "explanation": "Le cycle biologique de la plante crée un besoin de trésorerie (BFR). Il faut payer les intrants et salaires pendant plusieurs mois avant de pouvoir vendre la récolte."
            }
          ]
        }
      ]
    }
  ];

  for (const mod of modulesData) {
    const moduleId = `mod_${crypto.randomUUID().slice(0, 8)}`;
    await db.insert(formation_modules).values({
      id: moduleId,
      formation_id: formationId,
      titre: mod.titre,
      ordre: mod.ordre,
    });
    console.log(`Module inserted: ${mod.titre}`);

    for (const lecon of mod.lecons) {
      await db.insert(formation_lecons).values({
        id: `lec_${crypto.randomUUID().slice(0, 8)}`,
        module_id: moduleId,
        titre: lecon.titre,
        contenu: lecon.contenu.trim(),
        duree_minutes: lecon.duree_minutes,
        ordre: lecon.ordre,
        quiz_json: lecon.quiz_json ? JSON.stringify(lecon.quiz_json) : null,
      });
    }
  }

  console.log('✅ Ultra-detailed Business Plan course seeded successfully!');
}

seedBusinessPlan().catch(console.error).finally(() => process.exit(0));
