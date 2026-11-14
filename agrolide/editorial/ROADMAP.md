# Feuille de route du système éditorial

Document de pilotage. Il se lit en premier, avant la charte. Il dit où on en est, ce qui manque, et dans quel ordre on construit. Il se tient à jour à chaque phase terminée.

## 1. L'objectif

Construire pour l'éditorial ce que le design system est au visuel : un système complet, cohérent, automatisable, qui donne le même résultat quel que soit l'agent qui l'exécute (Claude Code, Antigravity, ou un autre). Il couvre tout ce qu'agrolide écrit : site, articles, réseaux sociaux, fiches techniques, leçons de formation, e-books, livres.

Ce qui est demandé, mot pour mot dans l'esprit :

1. Une charte éditoriale complète, qui garde la cohérence selon la cible et le thème.
2. Un process de rédaction de bout en bout pour chaque type de contenu : réseaux sociaux, articles, e-books, formations, livres, pages du site.
3. Une analyse du site existant (pages, articles, formations) pour aligner l'existant sur la charte.
4. Des skills, des agents et des outils, pour automatiser avec l'intelligence artificielle.
5. Un résultat identique d'un agent à l'autre : changer d'outil ne change pas la qualité.
6. Des sources qui viennent de quatre familles : documents hébergés, documents locaux non hébergés, sources en ligne, autres ressources.
7. Plus tard : l'import de documents par les membres, avec rejet des doublons.

## 2. Bilan au 14 novembre 2026

| Ce qui était prévu | État | Détail |
|---|---|---|
| Charte éditoriale | Fait (v1) | 14 fichiers en six couches dans `charte/`, quatre registres validés, journal des décisions |
| Analyse du site existant | Partiel | Audit mécanique fait (tirets, marque, BIFERA, tutoiement) et corrigé dans le code. Pas d'analyse de voix ni de registre des pages, des quatre articles du blog, des formations. La base de données n'est pas contrôlée |
| Skill existant de Remyaga | Intégré | Repris en `agrolide-redaction-article`, enrichi |
| Process article | Fait | Cadrage en 11 points, rédaction, contrôle, mise en ligne par SQL. Deux articles test, un modèle de référence retenu |
| Process réseaux sociaux | Fait (v1) | Procédure `agrolide-post-reseau`, six posts modèles tirés de l'article Terrain, contrôles dans `ed:valider`. Limites par canal à valider (journal des décisions) |
| Process fiche technique, newsletter | Fait (v1) | Procédures `agrolide-fiche-technique` et `agrolide-newsletter`, modèles, contrôles |
| Process portrait | Procédure écrite, sans modèle | `agrolide-portrait` exige un consentement écrit et une vraie personne. Aucun modèle tant qu'un portrait réel n'est pas validé |
| Process leçon | Non commencé | Phase 4 |
| Process e-book et livre | Non commencé | Seulement cités dans la charte |
| Process page du site | Non commencé | Le texte des pages est écrit dans le code |
| Agents | Cadré | `roles/README.md` fixe le format de description. Aucun rôle écrit encore (phase 3) |
| Portabilité entre agents | Fait côté dépôt, non vérifié côté Antigravity | Procédures dans `procedures/`, skills générés par `ed:sync` dans `.agents/skills` et `.claude/skills`, section dans `AGENTS.md`, prompt de test prêt. Antigravity n'a pas encore été testé : voir `portabilite/prompt-test-antigravity.md` |
| Contrôle automatique | Partiel | `ed:check` (règles), `ed:valider` (en-tête et structure), `ed:sources` (liens, DOC, chiffres). Rien encore sur le contenu stocké en base |
| Tests de qualité (évaluations) | Fait (v1) | Six briefs, `ed:eval`, `ed:test`. Ils mesurent des règles, pas la clarté : relecture humaine toujours requise |
| Sources et bibliothèque | Partiel | Règles écrites (`10-preuves-et-sources.md`). `ed:sources` vérifie liens et identifiants DOC contre `INDEX.csv`. Pas encore de recherche automatique par sujet |
| Import de documents sans doublon | Conçu | Réflexion dans `chantiers/01-import-documents-sans-doublon.md`. Rien développé |
| Pilotage (calendrier, indicateurs, mise à jour) | Non commencé | |

### Pourquoi on a l'impression de ne pas avancer

On a creusé en profondeur un seul format, l'article, et construit son socle (charte, registres). C'était nécessaire, mais c'est la première fondation. Les parties qui font le système global, c'est-à-dire les autres formats, les agents, la portabilité, les tests et l'audit du site, n'ont pas démarré. Cette feuille de route les met toutes en file.

## 3. Ce qu'on améliore dès le départ

1. Un seul format ne fait pas un système : chaque nouveau format doit venir avec son skill, un exemple modèle, un contrôle automatique et un test. Sinon il reste décoratif.
2. Les skills ne doivent plus dépendre d'un seul outil.
3. La qualité ne doit plus reposer sur la bonne volonté du modèle : des contrôles déterministes (scripts) la garantissent.
4. L'existant doit être aligné : le site parle encore avec une voix institutionnelle.
5. Le travail humain doit être cadré : qui valide quoi, quand, avec quel retour.

## 4. L'architecture cible

Cinq couches. Chacune ne dépend que de celles qui la précèdent.

| Couche | Rôle | Où | Dépend d'un outil ? |
|---|---|---|---|
| 1. Socle | La charte : identité, voix, registres, formats, sources | `charte/` | Non. Markdown |
| 2. Procédures | Comment faire chaque tâche, étape par étape (les skills) | `procedures/` | Non. Markdown, écrit sans nom d'outil |
| 3. Rôles | Qui fait quoi : mission, entrées, sorties, contrôles | `roles/` | Non. Markdown |
| 4. Garde-fous | Scripts qui vérifient et publient | `scripts/ed-*.mjs` | Non. Node |
| 5. Preuves | Modèles de référence et tests qui prouvent le résultat | `modeles/`, `evaluations/` | Non. Markdown et JSON |
| Adaptateurs | Fichiers minces qui exposent le tout à chaque outil | `.agents/`, `.claude/` | Oui, générés, jamais écrits à la main |

### Principes de portabilité

1. Rien d'essentiel ne vit dans un format propre à un outil. Les procédures sont écrites dans `procedures/`. Les dossiers `.claude/skills` et `.agents/skills` sont générés par `npm run ed:sync`.
2. Les procédures nomment les actions par leur fonction (chercher sur le web, lire une page, lancer un script), jamais par le nom d'un outil.
3. Le résultat est garanti par des contrôles, pas par la confiance : en-tête validé par un schéma, `ed:check`, structure vérifiée par script, sources vérifiées par script.
4. Chaque format a un modèle de référence (un texte qui montre le niveau attendu). Un agent le relit avant d'écrire.
5. Un jeu d'évaluations (briefs d'exemple avec critères mesurables) permet de comparer deux agents sur le même brief et de détecter une régression.
6. Le point d'entrée universel est `agrolide/.agents/AGENTS.md`, qui existe déjà et que les agents lisent. Il renvoie à `agrolide/editorial/README.md` et à cette feuille de route.
7. À vérifier avec Antigravity : qu'il lit bien `AGENTS.md` et les skills de `.agents/skills`. Si ses conventions diffèrent, on ajoute un adaptateur, jamais un second jeu de règles.

## 5. Les rôles (les agents)

Un rôle est une mission décrite dans `roles/`. Dans Claude Code, il peut devenir un sous-agent. Ailleurs, c'est la même description qu'on donne à l'agent.

| Rôle | Mission | Entrée | Sortie | Humain requis |
|---|---|---|---|---|
| Rédacteur en chef | Reçoit un brief, choisit public, registre, format, canal, appelle les autres rôles dans l'ordre, refuse de passer une étape si un contrôle échoue | Un sujet | Un dossier de contenu complet | Valide le brief et la publication |
| Chercheur de sources | Cherche dans l'ordre : bibliothèque hébergée, contenus internes, corpus local, web. Lit à la source. Classe par statut | Sujet et public | Liste de sources vérifiées et lacunes | Non |
| Rédacteur | Écrit dans le registre et le gabarit demandés | Cadrage validé | Texte | Non |
| Adaptateur de canal | Réécrit un contenu pour un canal (post, newsletter, script vidéo) | Contenu source, canal | Versions par canal | Non |
| Relecteur éditorial | Applique la charte, `ed:check`, la grille de lecture, produit un rapport de corrections | Texte | Rapport et texte corrigé | Non, mais le rapport est lu |
| Vérificateur de faits | Contrôle chaque chiffre : source lue, périmètre, date. Met à jour le registre des chiffres | Texte | Fiche de preuves | Référent technique si sujet technique |
| Gardien de la bibliothèque | Détecte les doublons, indexe, relie articles et documents | Document ou article | Décision et liens | Modération des cas incertains |
| Analyste | Suit les indicateurs, propose les mises à jour et les sujets suivants | Chiffres d'usage | Rapport mensuel | Responsable éditorial |

## 6. Les procédures (skills) à produire

Une procédure par tâche. Chaque procédure est terminée quand elle a : un fichier de procédure, un modèle de référence, un contrôle automatique, une évaluation.

| Procédure | État |
|---|---|
| Cadrage d'article | Fait, migré dans `procedures/cadrage-article/` |
| Rédaction d'article | Fait, migré dans `procedures/redaction-article/` |
| Recherche de sources | À faire (aujourd'hui incluse dans le cadrage) |
| Fiche technique vulgarisée | Fait, `procedures/fiche-technique/` |
| Post pour chaque canal : LinkedIn, Facebook, Instagram, TikTok, YouTube, WhatsApp | Fait, `procedures/post-reseau/` (une procédure, six canaux) |
| Newsletter | Fait, `procedures/newsletter/` |
| Portrait et parcours | Procédure écrite, sans modèle, `procedures/portrait/` |
| Leçon de formation | À faire |
| Page du site | À faire |
| E-book | À faire |
| Livre | À faire |
| Relecture éditoriale | À faire |
| Vérification des faits et des sources | À faire |
| Audit d'un contenu existant | À faire |
| Mise à jour et fraîcheur d'un contenu | À faire |
| Voix de Remyaga (marque personnelle) | Existe (`clone-litteraire-remyaga`), à rattacher |

## 7. Les outils (scripts)

| Commande | Rôle | État |
|---|---|---|
| `ed:check` | Règles mesurables : tirets, marque, BIFERA, tutoiement, « je », registre | Fait |
| `ed:test` | Test de portabilité : adaptateurs à jour, modèles intacts, contrôles qui refusent un mauvais contenu, sorties de plusieurs agents comparables, jeu de déclinaisons conforme | Fait |
| `ed:publier` | Prépare le SQL de mise en ligne d'un article | Fait |
| `ed:valider` | Valide l'en-tête (champs, valeurs autorisées) et la structure (longueur, intertitres, CTA unique, lien interne) | Fait |
| `ed:sources` | Vérifie que les liens répondent, que les identifiants DOC-xxxxx existent et sont publiés, que chaque chiffre a une source | Fait |
| `ed:sync` | Génère les adaptateurs de chaque outil depuis `procedures/` (et `roles/` en phase 3) | Fait |
| `ed:eval` | Note les sorties d'agents sur des briefs fixes et compare deux agents | Fait |
| `ed:audit` | Passe en revue les pages, les articles, les formations et la base de données contre la charte | À faire |
| `ed:chiffres` | Tient le registre des chiffres (valeur, périmètre, source, date, prochaine vérification) | À faire |
| `ed:doublon` | Détection de doublons de documents (voir le chantier d'import) | À faire |
| `ed:fraicheur` | Signale les contenus dont les chiffres ou les dates sont périmés | À faire |

## 8. Les processus

### Un contenu court ou moyen

```
brief -> public et registre -> sources -> cadrage -> rédaction -> relecture automatique -> validation technique -> validation éditoriale -> publication -> mesure -> mise à jour
```

Chaque flèche est une porte. Un contrôle qui échoue bloque le passage. Les portes humaines sont : le brief, la validation technique (obligatoire pour le technique), la validation éditoriale, la publication.

### Un contenu long (e-book, livre)

Plan validé, puis un chapitre à la fois : cadrage du chapitre, rédaction, relecture, vérification. Un dossier de projet garde l'état : plan, glossaire, cas utilisés, décisions de style, liste des sources. Un chapitre n'est jamais écrit sans relire le plan et les chapitres précédents.

### Du contenu vers les canaux

Un contenu source (article, fiche, replay) génère ses déclinaisons par canal, chacune avec son registre. On réécrit, on ne raccourcit pas.

### Le cycle de vie

Chaque contenu porte une date et des chiffres à revérifier. `ed:fraicheur` produit la liste des contenus à mettre à jour.

### Les retours

Un lecteur du public visé relit les contenus Terrain avant publication. Les indicateurs reviennent au rédacteur en chef.

## 9. Les phases

Chaque phase a un critère de fin vérifiable.

### Phase 1 : portabilité et garde-fous (priorité)

Pourquoi en premier : c'est elle qui garantit le même résultat d'un agent à l'autre, avant de multiplier les formats.

Livrables :
- `procedures/` et `roles/` créés. Les deux skills actuels y sont migrés, sans nom d'outil.
- `npm run ed:sync` génère `.agents/skills` et `.claude/skills` depuis `procedures/`.
- `AGENTS.md` pointe vers le système éditorial.
- `ed:valider` : schéma d'en-tête et structure d'un article.
- `ed:sources` : vérification des liens et des identifiants de la bibliothèque.
- Premier jeu d'évaluations (6 briefs au moins) et `ed:eval`.
- Modèle de référence par format existant.

Terminé quand : le même brief, donné à deux agents différents, produit deux articles qui passent tous les contrôles et sont de qualité comparable, et quand un test automatique le prouve.

### Phase 2 : formats courts et fréquents

Posts pour les six canaux, fiche technique, newsletter, portrait. Pour chaque format : procédure, modèle, contrôle, évaluation.

Terminé quand : un article publié se décline en un jeu de posts, une fiche et une newsletter qui passent les contrôles, sans intervention sur le texte.

### Phase 3 : les rôles

Rédacteur en chef, relecteur éditorial, vérificateur de faits, chercheur de sources, adaptateur de canal. Rapport de relecture standard. Registre des chiffres.

Terminé quand : un brief unique déclenche la chaîne complète jusqu'au dossier prêt pour la validation humaine.

### Phase 4 : site, formations et existant

Leçon de formation, page du site. Audit de toutes les pages, des articles et des formations, y compris la base de données. Remise à la charte, page par page, par ordre de visibilité. Décision pour les quatre articles de démonstration du blog.

Terminé quand : `ed:audit` ne remonte plus d'écart sur le site et la base, et quand les pages principales sont écrites dans la voix d'agrolide.

### Phase 5 : formats longs

E-book et livre : dossier de projet, plan, cycle par chapitre, glossaire et bible de style.

Terminé quand : un mini e-book test de trois chapitres est produit de bout en bout et passe les contrôles.

### Phase 6 : bibliothèque et données

Import de documents sans doublon (voir `chantiers/01-import-documents-sans-doublon.md`), index des documents interrogeable par les agents, registre des chiffres alimenté, relevés de prix datés, registre des référents techniques.

Terminé quand : un membre dépose un document, le système rejette un doublon exact et signale un quasi-doublon, et un agent retrouve les documents du sujet par public et domaine.

### Phase 7 : pilotage

Calendrier éditorial, indicateurs, rapport mensuel, boucle d'amélioration de la charte.

Terminé quand : un rapport mensuel propose les sujets et les mises à jour du mois suivant.

## 10. Décisions attendues de Remyaga

| Décision | Pourquoi | Qui |
|---|---|---|
| Décrire le producteur ou l'éleveur et le technicien ou conseiller (langues, niveau de lecture, canaux) | Compléter les deux personas en brouillon | Remyaga |
| Pilier 4 : « Recherche et plaidoyer » ou ancien nom | Proposition en attente | Remyaga |
| « agripreneur » ou « agri-preneur » | Orthographe | Remyaga |
| Longueurs par registre | Propositions en attente | Remyaga |
| Responsable de la ligne éditoriale, référents techniques par domaine, community manager | Les portes humaines n'ont pas de nom | Remyaga |
| Outil de planification des posts | Pour la phase 2 | Remyaga |
| Accès aux articles scientifiques derrière un accès payant | ScienceDirect refuse l'accès automatique | Remyaga |
| Confirmer qu'Antigravity lit `AGENTS.md` et `.agents/skills` | Portabilité | Remyaga |

## 11. Règles de travail pour tout agent ou toute session

1. Lire dans l'ordre : cette feuille de route, `README.md`, `charte/00-decisions.md`, puis la charte utile à la tâche.
2. Ne rien inventer : ni chiffre, ni source, ni citation. Lire une source à la source avant de la citer.
3. Une règle n'existe qu'à un seul endroit. En cas de désaccord entre un skill et la charte, la charte gagne.
4. Travailler dans un dossier de travail isolé cadré sur `origin/main`. Le dépôt est en sparse checkout : tout vit sous `agrolide/`.
5. Lancer `cd agrolide && npm run ed:check` avant tout commit. Zéro erreur, zéro avertissement.
6. Aucune écriture en base : produire un fichier SQL que Remyaga exécute dans son terminal Cloudflare.
7. Pousser sur `main` (habitude du propriétaire) après `git fetch` et reprise sur `origin/main`. Pour du code du site (`src/`), lancer d'abord le build.
8. Mettre à jour le tableau d'état de cette feuille de route et le journal des décisions à chaque phase.
9. Ne pas lier ni citer un document de la bibliothèque qui n'est pas publié.
10. Les contenus techniques ne passent en « publié » qu'après la validation d'un référent.

## 12. Tableau d'état

| Phase | État | Dernière mise à jour |
|---|---|---|
| Socle v1 (charte, registres, deux skills, `ed:check`, `ed:publier`) | Terminé | 2026-11-14 |
| 1. Portabilité et garde-fous | Terminé côté dépôt (Antigravity non testé). Preuve : brief 02 traité par deux agents (claude-sonnet, claude-haiku), les deux passent tous les contrôles et sont comparables. `npm run ed:test` : 9 tests sur 9 | 2026-11-14 |
| 2. Formats courts | v1 faite : posts six canaux, fiche, newsletter (procédures, jeu modèle, contrôles). Portrait sans modèle. Limites par canal à valider | 2026-11-14 |
| 3. Rôles | À faire | |
| 4. Site, formations, existant | À faire | |
| 5. Formats longs | À faire | |
| 6. Bibliothèque et données | À faire | |
| 7. Pilotage | À faire | |
