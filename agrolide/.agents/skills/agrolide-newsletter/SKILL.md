---
name: agrolide-newsletter
description: >
  Rédige la newsletter courte et mensuelle du réseau agrolide à partir d'un article agrolide :
  un édito, deux ou trois rubriques brèves, un seul appel à l'action principal. À utiliser
  quand on demande la newsletter, un envoi aux membres ou une lettre d'information.
---

<!-- GÉNÉRÉ par npm run ed:sync depuis agrolide/editorial/procedures/newsletter/PROCEDURE.md. Ne pas modifier ici : modifier la procédure, puis relancer la synchronisation. -->

Code témoin de cette procédure : ED-C0FE70

# Newsletter du réseau

## Rôle

Rédacteur de la lettre du réseau. Elle donne le sentiment d'appartenance et oriente vers un seul contenu. Elle ne crée aucun fait : tout vient des articles et des pages du site.

## Actions utilisées

Lire un fichier du dépôt, écrire un fichier du dépôt, lancer un script du dépôt (commandes `npm run ed:...` dans `agrolide/`).

## À lire avant d'écrire

Dossier `agrolide/editorial/` : `charte/12-canaux.md` (newsletter : tous registres, un seul CTA principal), `charte/09-objectifs-et-cta.md`, `charte/05-promesse-et-voix.md`, `charte/03-ecriture-naturelle.md`, `charte/02-langue-et-typographie.md`, l'article source et le modèle `declinaisons/aliment-poisson-sacs-par-bassin/newsletter.md`.

## Le fichier

`agrolide/editorial/declinaisons/<slug>/newsletter.md`, avec l'en-tête :

```
format: newsletter
canal: newsletter
source: <slug de l'article>
statut: redaction
public: <un des six publics>
registre: Terrain | Parcours | Expertise | Partenariat
objectif: <celui de l'article>
cta: <texte du CTA unique>
cta_cible: /blog/<slug>
validation_technique: <reprise de l'article>
```

Corps : un titre `# ...`, une ouverture (édito en un paragraphe, 4 phrases au plus), deux ou trois rubriques `##` brèves, le paragraphe du CTA, la ligne `Lien : https://agrolide.org/blog/<slug>`, une signature collective.

## Règles

- 150 à 450 mots (proposition à valider).
- Un seul appel à l'action, celui du champ `cta`. Les autres paragraphes informent.
- Aucun emoji (la newsletter n'est pas un réseau social), aucun tiret, jamais « je », vouvoiement.
- Aucun fait ni chiffre qui ne soit dans l'article, ou dans un document de la bibliothèque publié.
- On réécrit, aucune suite de plus de 12 mots identique à l'article.

## Contrôles à lancer avant de livrer

Depuis `agrolide/` : `npm run ed:valider -- <chemin>` et `npm run ed:check`. Zéro erreur.
