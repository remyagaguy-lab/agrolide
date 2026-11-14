# Rôles

Un rôle est une mission décrite en Markdown, sans nom d'outil. Dans un outil qui sait lancer des sous-agents, il peut devenir un sous-agent. Ailleurs, on donne la même description à l'agent. La description des huit rôles est dans `ROADMAP.md` (section 5). Chaque rôle sera écrit en phase 3, un fichier par rôle.

## Format d'un fichier de rôle

```
# <Nom du rôle>

## Mission
Une phrase.

## Entrées
Ce qu'il reçoit.

## Sorties
Ce qu'il produit, dans quel fichier.

## Contrôles
Les commandes ed:* qui doivent passer avant qu'il rende sa sortie.

## Il s'arrête et demande à un humain quand
Les cas où il ne décide pas seul (validation technique, doute sur un droit, source impossible à lire).

## Il ne fait jamais
Ce qui est hors de sa mission.
```

## État

| Rôle | Fichier | État |
|---|---|---|
| Rédacteur en chef | `redacteur-en-chef.md` | Phase 3 |
| Chercheur de sources | `chercheur-de-sources.md` | Phase 3 |
| Rédacteur | `redacteur.md` | Phase 3 (aujourd'hui : procédures `agrolide-cadrage-article` et `agrolide-redaction-article`) |
| Adaptateur de canal | `adaptateur-de-canal.md` | Phase 3 |
| Relecteur éditorial | `relecteur-editorial.md` | Phase 3 |
| Vérificateur de faits | `verificateur-de-faits.md` | Phase 3 |
| Gardien de la bibliothèque | `gardien-de-la-bibliotheque.md` | Phase 6 |
| Analyste | `analyste.md` | Phase 7 |

`npm run ed:sync` ne génère rien depuis ce dossier tant qu'aucun rôle n'est écrit. La génération (sous-agents d'un outil qui en connaît) sera ajoutée avec le premier rôle.
