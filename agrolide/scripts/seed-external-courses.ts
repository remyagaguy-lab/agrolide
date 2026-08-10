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
    lien_externe: "https://online.atingi.org",
    niveau: "Débutant",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "https://images.unsplash.com/photo-1595841696650-6f03d51fb154?q=80&w=1000&auto=format&fit=crop",
    programme_json: JSON.stringify([]),
    acces: "Gratuit",
  },
  {
    id: "ext-atingi-2",
    titre: "Business Model Canvas pour l'Agrobusiness",
    thematique: "Entrepreneuriat",
    description: "Découvrez comment utiliser le Business Model Canvas spécifiquement pour structurer, analyser et améliorer vos projets agricoles et agroalimentaires.",
    source_externe: "Agribusiness e-Academy (Atingi)",
    lien_externe: "https://online.atingi.org",
    niveau: "Intermédiaire",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop",
    programme_json: JSON.stringify([]),
    acces: "Gratuit",
  },
  {
    id: "ext-atingi-3",
    titre: "Préparer son Agrobusiness pour les Investisseurs",
    thematique: "Financement",
    description: "Comment structurer un projet agricole, préparer un plan d'affaires convaincant et attirer des investisseurs pour financer votre croissance.",
    source_externe: "Agribusiness e-Academy (Atingi)",
    lien_externe: "https://online.atingi.org",
    niveau: "Avancé",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "https://images.unsplash.com/photo-1611080922883-8a0a2e7c4ea9?q=80&w=1000&auto=format&fit=crop",
    programme_json: JSON.stringify([]),
    acces: "Gratuit",
  },
  // COLEAD
  {
    id: "ext-colead-1",
    titre: "Production Agricole Durable",
    thematique: "Production Végétale",
    description: "Adoptez les bonnes pratiques agricoles : gestion optimale de l'eau, préservation des sols, et utilisation responsable et sécurisée des intrants agricoles.",
    source_externe: "COLEAD e-learning",
    lien_externe: "https://elearning.colead.link",
    niveau: "Intermédiaire",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop",
    programme_json: JSON.stringify([]),
    acces: "Gratuit",
  },
  {
    id: "ext-colead-2",
    titre: "Sécurité Sanitaire des Aliments",
    thematique: "Agro-transformation",
    description: "Maîtriser les principes d'hygiène, la traçabilité et les normes sanitaires (HACCP) indispensables pour la transformation et l'exportation de produits agricoles.",
    source_externe: "COLEAD e-learning",
    lien_externe: "https://elearning.colead.link",
    niveau: "Avancé",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
    programme_json: JSON.stringify([]),
    acces: "Gratuit",
  },
  // Agrisud
  {
    id: "ext-agrisud-1",
    titre: "L'Agroécologie en pratique",
    thematique: "Agroécologie",
    description: "Apprenez les fondamentaux des pratiques agroécologiques : maintien de la fertilité, associations de cultures, lutte biologique et respect de l'environnement.",
    source_externe: "Agrisud International",
    lien_externe: "https://www.agrisud.org",
    niveau: "Débutant",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "https://images.unsplash.com/photo-1592982537447-6f296d19beec?q=80&w=1000&auto=format&fit=crop",
    programme_json: JSON.stringify([]),
    acces: "Gratuit",
  },
  // CORAF
  {
    id: "ext-coraf-1",
    titre: "Gestion Intégrée de la Fertilité des Sols",
    thematique: "Production Végétale",
    description: "Découvrez des techniques éprouvées pour maintenir et restaurer la santé des sols de manière durable, spécifiquement adaptées à l'Afrique de l'Ouest et du Centre.",
    source_externe: "CORAF e-learning",
    lien_externe: "https://coraf.org",
    niveau: "Intermédiaire",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1000&auto=format&fit=crop",
    programme_json: JSON.stringify([]),
    acces: "Gratuit",
  },
  // Daki Farm
  {
    id: "ext-daki-1",
    titre: "Initiation à l'Aviculture (Poulets de chair / Pondeuses)",
    thematique: "Production Animale",
    description: "Formation pratique sous forme de capsules vidéo abordant les bases techniques, sanitaires et alimentaires pour démarrer un élevage de volailles rentable.",
    source_externe: "Daki Farm",
    lien_externe: "https://daki-farm.com",
    niveau: "Débutant",
    modalite: "En ligne",
    prix_fcfa: 0,
    statut: "Publié",
    cover_image_url: "https://images.unsplash.com/photo-1548550023-2bf3c49b56bc?q=80&w=1000&auto=format&fit=crop",
    programme_json: JSON.stringify([]),
    acces: "Gratuit",
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
        }
      });
      console.log(`✅ Formation ajoutée/mise à jour : ${course.titre} (${course.source_externe})`);
    }
    console.log('🎉 Insertion terminée avec succès !');
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion :", error);
  }
}

seed();
