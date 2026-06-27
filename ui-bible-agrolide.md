# UI Bible — agrolide.org
## Version 2.0 — Direction Institutionnelle & Plateforme Professionnelle
### Document de référence permanent — À lire AVANT toute génération dans Antigravity

---

## 0. Instructions d'utilisation avec Antigravity

**Commence chaque session Antigravity avec ce bloc d'introduction :**

> "Avant de commencer, lis intégralement le fichier `ui-bible-agrolide.md` dans le dossier du projet. Ce document est la référence absolue de design pour toutes les interfaces d'agrolide. Aucune décision visuelle ne peut contredire ce document. Si le CdC et l'UI Bible sont en conflit sur un point de design, l'UI Bible a priorité."

**Règle d'or :** Antigravity ne doit JAMAIS produire de code HTML/CSS/Tailwind sans avoir lu ce fichier dans la session en cours.

---

## 1. Direction Artistique

### 1.1 Positionnement visuel

agrolide n'est pas un site ONG, une association locale ou un blog agricole.

agrolide est une **plateforme professionnelle continentale** — aussi sérieuse qu'un réseau professionnel d'élite, aussi accessible qu'une app mobile moderne, aussi ancrée en Afrique que les problèmes qu'elle résout.

**L'objectif de chaque interface :** quand un agronome du Bénin ou un investisseur de Nairobi ouvre agrolide.org, sa première pensée doit être : *"C'est une plateforme sérieuse. Je peux lui faire confiance."*

### 1.2 Cinq mots-clés de direction

```
INSTITUTIONNEL   SOBRE   PROFESSIONNEL   AFRICAIN   MODERNE
```

- **Institutionnel** : des proportions maîtrisées, une hiérarchie claire, pas de surprise
- **Sobre** : espaces généreux, couleurs utilisées avec parcimonie, pas d'effets inutiles
- **Professionnel** : finitions impeccables, typographie rigoureuse, cohérence parfaite
- **Africain** : pas de mimétisme Silicon Valley — le contexte (mobile, data, agriculture) informe les choix
- **Moderne** : pas de motifs folkloriques, pas de cliparts agricoles — des interfaces propres

### 1.3 Références retenues et ce qu'on en prend

| Référence | Ce qu'on emprunte |
|-----------|-------------------|
| **Attio** | Sections sombres de contraste, typographie ultra-clean, silence visuel |
| **ClickUp** | Product mockups comme visuels principaux, feature tabs, social proof |
| **Biccas** | Grille de features en cards, palette verte maîtrisée, stats band |
| **Ready** | Fonds gris clair (#f8f8f6) pour les sections features, légèreté |
| **Nutritionist** | Layout split hero (texte + photo), grille blog, testimonials cards |

### 1.4 Ce qu'on refuse absolument

- Aucun dégradé en arrière-plan de section
- Aucune illustration cartoon ou clipart agricole (épis de maïs, tracteurs cartoon, etc.)
- Aucune ombre portée lourde (`box-shadow: 0 20px 60px rgba(0,0,0,0.2)` → interdit)
- Aucun fond coloré sur les sections body (seul le hero et le CTA final ont fond vert)
- Aucune police décorative autre que Urbanist et Libre Baskerville
- Aucune animation complexe (parallax, particles, scroll-triggered animations lourdes)
- Aucun caroussel/slider automatique (mauvais pour la performance mobile)
- Aucun bouton avec `border-radius: 50px` (trop "startup")
- Aucune couleur vert criard (`#00ff00`, `#7cfc00`, etc.)
- Aucune icône emoji dans l'interface

---

## 2. Palette de couleurs

### 2.1 Couleurs primaires

```css
:root {
  /* === BRAND VERTS === */
  --vert-profond:    #1b5e38;   /* Autorité, confiance, fond hero, CTA final */
  --vert-principal:  #50a853;   /* Accents actifs, badges, liens hover, icônes */
  --vert-olive:      #878e2c;   /* Usages secondaires très rares */

  /* === BRAND ORANGES === */
  --orange-accent:   #f99e1d;   /* CTA principal unique, éléments d'urgence */
  --jaune-dore:      #fcb726;   /* Hover sur orange, highlights très ponctuels */

  /* === NEUTRES === */
  --blanc:           #ffffff;   /* Fond sections principales, cards */
  --fond-gris:       #f8f8f6;   /* Fond sections features, alternance */
  --gris-border:     #e8e8e4;   /* Toutes les bordures, séparateurs */
  --gris-light:      #f0f0ee;   /* Fonds de badges, placeholders */
  --gris-muted:      #9a9a96;   /* Textes secondaires, métadonnées */
  --texte-corps:     #4a4a4a;   /* Corps de texte */
  --texte-titre:     #1a1a1a;   /* Titres sur fond blanc */

  /* === SECTIONS SOMBRES (style Attio) === */
  --dark-bg:         #0f1f17;   /* Fond section sombre (alternative au vert profond) */
  --dark-surface:    #1a2e22;   /* Surface dans section sombre */
  --dark-border:     rgba(255,255,255,0.1); /* Bordures dans section sombre */
}
```

### 2.2 Règles d'utilisation des couleurs

**Le vert profond (#1b5e38)** → UNIQUEMENT :
- Fond du hero
- Fond du CTA final
- Texte du logo
- Hover sur les liens de navigation

**Le vert principal (#50a853)** → UNIQUEMENT :
- Labels de section (petit texte uppercase)
- Liens texte hover
- Icônes actives
- Badges "actif", "nouveau"
- Barre de focus sur les inputs

**L'orange (#f99e1d)** → UNIQUEMENT :
- Le bouton CTA primaire de la page (1 seul par vue)
- Les éléments qui demandent une action immédiate critique

**Le gris fond (#f8f8f6)** → Pour toutes les sections qui ne sont pas blanc pur. Jamais de vert clair en fond de section.

### 2.3 Ratios de contraste WCAG AA

| Combinaison | Ratio | Status |
|-------------|-------|--------|
| #1a1a1a sur #ffffff | 18.1:1 | ✅ AAA |
| #4a4a4a sur #ffffff | 8.6:1 | ✅ AAA |
| #ffffff sur #1b5e38 | 9.4:1 | ✅ AAA |
| #1b5e38 sur #f8f8f6 | 8.1:1 | ✅ AAA |
| #50a853 sur #ffffff | 3.2:1 | ⚠️ Utiliser uniquement pour texte ≥ 18px ou bold |

---

## 3. Typographie

### 3.1 Polices

```css
/* Urbanist — Tous les titres, labels, boutons, navigation, UI */
font-family: 'Urbanist', system-ui, sans-serif;

/* Libre Baskerville — Citations de témoignages et corps d'articles de blog UNIQUEMENT */
font-family: 'Libre Baskerville', Georgia, serif;
```

**Règle critique :** Libre Baskerville n'apparaît QUE dans :
1. Les citations de témoignages (guillemets + citation)
2. Le corps des articles de blog (page `/blog/[slug]`)
3. Les extraits longs dans la bibliothèque numérique

Tout le reste — corps de texte, descriptions, paragraphes de sections — est en **Urbanist 400**.

### 3.2 Échelle typographique

```css
/* DISPLAY — Hero uniquement */
.text-display { font-size: clamp(36px, 5vw, 56px); font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; }

/* H1 — Un seul par page */
.text-h1 { font-size: clamp(28px, 4vw, 44px); font-weight: 800; line-height: 1.15; letter-spacing: -0.025em; }

/* H2 — Titres de section */
.text-h2 { font-size: clamp(22px, 3vw, 34px); font-weight: 800; line-height: 1.2; letter-spacing: -0.02em; }

/* H3 — Titres de cards et sous-sections */
.text-h3 { font-size: clamp(16px, 2vw, 20px); font-weight: 700; line-height: 1.3; }

/* H4 — Labels de features, titres de liste */
.text-h4 { font-size: 16px; font-weight: 600; line-height: 1.4; }

/* BODY-LG — Paragraphes intro sections */
.text-body-lg { font-size: 17px; font-weight: 400; line-height: 1.75; color: #4a4a4a; }

/* BODY — Corps de texte standard */
.text-body { font-size: 15px; font-weight: 400; line-height: 1.7; color: #4a4a4a; }

/* BODY-SM — Métadonnées, descriptions secondaires */
.text-body-sm { font-size: 13px; font-weight: 400; line-height: 1.6; color: #9a9a96; }

/* LABEL — Labels de section uppercase */
.text-label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #50a853; }

/* CAPTION — Métadonnées (date, durée, pays) */
.text-caption { font-size: 12px; font-weight: 500; color: #9a9a96; }
```

### 3.3 Chargement des polices (Next.js)

```typescript
// src/app/layout.tsx
import { Urbanist, Libre_Baskerville } from 'next/font/google'

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-urbanist',
  display: 'swap',
  preload: true,
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-baskerville',
  display: 'swap',
  preload: false,  // Non-critique — ne pas bloquer le chargement
})
```

---

## 4. Espacement & Grille

### 4.1 Système d'espacement (base 4px)

```
4px   → micro (gap entre icône et texte)
8px   → xs (padding badge, gap intra-composant)
12px  → sm (gap dans cards)
16px  → md (padding card standard)
20px  → md+ (gap entre cards)
24px  → lg (padding card large, margin entre éléments)
32px  → xl (espacement interne de section)
48px  → 2xl (padding section mobile)
64px  → 3xl (padding section tablet)
80px  → 4xl (padding section desktop standard)
96px  → 5xl (padding section desktop hero/CTA)
128px → 6xl (padding sections premium)
```

### 4.2 Grille

```css
/* Conteneur principal */
.container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

/* Sur tablet (≥768px) */
@media (min-width: 768px) { .container { padding: 0 32px; } }

/* Sur desktop (≥1024px) */
@media (min-width: 1024px) { .container { padding: 0 40px; } }
```

**Tailwind config pour le conteneur :**
```javascript
// tailwind.config.ts
container: {
  center: true,
  padding: { DEFAULT: '24px', md: '32px', lg: '40px' },
  screens: { DEFAULT: '100%', lg: '1100px' },
}
```

### 4.3 Padding de section standard

```css
/* Toutes les sections (sauf hero et CTA final) */
section { padding: 64px 0; }
@media (min-width: 768px) { section { padding: 80px 0; } }
@media (min-width: 1024px) { section { padding: 96px 0; } }
```

---

## 5. Composants UI

### 5.1 Boutons

```css
/* BTN PRIMAIRE — Orange, CTA principal, 1 seul par vue */
.btn-primary {
  background: #f99e1d;
  color: #ffffff;
  font-family: 'Urbanist', sans-serif;
  font-size: 15px;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
  min-height: 48px;  /* Touch target mobile */
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-primary:hover { background: #fcb726; }
.btn-primary:active { transform: scale(0.98); }

/* BTN SECONDAIRE — Vert, actions importantes non-CTA */
.btn-secondary {
  background: #1b5e38;
  color: #ffffff;
  /* même base que primary */
}
.btn-secondary:hover { background: #145030; }

/* BTN OUTLINE — Actions tertiaires */
.btn-outline {
  background: transparent;
  border: 1.5px solid #e8e8e4;
  color: #1a1a1a;
  font-family: 'Urbanist', sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 28px;
  border-radius: 8px;
  min-height: 48px;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.btn-outline:hover { border-color: #1b5e38; color: #1b5e38; background: #f0f7f0; }

/* BTN GHOST SUR FOND SOMBRE — Dans le hero */
.btn-ghost-dark {
  background: rgba(255,255,255,0.1);
  border: 1.5px solid rgba(255,255,255,0.3);
  color: #ffffff;
  /* même base */
}
.btn-ghost-dark:hover { background: rgba(255,255,255,0.18); }

/* BTN TEXTE — Liens d'action */
.btn-text {
  background: none;
  border: none;
  color: #1b5e38;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.15s;
}
.btn-text:hover { text-decoration-color: #1b5e38; }
```

### 5.2 Cards

```css
/* CARD STANDARD */
.card {
  background: #ffffff;
  border: 1px solid #e8e8e4;
  border-radius: 12px;
  padding: 24px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.card:hover {
  border-color: #c8c8c4;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

/* CARD SUR FOND GRIS (#f8f8f6) — Même style, fond blanc crée le contraste */
/* Pas de modification nécessaire — le blanc sur gris est suffisamment contrasté */

/* CARD SOMBRE — Dans les sections dark (style Attio) */
.card-dark {
  background: #1a2e22;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 24px;
}

/* CARD FEATURE — Feature avec icône */
.card-feature {
  background: #ffffff;
  border: 1px solid #e8e8e4;
  border-radius: 12px;
  padding: 28px;
}
.card-feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #f0f7f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
/* L'icône dans .card-feature-icon : Lucide, stroke-width=1.5, color=#1b5e38, size=20px */

/* CARD MEMBRE — Dans l'annuaire */
.card-membre {
  background: #ffffff;
  border: 1px solid #e8e8e4;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.card-membre:hover {
  border-color: #50a853;
  box-shadow: 0 0 0 3px rgba(80,168,83,0.1);
}

/* CARD BLOG */
.card-blog {
  background: #ffffff;
  border: 1px solid #e8e8e4;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.15s ease;
}
.card-blog:hover { border-color: #c8c8c4; }
.card-blog-image {
  aspect-ratio: 16/9;
  background: #f0f0ee;
  overflow: hidden;
}
.card-blog-body { padding: 20px; }
```

### 5.3 Badges

```css
/* BADGE CATÉGORIE MEMBRE */
.badge-junior        { background: #e8f5e9; color: #1b5e38; }
.badge-professionnel { background: #1b5e38; color: #ffffff; }
.badge-partenaire    { background: #878e2c; color: #ffffff; }
.badge-senior        { background: #fcb726; color: #5a3d00; }

/* BADGE STATUT */
.badge-actif         { background: #e8f5e9; color: #1b5e38; }
.badge-expire        { background: #fef3e2; color: #8a4e00; }
.badge-nouveau       { background: #f0f0fe; color: #3d3d8a; }

/* BASE BADGE */
.badge-base {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 5px;
  display: inline-block;
  letter-spacing: 0.03em;
  font-family: 'Urbanist', sans-serif;
}
```

### 5.4 Navigation

```css
/* HEADER */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid #e8e8e4;
  height: 64px;
  display: flex;
  align-items: center;
}

/* Logo — le texte "agrolide" en Urbanist 800 color:#1b5e38 */
/* La feuille dans le logo : afficher le SVG PNG du logo fourni */

/* Liens nav desktop */
.nav-link {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #555555;
  text-decoration: none;
  transition: color 0.15s;
}
.nav-link:hover { color: #1b5e38; }
.nav-link.active { color: #1b5e38; font-weight: 600; }

/* SIDEBAR MEMBRES — Desktop */
.sidebar {
  width: 240px;
  height: 100vh;
  position: sticky;
  top: 0;
  background: #ffffff;
  border-right: 1px solid #e8e8e4;
  padding: 24px 0;
  overflow-y: auto;
}
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #4a4a4a;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.1s;
}
.sidebar-item:hover { background: #f8f8f6; color: #1b5e38; }
.sidebar-item.active { background: #f0f7f0; color: #1b5e38; font-weight: 600; border-right: 2px solid #1b5e38; }
/* Icônes sidebar : Lucide, size=18px, stroke-width=1.5 */

/* BOTTOM NAV MOBILE — Zone membres uniquement */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #ffffff;
  border-top: 1px solid #e8e8e4;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 50;
}
/* Visible uniquement sur max-width: 768px */
```

### 5.5 Formulaires

```css
/* INPUT */
.input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #e8e8e4;
  border-radius: 8px;
  font-family: 'Urbanist', sans-serif;
  font-size: 15px;
  color: #1a1a1a;
  background: #ffffff;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}
.input:focus {
  border-color: #50a853;
  box-shadow: 0 0 0 3px rgba(80,168,83,0.12);
}
.input::placeholder { color: #c0c0bc; }
.input.error { border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.1); }

/* LABEL */
.label {
  font-family: 'Urbanist', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
  display: block;
}

/* SELECT */
/* Même style que .input + icône ChevronDown Lucide en position absolue à droite */

/* TEXTAREA */
.textarea {
  /* Même que .input */
  height: auto;
  min-height: 120px;
  padding: 12px 16px;
  resize: vertical;
}

/* MESSAGE D'ERREUR */
.error-msg {
  font-size: 12px;
  color: #d32f2f;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
/* Icône : Lucide AlertCircle, size=14px, couleur #d32f2f */
```

### 5.6 Avatar & Profil

```css
/* AVATAR — Toujours circulaire */
.avatar-sm { width: 32px; height: 32px; font-size: 12px; }
.avatar-md { width: 40px; height: 40px; font-size: 14px; }
.avatar-lg { width: 56px; height: 56px; font-size: 18px; }
.avatar-xl { width: 80px; height: 80px; font-size: 24px; }

.avatar {
  border-radius: 50%;
  background: #e8f5e9;
  color: #1b5e38;
  font-weight: 700;
  font-family: 'Urbanist', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;  /* Pour les vraies photos */
}
/* Si photo disponible : <img> en object-fit:cover */
/* Si pas de photo : initiales (2 caractères max) */
```

### 5.7 Label de section

```css
/* Apparaît au-dessus de chaque H2 de section */
.section-label {
  font-family: 'Urbanist', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #50a853;
  margin-bottom: 10px;
  display: block;
}
```

### 5.8 Séparateur horizontal

```css
/* Jamais de <hr> visible entre les sections — utiliser l'alternance de fonds */
/* Si séparateur nécessaire dans une section : */
.divider { border: none; border-top: 1px solid #e8e8e4; margin: 32px 0; }
```

---

## 6. Patterns de sections — Page d'accueil

### 6.1 Section HERO

```
Structure : fond #1b5e38, padding 96px 0 desktop / 72px 0 mobile
Layout : 2 colonnes sur desktop (texte 58% + élément visuel 42%)
         1 colonne sur mobile (texte empilé)

Colonne texte :
  → Pill label (voir composant ci-dessous)
  → H1 Display (Urbanist 900, clamp 36px→56px, blanc)
  → Segment accentué dans le H1 : color #fcb726 (jaune doré), font-style normal
  → Paragraphe 17px Urbanist 400, rgba(255,255,255,0.70), max-width 480px
  → 2 boutons : btn-primary (orange) + btn-ghost-dark

Colonne visuelle :
  → Photo agrolide (fichier dans /images du dossier projet)
  → border-radius: 12px, overflow: hidden
  → Sur mobile : masquée (display:none) pour performance
  → Image : object-fit:cover, aspect-ratio 4/3

Pill label :
  → border: 1px solid rgba(255,255,255,0.25)
  → border-radius: 5px (PAS de full-round)
  → padding: 5px 14px
  → font-size: 12px, Urbanist 500, rgba(255,255,255,0.8)
  → Petit point vert (#50a853) à gauche
```

### 6.2 Section STATS

```
Structure : fond #ffffff, border-bottom: 1px solid #e8e8e4
Layout : 4 colonnes, séparées par border-right: 1px solid #e8e8e4
Padding : 28px 0

Chaque stat :
  → Valeur : Urbanist 900, 36px, #1b5e38
  → Suffixe ("+", " pays") : Urbanist 400, 18px, #50a853
  → Label : Urbanist 600, 11px, #9a9a96, uppercase, letter-spacing 0.07em
  → text-align: center

Animation compteur :
  → IntersectionObserver : déclenche quand la section entre dans le viewport
  → Durée : 1500ms, easing : ease-out cubique
  → Délai entre chaque compteur : 150ms de décalage
```

### 6.3 Section RAISON D'ÊTRE

```
Structure : fond #ffffff
Layout : 2 colonnes (texte 55% + image/visuel 45%), gap 48px
Alignement : items-start

Colonne gauche :
  → section-label "Notre raison d'être"
  → H2 Urbanist 800
  → 2 paragraphes Urbanist 400 15px #4a4a4a, line-height 1.75
  → btn-text "En savoir plus →"

Colonne droite (desktop) :
  → Placeholder fond #f0f0ee, border-radius 12px, aspect-ratio 4/3
  → Centré verticalement par rapport au texte
  → Sur mobile : masqué ou affiché après le texte en pleine largeur
```

### 6.4 Section 4 FREINS (PROBLÈME)

```
Structure : fond #f8f8f6
Header : section-label + H2 Urbanist 800 + sous-titre optionnel 15px

Grid : 2×2 desktop (gap 16px), 1 col mobile
Chaque card :
  → .card standard (blanc, border gris, radius 12)
  → Numéro "01/02/03/04" : Urbanist 700, 11px, #50a853, uppercase, letter-spacing 0.1em
  → H3 Urbanist 700, 17px, #1a1a1a
  → Texte Urbanist 400, 14px, #4a4a4a, line-height 1.65
  → AUCUNE icône, AUCUNE border colorée, AUCUN accent visuel

Phrase de clôture :
  → Centrée, Urbanist 700, 17px, #1a1a1a
  → Margin-top 32px
```

### 6.5 Section 3 DOMAINES D'ACTIVITÉ

```
Structure : fond #ffffff
Header : section-label + H2

Layout : 3 colonnes desktop (gap 20px), 1 col mobile
Chaque card DAS :
  → .card-feature
  → Icône dans .card-feature-icon (Lucide, différente par DAS)
     - Mobilisation & Réseautage : Users (ou Network)
     - Formation & Insertion : BookOpen (ou GraduationCap)
     - Agrobusiness : TrendingUp (ou Briefcase)
  → H3 Urbanist 700 17px
  → Texte Urbanist 400 14px #4a4a4a
  → Lien "Découvrir →" btn-text en bas de card
  → Toute la card est cliquable (cursor:pointer, hover state de .card)
```

### 6.6 Section PLATEFORME (inspiration ClickUp/Attio)

```
Structure : fond #0f1f17 (sombre), padding 96px 0
CETTE SECTION EST LA CLEF DU DESIGN PREMIUM

Header : section-label couleur rgba(80,168,83,0.9) + H2 blanc

Layout : alternance de 3 blocs "split" :
  Bloc 1 : texte gauche + capture dashboard droit
  Bloc 2 : capture annuaire gauche + texte droit
  Bloc 3 : texte gauche + capture bibliothèque droit

Chaque bloc :
  → Grid 2 colonnes, gap 48px, padding-bottom 64px, border-bottom 1px solid rgba(255,255,255,0.08)
  → Colonne texte : numéro discret (Urbanist 900, 48px, rgba(255,255,255,0.06)) + H3 blanc + texte rgba(255,255,255,0.65) Urbanist 400 15px
  → Colonne visuelle : .card-dark avec screenshot interface agrolide OU placeholder
  → btn-text couleur #50a853 "En savoir plus →"

Screenshots/placeholders :
  → Fond #1a2e22, border: 1px solid rgba(255,255,255,0.1), border-radius 10px
  → Aspect-ratio 16/9 ou 4/3
  → Si screenshots pas disponibles : placeholder avec label centré en Urbanist 600 blanc
```

### 6.7 Section TÉMOIGNAGES

```
Structure : fond #f8f8f6
Header : section-label + H2

Grid : 3 colonnes desktop (gap 20px), 1 col mobile
Chaque card :
  → fond #ffffff, border: 1px solid #e8e8e4, border-radius 12px, padding 24px
  → Guillemet ouvrant : " en Libre Baskerville, 48px, #d4ead4 (vert très pâle), line-height 0.8
  → Citation : Libre Baskerville italic, 14px, #444, line-height 1.85
  → Séparateur : border-top 1px solid #f0f0f0, margin-top 16px, padding-top 16px
  → Avatar + Nom (Urbanist 600, 13px, #1a1a1a) + Badge catégorie + Pays (Urbanist 400, 12px, #9a9a96)
  → AUCUN ★ rating visible (risque d'avoir l'air fake)
```

### 6.8 Section BLOG

```
Structure : fond #ffffff
Header : section-label + H2 aligné gauche + btn-text "Tous les articles →" aligné droite (même ligne que H2 sur desktop)

Grid : 3 colonnes desktop (gap 20px), 1 col mobile
Card blog : voir .card-blog

Corps de card :
  → Image zone : aspect-ratio 16/9, fond #f0f0ee (placeholder gris)
  → Badge catégorie (vert pâle, text vert)
  → Titre Urbanist 700, 15px, #1a1a1a, line-height 1.4
  → Extrait Urbanist 400, 13px, #4a4a4a, 2 lignes max (line-clamp: 2)
  → Métadonnées : Date + "·" + temps de lecture estimé — Urbanist 400, 12px, #9a9a96

Si 0 articles : afficher les 3 cards avec opacity: 0.4, cursor: default, texte "Articles bientôt disponibles"
```

### 6.9 Section CTA FINAL

```
Structure : fond #1b5e38, padding 96px 0, text-align center
H2 Urbanist 900, clamp(24px→36px), blanc, max-width 520px, centré
Sous-titre : modules en ligne séparés par " · " — Urbanist 400, 14px, rgba(255,255,255,0.6)
Margin entre sous-titre et bouton : 28px
Bouton : .btn-primary (orange) — SEUL CTA de cette section
Aucun autre lien ou bouton dans cette section
```

### 6.10 FOOTER

```
Structure : fond #0f3d22, padding 56px 0 28px
Grid 3 colonnes desktop, 1 col mobile, gap 32px

Colonne 1 :
  → Logo SVG blanc (version blanc du logo agrolide)
  → Tagline : Urbanist 400, 13px, rgba(255,255,255,0.5), max-width 220px, line-height 1.6
  → Icônes réseaux sociaux : carré 32px, border: 1px solid rgba(255,255,255,0.15), border-radius 6px, Lucide icons

Colonne 2 — Navigation rapide :
  → Titre : Urbanist 700, 11px, rgba(255,255,255,0.9), uppercase, letter-spacing 0.07em
  → Liens : Urbanist 400, 13px, rgba(255,255,255,0.5), margin-bottom 8px, hover: rgba(255,255,255,0.85)

Colonne 3 — Contact :
  → Même structure que col 2
  → mail: reseau@agrolide.org
  → Localisation: Lomé, Togo

Bas de footer :
  → border-top: 1px solid rgba(255,255,255,0.08), padding-top 20px
  → flex space-between : Copyright gauche | Mentions légales + Politique de confidentialité droite
  → Tout en Urbanist 400, 12px, rgba(255,255,255,0.3)
```

---

## 7. Patterns Dashboard — Espace Membres

### 7.1 Layout général membres (desktop)

```
┌─────────────────────────────────────────────────────┐
│  HEADER (64px sticky, blanc, border-bottom)         │
├──────────────┬──────────────────────────────────────┤
│              │                                       │
│  SIDEBAR     │  CONTENU PRINCIPAL                   │
│  (240px)     │  fond #f8f8f6                        │
│  sticky      │  padding: 32px 40px                  │
│  bg: blanc   │                                      │
│  border-right│                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

### 7.2 Dashboard header (page)

```
→ "Bonjour, [Prénom]" Urbanist 800, 24px, #1a1a1a
→ Badge catégorie à côté du prénom
→ Date du jour : Urbanist 400, 14px, #9a9a96
→ Sous-titre : "Votre espace [Junior/Professionnel/etc.]"
```

### 7.3 Metric cards (dashboard)

```
Grid 4 colonnes desktop, 2 col tablet, 1 col mobile

Chaque card :
  → fond blanc, border: 1px solid #e8e8e4, border-radius 10px, padding 20px
  → Icône Lucide en haut gauche (24px, #50a853)
  → Label : Urbanist 600, 12px, #9a9a96, uppercase
  → Valeur : Urbanist 800, 28px, #1a1a1a
  → Variation ou sous-label : Urbanist 400, 12px, #9a9a96
```

### 7.4 Tableau de données (admin + listes membres)

```css
/* TABLE */
.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  font-family: 'Urbanist', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #9a9a96;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e4;
  text-align: left;
  background: #f8f8f6;
}
.data-table td {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  color: #1a1a1a;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0ee;
}
.data-table tr:hover td { background: #fafaf8; }
```

### 7.5 Formulaire membre (modifier profil)

```
Layout : 2 colonnes sur desktop (labels + inputs côte à côte)
         1 colonne sur mobile

Groupes de champs séparés par des sections avec titre H3 Urbanist 700 16px + border-bottom

Ordre des sections :
1. Photo de profil (upload zone + aperçu circulaire)
2. Informations personnelles
3. Informations professionnelles
4. Paramètres d'annuaire
5. Paramètres de notifications

Bouton de sauvegarde : btn-secondary (vert), fixe en bas sur mobile (sticky bottom bar)
```

---

## 8. Iconographie

### 8.1 Bibliothèque : Lucide React (déjà installé)

**Règle unique :** `stroke-width={1.5}` sur TOUTES les icônes. Jamais 2, jamais 1.

```typescript
// Pattern d'usage standard
import { Users, BookOpen, TrendingUp, Search, Bell } from 'lucide-react'

// Dans le composant :
<Users size={20} strokeWidth={1.5} color="#1b5e38" />
```

### 8.2 Tailles standards

```
16px → Icônes dans le texte, badges, petits labels
18px → Sidebar navigation
20px → Cards features, boutons
24px → Dashboard metric cards, sections
32px → Icônes hero et grandes sections
```

### 8.3 Mapping icônes par module agrolide

```
Accueil          → Home
Annuaire         → Users
Bibliothèque     → BookOpen
Formations       → GraduationCap
Webinaires       → Video
Événements       → Calendar
Forum            → MessageSquare
Opportunités     → Briefcase
Messages         → Mail
Notifications    → Bell
Profil           → User
Cotisation       → CreditCard
Agrobusiness     → TrendingUp
Nous soutenir    → Heart
Partenaires      → Handshake
Blog             → FileText
Admin            → Settings
Déconnexion      → LogOut
Télécharger      → Download
Partager         → Share2
Rechercher       → Search
Filtres          → SlidersHorizontal
```

---

## 9. Photographie & Visuels

### 9.1 Photo d'en-tête (déjà en place)

La photo dans le dossier `/images` est la photo principale du hero. Elle doit :
- Être servie depuis R2 via `<Image>` Next.js (format WebP automatique)
- Être compressée à ≤ 150 Ko en WebP
- Avoir un placeholder blur (prop `placeholder="blur"`) pendant le chargement

### 9.2 Règles photo pour les futures images

- **Authenticité obligatoire :** Vraies personnes africaines dans des contextes agricoles réels — pas de banques d'images occidentales stéréotypées
- **Format :** WebP uniquement via `<Image>` Next.js
- **Aspect ratios standards :**
  - Hero : 4/3 ou 3/2
  - Blog cards : 16/9
  - Profils : 1/1 (carré, affiché circulaire)
  - Agripreneurs vitrine : 4/3
- **Taille maximale par image :**
  - Hero : 200 Ko WebP
  - Cards blog : 80 Ko WebP
  - Profils : 40 Ko WebP
- **Alt text :** Obligatoire, descriptif, en français

### 9.3 Placeholders (avant photos réelles)

```css
/* Placeholder standard */
.img-placeholder {
  background: #f0f0ee;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* Icône Lucide Image, size=32px, color=#c0c0bc */
```

---

## 10. Configuration Tailwind

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        vert: {
          profond:    '#1b5e38',
          principal:  '#50a853',
          olive:      '#878e2c',
          clair:      '#f0f7f0',
          pale:       '#e8f5e9',
        },
        orange: {
          accent: '#f99e1d',
          dore:   '#fcb726',
        },
        dark: {
          bg:      '#0f1f17',
          surface: '#1a2e22',
          border:  'rgba(255,255,255,0.1)',
        },
        gris: {
          fond:   '#f8f8f6',
          border: '#e8e8e4',
          light:  '#f0f0ee',
          muted:  '#9a9a96',
          texte:  '#4a4a4a',
          titre:  '#1a1a1a',
        },
      },
      fontFamily: {
        urbanist:    ['var(--font-urbanist)', 'system-ui', 'sans-serif'],
        baskerville: ['var(--font-baskerville)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': ['clamp(36px, 5vw, 56px)', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '900' }],
        'h1':      ['clamp(28px, 4vw, 44px)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '800' }],
        'h2':      ['clamp(22px, 3vw, 34px)', { lineHeight: '1.2',  letterSpacing: '-0.02em',  fontWeight: '800' }],
        'h3':      ['clamp(16px, 2vw, 20px)', { lineHeight: '1.3',  fontWeight: '700' }],
      },
      borderRadius: {
        'card': '12px',
        'btn':  '8px',
        'badge': '5px',
        'icon': '10px',
      },
      spacing: {
        'section-sm': '64px',
        'section':    '80px',
        'section-lg': '96px',
      },
      maxWidth: {
        'container': '1100px',
        'prose':     '660px',
      },
      boxShadow: {
        'card-hover': '0 2px 12px rgba(0,0,0,0.06)',
        'focus-green': '0 0 0 3px rgba(80,168,83,0.12)',
        'focus-red': '0 0 0 3px rgba(211,47,47,0.10)',
        /* AUCUNE ombre lourde permise */
      },
      animation: {
        'counter': 'countUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 11. Anti-patterns — Ce qu'Antigravity ne doit JAMAIS faire

### Visuels

```
❌ background: linear-gradient(...)  → Remplacer par solid color
❌ box-shadow: 0 20px 60px rgba(0,0,0,0.2)  → Max: 0 2px 12px rgba(0,0,0,0.06)
❌ border-radius: 9999px sur les boutons → Max: 8px
❌ backdrop-filter: blur(...) sur autre chose que le header
❌ Animations CSS > 300ms sauf compteurs
❌ Icônes emoji dans l'interface
❌ Gradients sur les backgrounds de section
❌ Photos stock d'agriculture occidentale
❌ Caroussel/slider automatique
❌ Skeleton loaders complexes (simple pulse suffit)
```

### Typographie

```
❌ font-weight: 600 ou 700 sur les paragraphes de corps
❌ letter-spacing positif sur les H1/H2 (uniquement negatif)
❌ Libre Baskerville en dehors des citations et articles
❌ text-transform: uppercase sur les titres H2+
❌ line-height < 1.5 sur le corps de texte
❌ Plusieurs niveaux d'emphase dans un même paragraphe
```

### Structure

```
❌ Fond coloré (autre que blanc ou #f8f8f6) sur les sections body
❌ Plus de 2 CTAs différents visibles en même temps
❌ Cards avec plus de 3 niveaux d'information
❌ Sections sans section-label
❌ Tableau sans header sticky sur mobile
❌ Images sans attribut alt
❌ Liens sans indication visuelle (underline ou couleur différente)
```

### Performance

```
❌ Images sans <Image> Next.js (jamais de <img> vanilla)
❌ Polices sans display: swap
❌ Animations sans prefers-reduced-motion
❌ JavaScript bloquant le rendu (tout en async/defer ou Server Components)
❌ Requêtes API côté client sans loading state
❌ Infinite scroll sans virtualization (liste de >50 items)
```

---

## 12. Prompt maître Antigravity (à coller en début de session)

```
Tu vas développer le site web agrolide.org, un réseau professionnel agricole africain.

AVANT TOUTE CHOSE, lis le fichier ui-bible-agrolide.md dans ce dossier.
Ce fichier est ta constitution de design. Chaque décision visuelle doit en découler.

RÉSUMÉ DE LA DIRECTION :
- Institutionnel, sobre, professionnel, africain, moderne
- Typographie : Urbanist pour tout, Libre Baskerville UNIQUEMENT pour les citations et articles
- Palette : vert profond #1b5e38 (hero, CTAfinal), vert principal #50a853 (accents), orange #f99e1d (CTA principal)
- Fonds : blanc #ffffff et gris clair #f8f8f6 en alternance. AUCUN fond coloré sur les sections body.
- Icônes : Lucide React, stroke-width={1.5} partout
- Aucun gradient, aucune ombre lourde, aucun carousel automatique
- Mobile-first impératif : utilisateurs africains sur 3G, images optimisées, touch targets 48px minimum

STACK TECHNIQUE :
- Next.js 15 App Router (déjà initialisé)
- Supabase (déjà configuré, migrations appliquées)
- Cloudflare Workers (déjà déployé)
- Tailwind CSS avec la config de l'UI Bible
- Lucide React (déjà installé)

Références design : Attio (sections sombres premium), ClickUp (product mockups), Biccas (card grid vert), Ready (fonds gris clair), Nutritionist (split hero).

Pour cette session, voici ce que tu vas implémenter : [DÉCRIRE LA TÂCHE ICI]
```

---

*— Fin de l'UI Bible agrolide v2.0 —*
*À placer dans le dossier racine du projet agrolide.org*
*Référencer dans chaque session Antigravity avant toute génération*
