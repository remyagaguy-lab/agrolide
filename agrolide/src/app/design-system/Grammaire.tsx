import * as React from 'react'
import { BookOpen, Search } from 'lucide-react'
import { CarteSoleil } from '@/components/ui/CarteSoleil'
import { Anneau, ArcheBadge, ArchPhoto, Emblem, EmblemEclate, Feuille, GEOMETRIE, Horizon, Motif, PlanSoleil, Puce, RAPPORTS_ECHOS, Sillons } from '@/components/brand'

const R = GEOMETRIE.rayons
const pct = (v: number) => `×${v.toFixed(2).replace('.', ',')}`

type Ligne = {
  forme: string
  composant: string
  origine: string
  role: string
  tailles: string
  couleurs: string
  interdit: string
  demo: React.ReactNode
}

const LIGNES: Ligne[] = [
  {
    forme: 'Emblème',
    composant: '<Emblem>',
    origine: 'Le favicon entier. En une couleur, le soleil est détaché des collines par un filet blanc d’un demi-trait (31 px).',
    role: 'SIGNATURE : logo, favicon, icône d’application, pied de page, filigrane de certificat, avatar par défaut. Couleur, noir, blanc ou contour ; jamais de silhouette pleine.',
    tailles: '16 à 96 px ; jamais en décor de fond.',
    couleurs: 'Couleur sur clair ; blanc sur vert profond, sur photo et en sombre ; noir pour l’impression ; contour à partir de 48 px.',
    interdit: 'Recolorer la version couleur, le couper, le déformer, en faire un motif.',
    demo: <Emblem variant="couleur" className="w-14" />,
  },
  {
    forme: 'Soleil (plan + échos)',
    composant: '<PlanSoleil>',
    origine: `Quatre cercles concentriques : soleil clair, soleil ${pct(RAPPORTS_ECHOS[0])}, blanc ${pct(RAPPORTS_ECHOS[1])}, anneau ${pct(RAPPORTS_ECHOS[2])}.`,
    role: 'LE PLAN : la grande forme de la vue, aplat plein qui porte le titre (héros, en-tête intérieur, 404, bandeau d’appel), avec au plus 3 échos. En petit : la carte « titre dans le soleil » (quart de soleil clair dans le coin bas gauche d’une photo).',
    tailles: 'Rayon de 9 rem à 800 px ; échos aux rapports de l’emblème, ou pas constant de 40 à 56 px pour un plan de plus de 400 px.',
    couleurs: 'Vert profond (titre blanc), jaune (titre vert, 1 écho orange sur fond vert), vert pâle (états vides), clair (carte sur photo : échos translucides en thème clair, aucun écho en sombre).',
    interdit: 'Un plan flottant au milieu, un second grand plan dans la vue, un contour, un écho sur un visage.',
    demo: (
      <div className="relative h-16 w-24 overflow-hidden rounded-tag bg-surface">
        <PlanSoleil x="0%" y="100%" rayon="2.5rem" />
      </div>
    ),
  },
  {
    forme: 'Arche (le dôme)',
    composant: '<Arche variant="plein">, <ArcheBadge>',
    origine: 'La silhouette de l’emblème au-dessus de sa 1re ligne blanche (anneau, ciel, collines), IoU 0,991. Le sillon autrefois accolé dessous est retiré (12/11/2026).',
    role: 'PORTEUR de CHIFFRES à taille moyenne : date d’événement, numéro d’étape. Les pictogrammes n’y sont plus insérés (décision du 12/11/2026) : ils restent libres, posés directement sur la carte ou la section.',
    tailles: 'Badge 40 à 112 px, contenu au centre optique du dôme (axe de symétrie, mi-hauteur de la corde verticale).',
    couleurs: 'Jaune soleil + chiffre vert ; vert + chiffre blanc.',
    interdit: 'Y insérer un pictogramme, lui recoller un sillon, le poser sur une photo pour porter un titre (c’est le rôle du soleil), le poser seul en onglet sur un bord, l’utiliser comme cadre photo au trait, le centrer sous un titre, empiler plusieurs dômes.',
    demo: <ArcheBadge className="w-14">3</ArcheBadge>,
  },
  {
    forme: 'Fenêtre',
    composant: '<ArchPhoto>',
    origine: 'Le ciel de l’emblème : disque intérieur de l’anneau au-dessus des deux collines (IoU 0,985). Son point le plus bas est le creux en V.',
    role: 'PHOTO de terrain ou de groupe, grande (50 à 60 % de la largeur), sujet tourné vers le texte ; une capture d’écran peut en sortir.',
    tailles: '320 px de large au minimum.',
    couleurs: 'Échos pâles de la fenêtre (même ouverture, agrandie) sur fond clair.',
    interdit: 'Portraits d’équipe (visages trop petits), cadre au trait, deux fenêtres côte à côte.',
    demo: <ArchPhoto src="/hero-background.webp" alt="" className="w-24" />,
  },
  {
    forme: 'Emblème éclaté',
    composant: '<EmblemEclate>',
    origine: 'Le dôme et les trois pièces du bas (colline, grand sillon, feuille), détachées de l’anneau. Chaque pièce = son aplat intérieur + un demi-trait autour ; coins arrondis du même demi-trait, comme le bout du grand sillon. Toutes s’inscrivent dans le cercle extérieur de l’emblème (écart < 0,2 px) : les aplats bordés par l’anneau s’arrêtent sur son axe, les bouts du grand sillon sont tangents au cercle.',
    role: 'ILLUSTRATION DE GRAND FORMAT : page 404, en-tête d’accueil, écran d’erreur ; le ciel peut porter le soleil ou une photo.',
    tailles: '240 px et plus ; jamais en badge ni en icône (trop chargé en petit).',
    couleurs: 'Vert profond ou blanc ; soleil jaune dans le ciel (variante soleil).',
    interdit: 'En petit, à côté de l’emblème ou du logo dans la même vue, avec un plan soleil.',
    demo: <EmblemEclate className="w-14 text-primary" />,
  },
  {
    forme: 'Sillons',
    composant: '<Sillons>',
    origine: 'Les trois traits verts de droite : même épaisseur que l’anneau (61,8 à 62,7 px), axes circulaires aux centres décalés sous la feuille ; les bandes blanches entre eux s’affinent de 68 à 45 px. Cadre = coin bas-droit de l’emblème.',
    role: 'MOUVEMENT DE COIN : bandeau de chiffres, en-tête vert, coin d’un bandeau large.',
    tailles: '30 % de la largeur sur mobile, 18 à 26 rem sur bureau ; proportions fixes (726 × 490).',
    couleurs: 'Couleur du texte à 8–12 % d’opacité sur vert ; vert à 12 % sur clair.',
    interdit: 'Au milieu, derrière un paragraphe ou un chiffre, en contact avec l’horizon, dans deux coins de la même vue.',
    demo: (
      <div className="relative h-16 w-24 overflow-hidden rounded-tag bg-surface-brand text-on-surface-brand">
        <Sillons coin="haut-droite" className="w-16" opacite={0.35} />
      </div>
    ),
  },
  {
    forme: 'Horizon',
    composant: '<Horizon>',
    origine: 'Les deux collines (arcs de rayons 683 et 896) qui se rejoignent en V sous le soleil.',
    role: 'SÉPARATEUR : bas d’un en-tête vert, haut du pied de page. Élément de structure : il ne compte pas comme forme, mais ne touche aucune autre forme.',
    tailles: '40 / 56 / 80 px de haut ; toute la largeur.',
    couleurs: 'La couleur de la section suivante.',
    interdit: 'Deux horizons qui se suivent, un horizon au milieu d’une section, l’horizon retourné vers le haut.',
    demo: (
      <div className="w-24 overflow-hidden rounded-tag bg-surface-brand pt-6">
        <Horizon className="h-8 text-surface sm:h-8 lg:h-8" />
      </div>
    ),
  },
  {
    forme: 'Feuille',
    composant: '<Feuille>, <Puce>',
    origine: 'Lentille : intersection du disque de l’emblème et du dernier arc des sillons.',
    role: 'REPÈRE : puce de liste (<Puce>, centrée sur la hauteur d’x de la 1re ligne : +0,095 em), pastille de catégorie ou de type, signature d’un témoignage.',
    tailles: '8 à 24 px.',
    couleurs: 'Vert feuille (accent-leaf) ; blanc sur vert.',
    interdit: 'En grand, comme cadre, comme seul porteur d’une information (toujours avec un texte).',
    demo: <Feuille className="w-10 text-accent-leaf" />,
  },
  {
    forme: 'Anneau',
    composant: '<Anneau>',
    origine: `La couronne verte (rayons ${R['anneau-int'].toFixed(0)} et ${R['anneau-ext'].toFixed(0)}) et son ouverture de ${(GEOMETRIE.anneauOuverture[1] - GEOMETRIE.anneauOuverture[0]).toFixed(0)}° en bas à gauche.`,
    role: 'CHARGEMENT et PROGRESSION : chargement de page, bouton en attente, profil complété autour de l’avatar. Seule forme utilisée en trait.',
    tailles: '16 à 160 px.',
    couleurs: 'Vert (primary) ; piste à 18 %.',
    interdit: 'Fermer l’anneau, le grossir en décor, l’utiliser comme cadre photo seul.',
    demo: <Anneau mode="progression" valeur={0.6} label={null} className="size-12 text-primary" />,
  },
  {
    forme: 'Motif',
    composant: '<Motif>',
    origine: 'Le motif plante de la charte (tuile vectorielle).',
    role: 'TEXTURE : connexion et inscription, grands aplats sans texte dense.',
    tailles: 'Planche de 400 à 800 px.',
    couleurs: 'Ton sur ton, 4 à 7 % d’opacité.',
    interdit: 'Avec un plan soleil ou des sillons dans la même vue.',
    demo: (
      <div className="relative h-16 w-24 overflow-hidden rounded-tag bg-surface-brand text-on-surface-brand">
        <Motif size={300} opacity={0.3} className="text-on-surface-brand" />
      </div>
    ),
  },
]

/** Section « Grammaire des formes » de la page /design-system. */
export function Grammaire() {
  return (
    <>
      <h3 className="mb-3 text-title-md">L’emblème est un système de cercles</h3>
      <p className="mb-4 max-w-3xl text-body-md text-on-surface-variant">
        Mesure sur les pixels du favicon (<code>scripts/forme/primitives.py</code>) : le soleil clair, le soleil, le blanc et l’anneau sont
        quatre cercles de même centre (écart inférieur à 2 px), aux pas presque égaux ({R['soleil-clair'].toFixed(0)}, {R.soleil.toFixed(0)},{' '}
        {R['anneau-int'].toFixed(0)}, {R['anneau-ext'].toFixed(0)} px). Les collines, les deux bandes blanches et le haut de la feuille sont des
        arcs de cercles dont les centres sont sous l’emblème ; la feuille est une lentille. Tout le vert est tracé d’un seul trait : l’anneau
        et les trois sillons ont la même épaisseur (61 à 63 px, 12 % du rayon). Résidus moyens d’ajustement : 0,2 à 0,9 px ; IoU de
        contrôle : 0,95 à 0,99. Chaque forme ci-dessous est donc un morceau exact de l’emblème, avec un rôle et un seul.
      </p>
      <div className="mb-8 grid items-center gap-6 rounded-card border border-outline-variant bg-surface-container-lowest p-6 md:grid-cols-[auto_1fr]">
        <Emblem variant="couleur" title="Emblème agrolide" className="mx-auto w-40" />
        <ol className="grid gap-x-6 gap-y-2 text-body-sm text-on-surface-variant sm:grid-cols-2">
          <li><strong className="text-on-surface">Soleil</strong> : plan + 3 échos concentriques (×1,16 ; ×1,34 ; ×1,52).</li>
          <li><strong className="text-on-surface">Anneau</strong> : couronne de 12 % du rayon, ouverte sur 27°.</li>
          <li><strong className="text-on-surface">Horizon</strong> : deux collines, creux en V à 56 % de la largeur.</li>
          <li><strong className="text-on-surface">Sillons</strong> : trois traits d’épaisseur constante, foyers sous la feuille.</li>
          <li><strong className="text-on-surface">Feuille</strong> : lentille entre le disque et le dernier sillon.</li>
          <li><strong className="text-on-surface">Arche</strong> : le dôme, silhouette au-dessus de la 1re ligne blanche.</li>
          <li><strong className="text-on-surface">Fenêtre</strong> : le ciel (disque intérieur au-dessus des collines).</li>
          <li><strong className="text-on-surface">Éclaté</strong> : le dôme + colline, grand sillon et feuille détachés.</li>
        </ol>
      </div>

      <h3 className="mb-3 text-title-md">Une forme, un rôle</h3>
      <div className="overflow-x-auto rounded-card border border-outline-variant">
        <table className="w-full min-w-[56rem] text-left text-body-sm">
          <thead className="bg-surface-container text-label-md text-on-surface">
            <tr>
              <th className="p-3">Forme</th>
              <th className="p-3">Rôle</th>
              <th className="p-3">Origine mesurée</th>
              <th className="p-3">Tailles et couleurs</th>
              <th className="p-3">Interdit</th>
            </tr>
          </thead>
          <tbody>
            {LIGNES.map((l) => (
              <tr key={l.forme} className="border-t border-outline-variant align-top text-on-surface-variant">
                <td className="p-3">
                  <div className="mb-2 flex h-16 items-center">{l.demo}</div>
                  <p className="text-title-sm text-on-surface">{l.forme}</p>
                  <code className="text-label-sm text-on-surface-muted">{l.composant}</code>
                </td>
                <td className="p-3 text-on-surface">{l.role}</td>
                <td className="p-3">{l.origine}</td>
                <td className="p-3">{l.tailles} {l.couleurs}</td>
                <td className="p-3">{l.interdit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mb-3 mt-10 text-title-md">Six règles de composition</h3>
      <ol className="grid gap-3 md:grid-cols-2">
        {[
          ['Une seule grande forme par vue.', 'Plan soleil, fenêtre ou sillons : un seul par écran. Les petites formes (badge, feuille, anneau) ont un rôle et une place fixes.'],
          ['La forme est coupée par un bord.', 'Le plan et les sillons partent d’un bord ou d’un coin de la vue ; jamais flottants au centre.'],
          ['Jamais de trait sur un grand plan.', 'Les grands aplats sont pleins, les échos aussi. Seul l’anneau (petit) est un trait.'],
          ['Le texte se pose DANS le plan.', 'Titre de 2 à 3 lignes, jamais un long paragraphe ; contraste vérifié (blanc sur vert, vert sur jaune).'],
          ['Jamais le visage caché.', 'Ni plan, ni écho, ni capture sur un visage ; le sujet regarde vers le texte.'],
          ['Une photo ne change pas avec le thème.', 'Les échos posés sur une photo s’éclaircissent vers le blanc en clair comme en sombre (fond="photo") ; ailleurs, vers la surface du thème.'],
        ].map(([t, d], i) => (
          <li key={t} className="flex gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-4">
            <span className="text-title-lg text-primary">{i + 1}</span>
            <span><strong className="block text-title-sm text-on-surface">{t}</strong><span className="text-body-sm text-on-surface-variant">{d}</span></span>
          </li>
        ))}
      </ol>

      <h3 className="mb-3 mt-10 text-title-md">Exemples</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative isolate h-56 overflow-hidden rounded-card bg-surface">
          <PlanSoleil x="-4%" y="-22%" rayon="15rem" pas={24} />
          <div className="relative z-10 p-6 text-on-surface-brand">
            <p className="text-label-sm uppercase tracking-[0.12em] text-accent-sun">Formations</p>
            <p className="mt-1 max-w-[9.5rem] text-title-lg">Apprendre avec ceux qui cultivent</p>
          </div>
          <p className="absolute bottom-3 right-4 text-label-sm text-on-surface-muted">En-tête : plan + échos</p>
        </div>
        <div className="relative isolate flex h-56 flex-col items-center overflow-hidden rounded-card bg-surface-container-low px-4 pt-20 text-center">
          <PlanSoleil x="50%" y="0%" rayon="3.25rem" echos={2} ton="pale" fond="surface-container-low" />
          <Search aria-hidden="true" className="absolute left-1/2 top-3 size-6 -translate-x-1/2 text-primary" />
          <p className="text-title-md text-on-surface">Aucun résultat</p>
          <p className="mt-1 text-body-sm text-on-surface-variant">État vide : le soleil descend du bord.</p>
        </div>
        <div className="relative isolate h-56 overflow-hidden rounded-card bg-surface-brand p-6 text-on-surface-brand">
          <Sillons coin="haut-droite" className="w-40" opacite={0.12} />
          <p className="text-display-md text-accent-sun">2 400</p>
          <p className="text-title-md">membres</p>
          <p className="absolute bottom-3 left-6 text-label-sm opacity-80">Chiffres : sillons de coin</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-5">
          <div className="relative size-16 shrink-0">
            <Anneau mode="progression" valeur={0.6} label="Profil complété à 60 %" className="size-16 text-primary" />
            <span className="absolute inset-0 flex items-center justify-center text-label-md text-on-surface">60&nbsp;%</span>
          </div>
          <p className="text-body-sm text-on-surface-variant">Anneau de progression (s’ouvre en bas à gauche, comme l’emblème).</p>
        </div>
        <div className="flex items-center gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-5">
          <div className="w-20 shrink-0">
            <ArcheBadge className="w-20">18</ArcheBadge>
            <p className="mt-1 text-center text-label-md uppercase text-on-surface-variant">nov.</p>
          </div>
          <p className="text-body-sm text-on-surface-variant">Date d’événement : le jour au centre optique du dôme (chiffre centré sur la hauteur des capitales), le mois dessous.</p>
        </div>
        <ul className="space-y-2 rounded-card border border-outline-variant bg-surface-container-lowest p-5 text-body-md text-on-surface-variant">
          {['Puce de liste', 'Pastille de catégorie', 'Signature de témoignage, sur deux lignes si le texte est long'].map((t) => (
            <li key={t} className="flex gap-2.5"><Puce />{t}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 grid items-center gap-4 md:grid-cols-3">
        <CarteSoleil
          placement="coin"
          image={{ src: '/images/formations/ext-fao-1.webp', alt: 'Parcelle irriguée au goutte-à-goutte, panneaux solaires et agricultrice' }}
          categorie="Formation · 6 semaines"
          titre="Irrigation goutte-à-goutte sur petite parcelle"
        />
        <CarteSoleil
          placement="centre"
          image={{ src: '/images/formations/ext-fao-1.webp', alt: 'Parcelle irriguée au goutte-à-goutte, panneaux solaires et agricultrice' }}
          categorie="Formation · 6 semaines"
          titre="Irrigation goutte-à-goutte sur petite parcelle"
        />
        <div className="space-y-3 text-body-sm text-on-surface-variant">
          <p>
            Carte « titre dans le soleil » (composant <code>CarteSoleil</code> : formations à la une, pas les listes denses), soleil clair (<code>PlanSoleil ton=&quot;clair&quot;</code>)
            en deux placements :
          </p>
          <p>
            <strong className="text-on-surface">Dans le coin bas gauche</strong> : un quart de soleil (centre 4 cqw hors du coin, rayon 80 % de la
            largeur), catégorie et titre alignés à gauche. Pour une photo dont le sujet est à droite.
          </p>
          <p>
            <strong className="text-on-surface">Centré en bas</strong> : le soleil monte du bord bas (centre 7 cqw sous le bord, rayon 65 % de la
            largeur), texte centré. Pour une photo dont le sujet est en haut.
          </p>
          <p>
            Dans les deux cas : 3 échos translucides au pas de 14 px en thème clair, aucun écho en thème sombre (un voile sombre éteindrait la
            photo) ; titre de 2 à 3 lignes ; ni le soleil ni ses échos sur un visage.
          </p>
        </div>
      </div>
      <div className="mt-6 max-w-3xl space-y-2 text-body-md text-on-surface-variant">
        <h3 className="text-title-md text-on-surface">En-tête de rubrique (PageHero)</h3>
        <p>
          Bandeau vert profond ; <code>Sillons coin=&quot;haut-droite&quot;</code> à 10 % d’opacité (30 % de la largeur sur mobile, 10 rem à
          768 px, 20 rem à 1024 px, 26 rem dès 1280 px) ; <code>Horizon</code> aux couleurs de la section suivante. Le motif de marque n’y est plus : il ne se
          superpose pas aux sillons.
        </p>
        <p>
          Titre en <code>headline-md</code> sur mobile, <code>display-md</code> dès 768 px, sur 2 lignes au plus sur bureau (sans réduire le corps) ;
          sous-titre plus étroit que le titre (28 rem mobile, 30 rem bureau, équilibré) pour l’effet de flèche vers les boutons ; les sillons ne
          passent jamais sous une ligne de texte (mesuré de 375 à 1440 px sur les 12 pages).
        </p>
      </div>
      <div className="mt-6 max-w-3xl space-y-2 text-body-md text-on-surface-variant">
        <h3 className="text-title-md text-on-surface">Applications dans les composants</h3>
        <p>
          <strong className="text-on-surface">Pictogrammes libres</strong> : les icônes ne sont pas insérées dans l’arche (décision du 12/11/2026) ; elles se posent
          directement sur la carte ou la section, en trait de 1,75, couleur de marque. L’arche (le dôme) garde les chiffres : date d’événement, numéro d’étape (décision confirmée).
        </p>
        <p>
          <strong className="text-on-surface">Pied de page</strong> : <code>Horizon</code> aux couleurs du vert de marque ; le motif remonte jusqu’à la ligne
          de l’horizon (masque <code>HORIZON_MASQUE_TERRE_BORD</code>). <strong className="text-on-surface">404</strong> : l’emblème éclaté entier (<code>EmblemEclate variante=&quot;soleil&quot;</code>)
          au-dessus du texte, jamais coupé. <strong className="text-on-surface">État vide</strong> : soleil pâle qui descend du bord haut.{' '}
          <strong className="text-on-surface">Chargement</strong> : <code>Spinner</code> = <code>Anneau mode=&quot;chargement&quot;</code>.{' '}
          <strong className="text-on-surface">Carte d’article</strong> : <code>Feuille</code> devant la catégorie. <strong className="text-on-surface">Carte d’événement</strong> : jour dans le dôme, mois dessous.
        </p>
      </div>
      <p className="mt-4 max-w-3xl text-body-sm text-on-surface-muted">
        <code>HorizonDivider</code> (courbes approchées) n’est plus utilisé par les pages (remplacé par <code>Horizon</code>).{' '}
        Les marqueurs dessinés à part (arche avec sillon, emblème plein) sont retirés : toutes les formes sont désormais déduites de l’emblème.
      </p>
    </>
  )
}
