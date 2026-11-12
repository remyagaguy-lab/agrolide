import type { Metadata } from 'next'
import {
  Alert, Avatar, AvatarGroup, Badge, Button, Card, CardDescription, CardTitle, Logo, Skeleton, Table, TableBody,
  TableCaption, TableCell, TableHead, TableHeader, TableRow, ToastProvider,
} from '@/components/ui'
import { brand, darkColors, lightColors, refPalette, type ColorRole } from '@/styles/tokens'
import { Arche, ArchPhoto, Emblem, EmblemEclate, HorizonDivider, Motif } from '@/components/brand'
import { Interactive } from './Interactive'
import { Grammaire } from './Grammaire'

export const metadata: Metadata = {
  title: 'Design system',
  description: 'Jetons et composants du design system agrolide (page interne).',
  robots: { index: false, follow: false, nocache: true },
}

// ─── Contrastes calculés côté serveur à partir des mêmes valeurs que les jetons ───
function lum(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
function ratio(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
function grade(r: number) {
  return r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA grand texte' : 'échec'
}

type Pair = [ColorRole, ColorRole | null, string]
const surfacePairs: Pair[] = [
  ['primary', 'on-primary', 'Action principale'],
  ['primary-container', 'on-primary-container', 'Conteneur de marque'],
  ['secondary', 'on-secondary', 'Olive'],
  ['secondary-container', 'on-secondary-container', 'Conteneur olive'],
  ['tertiary', 'on-tertiary', 'Appel à l’action'],
  ['tertiary-container', 'on-tertiary-container', 'Conteneur orange'],
  ['error', 'on-error', 'Erreur'],
  ['error-container', 'on-error-container', 'Conteneur erreur'],
  ['success', 'on-success', 'Succès'],
  ['success-container', 'on-success-container', 'Conteneur succès'],
  ['warning', 'on-warning', 'Alerte'],
  ['warning-container', 'on-warning-container', 'Conteneur alerte'],
  ['info', 'on-info', 'Information'],
  ['info-container', 'on-info-container', 'Conteneur info'],
  ['surface', 'on-surface', 'Fond de page'],
  ['surface-container-lowest', 'on-surface', 'Cartes (niveau 0)'],
  ['surface-container-low', 'on-surface-variant', 'Niveau 1'],
  ['surface-container', 'on-surface-variant', 'Niveau 2'],
  ['surface-container-high', 'on-surface-variant', 'Niveau 3'],
  ['surface-container-highest', 'on-surface-variant', 'Niveau 4'],
  ['surface-brand', 'on-surface-brand', 'Bandeaux vert profond'],
  ['inverse-surface', 'inverse-on-surface', 'Toasts'],
]
const accentRoles: ColorRole[] = ['accent-leaf', 'accent-sun', 'accent-olive']

function Swatches({ colors }: { colors: Record<string, string> }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {surfacePairs.map(([bg, fg, usage]) => {
        const r = ratio(colors[bg], colors[fg as string])
        return (
          <div key={bg} className="overflow-hidden rounded-card border border-outline-variant">
            <div className="flex h-20 items-end justify-between p-3" style={{ background: `var(--ag-sys-color-${bg})`, color: `var(--ag-sys-color-${fg})` }}>
              <span className="text-title-sm">{usage}</span>
              <span className="text-label-sm">Aa</span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 text-label-sm text-on-surface-variant">
              <span className="block text-on-surface">{bg}</span>
              <span>{colors[bg]} / {fg} {colors[fg as string]}</span>
              <span className="block font-bold">{r.toFixed(1)}:1 · {grade(r)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-outline-variant py-12">
      <h2 className="text-headline-md text-on-surface">{title}</h2>
      {intro && <p className="mt-2 max-w-3xl text-body-lg text-on-surface-variant">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  )
}

const typeScale: Array<[string, string, string]> = [
  ['display-lg', 'text-display-lg', 'Nourrir l’Afrique'],
  ['display-md', 'text-display-md', 'Le réseau agricole'],
  ['headline-lg', 'text-headline-lg', 'Titre de page (h1)'],
  ['headline-md', 'text-headline-md', 'Titre de section (h2)'],
  ['headline-sm', 'text-headline-sm', 'Sous-section (h3)'],
  ['title-lg', 'text-title-lg', 'Titre de carte ou de modale'],
  ['title-md', 'text-title-md', 'Titre de liste'],
  ['title-sm', 'text-title-sm', 'Petit titre'],
  ['body-lg', 'text-body-lg', 'Paragraphe d’introduction, lisible et aéré pour les premiers contacts.'],
  ['body-md', 'text-body-md', 'Texte courant : 16 px minimum, interligne confortable, 70 caractères par ligne au plus.'],
  ['body-sm', 'text-body-sm', 'Métadonnées, aides, mentions légales : 14 px, jamais en dessous.'],
  ['label-lg', 'text-label-lg', 'Libellé de bouton ou de champ'],
  ['label-md', 'text-label-md', 'Libellé compact'],
  ['label-sm', 'text-label-sm', 'ÉTIQUETTE, BADGE (12 px)'],
]

export default function DesignSystemPage() {
  return (
    <ToastProvider>
      <div className="bg-surface text-on-surface">
        <header className="bg-surface-brand text-on-surface-brand">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
            <Logo tone="on-dark" size="lg" priority />
            <h1 className="mt-6 text-headline-lg">Design system agrolide</h1>
            <p className="mt-2 max-w-2xl text-body-lg opacity-90">
              Jetons, composants et règles d’usage. Page interne : non indexée, absente du plan du site. Version 1 : 11/11/2026.
            </p>
            <nav aria-label="Sections" className="mt-6 flex flex-wrap gap-2">
              {[['couleurs', 'Couleurs'], ['typographie', 'Typographie'], ['formes', 'Formes et mouvement'], ['composants', 'Composants'], ['donnees', 'Données'], ['identite', 'Identité'], ['grammaire', 'Grammaire des formes'], ['logo', 'Logo'], ['regles', 'Règles']].map(([id, label]) => (
                <a key={id} href={`#${id}`} className="ag-state inline-flex min-h-11 items-center rounded-full border border-on-surface-brand/30 px-4 text-label-md">{label}</a>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-8">
          <Section id="couleurs" title="Couleurs" intro="Trois niveaux : référence (valeurs de marque), système (rôles clair/sombre), composant. Les composants ne consomment que les rôles. Contrastes calculés ici à partir des mêmes valeurs que le code.">
            <h3 className="mb-3 text-title-md">Palette de marque (épinglée sur le logo)</h3>
            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {([['Vert profond', brand.vertProfond, lightColors['on-primary']], ['Vert conteneur', brand.vertConteneur, lightColors['on-primary-container']], ['Vert feuille', brand.vertFeuille, brand.encre], ['Olive', brand.olive, brand.encre], ['Orange', brand.orange, brand.encre], ['Orange conteneur', brand.orangeConteneur, lightColors['on-tertiary-container']], ['Soleil', brand.soleil, brand.encre]] as const).map(([name, bg, fg]) => (
                <div key={name} className="rounded-card p-3" style={{ background: bg, color: fg }}>
                  <p className="h-14 text-title-sm">{name}</p>
                  <p className="text-label-sm">{bg}</p>
                </div>
              ))}
            </div>

            <h3 className="mb-3 text-title-md">Rôles : thème clair</h3>
            <Swatches colors={lightColors} />

            <h3 className="mb-3 mt-12 text-title-md">Rôles : thème sombre (aperçu isolé)</h3>
            <div data-theme="dark" className="rounded-panel bg-surface p-5 text-on-surface">
              <Swatches colors={darkColors} />
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button variant="primary">Rejoindre</Button>
                <Button variant="secondary">Enregistrer</Button>
                <Button variant="outline">Annuler</Button>
                <Badge variant="actif">Actif</Badge>
                <Alert variant="warning" title="Attention" className="max-w-sm">Cotisation bientôt expirée.</Alert>
              </div>
            </div>
            <p className="mt-3 text-body-sm text-on-surface-muted">Le mode sombre est actif sur tout le site : bascule Clair / Sombre / Système dans l’en-tête public et le menu du compte (voir src/lib/theme.ts).</p>

            <h3 className="mb-3 mt-12 text-title-md">Accents graphiques (jamais du texte sur fond clair)</h3>
            <div className="flex flex-wrap gap-3">
              {accentRoles.map((r) => (
                <div key={r} className="rounded-card p-4 text-label-md" style={{ background: `var(--ag-sys-color-${r})`, color: 'var(--ag-sys-color-on-accent)' }}>{r}<br />{lightColors[r]}</div>
              ))}
            </div>

            <h3 className="mb-3 mt-12 text-title-md">Niveau référence : tons des palettes</h3>
            <div className="space-y-2">
              {Object.entries(refPalette).map(([name, tones]) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="w-28 shrink-0 text-label-md text-on-surface-variant">{name}</span>
                  <div className="flex flex-1 overflow-hidden rounded-control">
                    {Object.entries(tones).map(([tone, hex]) => (
                      <span key={tone} title={`${name}-${tone} ${hex}`} className="h-9 flex-1" style={{ background: hex as string }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="typographie" title="Typographie" intro="Urbanist pour toute l’interface et les titres. Libre Baskerville uniquement pour les articles de blog, les citations de témoignages et les extraits de la bibliothèque.">
            <div className="divide-y divide-outline-variant rounded-card border border-outline-variant bg-surface-container-lowest">
              {typeScale.map(([name, cls, sample]) => (
                <div key={name} className="grid gap-1 p-4 md:grid-cols-[9rem_1fr] md:items-baseline md:gap-6">
                  <code className="text-label-md text-on-surface-muted">{cls}</code>
                  <p className={`${cls} text-on-surface`}>{sample}</p>
                </div>
              ))}
              <div className="grid gap-1 p-4 md:grid-cols-[9rem_1fr] md:items-baseline md:gap-6">
                <code className="text-label-md text-on-surface-muted">font-serif</code>
                <blockquote className="font-serif text-title-lg italic text-on-surface">« Depuis que je suis membre, j’ai trouvé deux partenaires pour ma coopérative. »</blockquote>
              </div>
            </div>
          </Section>

          <Section id="formes" title="Formes, élévation, mouvement, espacement" intro="Plus un élément est important ou flottant, plus il est arrondi. L’élévation est d’abord tonale : on change de niveau de surface avant d’ajouter une ombre.">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-title-md">Formes</h3>
                <div className="flex flex-wrap gap-4">
                  {[['tag', 'rounded-tag', '4 px'], ['control', 'rounded-control', '8 px'], ['card', 'rounded-card', '12 px'], ['panel', 'rounded-panel', '16 px'], ['sheet', 'rounded-sheet', '28 px'], ['full', 'rounded-full', 'rond']].map(([n, c, v]) => (
                    <div key={n} className="text-center">
                      <div className={`size-20 border-2 border-primary bg-primary-container ${c}`} />
                      <p className="mt-1 text-label-md">{n}</p>
                      <p className="text-label-sm text-on-surface-muted">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-title-md">Élévation</h3>
                <div className="flex flex-wrap gap-4 rounded-card bg-surface-container p-5">
                  {['', 'shadow-elev-1', 'shadow-elev-2', 'shadow-elev-3', 'shadow-elev-4'].map((s, i) => (
                    <div key={i} className={`flex size-20 items-center justify-center rounded-card bg-surface-container-lowest text-label-md ${s}`}>niv. {i}</div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-title-md">Mouvement</h3>
                <ul className="space-y-1 text-body-md text-on-surface-variant">
                  <li><strong className="text-on-surface">Courbes :</strong> standard (0,2 · 0 · 0 · 1), décélération (entrée), accélération (sortie).</li>
                  <li><strong className="text-on-surface">Durées :</strong> 150 ms (état), 250 ms (apparition), 400 ms (grande transition).</li>
                  <li><strong className="text-on-surface">Réduit :</strong> tout est neutralisé si l’utilisateur le demande (prefers-reduced-motion).</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-title-md">Espacement (base 4 px)</h3>
                <div className="space-y-1.5">
                  {[1, 2, 3, 4, 6, 8, 12, 16].map((n) => (
                    <div key={n} className="flex items-center gap-3">
                      <span className="w-20 text-label-md text-on-surface-muted">{n} · {n * 4} px</span>
                      <span className="h-3 rounded-tag bg-primary" style={{ width: n * 4 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section id="composants" title="Composants" intro="Tous accessibles au clavier, avec focus visible, états survol/appui/désactivé/chargement/erreur.">
            <Interactive />
          </Section>

          <Section id="donnees" title="Données : tableau, avatars, chargement">
            <Table>
              <TableCaption>Derniers membres inscrits</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Membre</TableHead><TableHead>Pays</TableHead><TableHead>Catégorie</TableHead><TableHead className="text-right">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[['Aminata Diallo', 'Sénégal', 'professionnel', 'actif'], ['Kossi Mensah', 'Bénin', 'junior', 'nouveau'], ['Coopérative Teranga', 'Sénégal', 'partenaire', 'expire']].map(([n, p, c, s]) => (
                  <TableRow key={n}>
                    <TableCell><span className="flex items-center gap-3"><Avatar name={n} size="sm" />{n}</span></TableCell>
                    <TableCell>{p}</TableCell>
                    <TableCell><Badge variant={c as 'junior'}>{c}</Badge></TableCell>
                    <TableCell className="text-right"><Badge variant={s as 'actif'}>{s}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Avatar name="Aminata Diallo" size="sm" /><Avatar name="Kossi Mensah" /><Avatar name="Fatou Ndiaye" size="lg" /><Avatar name="Yao Koffi" size="xl" />
              <AvatarGroup avatars={[{ name: 'Aminata Diallo' }, { name: 'Kossi Mensah' }, { name: 'Fatou Ndiaye' }, { name: 'Yao Koffi' }, { name: 'Ibrahim Traoré' }, { name: 'Awa Sow' }]} />
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2" aria-hidden="true">
              <Card><Skeleton className="mb-3 h-5 w-1/2" /><Skeleton className="mb-2 h-4 w-full" /><Skeleton className="h-4 w-3/4" /></Card>
              <Card variant="filled"><CardTitle>Squelette</CardTitle><CardDescription>Placeholder de chargement, immobile si le mouvement est réduit.</CardDescription></Card>
            </div>
          </Section>

          <Section id="identite" title="Identité visuelle : emblème, arche, fenêtre, éclaté, horizon, motif" intro="Toutes les formes viennent de l’emblème du favicon, reconstruites avec ses cercles mesurés. Elles se règlent par couleur de texte, restent décoratives et se limitent à quelques usages par page.">
            <h3 className="mb-3 text-title-md">L’emblème : couleur, noir, blanc, contour</h3>
            <p className="mb-4 max-w-3xl text-body-md text-on-surface-variant">
              Un seul dessin. En une couleur, le soleil est détaché des collines par un filet blanc d’un demi-trait : sans lui, le dessin se refermerait en
              silhouette pleine (forme abandonnée). Le contour suit ce même dessin, avec un trait constant à l’écran.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="flex flex-col items-center gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-6"><Emblem variant="couleur" title="Emblème agrolide" className="w-32" /><code className="text-label-sm text-on-surface-muted">variant=&quot;couleur&quot;</code></div>
              <div className="flex flex-col items-center gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-6"><Emblem variant="noir" className="w-32" /><code className="text-label-sm text-on-surface-muted">variant=&quot;noir&quot;</code></div>
              <div className="flex flex-col items-center gap-3 rounded-card bg-surface-brand p-6"><Emblem variant="blanc" className="w-32" /><code className="text-label-sm text-on-surface-brand">variant=&quot;blanc&quot;</code></div>
              <div className="flex flex-col items-center gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-6"><Emblem variant="creux" className="w-32 text-on-surface" /><code className="text-label-sm text-on-surface-muted">variant=&quot;creux&quot;</code></div>
            </div>

            <h3 className="mb-3 mt-10 text-title-md">Tailles et fonds (16 → 96 px)</h3>
            <p className="mb-4 max-w-3xl text-body-md text-on-surface-variant">
              Sur vert profond, la version couleur n’est pas adaptée (le trait vert s’y confond) : utiliser le blanc. Le contour est réservé aux tailles de 48 px et plus.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-card border border-outline-variant bg-surface p-5">
                <p className="mb-3 text-label-md text-on-surface-muted">Fond clair</p>
                <div className="flex items-end gap-5">{[16, 24, 32, 48, 96].map((n) => (<Emblem key={n} variant="couleur" style={{ width: n }} />))}</div>
                <div className="mt-4 flex items-end gap-5">{[16, 24, 32, 48, 96].map((n) => (<Emblem key={n} variant="noir" style={{ width: n }} />))}</div>
                <div className="mt-4 flex items-end gap-5 text-primary">{[16, 24, 32, 48, 96].map((n) => (<Arche key={n} variant="plein" style={{ width: n }} />))}</div>
              </div>
              <div className="rounded-card bg-surface-brand p-5 text-on-surface-brand">
                <p className="mb-3 text-label-md">Vert profond</p>
                <div className="flex items-end gap-5">{[16, 24, 32, 48, 96].map((n) => (<Emblem key={n} variant="blanc" style={{ width: n }} />))}</div>
                <div className="mt-4 flex items-end gap-5">{[48, 64, 96].map((n) => (<Emblem key={n} variant="creux" style={{ width: n }} />))}</div>
                <div className="mt-4 flex items-end gap-5">{[16, 24, 32, 48, 96].map((n) => (<Arche key={n} variant="creux" style={{ width: n }} />))}</div>
              </div>
              <div data-theme="dark" className="rounded-card border border-outline-variant bg-surface p-5 text-on-surface">
                <p className="mb-3 text-label-md text-on-surface-variant">Fond sombre</p>
                <div className="flex items-end gap-5">{[16, 24, 32, 48, 96].map((n) => (<Emblem key={n} variant="couleur" style={{ width: n }} />))}</div>
                <div className="mt-4 flex items-end gap-5">{[16, 24, 32, 48, 96].map((n) => (<Emblem key={n} variant="blanc" style={{ width: n }} />))}</div>
                <div className="mt-4 flex items-end gap-5 text-primary">{[16, 24, 32, 48, 96].map((n) => (<Arche key={n} variant="plein" style={{ width: n }} />))}</div>
              </div>
            </div>

            <h3 className="mb-3 mt-10 text-title-md">L’arche (le dôme), la fenêtre et l’emblème éclaté</h3>
            <p className="mb-4 max-w-3xl text-body-md text-on-surface-variant">
              L’<strong>arche</strong> est le dôme de l’emblème : sa silhouette au-dessus de la première ligne blanche. La <strong>fenêtre</strong> est son ciel.
              L’<strong>éclaté</strong> pose sous le dôme les trois pièces du bas (la colline, le grand sillon, la feuille), détachées de l’anneau : chaque pièce
              est son aplat intérieur entouré d’un demi-trait, et toutes s’inscrivent dans le même cercle que l’emblème (le cercle extérieur de l’anneau) :
              les aplats que bordait l’anneau s’arrêtent sur son axe, les deux bouts du grand sillon sont tangents au cercle. Il est réservé aux grands formats (404, en-tête).
            </p>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex flex-col items-center justify-end gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-6"><Arche variant="plein" className="w-40 text-primary" /><code className="text-label-sm text-on-surface-muted">Arche variant=&quot;plein&quot;</code></div>
              <div className="flex flex-col items-center justify-end gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-6"><Arche variant="creux" className="w-40 text-primary" /><code className="text-label-sm text-on-surface-muted">Arche variant=&quot;creux&quot;</code></div>
              <div className="flex flex-col items-center justify-end gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-6"><ArchPhoto src="/hero-background.webp" alt="Une agricultrice dans une serre" className="w-44" /><code className="text-label-sm text-on-surface-muted">ArchPhoto (fenêtre)</code></div>
              <div className="flex flex-col items-center justify-end gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-6"><EmblemEclate className="w-40 text-primary" /><code className="text-label-sm text-on-surface-muted">EmblemEclate</code></div>
            </div>

            <h3 className="mb-3 mt-10 text-title-md">Motif de marque (Motif) : tuile vectorielle</h3>
            <p className="mb-4 max-w-3xl text-body-md text-on-surface-variant">
              Plantes (et, en variante complète, collines en sillons) tracées depuis le motif d’origine (<code>scripts/forme/vectorize_motif.py</code>) : une seule tuile de 204 × 417,5 raccordable à l’infini, 22 Ko pour les plantes seules (avec leurs tirets en arc), 27 Ko avec les grosses collines (au lieu d’une image de 90 Ko), nette sur tout écran, aux couleurs du texte (clair, sombre). Le ton sur ton garde trois niveaux : collines, feuilles, contour. La planche d’origine dérivait dans ses dernières rangées ; la tuile est régulière.
            </p>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative h-56 overflow-hidden rounded-card bg-surface-brand text-on-surface-brand"><Motif size={800} opacity={0.25} className="text-on-surface-brand" /><span className="relative z-10 m-3 inline-block rounded-tag bg-surface-brand px-2 py-1 text-label-sm">plantes (défaut), sur vert</span></div>
              <div className="relative h-56 overflow-hidden rounded-card border border-outline-variant bg-surface text-primary"><Motif size={400} opacity={0.2} className="text-primary" /><span className="relative z-10 m-3 inline-block rounded-tag bg-surface px-2 py-1 text-label-sm text-on-surface">plantes, sur clair, size 400</span></div>
              <div className="relative h-56 overflow-hidden rounded-card bg-surface-brand text-on-surface-brand"><Motif size={800} opacity={0.25} variant="complet" className="text-on-surface-brand" /><span className="relative z-10 m-3 inline-block rounded-tag bg-surface-brand px-2 py-1 text-label-sm">variant=&quot;complet&quot; (avec collines)</span></div>
              <div className="relative h-56 overflow-hidden rounded-card bg-neutral-950 text-white"><Motif size={800} opacity={0.9} tone="couleur" /><span className="relative z-10 m-3 inline-block rounded-tag bg-black/70 px-2 py-1 text-label-sm">tone=&quot;couleur&quot; (fond noir)</span></div>
            </div>
            <p className="mt-3 max-w-3xl text-body-sm text-on-surface-muted">Usage courant : opacité de 0,04 à 0,07, jamais derrière du texte sans calque de fond. Les démos ci-dessus sont volontairement plus marquées pour montrer le dessin.</p>

            <h3 className="mb-3 mt-10 text-title-md">Transition d’horizon (HorizonDivider) et motif (Motif)</h3>
            <div className="overflow-hidden rounded-panel border border-outline-variant">
              <div className="relative bg-surface-brand pt-10 text-on-surface-brand">
                <Motif size={400} opacity={0.08} className="text-on-surface-brand" />
                <p className="relative z-10 px-6 pb-6 text-title-lg">Section vert profond avec motif plante</p>
                <HorizonDivider className="relative z-10 text-surface" />
              </div>
              <div className="bg-surface px-6 pb-8 pt-4"><p className="text-body-md text-on-surface-variant">La courbe reprend les collines du logo et remplace les ruptures nettes et les dégradés.</p></div>
            </div>
            <div className="relative mt-4 overflow-hidden rounded-panel border border-outline-variant bg-primary-container p-8 text-primary">
              <Motif size={400} opacity={0.1} className="text-primary" />
              <p className="relative z-10 text-title-md text-on-primary-container">Le même motif, en vert, sur fond clair</p>
            </div>
          </Section>

          <Section id="grammaire" title="Grammaire des formes" intro="Toutes les formes de la marque viennent de l’emblème du favicon. Chacune a un rôle précis, des tailles, des couleurs et des interdits ; une autre forme prend le relais quand le rôle change. Version 1 : 12/11/2026.">
            <Grammaire />
          </Section>

          <Section id="logo" title="Logo" intro="Composant Logo : version couleur sur fond clair, version blanche sur vert profond (ou en mode sombre), symbole seul pour les petits formats. Respecter la zone de protection : au moins la hauteur du « o » autour.">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-center rounded-card border border-outline-variant bg-surface-container-lowest p-8"><Logo tone="on-light" size="lg" /></div>
              <div className="flex items-center justify-center rounded-card bg-surface-brand p-8"><Logo tone="on-dark" size="lg" /></div>
              <div className="flex items-center justify-center gap-6 rounded-card bg-surface-container p-8"><Logo variant="symbol" size="lg" /><Logo variant="symbol" size="sm" /></div>
            </div>
          </Section>

          <Section id="regles" title="Règles d’usage">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardTitle>À faire</CardTitle>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-md text-on-surface-variant">
                  <li>Utiliser les rôles (<code>bg-primary</code>, <code>text-on-surface</code>) et jamais une valeur hexadécimale.</li>
                  <li>Un seul bouton orange par vue (l’appel à l’action) ; le vert pour le reste.</li>
                  <li>Un libellé visible sur chaque champ (FormField), avec aide et erreur reliées.</li>
                  <li>Nommer chaque bouton icône (<code>IconButton label</code>).</li>
                  <li>Texte courant à 16 px minimum ; jamais sous 12 px.</li>
                  <li>Cibles tactiles de 48 px (40 px compact pour l’administration, desktop).</li>
                </ul>
              </Card>
              <Card>
                <CardTitle>À ne pas faire</CardTitle>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-md text-on-surface-variant">
                  <li>Texte vert feuille ou jaune sur fond clair (contraste insuffisant).</li>
                  <li>Texte blanc sur l’orange (2,1:1) : le texte est toujours foncé.</li>
                  <li>Placeholder à la place du libellé.</li>
                  <li>Dégradés de fond, ombres lourdes, parallaxe, carrousels automatiques.</li>
                  <li>Informations portées par la couleur seule : ajouter icône ou texte.</li>
                  <li>Réinventer un bouton, une carte ou un badge : composer ceux de la bibliothèque.</li>
                </ul>
              </Card>
            </div>
          </Section>
        </main>
      </div>
    </ToastProvider>
  )
}
