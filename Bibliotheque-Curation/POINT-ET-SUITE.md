# Bibliothèque Agrolide : point au 12 novembre 2026 et suite

Note de passage de relais, pour une autre session Claude ou pour Antigravity. À lire en entier avant d'agir.

## 1. Où on en est, en trois lignes

- **273 documents sont en ligne** (213 publics, 60 réservés aux inscrits), avec filtres par domaine, sujet, type, public et niveau. Vérifié par le responsable sur le site.
- Les **1 091 documents** du corpus sont rangés et renommés dans `Opérations\Formation\Bibliothèque-Agrolide\Classée`. Rien n'a été supprimé.
- **Ce qui reste** : relire une cinquantaine de documents douteux, décider du sort des cours et des documents commerciaux, nettoyer les anciens dossiers. Voir la section 5.

## 2. Ce qui a été fait

1. **Consignes et règles.** `taxonomie.json` (6 domaines, 56 sujets, 14 types, publics, niveaux, décisions de publication, drapeaux) et `fiche_document.schema.json` (schéma qui interdit par exemple de publier un mémoire, un document incomplet ou aux droits réservés).
2. **Traitement par Antigravity.** Il a produit une fiche par document : domaine, type, public, droits, complétude, doublons, titre, résumé, nom final, décision. Résultats et scripts dans son dossier de travail `C:\Users\PC\.gemini\antigravity\worktrees\agrolide.org\document_classification_pipeline\pipeline`. Une copie des fiches et des rapports est dans `Classée\_Index\donnees_antigravity`.
3. **Contrôle indépendant.** Les fiches sont valides et complètes, mais Antigravity avait été trop large sur les droits : une quinzaine de documents publiés portaient « tous droits réservés, aucune reproduction n'est autorisée » (surtout des Agrodok). Corrigé : voir `correction-lot-public\`.
4. **Rangement.** `outils\ranger_bibliotheque.py` a déplacé les fichiers (journal `Classée\_Index\deplacements.csv`, annulation avec `annuler_rangement.py`).
5. **Base et site.**
   - Les 102 anciens documents en ligne avaient tous une copie locale. La table a été sauvegardée (`Classée\_Index\sauvegarde_base_2026-11-12\`) puis vidée, par le responsable dans son terminal.
   - 8 colonnes ajoutées à `documents` (`domaine`, `sous_domaine`, `public_cible`, `niveau`, `licence`, `source_organisation`, `mots_cles`, `reference`) : migration `agrolide/drizzle/0008_bibliotheque_classification.sql`, appliquée.
   - Filtres, cartes, page document (public, niveau, source, licence), lecture sans compte portée de 3 à 5 documents.
   - 273 PDF envoyés dans R2 (bucket `agrolide-biblio`), 273 lignes importées. Tout est sur `main` (commit `14679ed` et suivants), déployé par Vercel.

## 3. Décisions prises par le responsable

- La bibliothèque est **gratuite** (inscription gratuite, 5 lectures sans compte). Il n'y a donc pas d'usage commercial : les documents sous licence CC BY-NC-SA sont publiables, avec source et licence affichées. À revoir si la bibliothèque devenait payante.
- **Droits réservés explicites** : on ne publie pas (héberger une copie est une reproduction). Republier seulement avec l'accord écrit de l'éditeur, ou mettre un lien vers lui.
- **Avant 2000** : non publié.
- **Contexte tempéré** (guides bio français, québécois, suisses) : réservé aux inscrits.
- **Mémoires et thèses** : jamais publiés.
- Les **cours** et les **documents commerciaux** archivés : le responsable les relira lui-même avant de décider.
- Le responsable avait voulu **vider la bibliothèque avant de classer**. C'est fait, mais notez qu'on aurait pu éviter une période vide en important d'abord.

## 4. Chiffres de référence

| Décision finale | Nombre |
|---|---:|
| `public` | 213 |
| `membres` | 60 |
| `a_valider_humain` | 164 |
| `non_publie_archive` | 507 |
| `exclu_doublon` | 83 |
| `exclu_hors_perimetre` | 58 |
| `exclu_illisible` | 6 |

**Les 507 archivés** : 177 cours et polycopiés, 135 livres et documents commerciaux, 50 peu adaptés à l'Afrique, 41 aux droits inconnus, 25 autres (business plans de tiers…), 23 mémoires et thèses, 23 incomplets, 19 droits réservés explicites, 14 d'avant 2000.

**Les 164 à valider** : 101 scans sans texte lisible (résumés de cours, pertinence très faible), 24 aux droits indéterminables, 15 avec ©, 6 avec dosages à faire relire, 6 en désaccord entre relectures, 5 de confiance faible, 4 de plus de 40 Mo, 3 CC BY-NC-SA.

## 5. Ce qui reste à faire

Dans cet ordre.

1. **Relire environ 45 documents** : les 24 aux droits indéterminables (recommandation : ne pas publier sans accord de l'auteur), les 6 dosages (relecture par quelqu'un du métier), les 6 désaccords (guides sur le riz, utiles), les 5 de confiance faible, les 4 trop lourds (compresser ou écarter). Préparer un tableau avec une colonne « publier / garder », puis régénérer l'import.
2. **Publier les 3 documents CC BY-NC-SA** encore en « à valider » (DOC-00087, 00602, 00603), maintenant que la gratuité est établie.
3. **Les 101 scans** : recommandation d'archiver sans relire. Option : OCR si on veut les exploiter.
4. **Cours et documents commerciaux** : le responsable les passe au crible. Pour ceux qu'il veut rouvrir, modifier la décision et régénérer.
5. **Droits des Agrodok, FAO et CTA** (19 + 12) : écrire à Agromisa/CTA/ISF pour obtenir l'autorisation de les héberger, ou les remplacer par des liens.
6. **Nettoyage** : les anciens dossiers `traites` (77 PDF) et `doublons` (3 PDF) sous `Bibliothèque-Agrolide` sont identiques à des documents déjà rangés et peuvent être supprimés. Les archives `.rar`/`.zip`, 2 images, 1 vidéo et 1 fichier `.enc` n'ont pas été traités.
7. **Dépôt par les membres** : le formulaire `/membres/bibliotheque/deposer` appelle des routes (`/api/bibliotheque`, `/api/bibliotheque/upload-url`) qui n'existent pas. Il ne peut pas fonctionner. À reconstruire pour que les documents déposés reçoivent aussi domaine, sujet et public.
8. **Vérifier le site** : le contenu des pages a été relu en base, mais l'affichage (filtres, cadenas « Inscrits », page d'un CC BY-NC-SA) n'a pas été contrôlé par Claude dans un navigateur. Le responsable a confirmé que les documents s'affichent.
9. **Taxonomie** : les domaines « Ressources naturelles » et « Transversal » sont des ajouts proposés, à confirmer. Antigravity a aussi laissé des propositions d'évolution dans `donnees_antigravity\rapport\propositions_taxonomie.md`.

**Pour changer une décision** : modifier `Classée\_Index\decisions_finales.json` (ou la logique de `correction-lot-public`), puis relancer `Bibliotheque-Curation\import\generer_import.py`, et suivre `import\LISEZ-MOI.md` (envoi R2, puis `documents.sql`, qui est sans doublon grâce à `reference`).

## 6. Pièges rencontrés

- **Accès Cloudflare.** Depuis la session Claude, wrangler n'a pas l'autorisation D1 (erreur 7403). Toutes les commandes sur la base ou R2 se lancent **dans le terminal du responsable**, qui est connecté. Le mode automatique de Claude bloque d'ailleurs les suppressions en masse en production.
- **`wrangler d1 export` rend la base indisponible pendant l'export** : pour sauvegarder, lire la table avec `SELECT *` plutôt.
- **Scripts PowerShell (.ps1)** : écrire les chemins sans accent, car PowerShell 5 lit mal le UTF-8 sans BOM.
- **Chaînes de migrations** : les anciennes migrations ne se rejouent pas sur une base vide. Les migrations récentes sont des fichiers SQL écrits à la main et appliqués avec `wrangler d1 execute --file`, sans passer par le journal de drizzle. La 0006 et la 0007 étaient déjà prises par le réseau : celle de la bibliothèque est la **0008**.
- **Pagination** : elle s'appuie sur `created_at`. Chaque document importé doit avoir une date distincte (le script d'import s'en charge).
- **Cache** : la page publique `/bibliotheque` est mise en cache une heure (ISR).
- **Chemins Windows** : limite de 260 caractères, d'où les noms de fichiers tronqués à 58 caractères dans `Classée`.
- **Git** : la branche `main` est utilisée dans un autre dossier de travail (`C:\Users\PC\wt-agrolide-ui`). Le dossier principal est sur `a-jour-avec-main`. Les 2 commits locaux restés sur l'ancienne `main` sont sauvegardés dans `sauvegarde-main-local`. Ne pas commiter les 174 suppressions `Bibliothèque/...`.
- **Sécurité.** `agrolide/scripts/seed-bibliotheque.mjs` contient une clé de service Supabase en clair. À régénérer si ce projet Supabase existe encore, et à supprimer du script.

## 7. Carte des fichiers

| Quoi | Où |
|---|---|
| Documents rangés + index | `Opérations\Formation\Bibliothèque-Agrolide\Classée\` (`_Index\INDEX.csv`, `decisions_finales.json`, `deplacements.csv`) |
| Sauvegarde de l'ancienne base | `Classée\_Index\sauvegarde_base_2026-11-12\` |
| Règles | `Bibliotheque-Curation\taxonomie.json`, `fiche_document.schema.json` |
| Corrections de droits | `Bibliotheque-Curation\correction-lot-public\` |
| Rangement et import | `Bibliotheque-Curation\outils\`, `Bibliotheque-Curation\import\` |
| Envoi vers R2 | `agrolide\scripts\envoyer-bibliotheque-r2.mjs` |
| Filtres et libellés dans le code | `agrolide\src\lib\bibliotheque\` (`taxonomie.ts`, `filtres.ts`), `src\components\modules\bibliotheque\` |
| Colonnes de la base | `agrolide\src\db\schema.ts`, migration `drizzle\0008_bibliotheque_classification.sql` |
