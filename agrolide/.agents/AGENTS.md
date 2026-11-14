# Règles Architecturales - Projet Agrolide

## 1. Séparation des Buckets R2 (Cloudflare)

**RÈGLE ABSOLUE POUR LES FUTURS AGENTS :**

Le système utilise **deux buckets distincts** pour le stockage des fichiers, et vous ne devez **JAMAIS** les mélanger.

### A. Le Bucket Privé : `agrolide-biblio`
- **Contenu** : Exclusivement réservé aux livres, ouvrages et documents PDF de la Bibliothèque.
- **Accès** : Privé. Aucun accès public direct.
- **Consultation** : Les documents de ce bucket doivent TOUJOURS être lus à travers l'interface `SecurePDFViewer` (qui empêche le téléchargement et désactive le clic droit) via la route API de téléchargement sécurisée.

### B. Le Bucket Public : `agrolide-ressources`
- **Contenu** : Toutes les images (affiches d'événements, avatars de profils, bannières), ressources publiques, et présentations d'événements (diaporamas).
- **Accès** : 100% Public via l'URL configurée dans `NEXT_PUBLIC_R2_PUBLIC_URL` (ex: `https://pub-df776a18832d4a219ebf0401bbacd190.r2.dev`).
- **Consultation** : Ces ressources sont appelées directement via l'URL publique dans les balises `<img>` ou les liens de téléchargement directs `<a href="...">`. Ne pas créer de proxy pour ces fichiers.

### Directive d'Upload (API)
La route `/api/admin/upload/route.ts` est configurée pour rediriger le fichier vers le bucket approprié en fonction du type de fichier (image -> public, document -> privé). Conservez cette logique lors de l'ajout de nouvelles fonctionnalités d'upload.


---

# Système éditorial (tout ce qu'agrolide écrit)

Pour écrire, relire ou corriger un contenu agrolide (article, post, fiche, newsletter, leçon, page du site), ne pas improviser : le système éditorial décide de la voix, du registre, des sources et des contrôles. Ces règles s'ajoutent aux règles ci-dessus et ne les remplacent pas.

Code témoin du système éditorial : ED-AGENTS-7K3Q

## À lire, dans cet ordre

1. `agrolide/editorial/ROADMAP.md` : objectif, état d'avancement, architecture, règles de travail pour tout agent.
2. `agrolide/editorial/README.md` : les couches du système et les commandes.
3. `agrolide/editorial/charte/00-decisions.md`, puis les fichiers de la charte utiles à la tâche.

## Où se trouve quoi

| Couche | Dossier | Remarque |
|---|---|---|
| Charte (la source de vérité des règles) | `agrolide/editorial/charte/` | En cas de désaccord entre une procédure et la charte, la charte gagne |
| Procédures (comment faire chaque tâche) | `agrolide/editorial/procedures/` | Seule source des skills. Écrites sans nom d'outil |
| Rôles | `agrolide/editorial/roles/` | Qui fait quoi |
| Modèles de référence | `agrolide/editorial/modeles/` | Un texte qui montre le niveau attendu, à relire avant d'écrire |
| Évaluations | `agrolide/editorial/evaluations/` | Briefs d'essai avec critères mesurables |
| Skills générés | `agrolide/.agents/skills/agrolide-*` et `agrolide/.claude/skills/agrolide-*` | Générés par `npm run ed:sync`. Ne jamais les modifier à la main : modifier la procédure puis relancer la synchronisation |

## Règles qui ne se discutent pas

- Ne rien inventer : ni chiffre, ni source, ni citation. Lire une source à sa source avant de la citer.
- Aucun tiret (cadratin, demi-cadratin, trait d'union d'incise). « agrolide » toujours en minuscules. BIFERA seulement avec la mention d'ex-nom. Voix collective, sans « je », vouvoiement.
- Aucune écriture en base de données : produire un fichier SQL que le propriétaire exécute lui-même.
- Un contenu technique ne passe en « publié » qu'après la validation d'un référent du domaine.

## Contrôles obligatoires (depuis `agrolide/`)

```bash
npm run ed:check                 # règles de la charte (zéro erreur avant tout commit)
npm run ed:valider -- <slug>     # en-tête et structure d'un article
npm run ed:sources -- <slug>     # liens, identifiants DOC, chiffres rattachés à une source
npm run ed:sync                  # régénère les skills après une modification d'une procédure
npm run ed:eval                  # note les sorties des briefs d'évaluation
npm run ed:test                  # test de portabilité
```
