---
nom: agrolide-post-reseau
description: >
  Décline un article agrolide publié ou rédigé en posts pour les réseaux : WhatsApp, Facebook, Instagram,
  TikTok, YouTube, LinkedIn. À utiliser quand on demande un post, une légende, un script de vidéo courte ou une
  description de vidéo à partir d'un article agrolide. On réécrit pour le canal, on ne raccourcit pas l'article.
  Ne pas utiliser pour la voix personnelle de Remyaga, ni pour une newsletter ou une fiche technique.
---

# Posts pour les réseaux, à partir d'un article

## Rôle

Adaptateur de canal. Vous partez d'un article déjà rédigé et vous écrivez, pour chaque canal demandé, un texte qui a sa propre voix et qui renvoie vers l'article. Vous ne créez ni fait, ni chiffre, ni source : tout vient de l'article.

## Actions utilisées

Lire un fichier du dépôt, écrire un fichier du dépôt, lancer un script du dépôt (commandes `npm run ed:...` dans `agrolide/`). Aucune recherche sur le web n'est nécessaire : si un fait manque dans l'article, il ne va pas dans le post.

## À lire avant d'écrire

Dossier `agrolide/editorial/` :

- `charte/12-canaux.md` : le registre par défaut et les règles de chaque canal
- `charte/06-publics-et-registres.md` : un registre ne se raccourcit pas, il se réécrit
- `charte/02-langue-et-typographie.md`, `charte/03-ecriture-naturelle.md`, `charte/04-lignes-rouges.md`
- l'article source : `articles/<slug>/02-article.md`
- le modèle : les fichiers `declinaisons/aliment-poisson-sacs-par-bassin/post-*.md` (voir `modeles/README.md`). Un modèle montre un niveau, on ne recopie ni ses phrases ni ses chiffres.

## Entrée attendue

Le slug d'un article de `articles/`, et les canaux voulus (par défaut les six). Le public et le registre viennent de l'article, sauf si le canal impose un autre registre : un canal n'accepte que certains registres (voir le tableau). Dans ce cas, écrire le post dans le registre admis par le canal et choisir le public qui lui correspond.

## Le fichier

Un fichier par canal dans `agrolide/editorial/declinaisons/<slug>/` : `post-whatsapp.md`, `post-facebook.md`, `post-instagram.md`, `post-tiktok.md`, `post-youtube.md`, `post-linkedin.md`.

En-tête :

```
format: post
canal: whatsapp | facebook | instagram | tiktok | youtube | linkedin
source: <slug de l'article>
statut: redaction
public: <un des six publics>
registre: Terrain | Parcours | Expertise | Partenariat
objectif: <celui de l'article>
cta: <texte du CTA>
cta_cible: /blog/<slug>
validation_technique: <reprise de l'article>
```

Le corps contient, dans cet ordre, le texte, puis une ligne `Lien : https://agrolide.org/blog/<slug>`, puis les hashtags s'il y en a.

## Règles par canal

| Canal | Registres admis | Longueur | Hashtags | Emojis | Forme |
|---|---|---|---|---|---|
| whatsapp | Terrain | 20 à 120 mots | 0 | 2 au plus | Message court, une idée |
| facebook | Terrain, Parcours | 50 à 180 mots | 3 au plus | 3 au plus | Ton chaleureux, jamais familier à l'excès |
| instagram | Terrain, Parcours | 40 à 150 mots | 15 au plus | 3 au plus | Légende courte et incarnée |
| tiktok | Terrain, Parcours | 40 à 150 mots | 5 au plus | 3 au plus | Trois intertitres : `## Accroche`, `## Script`, `## Légende` |
| youtube | Terrain, Parcours, Expertise | 80 à 250 mots | 5 au plus | 3 au plus | Titre `# ...` de 70 caractères au plus, liens vers les autres réseaux en fin de description |
| linkedin | Expertise, Partenariat, Parcours | 100 à 260 mots | 3 au plus | 3 au plus | Première ligne de 140 caractères au plus (l'accroche) |

Les longueurs et les plafonds sont des propositions à valider (journal des décisions). Les registres admis et les règles de forme viennent de `charte/12-canaux.md`.

## Règles communes

- Voix du réseau : jamais « je », vouvoiement, « agrolide » en minuscules, aucun tiret.
- Un seul appel à l'action par post : le paragraphe qui contient le texte du champ `cta`. Le post renvoie vers l'article, il ne répète pas son CTA de document.
- Emojis : de 1 à 3, jamais accolés, jamais à la place d'un mot, jamais obligatoires.
- Aucun chiffre, aucun fait, aucune source qui ne soit dans l'article. Un chiffre garde son périmètre (pays, espèce, année).
- On réécrit : aucune suite de plus de 12 mots ne peut être identique à celle de l'article.
- Un exemple fictif de l'article reste annoncé comme fictif.
- Un contenu technique garde `validation_technique: a faire` tant que le référent n'a pas validé l'article.

## Contrôles à lancer avant de livrer

Depuis `agrolide/`, pour chaque fichier : `npm run ed:valider -- <chemin>` puis `npm run ed:check -- --fichier <chemin>` (sur l'ensemble : `npm run ed:check`). Zéro erreur. Corriger en réécrivant, pas en patchant un mot.

## Autocontrôle

- Un lecteur du public visé comprend le post sans avoir lu l'article
- Chaque canal a sa voix et ses unités : aucun post ne se lit comme l'article raccourci
- Le CTA est unique et le lien vers l'article est présent
- Aucun fait, aucun chiffre qui ne vienne de l'article
