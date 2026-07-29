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

<h3>1. Le sol correspond-il à vos cultures ?</h3>
<p>Toutes les terres ne se valent pas, et surtout, elles ne conviennent pas toutes aux mêmes cultures. Un maraîchage veut un sol meuble, riche en matière organique. Une culture vivrière pluviale, elle, tolère très bien un sol plus sableux. Un test simple : prenez une poignée de terre humide, roulez-la entre vos doigts. Si elle colle comme de la pâte, le sol est probablement argileux et draine mal. Si elle s'effrite immédiatement, il retient peu l'eau. La couleur du sol et la végétation qui y pousse déjà, spontanément, en disent souvent plus qu'on ne le croit sur sa fertilité réelle.</p>

<h3>2. Le sol est-il assez profond ?</h3>
<p>On pense rarement à creuser avant d'acheter. C'est pourtant une des vérifications les plus simples à faire. Les racines ont besoin d'espace pour s'installer et aller chercher l'eau en profondeur ; un sol peu profond, coincé au-dessus d'une roche ou d'une couche compacte, limite tout de suite la croissance et rend les cultures beaucoup plus vulnérables à la sécheresse. Creusez un trou d'au moins 60 cm, à deux ou trois endroits différents de la parcelle. Une terre homogène sur cette profondeur, c'est bon signe. Une roche qui affleure à 30 cm à peine, c'est un signal d'alerte qu'il ne faut pas ignorer.</p>

<h3>3. Y a-t-il assez d'eau, vraiment ?</h3>
<p>Sans eau, rien ne pousse — c'est la condition la plus évidente, et pourtant l'une des plus mal vérifiées. Cours d'eau à proximité, puits existant, nappe accessible, possibilité de forage : chaque option compte, tout comme la capacité du sol lui-même à retenir l'humidité. Le vrai test, c'est de visiter le terrain en pleine saison sèche, pas seulement pendant la saison des pluies où tout semble abondant. C'est le seul moment où un manque d'eau réel se révèle. Certaines techniques de conservation de l'eau documentées en zone semi-aride ouest-africaine — le zaï, les cordons pierreux, les demi-lunes — permettent de compenser un déficit modéré. Elles ne remplacent pas, en revanche, une source d'eau fiable.</p>

<h3>4. Le relief joue-t-il pour ou contre vous ?</h3>
<p>Une pente trop marquée entraîne l'érosion et complique sérieusement l'irrigation. À l'inverse, un terrain parfaitement plat en zone humide retient l'eau, qui stagne, et finit par asphyxier les racines. Après une bonne pluie, observez comment l'eau circule sur la parcelle : elle doit s'écouler sans creuser de ravines ni former de flaques qui persistent des heures. Une pente légère, entre 2 % et 8 %, reste le meilleur compromis pour la plupart des cultures pluviales, avec un aménagement minimal.</p>

<h3>5. Le climat local correspond-il vraiment à vos besoins ?</h3>
<p>Attention à une erreur fréquente : se fier aux moyennes nationales de pluviométrie. Les zones agro-écologiques changent parfois radicalement d'une vallée à l'autre, à quelques dizaines de kilomètres de distance seulement. Mieux vaut se renseigner directement auprès de l'institut météorologique ou de l'institut agronomique de son pays, sur les données précises de la zone visée — pas sur celles, plus vagues, de la région administrative.</p>

<h3>6. Peut-on y accéder toute l'année ?</h3>
<p>Un terrain magnifique mais inaccessible en saison des pluies devient vite un problème. Le transport des intrants se complique, les récoltes s'entassent faute de pouvoir sortir, et la main-d'œuvre hésite à se déplacer. Le bon réflexe : se renseigner sur l'état de la piste pendant la saison des pluies, pas seulement au moment de la visite en saison sèche. Un accès fiable toute l'année réduit sensiblement les coûts logistiques et les pertes après récolte.</p>

<h3>7. Le terrain est-il exempt de pollution ?</h3>
<p>C'est le point qu'on oublie le plus souvent — et pourtant, un ancien site industriel, une décharge à proximité, ou même un cours d'eau situé en aval d'une zone polluée peuvent contaminer durablement un sol ou une réserve d'eau. Renseignez-vous sur l'historique de la parcelle, auprès des exploitants voisins et des autorités locales, avant tout engagement. Pour un projet de plus grande ampleur, une analyse de sol en laboratoire, même basique, reste un bon investissement.</p>

<h3>8. L'ensoleillement est-il suffisant ?</h3>
<p>La majorité des cultures vivrières et maraîchères ont besoin de plusieurs heures de soleil direct chaque jour. Un relief encaissé, une forêt dense ou des bâtiments voisins peuvent projeter une ombre qui limite la photosynthèse — et donc le rendement, souvent sans que le porteur de projet ne s'en rende compte avant plusieurs mois. Observez l'orientation de la parcelle, et les zones d'ombre à différents moments de la journée, avant de vous décider.</p>

<h3>9. Le marché est-il accessible ?</h3>
<p>Un terrain parfait sur le papier, agronomiquement irréprochable, mais coupé de tout débouché commercial, peut plomber la rentabilité d'un projet entier. Transport plus coûteux, pertes liées à la durée du trajet, difficulté à écouler une production périssable à temps : les conséquences s'accumulent vite. Le critère qui compte vraiment n'est pas la distance en kilomètres, mais le temps de trajet réel jusqu'aux marchés, points de collecte ou acheteurs les plus proches.</p>

<h3>10. Le foncier est-il en règle ?</h3>
<p>Statut du sol, titre foncier, droit coutumier, permis d'exploiter : ces points se vérifient avant de signer, pas après. Les politiques agricoles régionales, portées notamment par la CEDEAO et l'UEMOA, poussent vers plus de cohérence entre les règles foncières des différents pays. Dans les faits, pourtant, les pratiques locales restent très variables d'un territoire à l'autre. Un document mal vérifié au départ peut remettre en cause un projet entier, parfois plusieurs saisons plus tard.</p>

<h3>Les erreurs qui reviennent le plus souvent</h3>
<p>Trois erreurs reviennent sans cesse chez les porteurs de projet : choisir un terrain sur le seul critère du prix ; le visiter uniquement en saison des pluies, quand l'eau semble abondante partout ; et démarrer les travaux avant même d'avoir vérifié les documents fonciers. Rien de tout cela n'est compliqué à éviter. Il suffit d'y penser avant, et non après la signature.</p>

<h3>Rejoignez le réseau</h3>
<p>Ces dix conditions ne remplacent pas une étude de terrain complète. Elles évitent, en revanche, les erreurs les plus coûteuses dès la première visite — et posent des bases solides pour construire, ensuite, un vrai projet agricole.</p>
<p>Rejoignez dès maintenant notre réseau pour concrétiser votre projet agricole : vous y trouverez des conseils supplémentaires et une communauté de professionnels engagés, agronomes, agripreneurs et Membres Partenaires, prêts à échanger sur les réalités du terrain.</p>

<div class="custom-cta" style="margin: 2rem 0; padding: 2rem; background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 0.75rem; text-align: center;">
  <h3 style="margin: 0 0 1rem 0; font-size: 1.5rem; color: #4b5563; font-weight: 700;">Vous souhaitez aller plus loin ?</h3>
  <p style="margin: 0 auto 1.5rem auto; font-size: 1.125rem; color: #6b7280; max-width: 600px; line-height: 1.6;">
    Rejoignez des milliers de professionnels sur agrolide et accédez à des ressources exclusives pour développer votre projet agricole.
  </p>
  <a href="/adhesion" style="display: inline-block; background-color: #f99e1d; color: #ffffff; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 1.125rem;">
    Découvrir les adhésions
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
