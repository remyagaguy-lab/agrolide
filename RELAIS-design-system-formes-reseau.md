# Document de relais — design system, grammaire des formes, réseau (agrolide)

Rédigé le 12 novembre 2026 à la fin de la session « Formes : corrections puis design system sur tout le site » (`local_6178b639-…`), après relecture des notes de toutes les sessions de la même famille. Il sert à reprendre avec un autre compte Claude ou avec Antigravity, sans refaire ni défaire ce qui a été décidé.

Application : Next.js 16 + Tailwind v4, dossier `agrolide/` du dépôt `remyagaguy-lab/agrolide`. Base Cloudflare D1 via Drizzle (`@/db`), authentification Supabase. Un autre relais existe déjà pour l'espace membre : `RELAIS-espace-membre.md` (même dossier racine, ou notes de la session `local_03f129d6`) (à lire aussi).

Légende de fiabilité : **[vérifié]** = vu au code, à l'écran ou dans `git log` ; **[note]** = repris d'une note de session, non revérifié ; **[à vérifier]** = je ne sais pas.

---

## 1. En une minute

- Le **design system** (jetons clair/sombre, composants `src/components/ui/`, garde-fou `npm run ds:check`) est en place et appliqué à tout le site. [vérifié]
- La **grammaire des formes** (soleil + échos, anneau, horizon, feuille, sillons, dôme/arche, fenêtre, emblème éclaté) est définie, mesurée sur le favicon, documentée sur `/design-system#grammaire` et appliquée : accueil, en-têtes de rubrique, pied de page, 404, états vides, chargement, cartes, puces. [vérifié]
- Le **réseau** (annuaire réservé aux membres, suggestions, invitations, messagerie, blocage/signalement, carte publique opt-in) est livré jusqu'au lot 5. [note + `git log`]
- Tout est **poussé sur `main`**. Règle de l'utilisateur : push direct sur `main`, pas de branche ni de PR (aucun utilisateur réel pour l'instant), après `npx tsc --noEmit`, `npm run ds:check`, `npx next build --webpack --experimental-build-mode compile`.
- **Presque rien n'a été vérifié en vrai connecté** (pages membres, admin) : voir §9, recette manuelle à faire.

Où travailler : `C:\Users\PC\wt-agrolide-ui\agrolide` (worktree sur `main`, **checkout partiel** : `git sparse-checkout add <dossier>` en PowerShell si un dossier manque). **Ne pas toucher** au dossier OneDrive `agrolide.org\agrolide` (branche `perf/speed-up`, session perf), ni à `src/lib/auth`, `src/db`, `next.config.ts`, `vercel.json`, `src/app/api/` sans passer par la session perf (voir §7).

---

## 2. Carte des sessions de cette famille

Toutes dans le dossier de notes `C:\Users\PC\AppData\Local\Claude-Data\claude_pzs8sxrjxfjjc\side-session-notes\<id de session>\` (hors dépôt).

| Session (nom) | Rôle | État | Pièces à lire |
|---|---|---|---|
| Réorganisation projet (`local_0833f4f5`) | Racine : audit du design existant, fondations, vérification des formes | Terminée, PR #1 fusionnée | `Design-System-audit.md`, `Design-System-fondations.md`, `Design-System-formes-verification.md`, `Design-System.md` |
| `perf-agrolide` (`local_6c68ccb6`) | Performance du site ; **seule habilitée** à modifier `src/app/api/`, `src/lib/auth`, `src/db`, config | Inactive. Branche `perf/speed-up` (dossier OneDrive) | pas de note propre ; correctifs d'API demandés dans `local_a01cd048…/Messagerie-API-proposition.md` |
| `design-system` (`local_d75d5e99`) | Conception du design system (jetons, composants, mode sombre) | Terminée | notes dans la racine |
| `vecto-forme` → `build-formes` → `retouches-favicon-pied-d` | Vectorisation du favicon, build, favicon/pied de page/icônes sociales | Terminées | `local_3a988454…/grammaire-des-formes.md` (séries 1 à 3), `local_1f2ade5b…/analyse-yas.md` + labs |
| `design-system-sur-tout-l`, `formes-favicon` (`local_d66af9d2`) | Série 4 de la grammaire, accueil (lot 1) | Terminées | `local_d66af9d2…/serie4-corrections.md`, `mesure-entete.cjs.txt`, `lab-formes-serie4-page.tsx.txt`, `planches/` |
| **`formes-site` (`local_6178b639`, celle-ci)** | Lots 2 à 6 : en-têtes, cartes, états, finitions | Terminée | `lot2-simulation-P2-P1.md`, `lot2-entetes-rubriques.md` (dossier `local_d66af9d2…`), planches PNG |
| `ds-migrate-reste` (`local_24e3ca61`) | Migration des jetons : membres, modules, admin, learn | Terminée | `Design-System.md` (guide d'usage v1.1, §10 = état de la migration) |
| `ds-finitions` (`local_e7575f72`) | Finitions + mode sombre ; audit des pages publiques ; démarre le réseau | Terminée | `Pages-publiques-audit.md`, `Reseau-diagnostic.md`, `Reseau-proposition.md`, `Reseau-regles-visibilite.md` |
| `pages-publiques` (`local_7290b548`) | Refonte `/nous-soutenir` et `/partenaires` (lot 1 de l'audit) | Inactive après le lot 1 | journal dans `Pages-publiques-audit.md` |
| `reseau-annuaire` (lot 1) → `reseau-lot2` → `reseau-lot3` → `reseau-lot4` → `reseau-lot5` | Réseau : annuaire (lot 1), profil/confidentialité/suggestions (2), Mon réseau/invitations (3), fiche membre et messagerie (4), D12 + carte publique + non-lus (5) | Terminées ou presque | `Reseau-email-verifie-proposition.md`, `Messagerie-API-proposition.md`, `Messagerie-blocage-API-proposition.md`, `Reseau-lot5-proposition.md`, `0006_reseau_lot5.sql`, `Reseau-recherche-offre-proposition.md` |
| Refonte espace membre (`local_03f129d6`) | Nav à 5 rubriques, frontière public/membre, dashboard « moi » | Terminée | `RELAIS-espace-membre.md` (racine du dépôt) |
| Bibliothèque (autre famille, Antigravity) | Classement et mise en ligne de 273 documents | Phase 1 terminée | `Bibliotheque-Curation/POINT-ET-SUITE.md` (dépôt, commit `7cb8d43`) |

Le dossier de notes contient **environ 170 autres dossiers** d'autres familles de sessions (audit 360, inscriptions INS-*, bilan intelligent, agent publicateur IA, K5–K8, LK-*, D4–D6 profil…) : **hors périmètre ici, non relues**. Voir l'index thématique en §12.

---

## 3. Chronologie (commits sur `main`, 11–12/11/2026) [vérifié]

- **Design system** : `ce0ea09`…`9dbb551` migration des jetons par codemod (layout, pages publiques, membres, modules, admin, learn, graphiques) et `ds:check` ; `edec1c0` bascule Clair/Sombre/Système ; `d5c8d9f` accueil, formations, EventCard + activation du mode sombre.
- **Marque** : `e82b486` formes et motif intégrés ; `c65618d` formes vectorisées depuis les pixels ; `1b5827b`/`4803eed`/`975250d` motif plantes ; `0a58128` primitives mesurées + grammaire ; `a260b15` arche/fenêtre/sillons déduits ; `086b156` emblème sans silhouette pleine + éclaté ; `e6a4e46` éclaté inscrit dans le cercle.
- **Accueil** : `e178fe8`, `1a838fe` (en-tête H2), `e42d787`, `534a896` (en-tête composé à la mesure, motif continu jusqu'à l'horizon).
- **Lot 2** : `ff677f9` en-têtes de rubrique (P2) + correctif `PlanSoleil`.
- **Lots 3, 4, 6** : `6cd5531` (pied de page, 404, état vide, Spinner, cartes, icônes libres), `f762802` (404 = emblème éclaté), `4fcc823` (`CarteSoleil`, appel final au soleil levant, anneau de progression, puces).
- **Réseau** : `cd8978e`, `4d3d2be`, `03dcd02`, `9070d78` (lot 1–2) ; `cc5ced5`, `ffcc390` (lot 3) ; `a3ce245` (lot 4) ; `0a158bd`, `23dc629`, `5e5d382`, `2fb8e6d`, `2683215`, `7d8cdb6` (lot 5).
- **Espace membre** : `7db451e`, `a8b77a4`, `e76cdbf`, `f629dc7`, `77fbe9c`.

---

## 4. Design system : ce qu'il faut savoir [note + vérifié]

Guide d'usage complet : `local_24e3ca61…/Design-System.md` (à copier un jour dans `Opérations/Réseautage/Site-web/Conception/`) et démonstration vivante `/design-system` (non indexée).

- **Trois niveaux de jetons** : `--ag-ref-*` (valeurs brutes, **jamais** dans un composant), `--ag-sys-*` (rôles : seul niveau consommé), classes Tailwind (`bg-primary`, `text-on-surface`, `rounded-card/panel/tag/control`, `shadow-elev-*`, `text-display-md`, `text-headline-md`, `text-body-lg`…). Source des couleurs : `scripts/ds-tokens.mjs`, puis `npm run ds:tokens` (échoue si un contraste passe sous le seuil).
- **Rôles uniquement, jamais d'hexadécimal ni de `gray-*`/`green-*`…** : `npm run ds:check` échoue sinon (exceptions : `ds-check:ignore`).
- **Un seul bouton orange par vue** (`bg-tertiary`, texte foncé). Sur fond vert : `variant="ghost-dark"`.
- **Mode sombre actif** (`DARK_MODE_ENABLED = true`, `src/lib/theme.ts`, `data-theme="dark"` sur `<html>`). Non vérifié en sombre : pages membres/admin (connexion requise).
- **Piège Tailwind v4** : un jeton `--color-*` n'est émis que s'il est utilisé par un utilitaire. Dans du CSS ou du style en ligne, utiliser `var(--ag-sys-color-…)` (toujours défini), pas `var(--color-…)`. (Cause du bug des échos du `PlanSoleil`, corrigé.)
- **Style global `section { padding }`** (`globals.css`) : mettre `py-0` sur les sections à forme.
- **Typographie** : Urbanist partout ; Libre Baskerville seulement pour blog, citations, extraits. Échelle `text-display-lg/md`, `headline-lg/md/sm`, `title-lg/md/sm`, `body-lg/md/sm`, `label-lg/md/sm`. Plancher 12 px.
- **Pas encore migré vers l'échelle typographique** : les pages autres que l'accueil, l'en-tête et les cartes traitées ici gardent beaucoup de `text-xl`/`text-sm`/`font-bold` en dur (fiche formation, blog, cartes de formation/document/opportunité/membre…). `ds:check` ne l'interdit pas.

---

## 5. Grammaire des formes : règles et décisions de l'utilisateur

Doc en ligne : `/design-system#grammaire` (`src/app/design-system/Grammaire.tsx`). Composants : `src/components/brand/` (`PlanSoleil`, `Anneau`, `Arche`/`ArcheBadge`, `ArchPhoto`, `Sillons`, `Horizon`, `Feuille`/`Puce`, `Motif`, `Emblem`, `EmblemEclate`) ; géométrie mesurée : `geometrie.ts`, `forme-paths.ts` (générés). Tout vient du favicon (cercles, collines, sillons mesurés, résidus 0,2–0,9 px).

**Scripts `scripts/forme/` (`vectorize.py`, `primitives.py`, `verify.py`, `icons.py`) : ne jamais supprimer ni remplacer à la main.** Toute modification de forme passe par le script (venv à recréer : `python -m venv` puis `pip install -r scripts/forme/requirements.txt`). Ils servent aussi à recréer les formes dans Photoshop/Illustrator.

Règles : une seule grande forme par vue ; texte DANS le plan ; jamais de visage caché ; une photo ne change pas avec le thème (`fond="photo"` ou ton `clair`, dont les échos disparaissent en sombre) ; jamais de trait sur un grand plan ; sillons à 8–12 % d'opacité, coin seulement, jamais sous un texte ; pas de motif avec un plan ou des sillons.

**Décisions de l'utilisateur à ne pas remettre en cause**
1. Emblème « plein » (silhouette) **supprimé** partout. Restent : couleur, noir, blanc, mono, creux. Arche = le **dôme seul**.
2. Onglet-signature abandonné. Carte « titre dans le soleil » : soleil blanc + échos, en quart de cercle bas gauche ou centré bas (`CarteSoleil`).
3. En-tête d'accueil (décision révisée le 13/11/2026) : texte dans le ciel vert à gauche, photo à droite = la terre, **horizon VERTICAL** (le vrai `Horizon` tourné de 90° : masque `HORIZON_MASQUE_TERRE`, mêmes proportions que le pied de page) sur ordinateur (≥ 768 px) ; sur mobile, horizon horizontal et photo sous le texte. **Pas d'emblème** au creux de l'horizon. Motif continu jusqu'à la ligne (masque, pas aplat). L'horizon n'est utilisé qu'à cet endroit de l'accueil (plus de séparateur vers les chiffres ni le guide gratuit) ; titre sur 3 lignes dès 1280 px (colonne de photo de 44 % de la largeur). Photo : `/hero-accueil.webp`.
4. En-têtes de rubrique : **P2 partout** (12 pages `PageHero` : bandeau vert, `Sillons` haut droite à 10 %, `Horizon`). P1 (grand soleil dans fond clair) **abandonné**.
5. **Icônes libres** : on n'insère plus de pictogrammes dans l'arche. **Les dômes sont gardés pour les chiffres** (date d'événement, numéro d'étape `StepList`).
6. 404 = **emblème éclaté entier** au-dessus du texte (jamais coupé). État vide = soleil pâle qui descend du bord. Chargement = `Anneau mode="chargement"` (`Spinner`).
7. Appel final « Prêt à participer… » : soleil jaune + anneau orange qui se lève sur la ligne d'horizon. Pied de page : `Horizon` + motif qui monte jusqu'à la ligne (`HORIZON_MASQUE_TERRE_BORD`).
8. **Orange du bouton principal en mode sombre** (`bg-tertiary` → #ffb867) : **on laisse tel quel**.
9. Connexion/inscription : on garde le motif, sans grande forme.

**Méthode exigée (retour explicite de l'utilisateur, important)** : ne jamais élargir ou ajuster « à l'aveugle ». Mesurer avant de trancher (largeur de chaque ligne via `Range.getClientRects`, tailles, interlignages, hauteur au-dessus de la ligne de flottaison, aux largeurs 1440/1280/1024/768/414/375/360). S'inspirer de ClickUp/Bonsai : titre sur 2 lignes sur bureau, sous-titre plus étroit (effet de flèche), mobile compact. Quand le texte est long, le dire et proposer une version courte plutôt que réduire le corps. Outils : `local_d66af9d2…/mesure-entete.cjs.txt`, `local_6178b639…/mesure-entetes-p1-p2.cjs.txt`.

---

## 6. Ce qui est fait / reste, lot par lot (liste de l'utilisateur)

| Lot | Contenu | État |
|---|---|---|
| 1 | Accueil sur la grammaire | Fait |
| 2 | En-têtes de rubrique | Fait (P2, 12 pages, mesuré 375–1440) |
| 3 | Cartes : événement (jour dans le dôme), article (feuille + catégorie, composant commun), formations à la une (`CarteSoleil`) | Fait. **`CarteSoleil` n'est utilisée par aucune page** (pas de section « à la une » à brancher) |
| 4 | États : vide, 404, chargement | Fait |
| 5 | Espace membre : anneau de progression autour de l'avatar ; pictogrammes dans le dôme | Anneau branché (`77fbe9c`, **non vérifié à l'écran**). Dôme des pictogrammes **abandonné** |
| 6 | Pied de page, puces, valeurs/services en dôme (abandonné), appel final, connexion | Fait, sauf **puces** partielles : seulement Nos actions et critères d'incubation ; les listes à coches (objectifs de formation, tarifs) restent des coches ; pages légales en puces classiques |

Non vérifié en capture : `EventCard`, `ArticleCard`, `Spinner`, anneau du dashboard (pas de données/connexion en local). `HorizonDivider` n'est plus utilisé que par la page `/design-system` (peut être retiré avec sa section).

---

## 7. Perf et garde-fous inter-sessions

- La session `perf-agrolide` possède `src/app/api/`, `src/lib/auth`, `src/db`, `next.config.ts`, `vercel.json`. Les autres sessions rédigent des propositions de correctif au lieu de les appliquer (ex. `Messagerie-API-proposition.md`, échappement HTML dans `contact-partenariat`, `api/annuaire` sous connexion). [note]
- Branche OneDrive `perf/speed-up` : dernier commit vu `158fc99` (bibliothèque). [vérifié]
- **Worktree partagé** : plusieurs sessions ont commité dans `wt-agrolide-ui` ; un `git pull --rebase` peut rejouer des commits locaux d'une autre session et provoquer des conflits sur des fichiers que vous n'avez pas touchés. En cas de conflit hors de vos fichiers : `git rebase --abort`, puis cherry-picker **votre** commit sur `origin/main` dans un worktree temporaire (`git worktree add <tmp> origin/main`) et pousser de là.
- `public/sw.js` et `public/workbox-*.js` sont des artefacts de build non suivis : ne pas les commiter.

---

## 8. Réseau : état et décisions [note + `git log`]

Détail : `local_e7575f72…/Reseau-diagnostic.md`, `Reseau-proposition.md` (révision 2 prime), `Reseau-regles-visibilite.md`.

- **Décision structurante** : l'annuaire **n'est plus public**. `/annuaire` = page vitrine sans personne listée ; recherche, suggestions, fiche complète sous `/membres/…` derrière la connexion ; visiteur = carte publique limitée **seulement si** la personne a activé `profil_public` (défaut faux). Enquête LinkedIn/Facebook/Instagram/X dans `Reseau-regles-visibilite.md` (pas un avis juridique).
- Livré : annuaire serveur, filtres dans l'URL, suggestions transparentes (fonction pure + tests), invitations (plafond 20), Mon réseau, fiche riche, confidentialité, blocage/signalement (D12), page admin des signalements, compteur de non-lus, carte publique opt-in, centres d'intérêt.
- **Migration lot 5** : `0006_reseau_lot5.sql` (colonnes `user.profil_public`, `centres_interet`, `recherche`, `user_connections.message`, tables `user_blocks`, `signalements`, index unique de paire). Séquence sûre : migration d'abord (additive), code ensuite, car des actions admin lisent `user` sans liste de colonnes. **[à vérifier : migration appliquée en production ? doublons de paires de connexion détectés ?]**
- **Contrôle de l'e-mail vérifié (D8)** : question préalable à l'utilisateur — l'option « Confirm email » de Supabase est-elle active ? Si oui, rien à coder. **[à vérifier]**
- **Décisions ouvertes (D8–D12)** : qui accède à l'annuaire (tout membre ou à jour de cotisation), défauts pour les membres existants, cadre juridique/entité éditrice, correctif immédiat de l'exposition publique (fait : `38f8201`, `c4d7b70`).

---

## 9. Recette manuelle à faire (rien de tout ceci n'a été vu connecté)

1. Tableau de bord : l'anneau autour de l'avatar (`ProfileSummaryWidget`, taux de `completionProfil`) et le bandeau de bienvenue (aplat vert sans décor).
2. Pages membres et admin en **mode sombre**.
3. `EventCard` (jour dans le dôme), `ArticleCard` (feuille), `Spinner` (anneau de 16 px, trait épaissi ×1,8) avec de vraies données.
4. Pied de page et appel final sur des pages réelles (le soleil ne doit jamais toucher le bouton ; vérifié sur `/formations` à 375 et 1440).
5. `/formations` avec des formations en base (carte de liste inchangée) ; envisager d'y brancher `CarteSoleil` pour « à la une ».

---

## 10. Reste à faire, par priorité

1. **Recette §9** (rapide, détecte les surprises).
2. **Échelle typographique sur les pages restantes** (fiche formation, blog, cartes formation/document/opportunité/membre) : le plus gros chantier de cohérence.
3. **Audit des pages publiques** (`Pages-publiques-audit.md`) : lots 3 à 10 non faits (faux articles du blog à supprimer, pile d'erreur visible sur `/blog`, `/formations/[id]` prix et partage, `/qui-sommes-nous` gouvernance/statut, `/nos-actions` « investisseurs/centaines », `/rejoindre` après décision sur les tarifs…). Plusieurs dépendent de **décisions de l'utilisateur** : entité juridique (dons, partenariats), reçu fiscal, case « anonyme », profil Sénior et promesses de `/rejoindre`.
4. **Section « formations à la une »** pour employer `CarteSoleil`.
5. **Pastille de statut** et autres usages de `Feuille` ; puces restantes si souhaité.
6. Retirer `HorizonDivider` et sa section de démonstration.
7. Brancher `ds:check` en CI (non fait). Copier `Design-System*.md` dans `Opérations/Réseautage/Site-web/Conception/` (les sessions n'ont pas pu y écrire).
8. Bibliothèque : voir `Bibliotheque-Curation/POINT-ET-SUITE.md` (relecture d'une cinquantaine de documents douteux, cours et documents commerciaux, anciens dossiers).

---

## 11. Pièges pratiques (Windows, outils)

- Serveur de test : `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:9 NEXT_PUBLIC_SUPABASE_ANON_KEY=test npx next dev --webpack -p 3112` (un seul par dossier ; **l'arrêter en fin de tâche**, y compris le processus node sur le port 3112 : tuer seulement le PID en `Listen`, pas les connexions `TIME_WAIT`). Sans base, les pages avec données affichent leurs états vides.
- Captures : `playwright-core` (dans `node_modules`) + `C:/Program Files/Google/Chrome/Application/chrome.exe`. **Mobile en DPR 1** pour les pages longues (en DPR 2 au-delà d'environ 16 000 px de haut, des tuiles se dupliquent). Thème sombre : `document.documentElement.setAttribute('data-theme','dark')`.
- Page de test temporaire `src/app/lab-formes/` : **jamais commitée** ; supprimer ensuite `.next/dev/types/app/lab-formes` et `.next/types/app/lab-formes`. Les sources des simulations sont archivées en `.tsx.txt` dans les notes.
- Python/PIL : sous Git Bash, les chemins `/c/…` ne marchent pas pour Python : utiliser `C:/Users/…`.
- Messages de commit en français ; ne commiter que ses propres fichiers.
- Mémoire de l'utilisateur (rappels) : Orkedio est **membre fondateur** (mention du pied de page « Site réalisé par Orkedio », pas « partenaire ») ; push direct sur `main`.

---

## 12. Index des notes d'autres familles (non relues ici)

Dans `side-session-notes\` : **audit 360** (`local_3253eafd…`, axes A–K, 156 Ko : lancement, sécurité, base de données, légal, exploitation) ; **plan de corrections des fiches** (`local_235989a9…`) ; **inscriptions** INS-* (`local_5fbdb06c`, `local_44974b91`, `local_2ec72c62`, `local_4b101aab`, `local_1108425c`, `local_4a592f0a`) ; **bilan intelligent** (`local_703cb51a`, `local_7aba57e6`, `local_4c5655cc`, `local_4d8f9e19`, `local_2b902bf3`, `local_27d31232`, `local_41202dc3`) ; **agent publicateur / IA** (`local_16c19a17`, `local_60ad8b72`, `local_47a9477e`, `local_700887b4`, `local_69143f49`) ; **profil D4–D6, portfolio public** (`local_3bb0ac5f`, `local_3ddbdc26`, `local_25273197`) ; **LK-1 à LK-8** (`local_457062a0`) ; **K5–K8** (`local_700f9dac`, `local_80232454`, `local_4651ad60`, `local_873e886e`, `local_13c1af40`) ; **offres et organisations** (`local_86b0a62a`, `local_878ee6db`, `local_10773405`, `local_5b43fc91`, `local_40b8ae2e`, `local_47ce6aac`, `local_14025b94`). Chaque dossier contient en général des fichiers `passation-*` / `HANDOFF-*` à lire avant d'y toucher.

---

## 13. Reprendre en 5 commandes

```bash
cd C:\Users\PC\wt-agrolide-ui\agrolide
git status ; git pull --rebase origin main        # voir §7 en cas de conflit hors de vos fichiers
npx tsc --noEmit
npm run ds:check
npx next build --webpack --experimental-build-mode compile
```

Puis : recette §9, puis priorité §10. Pour toute décision de design non listée en §5, **demander à l'utilisateur** et **mesurer avant d'ajuster**.
