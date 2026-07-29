import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const htmlContent = `
<p>Le manioc offre bien plus de débouchés que la vente en frais ; sa transformation locale ouvre au moins sept voies d'activité accessibles si vous démarrez avec peu de moyens. Chaque opportunité s'appuie sur des méthodes déjà éprouvées par des institutions de recherche agronomique africaines.</p>

<p>Vous produisez ou vous avez accès à du manioc, et vous vous demandez comment en tirer un vrai revenu ? La réponse ne se trouve pas dans le champ, elle se trouve dans la transformation. Le manioc nourrit chaque année plusieurs centaines de millions de personnes en Afrique subsaharienne. C'est une plante robuste, qui pousse sur la plupart des sols du continent avec peu d'intrants. Mais une grande partie de la récolte se perd faute d'être transformée à temps : une racine fraîche commence à s'abîmer quarante-huit à soixante-douze heures après avoir été arrachée du sol. C'est exactement là que se cache votre opportunité.</p>

<p>Beaucoup de porteurs de projet pensent business uniquement en termes de production : cultiver plus, vendre plus de tubercules. Or c'est la transformation qui crée la vraie valeur. Voici sept filières issues du manioc, aujourd'hui bien documentées par les instituts de recherche agronomique africains, que vous pouvez lancer avec un investissement de départ raisonnable.</p>

<h3>1. La farine de manioc pour la boulangerie</h3>
<p>Une farine de manioc bien préparée peut remplacer une partie de la farine de blé importée dans le pain et la pâtisserie. Le procédé, éplucher, râper puis bien sécher le manioc, est détaillé étape par étape dans un manuel de formation élaboré par le Conseil Ouest et Centre Africain pour la Recherche et le Développement agricoles (CORAF), avec le Centre Songhai.</p>
<p>Pour démarrer, vous avez besoin d'une éplucheuse et d'une râpeuse, à main ou motorisée selon votre budget, et d'un approvisionnement régulier en tubercules bien secs à la base. Le séchage final est l'étape la plus délicate : une farine mal séchée moisit vite et vous fait perdre la confiance de votre premier client. Commencez par démarcher les boulangeries et pâtisseries de quartier avant de viser des clients plus gros. Ce type de farine est recherché dans plusieurs pays de la région pour réduire la facture d'importation de blé ; ce qui vous fera garder un client, c'est la régularité de votre offre et la constance de votre qualité, plus que le prix.</p>

<h3>2. Le gari</h3>
<p>Le gari s'obtient en faisant fermenter, presser puis cuire le manioc râpé. C'est un produit qui se conserve longtemps et qui reste un aliment du quotidien dans plusieurs pays d'Afrique de l'Ouest et centrale, du Nigeria au Bénin en passant par le Togo. La demande y est donc stable toute l'année.</p>
<p>Vous pouvez démarrer petit, avec un simple équipement de pressage, puis investir progressivement dans une presse ou une friteuse plus grande pour augmenter vos volumes. Un bon emballage et une étiquette soignée font une vraie différence de prix face à un gari vendu en vrac sur les marchés : c'est souvent là, plus que sur le prix, que vous vous démarquerez de la production artisanale déjà en place. Votre marché reste avant tout local ou régional ; c'est la régularité de votre offre et votre façon de distribuer le produit qui feront la différence, pas le lieu où vous vous installez.</p>

<h3>3. L'attiéké</h3>
<p>L'attiéké, une semoule de manioc fermenté, est particulièrement consommé en Côte d'Ivoire, mais on le retrouve de plus en plus dans d'autres pays de la sous-région et jusque dans la diaspora. Des travaux de recherche menés en Côte d'Ivoire ont permis de mieux comprendre comment bien fermenter et bien conditionner le produit encore chaud, une étape clé pour sa qualité sanitaire.</p>
<p>Avant de vous lancer, faites-vous former par un référent technique ou une coopérative déjà expérimentée : les conditions d'hygiène pendant le conditionnement à chaud sont déterminantes pour la sécurité de vos clients. Une fermentation faite sans encadrement peut compromettre la qualité du produit, et avec elle, votre réputation naissante. Une fois la technique maîtrisée, commencez par vendre sur les marchés et auprès des restaurants de votre zone : c'est votre régularité et votre stratégie de vente qui compteront plus que l'endroit où vous êtes installé.</p>

<h3>4. La fécule et l'amidon industriel</h3>
<p>L'amidon extrait du manioc sert à plusieurs industries : agroalimentaire, textile, papeterie, pharmacie. C'est une filière qui demande plus de capital au départ, mais elle offre des débouchés stables auprès d'acheteurs institutionnels et industriels, moins sensibles aux variations saisonnières qu'un marché de détail.</p>
<p>Cette activité convient mieux à un projet mené en groupe, coopérative ou groupement d'agripreneurs, à cause du niveau d'équipement et de volume nécessaire. Faites une étude de faisabilité avant de vous lancer : la quantité d'eau utilisée et la gestion des eaux usées sont deux contraintes techniques souvent sous-estimées dans ce type de production. La vente se fait ensuite directement auprès d'industriels ou de transformateurs alimentaires, ce qui veut dire aller les démarcher plutôt que d'attendre un client de passage.</p>

<h3>5. Les chips et snacks de manioc</h3>
<p>Dans de nombreuses villes africaines, les habitudes de consommation changent avec l'urbanisation : les citadins recherchent des produits déjà transformés, prêts à manger et faciles à transporter. Les chips de manioc, frites ou séchées, répondent bien à cette demande grandissante, en remplacement de produits importés.</p>
<p>Un emballage soigné vous permet de vous démarquer tout de suite des chips vendues sans conditionnement, et de justifier un prix plus élevé auprès des kiosques et boutiques de quartier, avant de viser la grande distribution. Le point à surveiller de près, c'est la conservation : un produit frit mal stocké rancit vite et fait perdre confiance au commerçant qui vous distribue, quel que soit le marché visé.</p>

<h3>6. Le tapioca et les produits sans gluten</h3>
<p>La demande mondiale pour les produits sans gluten ouvre un marché de niche à l'exportation pour le tapioca et d'autres dérivés du manioc, y compris auprès de la diaspora installée hors du continent. C'est une filière plus exigeante en normes de qualité et de traçabilité, mais elle permet de viser des marchés où le produit se vend plus cher.</p>
<p>Rapprochez-vous d'un Membre Partenaire ou Sénior du réseau déjà engagé dans l'exportation pour comprendre les exigences de certification avant d'investir. L'erreur la plus fréquente sur cette filière, c'est de vouloir exporter dès le lancement, sans avoir d'abord stabilisé une production locale fiable et conforme. Consolidez d'abord un marché local ou régional : c'est la base solide qui vous permettra ensuite d'élargir votre stratégie de vente à l'international.</p>

<h3>7. La valorisation des sous-produits</h3>
<p>Épluchures, cossettes non transformées, eaux de fécule : chaque étape de la transformation du manioc laisse des résidus que vous pouvez valoriser, en alimentation animale ou, à plus grande échelle, en bioéthanol. Cette filière reste encore peu exploitée sur le continent, alors qu'elle permet de réduire vos pertes et de créer un revenu complémentaire à partir de ce que vous jetiez jusque-là.</p>
<p>Un éleveur de votre zone peut constituer votre premier client pour des épluchures séchées, avant d'envisager une valorisation plus industrielle. Considérer ces résidus comme un simple déchet reste l'erreur la plus courante chez les porteurs de projet ; c'est pourtant souvent la marge la plus facile à capter, faute de concurrence sur ce segment.</p>

<h3>Une opportunité, une méthode</h3>
<p>Ces sept filières ne s'opposent pas entre elles ; vous pouvez souvent les combiner au sein d'une même unité de transformation, produire du gari tout en valorisant vos épluchures, par exemple. Un seul point commun à toutes : aucune ne se lance sérieusement sans une méthode de production rigoureuse, une bonne lecture de votre marché local et une stratégie de vente qui vous démarque de la production artisanale déjà en place.</p>
<p>Consultez le manuel de transformation du manioc élaboré par l'Institut International d'Agriculture Tropicale (IITA), disponible dans la bibliothèque numérique agrolide, pour retrouver, filière par filière, les étapes techniques qui vous aideront à sécuriser la qualité de votre produit, de la production jusqu'à la vente.</p>

<div style="margin-top: 2rem; padding: 1.5rem; background-color: #f8f8f8; border-left: 4px solid #4ade80; border-radius: 0.5rem;">
  <p style="margin-top: 0; font-weight: bold;">Téléchargez gratuitement le manuel :</p>
  <a href="/bibliotheque/49192cf8-6241-4e56-b93f-61830c786844" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #16a34a; color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; text-decoration: none; font-weight: bold; margin-top: 0.5rem;">
    Obtenir le manuel de l'IITA
  </a>
</div>
`

const article = {
  slug: "7-opportunites-agrobusiness-manioc",
  titre: "Transformer localement : 7 opportunités agrobusiness autour du manioc",
  extrait: "Le manioc offre bien plus que la vente en frais : sa transformation locale ouvre sept voies d'activité avec peu de moyens.",
  categorie: "Agrobusiness",
  auteur_externe: "Équipe Agrolide",
  published_at: new Date().toISOString(),
  image_une_url: "https://placehold.co/1200x630/16a34a/FFFFFF/png?text=Transformation+Manioc", 
  statut: "publie",
  contenu_json: htmlContent
}

async function insertArticle() {
  const { data, error } = await supabase.from('articles').upsert(article, { onConflict: 'slug' })
  if (error) {
    console.error("Erreur lors de l'insertion de", article.slug, error)
  } else {
    console.log('Inséré avec succès:', article.slug)
  }
}

insertArticle()
