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
    acces: "libre"
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
    acces: "libre"
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
    acces: "libre"
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
    acces: "libre"
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
