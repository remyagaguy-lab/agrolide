import { db } from '../src/db/index';
import { formations } from '../src/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const externalCourses = [
  // Atingi
  {
    id: "ext-atingi-1",
    titre: "L'Agriculture comme Business (Agriculture as a Business)",
    thematique: "Agrobusiness & Gestion",
    description: "Apprenez à gérer une exploitation agricole comme une véritable entreprise économique. Découvrez les outils de gestion essentiels et apprenez à calculer la rentabilité de vos activités agricoles.",
    source_externe: "Agribusiness e-Academy (Atingi)",
    lien_externe: "https://online.atingi.org/course/search.php?search=Agriculture+as+a+Business",
    niveau: "Débutant",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "/images/formations/ext-atingi-1.png",
    acces: "Gratuit",
    programme_json: JSON.stringify({
      contexte: "Passer d'une agriculture de subsistance à une agriculture commerciale nécessite de nouvelles compétences en gestion financière, en marketing et en planification.",
      public_cible: "Jeunes agripreneurs, agriculteurs souhaitant développer leur activité, étudiants en agronomie.",
      presentation_structure: "Atingi est une plateforme numérique d'apprentissage gratuite mise en place par la Coopération allemande (GIZ) pour améliorer l'accès à la formation.",
      objectifs: [
        "Comprendre les principes de l'agrobusiness",
        "Calculer les coûts de production et la rentabilité",
        "Identifier les marchés potentiels et vendre efficacement"
      ]
    })
  },
  {
    id: "ext-atingi-2",
    titre: "Business Model Canvas pour l'Agrobusiness",
    thematique: "Entrepreneuriat",
    description: "Découvrez comment utiliser le Business Model Canvas spécifiquement pour structurer, analyser et améliorer vos projets agricoles et agroalimentaires.",
    source_externe: "Agribusiness e-Academy (Atingi)",
    lien_externe: "https://online.atingi.org/course/search.php?search=Business+Model+Canvas",
    niveau: "Intermédiaire",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "/images/formations/ext-atingi-2.png",
    acces: "Gratuit",
    programme_json: JSON.stringify({
      contexte: "Un bon projet agricole repose sur un modèle économique solide. Le BMC est l'outil visuel de référence pour cartographier et optimiser ce modèle.",
      public_cible: "Porteurs de projets agricoles, gérants d'exploitations, startups agritech.",
      presentation_structure: "Atingi collabore avec des experts mondiaux pour offrir des cours de qualité sur l'entrepreneuriat.",
      objectifs: [
        "Maîtriser les 9 blocs du Business Model Canvas",
        "Appliquer le BMC à une entreprise agricole",
        "Tester et valider ses hypothèses économiques"
      ]
    })
  },
  {
    id: "ext-atingi-3",
    titre: "Préparer son Agrobusiness pour les Investisseurs",
    thematique: "Financement",
    description: "Comment structurer un projet agricole, préparer un plan d'affaires convaincant et attirer des investisseurs pour financer votre croissance.",
    source_externe: "Agribusiness e-Academy (Atingi)",
    lien_externe: "https://online.atingi.org/course/search.php?search=Agribusiness",
    niveau: "Avancé",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "/images/formations/ext-atingi-3.png",
    acces: "Gratuit",
    programme_json: JSON.stringify({
      contexte: "L'accès au financement est l'un des principaux freins au développement de l'agrobusiness en Afrique. Savoir parler aux investisseurs est crucial.",
      public_cible: "Entrepreneurs agricoles en phase de levée de fonds, directeurs financiers de PME agricoles.",
      presentation_structure: "Atingi met à disposition des ressources pour renforcer la viabilité économique des PME en Afrique.",
      objectifs: [
        "Structurer des données financières pour des investisseurs",
        "Rédiger un pitch deck percutant",
        "Comprendre les critères de due diligence"
      ]
    })
  },
  // COLEAD
  {
    id: "ext-colead-1",
    titre: "Production Agricole Durable",
    thematique: "Production Végétale",
    description: "Adoptez les bonnes pratiques agricoles : gestion optimale de l'eau, préservation des sols, et utilisation responsable et sécurisée des intrants agricoles.",
    source_externe: "COLEAD e-learning",
    lien_externe: "https://elearning.colead.link/course/search.php?search=Production+Durable",
    niveau: "Intermédiaire",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "/images/formations/ext-colead-1.png",
    acces: "Gratuit",
    programme_json: JSON.stringify({
      contexte: "Face aux défis environnementaux et aux exigences croissantes des marchés internationaux (notamment l'UE), la durabilité devient incontournable.",
      public_cible: "Producteurs exportateurs, responsables qualité, techniciens agricoles.",
      presentation_structure: "Le COLEAD (Comité de Liaison Europe-Afrique-Caraïbes-Pacifique) soutient le développement d'une agriculture durable et compétitive.",
      objectifs: [
        "Mettre en œuvre les bonnes pratiques agricoles (BPA)",
        "Réduire l'utilisation de pesticides chimiques",
        "Optimiser la gestion des ressources en eau"
      ]
    })
  },
  {
    id: "ext-colead-2",
    titre: "Sécurité Sanitaire des Aliments",
    thematique: "Agro-transformation",
    description: "Maîtriser les principes d'hygiène, la traçabilité et les normes sanitaires (HACCP) indispensables pour la transformation et l'exportation de produits agricoles.",
    source_externe: "COLEAD e-learning",
    lien_externe: "https://elearning.colead.link/course/search.php?search=HACCP",
    niveau: "Avancé",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "/images/formations/ext-colead-2.png",
    acces: "Gratuit",
    programme_json: JSON.stringify({
      contexte: "La conformité sanitaire est un prérequis pour accéder aux marchés internationaux. Une défaillance dans la chaîne de valeur peut avoir de graves conséquences.",
      public_cible: "Responsables qualité en unités de transformation, exportateurs, inspecteurs sanitaires.",
      presentation_structure: "Le COLEAD accompagne les pays ACP dans l'atteinte des standards de qualité européens et internationaux.",
      objectifs: [
        "Comprendre les principes du système HACCP",
        "Assurer la traçabilité complète des produits",
        "Prévenir les contaminations croisées"
      ]
    })
  },
  // Agrisud
  {
    id: "ext-agrisud-1",
    titre: "L'Agroécologie en pratique",
    thematique: "Agroécologie",
    description: "Apprenez les fondamentaux des pratiques agroécologiques : maintien de la fertilité, associations de cultures, lutte biologique et respect de l'environnement.",
    source_externe: "Agrisud International",
    lien_externe: "https://www.agrisud.org/fr/le-guide-de-lagroecologie",
    niveau: "Débutant",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "/images/formations/ext-agrisud-1.png",
    acces: "Gratuit",
    programme_json: JSON.stringify({
      contexte: "L'agroécologie propose des solutions fondées sur la nature pour produire sainement tout en préservant la biodiversité et en régénérant les écosystèmes.",
      public_cible: "Petits producteurs, animateurs ruraux, membres d'ONG environnementales.",
      presentation_structure: "Agrisud International lutte contre la pauvreté en soutenant la création de très petites entreprises (TPE) agricoles familiales.",
      objectifs: [
        "Comprendre les principes de l'agroécologie",
        "Produire du compost et des fertilisants organiques",
        "Protéger les cultures de manière naturelle"
      ]
    })
  },
  // CORAF
  {
    id: "ext-coraf-1",
    titre: "Gestion Intégrée de la Fertilité des Sols",
    thematique: "Production Végétale",
    description: "Découvrez des techniques éprouvées pour maintenir et restaurer la santé des sols de manière durable, spécifiquement adaptées à l'Afrique de l'Ouest et du Centre.",
    source_externe: "CORAF e-learning",
    lien_externe: "https://coraf.org/resources?search=Gestion+Fertilite",
    niveau: "Intermédiaire",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "/images/formations/ext-coraf-1.png",
    acces: "Gratuit",
    programme_json: JSON.stringify({
      contexte: "La dégradation des sols menace gravement la sécurité alimentaire en Afrique. Des pratiques intégrées sont nécessaires pour restaurer la productivité.",
      public_cible: "Producteurs de céréales, techniciens agricoles, chercheurs.",
      presentation_structure: "Le CORAF est la principale organisation de recherche agricole en Afrique de l'Ouest et du Centre.",
      objectifs: [
        "Évaluer l'état de fertilité d'un sol",
        "Combiner engrais minéraux et amendements organiques",
        "Pratiquer la rotation et l'association de cultures"
      ]
    })
  },
  // Daki Farm
  {
    id: "ext-daki-1",
    titre: "Initiation à l'Aviculture (Poulets de chair / Pondeuses)",
    thematique: "Production Animale",
    description: "Formation pratique sous forme de capsules vidéo abordant les bases techniques, sanitaires et alimentaires pour démarrer un élevage de volailles rentable.",
    source_externe: "Daki Farm",
    lien_externe: "https://daki-farm.com/formations/aviculture",
    niveau: "Débutant",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "/images/formations/ext-daki-1.png",
    acces: "Gratuit",
    programme_json: JSON.stringify({
      contexte: "L'aviculture est une filière très dynamique et lucrative en Afrique, mais elle exige une grande rigueur technique et sanitaire.",
      public_cible: "Nouveaux éleveurs, passionnés d'agriculture, investisseurs ruraux.",
      presentation_structure: "Daki Farm est une entreprise agricole leader qui partage son expertise pratique avec les entrepreneurs du continent.",
      objectifs: [
        "Aménager un poulailler aux normes",
        "Gérer l'alimentation et la prophylaxie",
        "Optimiser la croissance et le rendement de ponte"
      ]
    })
  }
];

async function seed() {
  console.log('🔄 Insertion des formations externes dans la base de données...');
  try {
    for (const course of externalCourses) {
      await db.insert(formations).values(course).onConflictDoUpdate({
        target: formations.id,
        set: {
          titre: course.titre,
          thematique: course.thematique,
          description: course.description,
          source_externe: course.source_externe,
          lien_externe: course.lien_externe,
          cover_image_url: course.cover_image_url,
          programme_json: course.programme_json,
        }
      });
      console.log(`✅ Formation ajoutée/mise à jour : ${course.titre} (${course.source_externe})`);
    }
    console.log('🎉 Insertion terminée avec succès !');
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion :", error);
  }
  process.exit(0);
}

seed();
