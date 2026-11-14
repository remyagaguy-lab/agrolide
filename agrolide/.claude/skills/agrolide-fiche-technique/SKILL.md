---
name: agrolide-fiche-technique
description: >
  Rédige une fiche technique vulgarisée agrolide (400 à 600 mots, pas à pas, encart « À
  retenir ») à partir d'un article agrolide ou d'un sujet déjà cadré. À utiliser quand on
  demande une fiche technique, une fiche pratique ou une fiche à télécharger. La fiche est
  toujours à valider par un référent technique avant publication.
---

<!-- GÉNÉRÉ par npm run ed:sync depuis agrolide/editorial/procedures/fiche-technique/PROCEDURE.md. Ne pas modifier ici : modifier la procédure, puis relancer la synchronisation. -->

Code témoin de cette procédure : ED-3EC44D

# Fiche technique vulgarisée

## Rôle

Rédacteur de fiches. Une fiche tient sur une page et permet de faire quelque chose : un lecteur doit pouvoir suivre les étapes sans avoir lu autre chose. Elle ne contient aucun fait qui ne soit déjà source dans l'article dont elle vient.

## Actions utilisées

Lire un fichier du dépôt, écrire un fichier du dépôt, lancer un script du dépôt (commandes `npm run ed:...` dans `agrolide/`). Si la fiche doit couvrir un sujet qui n'a pas d'article, la rédaction d'un article source passe d'abord par les procédures d'article.

## À lire avant d'écrire

Dossier `agrolide/editorial/` : `charte/11-formats.md` (fiche technique vulgarisée), `charte/06-publics-et-registres.md` (registres Terrain et Parcours), `charte/10-preuves-et-sources.md`, `charte/04-lignes-rouges.md`, `charte/03-ecriture-naturelle.md`, `charte/02-langue-et-typographie.md`, l'article source et le modèle `declinaisons/aliment-poisson-sacs-par-bassin/fiche-technique.md`.

## Le fichier

`agrolide/editorial/declinaisons/<slug>/fiche-technique.md`, avec l'en-tête :

```
format: fiche
canal: site
source: <slug de l'article>
statut: redaction
public: <producteur | technicien_conseiller | etudiant | entrepreneur_porteur_projet>
registre: Terrain | Parcours
objectif: <celui de l'article>
cta: <texte du CTA, par exemple Téléchargez le manuel ...>
cta_cible: <DOC-xxxxx ou chemin du site>
validation_technique: a faire (référent du domaine)
```

Corps :

1. Un titre `# Fiche : ...`, puis un court chapô : à quoi sert la fiche, en trois phrases au plus.
2. Intertitres `##` : pourquoi, ce qu'il faut, le calcul ou la méthode pas à pas (liste numérotée de trois étapes au moins), `## À retenir` (liste), pour aller plus loin avec le CTA unique suivi de sa ligne de lien.
3. Un bloc final `D'où ça vient :` (Terrain) ou `Sources :` (Parcours), avec les sources de l'article.

## Règles

- 400 à 600 mots. Une étape = une action. Les unités du terrain.
- Les chiffres viennent de l'article, un exemple fictif reste annoncé comme fictif.
- On réécrit : aucune suite de plus de 12 mots identique à l'article.
- Une fiche passe en `valide` ou `publie` seulement avec `validation_technique: faite par <nom>`.
- Voix du réseau, vouvoiement, aucun tiret, aucun emoji, un seul CTA.

## Contrôles à lancer avant de livrer

Depuis `agrolide/` : `npm run ed:valider -- <chemin de la fiche>` et `npm run ed:check`. Zéro erreur.
