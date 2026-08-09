import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from './index.js';
import { formations, formation_modules, formation_lecons } from './schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

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
    description: "Apprenez à concevoir, structurer et rédiger un plan d'affaires ultra-détaillé et professionnel pour vos projets agricoles (maraîchage, élevage, agrobusiness). Basé sur des modèles institutionnels réels.",
    thematique: "Agrobusiness",
    niveau: "Avancé",
    modalite: "En ligne",
    prix_fcfa: 0,
    cover_image_url: "/images/formations/cover_bp_agricole.png",
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
          titre: "1.1 Comprendre l'enjeu du Business Plan",
          ordre: 1,
          duree_minutes: 15,
          contenu: `
# L'enjeu du Business Plan Agricole

Le Business Plan (ou plan d'affaires) est le document fondateur de votre projet agricole. Il ne s'agit pas seulement d'un document pour obtenir un financement (banque, ANPGF, investisseurs), c'est avant tout **votre feuille de route**.

## À quoi sert-il ?
- **Structurer vos idées** : Passer de la passion à la rentabilité.
- **Évaluer la faisabilité** : Vérifier que le sol, le climat, et le marché sont propices (ex: zone des Niayes).
- **Convaincre** : Démontrer aux partenaires que vous maîtrisez votre projet (techniquement et financièrement).

> *« Si le matin vous ne vous levez pas pour construire vos rêves, quelqu'un d'autre vous embauchera pour construire les siens »*
          `,
        },
        {
          titre: "1.2 Le Résumé Opérationnel (Executive Summary)",
          ordre: 2,
          duree_minutes: 20,
          contenu: `
# Le Résumé Opérationnel (Executive Summary)

Bien qu'il soit placé au début du document, le résumé opérationnel **s'écrit en dernier**. C'est le "teaser" de votre projet.

## Que doit contenir la fiche synthétique ? (Modèle ANPGF / Exploitation)
1. **Identité du promoteur** : Nom, prénom, contacts, compétences (techniques, gestion, commerciales).
2. **Nom du projet / Enseigne** : Ex: *Ferme Agro-écologique de Mbour*
3. **Forme Juridique** : GIE, SARL, SUARL, etc.
4. **Localisation** : Région, nature du terrain (Titre Foncier, Bail, Délibération).
5. **Chiffre d'Affaires Prévisionnel** : Indiquer le CA attendu à l'année 1.
6. **Coût total du projet & Financement** : 
   - Apport personnel (ex: 20%)
   - Besoin de financement externe (ex: 80%)

**Exemple de Crédo :** *"Cultivons la terre pour assurer notre développement !"*
          `
        }
      ]
    },
    {
      titre: "Module 2 : L'Étude de Marché",
      ordre: 2,
      lecons: [
        {
          titre: "2.1 L'Environnement du Projet et la Demande",
          ordre: 1,
          duree_minutes: 30,
          contenu: `
# Analyse de l'Environnement et de la Demande

Dans l'agrobusiness, l'environnement est crucial. Vous devez analyser la demande pour vos produits (oignon, pomme de terre, volaille, etc.).

## 1. L'Environnement (PESTEL)
- **Politique/Légal** : Subventions de l'État (ex: Plan Sénégal Émergent, PRACAS), lois foncières.
- **Économique** : Pouvoir d'achat, inflation sur les intrants (engrais, semences).
- **Socioculturel** : Changements des habitudes alimentaires (bio, produits locaux).
- **Technologique** : Irrigation goutte-à-goutte, serres, énergie solaire.
- **Écologique** : Pluviométrie, qualité des sols, accès à l'eau.

## 2. La Demande
- **Qui sont vos clients ?** Grossistes, supermarchés, ménages, restauration, exportation (France, Espagne).
- **Quelles sont leurs attentes ?** Qualité, calibrage, régularité d'approvisionnement, prix concurrentiel.
- **Saisonnalité** : La demande varie-t-elle selon les périodes (fêtes religieuses, saisons sèches) ?
          `
        },
        {
          titre: "2.2 L'Offre et l'Analyse SWOT",
          ordre: 2,
          duree_minutes: 25,
          contenu: `
# L'Analyse de l'Offre et le SWOT

## 1. L'Offre et la Concurrence
Identifiez vos concurrents directs (autres fermes locales) et indirects (produits importés). 
- **Leurs forces** : Capacité de production, réseau de distribution, prix bas.
- **Leurs faiblesses** : Manque de qualité, rupture de stock, méthodes traditionnelles.

*Votre stratégie (Avantage concurrentiel)* : Que proposez-vous de plus ? (ex: Traçabilité, livraison directe, calibrage supérieur).

## 2. La Matrice SWOT (FFOM)
C'est un tableau incontournable de votre Business Plan :

| Origine | Éléments Positifs | Éléments Négatifs |
|---------|-------------------|-------------------|
| **Interne** | **Forces (Strengths)** : Terrain acquis, accès à l'eau, expertise technique. | **Faiblesses (Weaknesses)** : Manque de fonds de roulement initial, équipement vieillissant. |
| **Externe** | **Opportunités (Opportunities)** : Forte demande locale, restrictions sur les importations. | **Menaces (Threats)** : Aléas climatiques, maladies des cultures, hausse du prix de l'engrais. |
          `,
          quiz_json: [
            {
              "question": "Que signifie le 'O' dans l'analyse SWOT ?",
              "options": ["Objectifs", "Offre", "Opportunités", "Organisation"],
              "correctAnswer": 2,
              "explanation": "Le 'O' désigne les Opportunités (Opportunities en anglais), c'est-à-dire les facteurs externes favorables au projet."
            }
          ]
        }
      ]
    },
    {
      titre: "Module 3 : Le Plan Technique et des Opérations",
      ordre: 3,
      lecons: [
        {
          titre: "3.1 Les Infrastructures et Équipements",
          ordre: 1,
          duree_minutes: 35,
          contenu: `
# Le Plan Technique (Moyens de Production)

Pour une exploitation agricole, c'est ici que vous prouvez la faisabilité concrète du projet.

## 1. Le Foncier et les Infrastructures
- **Le Terrain** : Superficie (ex: 10 hectares), nature juridique, type de sol, topographie.
- **L'Accès à l'Eau** : Forage, puits, raccordement au réseau, profondeur de la nappe phréatique.
- **Les Bâtiments** : Magasin de stockage, chambre froide, locaux pour le personnel.

## 2. Les Équipements et Matériels
Faites une liste détaillée :
- **Irrigation** : Motopompes, réseau goutte-à-goutte, asperseurs.
- **Machinisme** : Tracteurs, charrues, semoirs.
- **Énergie** : Groupes électrogènes, panneaux solaires.

## 3. Le Processus de Production (Itinéraire Technique)
Décrivez chronologiquement votre activité :
1. Préparation du sol (labour, pulvérisation)
2. Pépinière ou Semis direct
3. Repiquage
4. Entretien (Sarclage, binage, fertilisation)
5. Traitements phytosanitaires
6. Récolte, tri et conditionnement
          `
        },
        {
          titre: "3.2 Ressources Humaines et Organisation",
          ordre: 2,
          duree_minutes: 20,
          contenu: `
# Organisation et Ressources Humaines

Un projet agricole repose sur des bras et des compétences.

## 1. L'Organigramme
- **Gérant / Chef de projet** : Supervise l'ensemble.
- **Chef de culture / Technicien agricole** : Gère l'itinéraire technique.
- **Ouvriers agricoles (permanents et journaliers)** : Plantation, récolte, entretien.
- **Responsable commercial/logistique** : Gère les expéditions et la clientèle.

## 2. Le Coût du Personnel
Vous devez présenter un tableau récapitulatif des salaires pour l'intégration dans le plan financier :
- Salaire de base
- Charges sociales
- Primes de rendement

*Astuce : En agriculture, prévoyez un budget important pour la main-d'œuvre saisonnière (journaliers) lors des pics d'activité (récoltes).*
          `
        }
      ]
    },
    {
      titre: "Module 4 : Le Plan Financier",
      ordre: 4,
      lecons: [
        {
          titre: "4.1 Le Coût du Projet (Plan d'Investissement)",
          ordre: 1,
          duree_minutes: 30,
          contenu: `
# Le Coût Total du Projet

Le plan de financement initial répond à deux questions : **De quoi ai-je besoin ?** et **Comment vais-je le payer ?**

## 1. Les Investissements (Immobilisations)
- **Frais d'établissement** : Création d'entreprise, études, autorisations.
- **Terrains et Aménagements** : Achat, clôture, défrichage, forage.
- **Constructions** : Magasins, bassins de rétention.
- **Matériels et Outillages** : Tracteurs, système d'irrigation.
- **Matériel roulant** : Camionnette de livraison.

## 2. Le Besoin en Fonds de Roulement (BFR)
En agriculture, il faut parfois attendre 3 à 6 mois avant la première récolte. Le BFR est l'argent mis de côté pour payer :
- Les semences, engrais, produits phytosanitaires.
- Les salaires des premiers mois.
- Le carburant (motopompes).

## 3. Le Plan de Financement
- **Ressources Propres** : Votre apport personnel en cash ou en nature (terrain).
- **Ressources Empruntées** : Le crédit sollicité auprès de la banque ou du fonds d'investissement.
          `
        },
        {
          titre: "4.2 Compte de Résultat et Rentabilité",
          ordre: 2,
          duree_minutes: 40,
          contenu: `
# Compte de Résultat et Rentabilité

Le Compte d'Exploitation Prévisionnel se fait généralement sur 3 à 5 ans. Il prouve que votre ferme va générer du profit.

## 1. Les Chiffres d'Affaires Prévisionnels
Calculez avec prudence : \`Quantité récoltée x Prix de vente moyen\`.
*Attention : Intégrez toujours un taux de perte (ex: 10 à 15% de pertes post-récolte).*

## 2. Les Charges d'Exploitation
- **Achats de matières premières** : Semences, intrants, emballages.
- **Services extérieurs** : Transport, entretien, location de machines.
- **Impôts et taxes**
- **Frais de personnel**
- **Amortissements** : La perte de valeur de vos équipements chaque année.

## 3. Le Résultat Net
\`Résultat = Chiffre d'Affaires - Charges Totales\`.
Si ce chiffre est positif, le projet est rentable. Sinon, il faut revoir vos coûts ou vos prix de vente.

## Le Seuil de Rentabilité (Point Mort)
C'est le moment précis où vous ne gagnez ni ne perdez d'argent (Résultat = 0). Il s'exprime en volume (ex: il faut vendre 50 tonnes d'oignons pour couvrir toutes les charges).
          `,
          quiz_json: [
            {
              "question": "Qu'est-ce que le Besoin en Fonds de Roulement (BFR) ?",
              "options": [
                "Le coût d'achat du terrain et du tracteur",
                "L'argent nécessaire pour faire tourner l'entreprise avant les premières recettes",
                "Le bénéfice net à la fin de l'année",
                "Les impôts payés à l'État"
              ],
              "correctAnswer": 1,
              "explanation": "Le BFR permet de financer le cycle d'exploitation (intrants, salaires) en attendant que les premières ventes rapportent de l'argent."
            },
            {
              "question": "Le Chiffre d'Affaires prévisionnel se calcule en :",
              "options": [
                "Soustrayant les charges des recettes",
                "Additionnant le financement bancaire et l'apport",
                "Multipliant la quantité de production vendable par le prix de vente unitaire",
                "Divisant le coût total par la durée du projet"
              ],
              "correctAnswer": 2,
              "explanation": "Le chiffre d'affaires correspond au total des ventes (Quantité vendue × Prix unitaire)."
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
