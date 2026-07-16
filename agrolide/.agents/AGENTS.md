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
