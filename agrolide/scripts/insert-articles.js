require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const articles = [
  {
    slug: "pratiques-agroecologiques",
    titre: "Pratiques agroécologiques pour sols tropicaux",
    extrait: "Comment adapter les techniques de conservation des sols aux conditions climatiques de l'Afrique subsaharienne.",
    categorie: "Agronomie",
    auteur_externe: "Équipe Agrolide",
    published_at: "2024-10-12T00:00:00Z",
    image_une_url: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c0e?q=80&w=2070&auto=format&fit=crop",
    statut: "publie",
    contenu_json: {}
  },
  {
    slug: "financer-projet-agricole",
    titre: "Financer son projet agricole : les clés",
    extrait: "Tour d'horizon des instruments financiers accessibles aux agripreneurs africains en 2024.",
    categorie: "Agrobusiness",
    auteur_externe: "Équipe Agrolide",
    published_at: "2024-10-05T00:00:00Z",
    statut: "publie",
    contenu_json: {}
  },
  {
    slug: "competences-agronomes",
    titre: "Compétences du futur pour les agronomes",
    extrait: "Panorama des formations techniques et managériales qui font la différence sur le terrain africain.",
    categorie: "Formation",
    auteur_externe: "Équipe Agrolide",
    published_at: "2024-09-28T00:00:00Z",
    statut: "publie",
    contenu_json: {}
  },
  {
    slug: "innovation-agricole",
    titre: "Les innovations technologiques qui transforment l'agriculture",
    extrait: "Découvrez comment l'IA et les drones révolutionnent les rendements agricoles en Afrique de l'Ouest.",
    categorie: "Recherche & vulgarisation",
    auteur_externe: "Équipe Agrolide",
    published_at: "2024-09-15T00:00:00Z",
    statut: "publie",
    contenu_json: {}
  }
]

async function insertArticles() {
  for (const article of articles) {
    const { data, error } = await supabase.from('articles').upsert(article, { onConflict: 'slug' })
    if (error) {
      console.error('Erreur lors de l\'insertion de', article.slug, error)
    } else {
      console.log('Inséré avec succès:', article.slug)
    }
  }
}

insertArticles()
