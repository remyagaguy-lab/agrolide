# Journal des décisions éditoriales

Chaque ligne est une décision prise. Pour la changer, on ajoute une nouvelle ligne datée, on ne réécrit pas l'ancienne.

## Décisions validées

| Date | Décision | Détail |
|---|---|---|
| 2026-11-14 | Tirets interdits partout | Ni tiret cadratin, ni demi-cadratin, ni trait d'union entouré d'espaces pour une incise. Utiliser la virgule, les parenthèses, les deux-points ou une nouvelle phrase. Le trait d'union des mots composés reste permis (agro-industrie, ex-nom). |
| 2026-11-14 | Listes : la feuille est la puce | Dans le design system, la puce de liste est la feuille de l'emblème (`Puce`). On écrit des listes en Markdown simple, le rendu pose la feuille. Aucun caractère de puce tapé à la main. |
| 2026-11-14 | BIFERA | Ancien nom d'agrolide. Il reste là où c'est nécessaire (historique, chronologie, anciens supports) et toujours avec la mention « ex-nom d'agrolide » ou « anciennement BIFERA ». Jamais comme nom actuel. |
| 2026-11-14 | Marque | « agrolide » toujours en minuscules, même en début de phrase. |
| 2026-11-14 | Voix du réseau | Collective, sans « je », vouvoiement du lecteur. |
| 2026-11-14 | Voix personnelle de Remyaga | Séparée de la voix du réseau (tutoiement, première personne). Skill `clone-litteraire-remyaga`, jamais mélangée à un contenu publié au nom d'agrolide. |

| 2026-11-14 | Longueur d'un article de fond | 800 à 1 500 mots. Remplace 800 à 1 200 (ancienne charte) et 900 à 1 700 (ancien skill). |
| 2026-11-14 | Typographie : le design system prime | Urbanist pour l'interface et les titres. Libre Baskerville réservée aux articles de blog, citations de témoignages et extraits de la bibliothèque. L'ancienne charte (Libre Baskerville pour tout texte courant) est écartée. |
| 2026-11-14 | Emojis | Aucun sur le site (garanti par `ds-icons.mjs`). Réseaux sociaux : quelques emojis autorisés, avec parcimonie (de 1 à 3 par publication, jamais en série, jamais en remplacement d'un mot). |
| 2026-11-14 | Tirets longs supprimés | Les tirets existants sont retirés du site, et la règle est contrôlée par `npm run ed:check`. |

## À vérifier

| Sujet | Valeur retenue | Pourquoi |
|---|---|---|
| Catégories de membres | Membre Junior, Professionnel, Partenaire, Sénior | À vérifier dans les écrans du site. |

## Écarts connus entre le site et la charte (état au 2026-11-14)

Voir le rapport du garde-fou : `npm run ed:check`.

## Décisions du 2026-11-14 (cadrage éditorial par public)

| Décision | Détail |
|---|---|
| La vulgarisation est le fil conducteur, pas la seule fonction | agrolide rend le savoir agricole compréhensible et utilisable par tous les acteurs de la chaîne. Un contenu peut aussi présenter un parcours, un dispositif ou mobiliser des partenaires |
| Pas de ton institutionnel par défaut | La voix est celle d'un collègue qui connaît le sujet. Le registre Partenariat seul est plus sobre et factuel |
| Citer n'est pas systématique | On source toujours, on cite selon le public et le contenu (voir `10-preuves-et-sources.md`) |
| Chaque contenu vise un public et un registre | Les publics et les niveaux sont ceux de la taxonomie de la bibliothèque |
| Quatre registres validés : Terrain, Parcours, Expertise, Partenariat | Regroupent les six publics de la bibliothèque en quatre façons d'écrire (validé par Remyaga le 2026-11-14) |
| Le texte Terrain est le modèle de référence | Entre deux versions du même sujet (Parcours et Terrain), Remyaga retient `aliment-poisson-sacs-par-bassin` comme modèle de ton pour agrolide : simple, concret, imagé, en unités du terrain (2026-11-14) |
| Version Parcours retirée du site | `aliment-ferme-piscicole` est supprimé de la table `articles` pour éviter deux textes concurrents sur le même sujet. Les fichiers restent dans le dépôt comme exemple de registre, sans fichier SQL de publication (2026-11-14) |

## Propositions à valider

| Proposition | Pourquoi |
|---|---|
| Deux personas à créer : le producteur ou l'éleveur, le technicien ou conseiller | Manquaient. Le texte fondateur vise les producteurs. Fiches en brouillon dans `07-personas.md` |
| Pilier 4 renommé « Recherche et plaidoyer » | Colle au quatrième frein du texte fondateur (sous-valorisation des connaissances scientifiques). L'ancien nom était « Souveraineté alimentaire et plaidoyer » |
| Orthographe « agripreneur » | Le texte fondateur écrit « agri-preneur » avec un trait d'union. La charte et le site écrivent « agripreneur » |
| Longueur par registre | Terrain 400 à 800 mots, Parcours 800 à 1 500 (décision du 2026-11-14), Expertise 1 000 à 1 800, Partenariat 600 à 1 200 |

## Décisions techniques du 2026-11-14 (phase 1, portabilité et garde-fous)

| Décision | Détail |
|---|---|
| Les procédures sont la seule source des skills | `editorial/procedures/<nom>/PROCEDURE.md`, écrites sans nom d'outil. `npm run ed:sync` génère `.agents/skills/agrolide-*` et `.claude/skills/agrolide-*`. Ces dossiers ne s'éditent jamais à la main. Les skills installés par l'outil `skills` (clerk-*) et les règles de `.agents/AGENTS.md` ne sont pas touchés |
| Point d'entrée universel | `.agents/AGENTS.md` porte une section « Système éditorial » qui renvoie à `ROADMAP.md`, `README.md` et à la charte |
| Contrôles en trois temps | `ed:check` (règles), `ed:valider` (en-tête et structure), `ed:sources` (liens, identifiants DOC, chiffres). Un contenu passe les trois avant d'être livré |
| Le registre Expertise admet aussi le technicien | Lecture de « professionnels du métier » dans `06-publics-et-registres.md`. À confirmer |
| Contenu retiré | Un contenu au statut `retire` (exemple conservé, retiré du site) ne bloque pas les contrôles : ses écarts sont signalés en avertissement |
| Lien vers un document hébergé | Le site n'ouvre un document que par son identifiant base (`/bibliotheque/<id>`), qui n'est pas dans l'index local. Tant qu'il manque, le lien provisoire `/bibliotheque/DOC-xxxxx` est toléré au statut `redaction` (avertissement avec la requête de récupération), interdit aux statuts `valide` et `publie` |
| Antigravity | Non vérifié. Le test est dans `portabilite/prompt-test-antigravity.md`. Tant qu'il n'a pas été joué avec succès, on n'affirme pas qu'Antigravity lit `AGENTS.md` ni les skills |
| Ce que prouve le test de portabilité | Que des sorties de plusieurs agents passent les mêmes contrôles et sont comparables sur des règles mesurables. Pas qu'elles se valent en clarté ni en justesse : la relecture humaine reste obligatoire |

## Propositions à valider (phase 2, formats courts)

Les limites suivantes ne sont pas dans la charte. Elles sont fixées dans `scripts/lib/ed-formats-courts.mjs` pour que les contrôles tournent, et se changent à cet endroit seul.

| Format ou canal | Proposition |
|---|---|
| WhatsApp | 20 à 120 mots, aucun hashtag, 2 emojis au plus |
| Facebook | 50 à 180 mots, 3 hashtags et 3 emojis au plus |
| Instagram | 40 à 150 mots, 15 hashtags au plus (charte), 3 emojis au plus |
| TikTok | Script de 40 à 150 mots, sections Accroche, Script, Légende, 5 hashtags au plus |
| YouTube | Titre de 70 caractères au plus, description de 80 à 250 mots, liens vers les autres réseaux en fin |
| LinkedIn | 100 à 260 mots, accroche de 140 caractères au plus en première ligne, 3 hashtags au plus |
| Newsletter | 150 à 450 mots, aucun emoji, un seul CTA |
| Fiche technique | 400 à 600 mots (charte), trois étapes numérotées au moins, encart « À retenir », validation par un référent avant le statut valide |
| Déclinaison | Aucune suite de plus de 12 mots identique à l'article source, aucun chiffre absent de l'article source |
