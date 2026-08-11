import { db } from '../src/db/index';
import { formations } from '../src/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const faoCourses = [
  {
    id: "fao-1",
    titre: "Gestion de l'eau pour une agriculture intelligente face au climat",
    thematique: "Climat & Résilience",
    description: "Apprenez les pratiques hydriques durables pour adapter vos systèmes de production aux changements climatiques.",
    source_externe: "FAO elearning Academy",
    lien_externe: "https://elearning.fao.org/course/view.php?id=460",
    modalite: "En ligne (Externe)",
    niveau: "Intermédiaire",
    prix_fcfa: 0,
    statut: "publie",
    acces: "libre",
    cover_image_url: "/images/formations/ext-fao-1.png",
    programme_json: JSON.stringify({
      contexte: "La gestion de l'eau est cruciale face à l'irrégularité des précipitations causée par le changement climatique.",
      public_cible: "Agriculteurs, techniciens agricoles, étudiants.",
      presentation_structure: "La FAO propose cette formation pour promouvoir des pratiques résilientes.",
      objectifs: [
        "Comprendre les enjeux de l'eau en agriculture",
        "Identifier les pratiques d'irrigation durables",
        "Évaluer l'impact des changements climatiques"
      ]
    })
  },

  {
    id: "fao-4",
    titre: "Introduction à l'agriculture intelligente face au climat (Anglais)",
    thematique: "Climat & Résilience",
    description: "Ce cours en anglais présente les impacts du changement climatique sur l'agriculture et les stratégies d'adaptation.",
    source_externe: "FAO elearning Academy",
    lien_externe: "https://elearning.fao.org/course/view.php?id=439",
    modalite: "En ligne (Externe)",
    niveau: "Débutant",
    prix_fcfa: 0,
    statut: "publie",
    acces: "libre",
    cover_image_url: "/images/formations/ext-fao-2.png",
    programme_json: JSON.stringify({
      contexte: "L'agriculture intelligente face au climat (AIC) aide à orienter les actions nécessaires pour transformer les systèmes agricoles.",
      public_cible: "Agriculteurs, décideurs politiques, étudiants.",
      presentation_structure: "Une formation fondamentale de la FAO pour la sécurité alimentaire mondiale.",
      objectifs: [
        "Comprendre le concept et les objectifs de l'AIC",
        "Identifier les pratiques agricoles résilientes",
        "Évaluer l'impact des changements climatiques sur l'agriculture"
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
