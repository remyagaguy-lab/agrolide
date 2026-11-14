import type { Metadata } from 'next'
import * as React from 'react'
import { Arche, ArcheBadge, ArchPhoto, Motif } from '@/components/brand'
import { FORMES_ALTERNATIVES, type FormeId } from './formes-alternatives'
import { FenetreForme, PastilleForme, PHOTOS, VignetteForme } from './Demo'

export const metadata: Metadata = {
  title: 'Formes alternatives à l’arche',
  description: 'Comparatif interne de formes candidates pour remplacer l’arche (page non indexée).',
  robots: { index: false, follow: false, nocache: true },
}

type Fiche = {
  id: FormeId
  nom: string
  intention: string
  echo: string
  forces: string[]
  limites: string[]
  soleil?: boolean
}

const FICHES: Fiche[] = [
  {
    id: 'petale',
    nom: 'Pétale',
    intention: 'Un rectangle dont deux coins opposés (haut gauche, bas droite) sont arrondis comme la lame d’une feuille, les deux autres presque vifs.',
    echo: 'Reprend la feuille de l’emblème (la lentille sous le soleil) et la même logique d’arcs de cercle, mais en cadre utilisable.',
    forces: ['Garde plus de 92 % de la photo.', 'La diagonale donne du mouvement sans geste décoratif.', 'Le chiffre se centre exactement : plus grand cercle inscrit de 100 % du côté.'],
    limites: [
      'Les deux coins vifs restent nets : ne pas placer un visage à moins de 8 % de ces coins.',
      'Posée sur le bord bas d’un bandeau (comme l’arche dans l’en-tête de fiche), le coin arrondi bas droit laisse un creux : prévoir une marge ou faire déborder la forme.',
      'À 40 px de large, les deux coins arrondis se lisent encore comme une feuille, pas comme un carré.',
    ],
  },
  {
    id: 'goutte',
    nom: 'Goutte',
    intention: 'Trois coins arrondis à la demi-hauteur, un seul coin vif (bas gauche) : une goutte, un grain, une bulle de parole.',
    echo: 'Le soleil et l’anneau de l’emblème sont des cercles : la goutte est un cercle auquel on a laissé un seul angle.',
    forces: ['Très douce, très lisible à petite taille : la meilleure pastille de chiffre du comparatif.', 'Le coin vif pointe vers le texte ou la légende associée.'],
    limites: [
      'En paysage, la forme devient une pilule : elle ressemble à un composant d’interface, pas à une fenêtre de photo.',
      'Les grands arrondis rognent les coins de l’image : 87 % de la photo seulement en portrait.',
      'Moins signature : proche des bulles de messagerie de nombreux produits.',
    ],
  },
  {
    id: 'alveole',
    nom: 'Alvéole',
    intention: 'Un hexagone aux sommets adoucis : la cellule de la ruche, le parcellaire vu du ciel. Sommet en haut en portrait et en pastille, côté plat en haut en paysage.',
    echo: 'Évoque la pollinisation, la ruche et le travail collectif du réseau ; se juxtapose en nid d’abeille pour une galerie de photos ou de membres.',
    forces: ['La plus reconnaissable : aucune autre forme ne se confond avec elle.', 'Se répète sans trou (galerie de membres, résultats d’annuaire).'],
    limites: [
      'Rogne le plus : environ 75 % de la photo en fenêtre, 65 % en pastille. Un visage cadré serré touche les arêtes.',
      'Le chiffre perd de la place : cercle inscrit de 87 % du côté en pastille.',
      'Style très répandu en identité visuelle « tech » ; à manier avec retenue pour ne pas faire générique.',
    ],
  },
  {
    id: 'colline',
    nom: 'Colline',
    intention: 'Un bord supérieur en colline douce (deux paliers raccordés par une courbe en S, crête décalée à droite), coins du bas arrondis.',
    echo: 'Reprend l’horizon du pied de page et de l’en-tête d’accueil : le même vocabulaire de collines, ici à l’échelle d’un cadre.',
    forces: ['Pose le texte naturellement sous la crête : idéale pour la grande vignette.', 'Repose à plat sur le bord bas d’un bandeau, comme l’arche actuelle.', 'Se lit tout de suite comme un paysage.'],
    limites: [
      'La crête coupe le haut de la photo : garder les têtes sous la courbe, mauvais choix pour un portrait cadré serré.',
      'En pastille, elle se lit comme une maison ou un pentagone : à éviter pour les chiffres.',
      'Tracé à courbes de Bézier (pas des arcs de cercle) : à recopier fidèlement dans Illustrator, d’où le SVG fourni.',
    ],
  },
  {
    id: 'encoche',
    nom: 'Encoche solaire',
    intention: 'Un rectangle aux coins doux dont le coin bas droit est mordu par un quart de cercle concave, où se loge un quart de soleil jaune.',
    echo: 'Le soleil levé derrière la parcelle : même langage que le soleil et l’anneau de l’emblème, avec un vrai point d’ancrage pour un badge ou un bouton.',
    forces: ['La plus identitaire : se reconnaît sans logo.', 'Garde presque toute la photo (94 %).', 'Le creux accueille un repère : jour, durée, catégorie.'],
    limites: [
      'L’encoche ne doit rien recevoir de critique : visages, texte et boutons restent hors du coin (en vignette, la plage de titre est réduite à gauche).',
      'Le soleil logé ajoute une couleur : à réserver aux visuels forts, un par écran.',
      'En pastille, la morsure rétrécit le cercle inscrit (92 % du côté) et déséquilibre un chiffre à deux caractères.',
    ],
    soleil: true,
  },
  {
    id: 'galet',
    nom: 'Galet',
    intention: 'Quatre coins elliptiques de rayons inégaux : un galet, une graine posée. Ni arête, ni axe de symétrie.',
    echo: 'L’organique le plus sobre : proche de la goutte et du pétale mais sans angle, comme les formes pleines de l’emblème.',
    forces: ['Aucun angle vif : très douce, même à grande taille.', 'Chaque photo reçoit une enveloppe un peu différente sans effort.'],
    limites: [
      'Rogne environ 22 % de la photo : coins arrondis larges.',
      'Peu de caractère : sans le contexte vert, elle ressemble à un « blob » générique.',
      'Aucune arête pour aligner une légende ou un badge.',
    ],
  },
]

const ORDRE = FICHES.map((f) => f.id)

function pct(n: number) {
  return `${n.toFixed(0).replace('.', ',')} %`
}

/** Bandeau de fiche (comme DetailHero) : titre à gauche, fenêtre à droite, filigrane de la forme. */
function BandeauFiche({ fiche }: { fiche: Fiche }) {
  const P = FORMES_ALTERNATIVES[fiche.id].paysage
  return (
    <div className="relative overflow-hidden rounded-card bg-surface-brand text-on-surface-brand">
      <Motif size={800} opacity={0.05} className="text-on-surface-brand" />
      <svg viewBox={`0 0 ${P.w} ${P.h}`} aria-hidden="true" className="pointer-events-none absolute -bottom-10 left-1/3 hidden h-72 w-auto fill-on-surface-brand/[0.06] md:block">
        <path d={P.d} />
      </svg>
      <div className="relative grid items-end gap-6 px-6 pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] md:gap-10 md:px-10 md:pt-10">
        <div className="pb-2 md:pb-10">
          <p className="mb-3 text-label-md uppercase tracking-[0.12em] text-accent-sun">Formation</p>
          <p className="text-headline-md text-balance">Cultures maraîchères sous serre : de la plantation à la vente</p>
          <p className="mt-4 text-body-md text-on-surface-brand/80">Simulation de l’en-tête de fiche : la fenêtre se pose sur le bord bas du bandeau, comme l’arche aujourd’hui.</p>
        </div>
        <div className="mx-auto w-full max-w-[420px] pb-6 md:pb-0 md:translate-y-[18%]">
          <FenetreForme forme={fiche.id} format="paysage" photo={PHOTOS.paysage} soleil={fiche.soleil} />
        </div>
      </div>
    </div>
  )
}

/** Un panneau clair ou sombre : fenêtres, pastilles, grande vignette. */
function Panneau({ fiche, theme }: { fiche: Fiche; theme: 'light' | 'dark' }) {
  return (
    <div data-theme={theme} className="rounded-panel border border-outline-variant bg-surface p-5 text-on-surface">
      <p className="mb-4 text-label-md uppercase tracking-[0.12em] text-on-surface-muted">{theme === 'light' ? 'Thème clair' : 'Thème sombre'}</p>

      <p className="mb-2 text-label-lg text-on-surface-variant">Fenêtres d’image</p>
      <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-end gap-4">
        <FenetreForme forme={fiche.id} format="portrait" photo={PHOTOS.portrait} soleil={fiche.soleil} />
        <FenetreForme forme={fiche.id} format="paysage" photo={PHOTOS.paysage} soleil={fiche.soleil} />
      </div>

      <p className="mb-2 mt-6 text-label-lg text-on-surface-variant">Pastilles de chiffre : 40, 56 et 80 px, deux tons</p>
      <div className="flex flex-wrap items-end gap-4">
        <PastilleForme forme={fiche.id} className="w-10">8</PastilleForme>
        <PastilleForme forme={fiche.id} className="w-14">24</PastilleForme>
        <PastilleForme forme={fiche.id} className="w-20">3</PastilleForme>
        <PastilleForme forme={fiche.id} ton="marque" className="w-10">8</PastilleForme>
        <PastilleForme forme={fiche.id} ton="marque" className="w-14">24</PastilleForme>
        <PastilleForme forme={fiche.id} ton="marque" className="w-20">3</PastilleForme>
      </div>

      <p className="mb-2 mt-6 text-label-lg text-on-surface-variant">Grande vignette (carte d’article ou de formation)</p>
      <VignetteForme forme={fiche.id} photo={PHOTOS.vignette} etiquette="Agrobusiness" titre="Transformer localement : 7 opportunités autour du manioc" />
    </div>
  )
}

function Mesure({ fiche }: { fiche: Fiche }) {
  const M = FORMES_ALTERNATIVES[fiche.id]
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-body-sm sm:grid-cols-4">
      <div><dt className="text-on-surface-muted">Photo conservée, portrait</dt><dd className="font-semibold">{pct(M.portrait.conserve)}</dd></div>
      <div><dt className="text-on-surface-muted">Photo conservée, paysage</dt><dd className="font-semibold">{pct(M.paysage.conserve)}</dd></div>
      <div><dt className="text-on-surface-muted">Cercle du chiffre (pastille)</dt><dd className="font-semibold">{pct(M.pastille.diametre)} du côté</dd></div>
      <div><dt className="text-on-surface-muted">Plage de titre (vignette)</dt><dd className="font-semibold">{M.vignette.texte ? pct(M.vignette.texte[1] - M.vignette.texte[0]) : 'n. d.'} de la largeur</dd></div>
    </dl>
  )
}

function Section({ fiche, rang }: { fiche: Fiche; rang: number }) {
  return (
    <section id={fiche.id} className="scroll-mt-24 py-0">
      <div className="mb-5 flex items-baseline gap-4">
        <span className="text-display-md text-primary">{rang}</span>
        <h2 className="text-headline-md">{fiche.nom}</h2>
      </div>
      <div className="mb-5 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-body-lg">{fiche.intention}</p>
          <p className="mt-3 text-body-md text-on-surface-variant"><strong className="text-on-surface">Lien avec l’emblème :</strong> {fiche.echo}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-label-lg text-success">Ce qu’elle fait bien</p>
            <ul className="list-disc space-y-1 pl-5 text-body-sm text-on-surface-variant">{fiche.forces.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div>
            <p className="mb-1 text-label-lg text-warning">Ses limites</p>
            <ul className="list-disc space-y-1 pl-5 text-body-sm text-on-surface-variant">{fiche.limites.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
      </div>
      <div className="mb-5 rounded-card border border-outline-variant bg-surface-container-lowest p-4"><Mesure fiche={fiche} /></div>
      <div className="mb-5"><BandeauFiche fiche={fiche} /></div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panneau fiche={fiche} theme="light" />
        <Panneau fiche={fiche} theme="dark" />
      </div>
      <p className="mt-3 text-label-sm text-on-surface-muted">
        SVG pour Illustrator et Photoshop :{' '}
        {(['portrait', 'paysage', 'pastille', 'vignette'] as const).map((f, i) => (
          <React.Fragment key={f}>
            {i > 0 && ', '}
            <a className="underline" href={`/design-assets/formes-alternatives/${fiche.id}-${f}.svg`}>{f}</a>
          </React.Fragment>
        ))}
        .
      </p>
    </section>
  )
}

/** Référence : l'arche actuelle, avec les vrais composants du site. */
function Reference() {
  return (
    <section id="arche-actuelle" className="scroll-mt-24 py-0">
      <h2 className="mb-2 text-headline-md">Pour mémoire : l’arche actuelle</h2>
      <p className="mb-5 max-w-3xl text-body-md text-on-surface-variant">
        Le dôme de l’emblème (silhouette au-dessus de la première ligne blanche) et son ciel pour la fenêtre. Rendus avec les composants réels du site. Elle ne se décline qu’en un format très large (environ 1,7 pour 1) : en portrait, la photo reste paysage dans une fenêtre qui ne s’y prête pas.
      </p>
      <div className="grid gap-5 xl:grid-cols-2">
        {(['light', 'dark'] as const).map((theme) => (
          <div key={theme} data-theme={theme} className="rounded-panel border border-outline-variant bg-surface p-5 text-on-surface">
            <p className="mb-4 text-label-md uppercase tracking-[0.12em] text-on-surface-muted">{theme === 'light' ? 'Thème clair' : 'Thème sombre'}</p>
            <p className="mb-2 text-label-lg text-on-surface-variant">Fenêtre d’image (ArchPhoto), avec la même photo</p>
            <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-end gap-4">
              <ArchPhoto src={PHOTOS.portrait.src} alt={PHOTOS.portrait.alt} cadrage={PHOTOS.portrait.cadrage} className="text-primary" />
              <ArchPhoto src={PHOTOS.paysage.src} alt={PHOTOS.paysage.alt} className="text-primary" />
            </div>
            <p className="mb-2 mt-6 text-label-lg text-on-surface-variant">Pastilles de chiffre (ArcheBadge)</p>
            <div className="flex flex-wrap items-end gap-4">
              <ArcheBadge className="w-10">8</ArcheBadge>
              <ArcheBadge className="w-14">24</ArcheBadge>
              <ArcheBadge className="w-20">3</ArcheBadge>
              <ArcheBadge ton="marque" className="w-10">8</ArcheBadge>
              <ArcheBadge ton="marque" className="w-14">24</ArcheBadge>
              <ArcheBadge ton="marque" className="w-20">3</ArcheBadge>
            </div>
            <p className="mb-2 mt-6 text-label-lg text-on-surface-variant">Filigrane (Arche pleine à 7 % d’opacité)</p>
            <Arche variant="plein" className="w-48 text-primary/[0.07]" />
          </div>
        ))}
      </div>
    </section>
  )
}

const USAGES: [string, string, string][] = [
  ['Fenêtre d’image', 'ArchPhoto : en-tête des fiches (DetailHero : formation, événement), Qui sommes-nous (histoire), Nos actions (une photo par pilier).', 'Photo paysage, une seule par écran, posée sur le bord bas d’un bandeau vert.'],
  ['Pastille de chiffre', 'ArcheBadge : jour dans EventCard et dans le widget d’événements du tableau de bord (40 et 56 px), numéro d’étape dans StepList (80 px).', 'Un ou deux chiffres, lisibles à 40 px, en deux tons (soleil, marque).'],
  ['Filigrane', 'Arche pleine à 7 à 10 % d’opacité : en-tête de fiche sans visuel, fond des pages de connexion et d’inscription.', 'Grande taille, décor sans texte, doit s’effacer.'],
  ['Pièce de l’emblème', 'Le dôme est aussi une pièce de l’emblème éclaté (EmblemEclate) et de ses SVG : c’est une partie du logo.', 'Hors périmètre : le logo ne change pas.'],
  ['État vide', 'La propriété `arche` des états vides est un reste de nom : ils affichent déjà un soleil pâle (PlanSoleil), pas l’arche.', 'Aucun changement attendu.'],
]

export default function PageFormes() {
  return (
    <main className="container space-y-16 py-12">
      <header className="max-w-3xl">
        <p className="mb-2 text-label-md uppercase tracking-[0.12em] text-on-surface-muted">Design system · page interne</p>
        <h1 className="text-display-md">Formes alternatives à l’arche</h1>
        <p className="mt-4 text-body-lg text-on-surface-variant">
          Six propositions pour remplacer l’arche, rendues sur les usages réels du site, en thème clair et en thème sombre, avec les vraies photos et les jetons du design system.
          <strong className="text-on-surface"> Rien n’est remplacé sur le site</strong> : cette page sert à choisir. Les tracés sont générés par un script (<code>scripts/forme/formes_alternatives.py</code>) et les SVG sont téléchargeables en bas de chaque proposition.
        </p>
        <p className="mt-4 rounded-card border border-primary bg-primary-container p-4 text-body-md text-on-primary-container">
          <strong>Décision du 14/11/2026 : l’encoche solaire est retenue</strong> (chiffres, fenêtres de photo et filigranes, pointes légèrement arrondies, fenêtre qui déborde du bandeau des fiches, filigrane à 7 %). Elle est migrée sur le site ; cette page garde le comparatif pour mémoire.
        </p>
        <nav aria-label="Propositions" className="mt-6 flex flex-wrap gap-2">
          <a href="#usages" className="rounded-tag border border-outline-variant px-3 py-2 text-label-lg">Usages actuels</a>
          <a href="#arche-actuelle" className="rounded-tag border border-outline-variant px-3 py-2 text-label-lg">Arche actuelle</a>
          {FICHES.map((f) => (
            <a key={f.id} href={`#${f.id}`} className="rounded-tag border border-outline-variant px-3 py-2 text-label-lg">{f.nom}</a>
          ))}
          <a href="#recommandation" className="rounded-tag bg-primary px-3 py-2 text-label-lg text-on-primary">Recommandation</a>
        </nav>
      </header>

      <section id="usages" className="scroll-mt-24 py-0">
        <h2 className="mb-4 text-headline-md">Ce que la forme doit couvrir</h2>
        <div className="overflow-x-auto rounded-card border border-outline-variant">
          <table className="w-full min-w-[640px] text-left text-body-sm">
            <thead className="bg-surface-container-low text-label-lg"><tr><th className="p-3">Besoin</th><th className="p-3">Où, aujourd’hui</th><th className="p-3">Contrainte</th></tr></thead>
            <tbody>
              {USAGES.map(([a, b, c]) => (
                <tr key={a} className="border-t border-outline-variant align-top"><td className="p-3 font-semibold">{a}</td><td className="p-3 text-on-surface-variant">{b}</td><td className="p-3 text-on-surface-variant">{c}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Reference />

      {FICHES.map((f, i) => (
        <Section key={f.id} fiche={f} rang={i + 1} />
      ))}

      <section id="recommandation" className="scroll-mt-24 py-0">
        <h2 className="mb-4 text-headline-md">Comparatif et recommandation</h2>
        <div className="mb-6 overflow-x-auto rounded-card border border-outline-variant">
          <table className="w-full min-w-[720px] text-left text-body-sm">
            <thead className="bg-surface-container-low text-label-lg">
              <tr><th className="p-3">Forme</th><th className="p-3">Photo portrait</th><th className="p-3">Photo paysage</th><th className="p-3">Chiffre</th><th className="p-3">Vignette</th><th className="p-3">Identité</th></tr>
            </thead>
            <tbody>
              {ORDRE.map((id) => {
                const f = FICHES.find((x) => x.id === id)!
                const M = FORMES_ALTERNATIVES[id]
                const note: Record<FormeId, [string, string, string, string, string]> = {
                  petale: ['Très bien', 'Très bien', 'Excellent', 'Bien', 'Forte (feuille)'],
                  goutte: ['Bien', 'Moyen (pilule)', 'Excellent', 'Bien', 'Moyenne'],
                  alveole: ['Moyen (rogne)', 'Moyen (rogne)', 'Bien', 'Moyen', 'Forte mais banale'],
                  colline: ['Faible (crête)', 'Très bien', 'Faible (maison)', 'Excellent', 'Forte (horizon)'],
                  encoche: ['Bien', 'Excellent', 'Moyen', 'Bien', 'Très forte (soleil)'],
                  galet: ['Bien', 'Bien', 'Bien', 'Bien', 'Faible'],
                }
                return (
                  <tr key={id} className="border-t border-outline-variant align-top">
                    <td className="p-3 font-semibold"><a href={`#${id}`} className="underline">{f.nom}</a></td>
                    <td className="p-3">{note[id][0]} <span className="text-on-surface-muted">({pct(M.portrait.conserve)})</span></td>
                    <td className="p-3">{note[id][1]} <span className="text-on-surface-muted">({pct(M.paysage.conserve)})</span></td>
                    <td className="p-3">{note[id][2]} <span className="text-on-surface-muted">({pct(M.pastille.diametre)})</span></td>
                    <td className="p-3">{note[id][3]}</td>
                    <td className="p-3">{note[id][4]}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mb-6 text-label-sm text-on-surface-muted">Pourcentages mesurés par le script : part de la photo conservée (fenêtres) et diamètre du plus grand cercle inscrit en % du côté (chiffre). Les mentions qualitatives sont un jugement visuel à confirmer par le propriétaire.</p>

        <div className="max-w-3xl space-y-4 text-body-md">
          <h3 className="text-title-lg">Recommandation : le Pétale</h3>
          <p>Il couvre les quatre besoins avec une seule géométrie : fenêtre portrait et paysage (plus de 92 % de la photo), pastille de chiffre parfaitement centrée, grande vignette et filigrane. C’est aussi la forme la plus cohérente avec la marque : l’emblème contient déjà une feuille, et le pétale en est la version cadre, sans retrouver l’arche (ni la silhouette pleine retirée le 12/11/2026).</p>
          <p>Deuxième choix si l’on veut une signature plus forte sur les visuels de grand format : l’Encoche solaire, réservée à la fenêtre des fiches (une par écran), avec le Pétale pour les pastilles et vignettes. La Colline est la meilleure vignette mais la plus risquée en portrait.</p>
          <h3 className="pt-2 text-title-lg">Questions pour le propriétaire</h3>
          <ol className="list-decimal space-y-2 pl-5 text-on-surface-variant">
            <li>Quelle forme retenez-vous, ou quelle combinaison (par exemple Pétale partout, ou Pétale plus Encoche pour la fenêtre des fiches) ?</li>
            <li>Les chiffres (jour d’événement, numéro d’étape) restent-ils dans la forme retenue, ou préférez-vous un simple disque ? La décision du 12/11/2026 réservait l’arche aux chiffres.</li>
            <li>Dans l’en-tête des fiches, la fenêtre doit-elle toujours reposer sur le bord bas du bandeau (alors le Pétale déborde ou flotte avec une marge), ou peut-elle flotter ?</li>
            <li>Que devient le filigrane (fiches sans visuel, connexion) : la forme retenue à 7 % d’opacité, ou le soleil pâle déjà utilisé ailleurs ?</li>
            <li>Le dôme de l’emblème (logo et emblème éclaté) reste inchangé : confirmez-vous ?</li>
          </ol>
          <p className="text-body-sm text-on-surface-muted">Étape suivante, après votre choix : migrer ArchPhoto, ArcheBadge, le filigrane de DetailHero et d’AuthCard, mettre à jour /design-system#grammaire et le script de génération ; l’arche actuelle n’est supprimée qu’à ce moment-là.</p>
        </div>
      </section>
    </main>
  )
}
