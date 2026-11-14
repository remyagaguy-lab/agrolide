# Chantier : import de documents sans doublon

Statut : à concevoir. Aucun code écrit. Ce document fixe la réflexion avant de développer.

## Constat dans le dépôt et la bibliothèque

- Le formulaire `/membres/bibliotheque/deposer` appelle `/api/bibliotheque` et `/api/bibliotheque/upload-url`, qui n'existent pas. Il ne peut pas fonctionner (note `Bibliotheque-Curation/POINT-ET-SUITE.md`, point 7). On construit l'import avec la détection dès le départ.
- La table `documents` n'a aucune empreinte de fichier. Seul `reference` (DOC-00001) est unique.
- Le classement de la bibliothèque a déjà produit ce qu'il faut : `INDEX.csv` contient un `sha256` pour les 1 091 documents du corpus (publiés, archivés, exclus), et la fiche de curation définit les types de doublon (`copie_exacte`, `copie_quasi_identique`, `version_anterieure`, `fragment`, `traduction`, `extrait`) et un `groupe_doublon_id`.
- Preuve que l'empreinte exacte ne suffit pas : DOC-00085 « La pisciculture à petite échelle en eau douce (Agrodok 15) » et DOC-00188 « La pisciculture à petite échelle en eau douce » ont les mêmes auteurs, la même année et le même titre à la mention près, et aucun n'est marqué doublon. À vérifier.

## Quatre niveaux de détection

| Niveau | Ce qui est comparé | Attrape | Réponse |
|---|---|---|---|
| 1. Fichier identique | SHA-256 des octets, calculé dans le navigateur avant l'envoi | Le même fichier déposé deux fois | Rejet immédiat, avant de stocker quoi que ce soit, avec lien vers le document existant |
| 2. Contenu identique | SHA-256 du texte extrait et normalisé (minuscules, espaces, numéros de page retirés) | Le même document réenregistré, converti de Word en PDF, compressé | Rejet automatique, lien vers l'existant |
| 3. Même publication | DOI, ISBN, URL d'origine, sinon titre normalisé plus premier auteur plus année | Un autre fichier de la même publication | File de modération, comparaison côte à côte |
| 4. Quasi-doublon | Similarité de texte par empreintes de séquences de mots (SimHash ou MinHash), seuil à calibrer | Nouvelle édition, extrait, fragment, scan d'un autre exemplaire | File de modération, avec le type de doublon proposé |

Principe : rejeter automatiquement seulement ce qui est certain (niveaux 1 et 2). Pour les niveaux 3 et 4, une personne décide, car une version plus récente, une traduction ou un extrait peuvent être légitimes. Une traduction se rattache à son original par le même `groupe_doublon_id`.

## Ce qu'il faut stocker

Nouvelle migration (la suivante après `0018`) :

- sur `documents` : `sha256` (index unique), `sha256_texte`, `titre_normalise`, `identifiant_externe` (DOI, ISBN), `url_source`, `groupe_doublon_id`, `role_doublon`
- nouvelle table `empreintes_connues` : `sha256`, `reference`, `decision`, `document_id` nullable. Elle contient aussi les documents archivés et exclus, absents de `documents`. Un fichier déjà examiné et refusé pour droits réservés est reconnu au dépôt suivant

Remplissage initial : `INDEX.csv` pour les empreintes de fichier, un script de calcul pour les empreintes de texte.

Le stockage R2 peut utiliser le SHA-256 dans la clé du fichier : le même contenu ne peut physiquement pas être stocké deux fois.

## Parcours de dépôt

1. Le membre choisit un fichier. Le navigateur calcule le SHA-256 (Web Crypto) et interroge `/api/bibliotheque/verifier` avant tout envoi.
2. Si le fichier est connu : message clair avec le lien vers le document, et deux actions (l'ajouter à ses favoris, signaler une erreur sur sa fiche). Aucune donnée envoyée.
3. Sinon : envoi vers R2 par URL signée, puis extraction du texte, niveaux 2 à 4 et validation automatique existante (`/api/documents/validate`).
4. Doublon probable : dossier en attente de modération avec comparaison. Nouveau document : modération habituelle (droits, pertinence).

Un index unique sur `sha256` garantit qu'aucun dépôt simultané ne passe deux fois.

## Au passage

- Le même contrôle sert l'import en masse : un script compare les fichiers locaux au registre et liste ceux qui ne sont pas encore hébergés.
- Pour un message au déposant, ne pas révéler le contenu d'un document archivé : « déjà examiné » suffit.

## Ordre de réalisation proposé

1. Migration et remplissage de `empreintes_connues` depuis `INDEX.csv`.
2. Route de vérification et calcul d'empreinte dans le formulaire.
3. Routes d'envoi manquantes (`upload-url`), avec rejet des niveaux 1 et 2.
4. Niveaux 3 et 4 et écran de modération.
5. Rattachement article et document (table `articles_documents`) pour afficher « Pour approfondir » et « Articles liés ».

## À décider

- Seuil de similarité du niveau 4 (à calibrer sur les 83 doublons déjà identifiés).
- Qui modère les doublons probables.
- Un membre peut-il proposer une version plus récente d'un document existant (remplacement) ?
