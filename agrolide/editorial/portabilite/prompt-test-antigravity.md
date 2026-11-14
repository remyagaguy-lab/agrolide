# Test de portabilité : Antigravity lit-il AGENTS.md et les skills ?

Fichier GÉNÉRÉ par npm run ed:sync. Ne pas modifier ici : `cd agrolide && npm run ed:sync`.

Ce test ne démontre rien tant qu'il n'a pas été joué. Tant qu'il n'est pas joué avec succès, ne pas écrire qu'Antigravity lit les règles et les skills du dépôt.

## Avant de commencer

1. Mettre à jour le dossier de travail : la branche qui contient `agrolide/.agents/AGENTS.md` et `agrolide/.agents/skills/agrolide-*` doit être celle ouverte.
2. Ouvrir dans Antigravity le dossier `agrolide/` du dépôt (celui qui contient `package.json` et `.agents/`), pas le dossier parent. Les conventions de découverte partent de la racine de l'espace de travail : si `.agents/` n'est pas à la racine ouverte, le test peut échouer pour cette seule raison.
3. Ouvrir une conversation neuve (aucun historique).

## Prompt 1 : à coller tel quel

```
Réponds sans ouvrir aucun fichier et sans lancer aucune commande. Ne devine pas : si tu ne sais pas, écris « inconnu ».

1. Dans les règles du projet agrolide, existe-t-il une section sur le système éditorial ? Si oui, donne son « code témoin ».
2. Liste les skills du projet dont le nom commence par « agrolide- » et, pour chacun, son « code témoin ».
3. Dis honnêtement si tu as ouvert un fichier ou lancé une commande pour répondre.
```

Réponse attendue si Antigravity charge AGENTS.md et les skills :

| Élément | Code témoin attendu |
|---|---|
| Section Système éditorial de AGENTS.md | ED-AGENTS-7K3Q |
| agrolide-cadrage-article | ED-9DD292 |
| agrolide-redaction-article | ED-E6FCE8 |

## Prompt 2 : à coller dans la même conversation

```
Sans ouvrir de fichier : pour un article destiné à un producteur, quel registre faut-il utiliser, et quelle commande vérifie l'en-tête et la structure de l'article avant publication ?
```

Réponse attendue : registre Terrain, commande `npm run ed:valider`.

## Lire le résultat

| Constat | Conclusion | Suite |
|---|---|---|
| Tous les codes exacts, aucun fichier ouvert | AGENTS.md et les skills sont chargés dans le contexte | Noter la version d'Antigravity et la date dans `editorial/charte/00-decisions.md` |
| Codes exacts mais l'agent a ouvert des fichiers | Il sait les trouver, sans les charger d'office | Acceptable : le point d'entrée AGENTS.md suffit si l'agent le consulte. À noter |
| Codes faux, inventés ou « inconnu » | Rien n'est chargé d'office | Redemander en nommant les fichiers (« lis agrolide/.agents/AGENTS.md »). Si cela marche, l'adaptateur manque : l'ajouter dans ed:sync (autre dossier ou fichier de règles), jamais un second jeu de règles |
| L'agent invente des codes | Ne pas conclure à une lecture | Refaire le test, et signaler l'hallucination |

Un code inventé qui ressemble à un code vrai est un échec, pas une réussite. Les codes sont des empreintes : ils ne se devinent pas.
