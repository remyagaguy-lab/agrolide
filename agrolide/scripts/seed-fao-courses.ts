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
    id: "fao-2",
    titre: "Capitalisation d'expériences pour un apprentissage continu",
    thematique: "Formation & Gestion",
    description: "Méthodologie pour identifier, analyser et partager les bonnes pratiques agricoles issues de l'expérience de terrain.",
    source_externe: "FAO elearning Academy",
    lien_externe: "https://elearning.fao.org/course/view.php?id=336",
    modalite: "En ligne (Externe)",
    niveau: "Débutant",
    prix_fcfa: 0,
    statut: "publie",
    acces: "libre",
    cover_image_url: "/images/formations/ext-fao-4.png",
    programme_json: JSON.stringify({
      contexte: "La capitalisation des expériences permet de ne pas reproduire les mêmes erreurs et de diffuser les innovations paysannes.",
      public_cible: "Agents de vulgarisation, chefs de projet, exploitants agricoles.",
      presentation_structure: "L'Académie d'apprentissage en ligne de la FAO.",
      objectifs: [
        "Comprendre le processus de capitalisation",
        "Mettre en place des stratégies de partage de connaissances",
        "Valoriser les expériences de terrain"
      ]
    })
  },
  {
    id: "fao-3",
    titre: "Données sur la composition des aliments",
    thematique: "Chaîne de Valeur",
    description: "Comprendre comment générer, compiler et utiliser les données sur la composition des aliments pour la nutrition.",
    source_externe: "FAO elearning Academy",
    lien_externe: "https://elearning.fao.org/course/view.php?id=354",
    modalite: "En ligne (Externe)",
    niveau: "Avancé",
    prix_fcfa: 0,
    statut: "publie",
    acces: "libre",
    cover_image_url: "/images/formations/ext-fao-3.png",
    programme_json: JSON.stringify({
      contexte: "La connaissance précise de la composition des aliments est indispensable pour élaborer des politiques nutritionnelles efficaces.",
      public_cible: "Nutritionnistes, chercheurs, acteurs de l'agro-industrie.",
      presentation_structure: "La FAO s'engage à promouvoir une chaîne de valeur alimentaire respectueuse de la santé humaine.",
      objectifs: [
        "Appréhender les bases de données nutritionnelles",
        "Générer et utiliser des données fiables",
        "Améliorer la qualité nutritionnelle des produits"
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
