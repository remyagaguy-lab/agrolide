import { db } from '../src/db/index';
import { formations } from '../src/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const faoCourses = [
  {
    id: "fao-1",
    titre: "Agriculture Intelligente face au Climat (AIC)",
    thematique: "Climat & Résilience",
    description: "Découvrez les bases de l'agriculture intelligente face au climat et comment adapter vos systèmes de production aux changements climatiques.",
    source_externe: "FAO elearning Academy",
    lien_externe: "https://elearning.fao.org/course/view.php?id=354",
    modalite: "En ligne (Externe)",
    niveau: "Débutant",
    prix_fcfa: 0,
    statut: "publie",
    acces: "libre",
    cover_image_url: "/images/formations/ext-fao-1.png",
    programme_json: JSON.stringify({
      contexte: "L'agriculture intelligente face au climat (AIC) aide à orienter les actions nécessaires pour transformer et réorienter les systèmes agricoles afin de soutenir efficacement le développement et d'assurer la sécurité alimentaire face au changement climatique.",
      public_cible: "Agriculteurs, décideurs politiques, étudiants et chercheurs intéressés par l'adaptation climatique en agriculture.",
      presentation_structure: "La FAO (Organisation des Nations Unies pour l'alimentation et l'agriculture) est une agence spécialisée qui mène les efforts internationaux vers l'élimination de la faim.",
      objectifs: [
        "Comprendre le concept et les objectifs de l'AIC",
        "Identifier les pratiques agricoles résilientes",
        "Évaluer l'impact des changements climatiques sur l'agriculture"
      ]
    })
  },
  {
    id: "fao-2",
    titre: "Gestion des Risques Agricoles",
    thematique: "Finance & Gestion",
    description: "Apprenez à évaluer et atténuer les risques liés aux marchés, aux conditions météorologiques et aux investissements agricoles.",
    source_externe: "FAO elearning Academy",
    lien_externe: "https://elearning.fao.org/course/view.php?id=336",
    modalite: "En ligne (Externe)",
    niveau: "Intermédiaire",
    prix_fcfa: 0,
    statut: "publie",
    acces: "libre",
    cover_image_url: "/images/formations/ext-fao-4.png",
    programme_json: JSON.stringify({
      contexte: "Le secteur agricole est particulièrement vulnérable à de nombreux risques (climatiques, biologiques, économiques). Une gestion proactive est essentielle pour protéger les revenus des producteurs.",
      public_cible: "Exploitants agricoles, gestionnaires de coopératives, et agents de vulgarisation.",
      presentation_structure: "L'Académie d'apprentissage en ligne de la FAO propose des formations reconnues mondialement sur l'alimentation et l'agriculture.",
      objectifs: [
        "Identifier et évaluer les risques agricoles majeurs",
        "Mettre en place des stratégies d'atténuation",
        "Utiliser les outils d'assurance et de protection financière"
      ]
    })
  },
  {
    id: "fao-3",
    titre: "Systèmes Alimentaires Durables",
    thematique: "Chaîne de Valeur",
    description: "Comprendre les principes des systèmes alimentaires durables et la réduction des pertes après récolte pour optimiser la chaîne de valeur.",
    source_externe: "FAO elearning Academy",
    lien_externe: "https://elearning.fao.org/course/view.php?id=682",
    modalite: "En ligne (Externe)",
    niveau: "Intermédiaire",
    prix_fcfa: 0,
    statut: "publie",
    acces: "libre",
    cover_image_url: "/images/formations/ext-fao-3.png",
    programme_json: JSON.stringify({
      contexte: "La transition vers des systèmes alimentaires durables est indispensable pour nourrir une population mondiale croissante tout en préservant les écosystèmes naturels.",
      public_cible: "Acteurs de l'agro-industrie, ONG, et décideurs.",
      presentation_structure: "La FAO s'engage à promouvoir une chaîne de valeur alimentaire respectueuse de l'environnement et socialement équitable.",
      objectifs: [
        "Appréhender la notion de système alimentaire durable",
        "Mesurer et réduire les pertes après récolte",
        "Favoriser les circuits courts et l'économie circulaire"
      ]
    })
  },
  {
    id: "fao-4",
    titre: "Gouvernance Foncière",
    thematique: "Droits & Gouvernance",
    description: "Les directives volontaires pour une gouvernance responsable des régimes fonciers applicables aux terres, pêches et forêts.",
    source_externe: "FAO elearning Academy",
    lien_externe: "https://elearning.fao.org/course/view.php?id=255",
    modalite: "En ligne (Externe)",
    niveau: "Avancé",
    prix_fcfa: 0,
    statut: "publie",
    acces: "libre",
    cover_image_url: "/images/formations/ext-fao-2.png",
    programme_json: JSON.stringify({
      contexte: "L'accès sécurisé à la terre et aux ressources naturelles est fondamental pour la sécurité alimentaire et l'éradication de la pauvreté rurale.",
      public_cible: "Responsables gouvernementaux, juristes, et représentants communautaires.",
      presentation_structure: "La FAO accompagne les États membres dans l'application des directives volontaires sur la gouvernance foncière.",
      objectifs: [
        "Comprendre les enjeux de la sécurisation foncière",
        "Appliquer les directives volontaires de la FAO",
        "Gérer pacifiquement les conflits liés aux ressources naturelles"
      ]
    })
  }
];

async function seed() {
  console.log("Seeding FAO courses...");
  for (const course of faoCourses) {
    try {
      await db.insert(formations).values(course).onConflictDoUpdate({
        target: formations.id,
        set: course,
      });
      console.log(`Inserted ${course.titre}`);
    } catch (err) {
      console.error(`Error inserting ${course.titre}:`, err);
    }
  }
  console.log("FAO courses seeded successfully!");
  process.exit(0);
}

seed().catch(console.error);
