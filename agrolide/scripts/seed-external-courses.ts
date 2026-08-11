import { db } from '../src/db/index';
import { formations } from '../src/db/schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const externalCourses = [
  {
    id: "ext-funmooc-1",
    titre: "MOOC Agroécologie",
    thematique: "Agroécologie",
    description: "Une approche interdisciplinaire combinant agronomie, écologie, sciences sociales pour comprendre les enjeux et pratiques de l'agroécologie.",
    source_externe: "FUN MOOC",
    lien_externe: "https://www.fun-mooc.fr/fr/cours/agroecologie/",
    niveau: "Débutant",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "/images/formations/ext-funmooc-1.png",
    acces: "Gratuit",
    programme_json: JSON.stringify({
      contexte: "Le cours explore l'émergence du concept d'agroécologie et les processus de transition vers des systèmes agricoles durables.",
      public_cible: "Étudiants, professionnels de l'agriculture, grand public.",
      presentation_structure: "Formation portée par l'Institut Agro Montpellier et Agreenium.",
      objectifs: [
        "Comprendre les enjeux de l'agroécologie",
        "Analyser des pratiques agricoles durables",
        "Explorer la transition agroécologique"
      ]
    })
  },
  {
    id: "ext-funmooc-2",
    titre: "Nutrition et Systèmes Alimentaires",
    thematique: "Agrobusiness",
    description: "Comprendre les liens entre la production agricole, la transformation, la distribution et la nutrition humaine pour des systèmes alimentaires durables.",
    source_externe: "FUN MOOC",
    lien_externe: "https://www.fun-mooc.fr/fr/cours/nutrition-systemes-alimentaires/",
    niveau: "Intermédiaire",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "/images/formations/ext-funmooc-2.png",
    acces: "Gratuit",
    programme_json: JSON.stringify({
      contexte: "La nécessité de repenser nos systèmes alimentaires pour garantir une nutrition de qualité tout en préservant l'environnement.",
      public_cible: "Acteurs de l'agroalimentaire, décideurs, étudiants en agronomie.",
      presentation_structure: "Proposé par l'Institut Agro Montpellier sur la plateforme FUN MOOC.",
      objectifs: [
        "Analyser la chaîne de valeur agroalimentaire",
        "Identifier les impacts sur la nutrition",
        "Proposer des améliorations durables"
      ]
    })
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
