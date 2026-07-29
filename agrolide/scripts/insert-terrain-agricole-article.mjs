import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const htmlContent = `
<p>Avant toute installation, un terrain agricole doit répondre à des critères précis : nature du sol, disponibilité en eau, climat, accessibilité et cadre réglementaire. Le réseau agrolide vous propose, dans cet article, une méthode en dix points, appuyée sur le cadre de référence de la FAO pour l'évaluation des terres, pour évaluer un terrain sans expertise pointue. Elle s'adresse à toute personne qui veut sécuriser son choix avant de concrétiser son projet agricole.</p>

<h3>Un choix trop souvent laissé au hasard</h3>
<p>Beaucoup de projets agricoles démarrent par un choix de terrain hâtif : un prix attractif, une parcelle héritée, une proximité avec le domicile. Ce choix pèse pourtant sur toute la suite du projet. Un sol pauvre, une eau absente en saison sèche ou un terrain enclavé peuvent transformer une bonne idée en échec coûteux, plusieurs saisons après l'investissement initial.</p>
<p>Avant d'investir temps et argent, chaque porteuse ou porteur de projet gagne à vérifier dix conditions essentielles. Cette méthode ne nécessite ni laboratoire ni expertise poussée : elle demande de la rigueur, une visite de terrain bien préparée et les bonnes questions.</p>

<h3>1. Un type de sol adapté à vos cultures</h3>
<p>Chaque culture a ses exigences de texture et de composition. Un maraîchage a besoin d'un sol meuble et riche en matière organique ; une culture vivrière pluviale tolère un sol plus sableux. Prenez une poignée de terre humide et roulez-la entre vos doigts : un sol trop collant draine mal, un sol qui s'effrite trop vite retient peu l'eau. La couleur du sol et la végétation spontanée qui y pousse donnent aussi de premiers indices fiables sur sa fertilité.</p>

<h3>2. Une profondeur de sol suffisante</h3>
<p>Les racines ont besoin d'espace pour s'ancrer et puiser eau et nutriments. Un sol peu profond, souvent limité par une roche ou une couche compacte proche de la surface, freine la croissance et la résistance à la sécheresse. Creusez un trou test d'au moins 60 cm à plusieurs endroits de la parcelle : une couche arable homogène sur cette profondeur est un bon signal ; une roche affleurante à moins de 30 cm doit alerter.</p>

<h3>3. Une disponibilité en eau fiable</h3>
<p>Sans eau, aucune culture ne tient une saison entière. Vérifiez la présence d'un cours d'eau, d'un puits, d'une nappe accessible ou d'un forage possible, ainsi que la capacité de rétention du sol lui-même. Visitez la parcelle en pleine saison sèche, pas seulement pendant la saison des pluies : c'est le seul moment où un déficit réel devient visible. Des techniques de conservation de l'eau pluviale documentées en zone semi-aride ouest-africaine, zaï, cordons pierreux, demi-lunes, peuvent compenser un manque modéré, mais ne remplacent pas une source d'eau fiable.</p>

<h3>4. Une topographie appropriée</h3>
<p>Une pente trop forte favorise l'érosion et complique l'irrigation ; un terrain trop plat en zone humide favorise la stagnation de l'eau et l'asphyxie des racines. Observez l'écoulement de l'eau après une pluie : elle doit circuler sans creuser de ravines ni stagner en flaques prolongées. Une pente légère, entre 2 % et 8 %, convient à la majorité des cultures pluviales avec un aménagement minimal.</p>

<h3>5. Un climat favorable à vos productions</h3>
<p>Pluviométrie, températures et saisons doivent correspondre aux besoins précis de vos cultures cibles, pas seulement à la moyenne nationale : les zones agro-écologiques varient fortement à quelques dizaines de kilomètres d'écart. Renseignez-vous auprès de l'institut météorologique ou de l'institut agronomique de votre pays sur les données de la zone précise, et non de la seule région administrative.</p>

<h3>6. Une accessibilité réelle, toute l'année</h3>
<p>Un terrain accessible seulement en saison sèche complique le transport des intrants et des récoltes, et décourage la main-d'œuvre. Vérifiez l'état de la piste ou de la route en saison des pluies, pas uniquement au moment de votre visite. Une bonne accessibilité toute l'année réduit les coûts logistiques et les pertes post-récolte.</p>

<h3>7. L'absence de pollution du sol et de l'eau</h3>
<p>Un ancien site industriel, une décharge proche ou un cours d'eau situé en aval d'une zone polluée peuvent contaminer durablement un sol ou une source d'eau. Renseignez-vous sur l'historique d'usage de la parcelle auprès des exploitants voisins et des autorités locales avant tout engagement. Pour un projet de grande envergure, une analyse de sol en laboratoire, même sommaire, reste recommandée.</p>

<h3>8. Une exposition au soleil adaptée</h3>
<p>La majorité des cultures vivrières et maraîchères ont besoin d'un ensoleillement direct de plusieurs heures par jour. Un terrain ombragé par un relief, une forêt dense ou des bâtiments voisins limite la photosynthèse, donc le rendement. Observez l'orientation de la parcelle et les ombres portées à différents moments de la journée avant de conclure.</p>

<h3>9. Une proximité utile avec le marché</h3>
<p>Un terrain agronomiquement parfait mais isolé de tout débouché commercial pèsera sur la rentabilité du projet : coûts de transport, pertes liées à la durée du trajet, difficulté à écouler une production périssable. Évaluez la distance réelle, en temps de trajet, jusqu'aux marchés, points de collecte ou acheteurs les plus proches, pas seulement en kilomètres.</p>

<h3>10. Le respect des réglementations locales</h3>
<p>Statut du sol, titre foncier, droit coutumier, permis d'exploiter : ces éléments doivent être vérifiés avant tout engagement financier, pas après. Les politiques agricoles régionales, portées notamment par la CEDEAO et l'UEMOA, encouragent une meilleure cohérence des règles foncières entre pays, mais les pratiques locales restent très variables d'un territoire à l'autre. Un document mal vérifié peut remettre en cause un projet entier, même après plusieurs saisons d'exploitation.</p>

<h3>Les erreurs les plus fréquentes</h3>
<p>Trois erreurs reviennent le plus souvent chez les porteurs de projet : choisir un terrain sur le seul critère du prix ; le visiter uniquement en saison des pluies, quand l'eau semble abondante partout ; et démarrer les travaux avant d'avoir vérifié les documents fonciers. Chacune de ces erreurs se corrige facilement, à condition d'y penser avant la signature.</p>

<div class="custom-cta" style="margin: 2rem 0; padding: 1.5rem; background: linear-gradient(135deg, #f4fdf4 0%, #e8f5e9 100%); border: 1px solid #c8e6c9; border-radius: 1rem; box-shadow: 0 4px 15px -5px rgba(27, 94, 56, 0.1); display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; overflow: hidden;">
  <div style="position: absolute; top: -20px; left: -20px; width: 100px; height: 100px; background: rgba(74, 222, 128, 0.15); border-radius: 50%; filter: blur(20px);"></div>
  <div style="position: absolute; bottom: -20px; right: -20px; width: 120px; height: 120px; background: rgba(249, 158, 29, 0.1); border-radius: 50%; filter: blur(25px);"></div>
  
  <div style="background-color: #ffffff; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin-bottom: 1rem; position: relative; z-index: 10;">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1b5e38" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
  </div>
  
  <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; color: #111827; font-weight: 800; line-height: 1.2; position: relative; z-index: 10;">Rejoignez le réseau</h3>
  <p style="margin: 0 0 1.25rem 0; font-size: 1rem; color: #4b5563; max-width: 500px; line-height: 1.5; position: relative; z-index: 10;">
    Ces dix conditions ne remplacent pas une étude de terrain complète, mais elles évitent les erreurs les plus coûteuses dès la première visite. Un terrain qui coche ces cases pose des bases solides pour construire, ensuite, un vrai projet agricole.<br><br>
    Rejoignez dès maintenant notre réseau pour concrétiser votre projet agricole : vous y trouverez des conseils supplémentaires et une communauté de professionnels engagés, agronomes, agripreneurs et Membres Partenaires.
  </p>
  
  <a href="/adhesion" style="position: relative; z-index: 10; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; background-color: #f99e1d; color: #ffffff; padding: 0.75rem 1.5rem; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 1rem; box-shadow: 0 4px 10px rgba(249, 158, 29, 0.3); text-transform: uppercase; letter-spacing: 0.05em;">
    Rejoindre le réseau
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 1px;"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  </a>
</div>
`

const article = {
  slug: "10-conditions-acquerir-terrain-agricole",
  titre: "Vous voulez acquérir un terrain agricole : les 10 conditions à vérifier avant de vous lancer",
  extrait: "Découvrez 10 conditions essentielles à vérifier avant d'investir dans un terrain agricole pour sécuriser votre projet : sol, eau, accessibilité, climat...",
  categorie: "Production végétale",
  auteur_id: "37db4fd1-8890-4526-b606-61144926143a",
  auteur_externe: null,
  published_at: new Date().toISOString(),
  image_une_url: "/images/articles/10-conditions-a-verifier-avant-dacquerir-un-terrain-agricole.jpg", 
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
