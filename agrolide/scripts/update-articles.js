require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const articlesContent = {
  "pratiques-agroecologiques": `
    <h2>Introduction à l'agroécologie en milieu tropical</h2>
    <p>L'Afrique subsaharienne fait face à des défis majeurs liés à la dégradation des sols, aux changements climatiques et à la pression démographique. L'agroécologie se présente comme une solution durable pour restaurer la fertilité des sols et garantir la sécurité alimentaire.</p>
    <h2>Les principes fondamentaux</h2>
    <p>L'application des principes agroécologiques repose sur plusieurs pratiques clés :</p>
    <ul>
      <li><strong>Le paillage et la couverture végétale :</strong> Protéger le sol contre l'érosion et maintenir l'humidité.</li>
      <li><strong>L'agroforesterie :</strong> Intégrer des arbres dans les systèmes agricoles pour améliorer la structure du sol et fournir de l'ombre.</li>
      <li><strong>La rotation et l'association des cultures :</strong> Optimiser l'utilisation des nutriments et rompre le cycle des ravageurs.</li>
    </ul>
    <h2>Impact sur les rendements</h2>
    <p>De nombreuses études démontrent que les pratiques agroécologiques, bien appliquées, permettent non seulement de stabiliser les rendements face aux chocs climatiques, mais aussi de réduire les coûts liés aux intrants chimiques.</p>
    <h2>Conclusion</h2>
    <p>La transition vers l'agroécologie nécessite un accompagnement technique et des échanges de bonnes pratiques entre les producteurs. C'est tout le sens de l'action menée par agrolide sur le terrain.</p>
  `,
  "financer-projet-agricole": `
    <h2>Comprendre le paysage du financement agricole</h2>
    <p>Le financement reste l'un des principaux freins pour les agripreneurs africains. Pourtant, de nombreux instruments existent en 2024 pour soutenir les projets agricoles innovants et durables.</p>
    <h2>Les sources de financement disponibles</h2>
    <ul>
      <li><strong>Les fonds d'investissement à impact :</strong> Ils ciblent les entreprises agricoles ayant un fort impact social et environnemental.</li>
      <li><strong>Le crowdfunding (financement participatif) :</strong> Une excellente alternative pour tester son produit et mobiliser sa communauté.</li>
      <li><strong>Les subventions et programmes internationaux :</strong> Des bailleurs de fonds proposent des subventions pour des projets axés sur la résilience climatique.</li>
      <li><strong>Le crédit bancaire classique :</strong> Souvent difficile d'accès sans garanties solides, il se réinvente avec des offres dédiées à l'agriculture (agri-finance).</li>
    </ul>
    <h2>Comment préparer son dossier ?</h2>
    <p>Un bon projet ne suffit pas ; il faut un business plan solide, des prévisions financières réalistes et une démonstration claire de la maîtrise technique. L'accompagnement par des experts, comme ceux du réseau agrolide, est souvent déterminant pour convaincre les investisseurs.</p>
  `,
  "competences-agronomes": `
    <h2>L'évolution du métier d'agronome</h2>
    <p>Le rôle de l'agronome en Afrique a considérablement évolué. Il n'est plus seulement un technicien du sol ou des plantes, mais un véritable chef de projet, capable de comprendre les enjeux économiques et environnementaux.</p>
    <h2>Les compétences techniques indispensables</h2>
    <p>Aujourd'hui, l'agronome doit maîtriser :</p>
    <ul>
      <li>L'analyse de données et l'utilisation d'outils d'agriculture de précision.</li>
      <li>Les techniques d'adaptation aux changements climatiques.</li>
      <li>La gestion intégrée des ravageurs.</li>
    </ul>
    <h2>Les soft skills (compétences transversales)</h2>
    <p>Au-delà de la technique, le savoir-être fait la différence :</p>
    <ul>
      <li><strong>Le leadership et le management :</strong> Capacité à diriger des équipes sur le terrain.</li>
      <li><strong>La communication :</strong> Savoir vulgariser des concepts complexes auprès des producteurs.</li>
      <li><strong>L'esprit d'entreprise :</strong> Détecter les opportunités commerciales dans la chaîne de valeur.</li>
    </ul>
    <h2>Se former en continu</h2>
    <p>La formation continue est essentielle. Des plateformes comme agrolide permettent aux professionnels d'actualiser leurs connaissances et de partager leurs expériences.</p>
  `,
  "innovation-agricole": `
    <h2>L'avènement de l'AgriTech en Afrique</h2>
    <p>L'innovation technologique s'impose comme un levier puissant pour surmonter les défis de l'agriculture africaine. Les solutions AgriTech transforment la manière dont nous cultivons, gérons et commercialisons nos produits.</p>
    <h2>Les technologies clés</h2>
    <ul>
      <li><strong>L'Intelligence Artificielle (IA) :</strong> Pour prédire les rendements, détecter les maladies des plantes via des photos sur smartphone, et optimiser l'irrigation.</li>
      <li><strong>Les drones agricoles :</strong> Utilisés pour la cartographie des parcelles, la surveillance de la santé des cultures et même l'épandage ciblé.</li>
      <li><strong>L'Internet des Objets (IoT) :</strong> Des capteurs dans le sol pour mesurer l'humidité en temps réel et déclencher l'irrigation automatiquement.</li>
    </ul>
    <h2>Défis et perspectives</h2>
    <p>Bien que prometteuses, ces technologies doivent faire face à des défis : l'accès à internet en zone rurale, le coût des équipements et la formation des utilisateurs. Il est crucial de développer des innovations "frugales", adaptées au contexte local.</p>
    <h2>Conclusion</h2>
    <p>L'innovation technologique n'est pas une fin en soi, mais un outil au service des producteurs. Son intégration doit se faire de manière inclusive et durable.</p>
  `
};

async function updateArticles() {
  for (const [slug, htmlContent] of Object.entries(articlesContent)) {
    const { data, error } = await supabase
      .from('articles')
      .update({ contenu_json: htmlContent })
      .eq('slug', slug);

    if (error) {
      console.error('Erreur lors de la mise à jour de', slug, error);
    } else {
      console.log('Mis à jour avec succès:', slug);
    }
  }
}

updateArticles();
