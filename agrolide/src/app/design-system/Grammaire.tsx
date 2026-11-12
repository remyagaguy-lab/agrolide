import * as React from 'react'
import { BookOpen, Search } from 'lucide-react'
import { Anneau, ArcheBadge, ArchPhoto, Emblem, Feuille, GEOMETRIE, Horizon, Motif, PlanSoleil, Puce, RAPPORTS_ECHOS, Sillons } from '@/components/brand'

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
    origine: 'Le favicon entier.',
    role: 'Signature en couleur : logo, favicon, icône d’application. Une seule fois par page, dans le logo.',
    tailles: '16 à 96 px ; jamais en décor de fond.',
    couleurs: 'Couleur d’origine sur clair ; plein blanc sur vert et en sombre.',
    interdit: 'Recolorer la version couleur, le couper, le déformer, en faire un motif.',
    demo: <Emblem variant="couleur" className="w-14" />,
  },
  {
    forme: 'Sceau (emblème plein)',
    composant: '<Emblem variant="plein">',
    origine: 'La silhouette de l’emblème : le cercle entaillé par ses sillons blancs (favicon-forme).',
    role: 'SCEAU monochrome : pastille « Certifiée agrolide » sur une photo, filigrane de certificat, avatar par défaut, signature au creux de l’horizon (en-tête, pied de page).',
    tailles: '16 à 96 px ; filigrane jusqu’à 256 px à 6 % d’opacité.',
    couleurs: 'Blanc sur vert profond ; vert sur clair.',
    interdit: 'Comme décor répété, en couleur (c’est le rôle de l’emblème), plus d’un sceau par vue.',
    demo: <Emblem variant="plein" className="w-12 text-primary" />,
  },
  {
    forme: 'Soleil (plan + échos)',
    composant: '<PlanSoleil>',
    origine: `Quatre cercles concentriques : soleil clair, soleil ${pct(RAPPORTS_ECHOS[0])}, blanc ${pct(RAPPORTS_ECHOS[1])}, anneau ${pct(RAPPORTS_ECHOS[2])}.`,
    role: 'LE PLAN : la grande forme de la vue, aplat plein qui porte le titre (héros, en-tête intérieur, 404, bandeau d’appel), avec au plus 3 échos.',
    tailles: 'Rayon de 9 rem à 800 px ; échos aux rapports de l’emblème, ou pas constant de 40 à 56 px pour un plan de plus de 400 px.',
    couleurs: 'Vert profond (titre blanc), jaune (titre vert, 1 écho orange sur fond vert), vert pâle (états vides).',
    interdit: 'Un plan flottant au milieu, un second grand plan dans la vue, un contour, un écho sur un visage.',
    demo: (
      <div className="relative h-16 w-24 overflow-hidden rounded-tag bg-surface">
        <PlanSoleil x="0%" y="100%" rayon="2.5rem" />
      </div>
    ),
  },
  {
    forme: 'Arche',
    composant: '<Arche variant="plein">, <ArcheBadge>',
    origine: 'Reconstruite avec les cercles de l’emblème : la silhouette au-dessus de la 1re ligne blanche (dôme) et le grand sillon (épaisseur constante, bout rond d’origine). IoU 0,991 et 0,977. Le marqueur dessiné à part ne coïncide qu’à 85 %.',
    role: 'PORTEUR à taille moyenne : carte « titre dans l’arche », badge de pictogramme, date d’événement, onglet-signature du héros.',
    tailles: 'Badge 40 à 112 px, contenu au centre optique du dôme (axe de symétrie, mi-hauteur de la corde verticale) ; carte : 125 % de la largeur ; onglet 150 à 184 px.',
    couleurs: 'Jaune soleil + pictogramme vert ; vert + pictogramme blanc ; blanc sur photo (carte).',
    interdit: 'L’arche creuse comme cadre photo, l’arche centrée sous un titre, plusieurs arches qui s’empilent.',
    demo: <ArcheBadge className="w-14"><BookOpen /></ArcheBadge>,
  },
  {
    forme: 'Fenêtre',
    composant: '<ArchPhoto framed={false}>',
    origine: 'Le ciel de l’emblème : disque intérieur de l’anneau au-dessus des deux collines (IoU 0,985). Son point le plus bas est le creux en V.',
    role: 'PHOTO de terrain ou de groupe, grande (50 à 60 % de la largeur), sujet tourné vers le texte ; une capture d’écran peut en sortir.',
    tailles: '320 px de large au minimum.',
    couleurs: 'Échos pâles de la fenêtre (même ouverture, agrandie) sur fond clair.',
    interdit: 'Portraits d’équipe (visages trop petits), cadre au trait, deux fenêtres côte à côte.',
    demo: <ArchPhoto src="/hero-background.webp" alt="" framed={false} source="embleme" className="w-24" />,
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
          <li><strong className="text-on-surface">Arche</strong> : silhouette au-dessus de la 1re ligne blanche + grand sillon.</li>
          <li><strong className="text-on-surface">Fenêtre</strong> : le ciel (disque intérieur au-dessus des collines).</li>
          <li><strong className="text-on-surface">Sceau</strong> : la silhouette pleine, entaillée par les sillons.</li>
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
          ['Une seule grande forme par vue.', 'Plan soleil, fenêtre ou sillons : un seul par écran. Les petites formes (badge, feuille, anneau, onglet) ont un rôle et une place fixes.'],
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
      <p className="mt-4 max-w-3xl text-body-sm text-on-surface-muted">
        <code>HorizonDivider</code> (courbes approchées) reste disponible pour les pages existantes ; <code>Horizon</code> le remplacera page par page.{' '}
        <code>Arche</code> et <code>ArchPhoto</code> gardent le tracé du marqueur par défaut tant que le passage à <code>source=&quot;embleme&quot;</code> n’est pas validé ;{' '}
        <code>ArcheBadge</code> utilise déjà le tracé déduit. L’arche creuse n’est plus recommandée comme cadre photo : utiliser la fenêtre sans cadre.
      </p>
    </>
  )
}
