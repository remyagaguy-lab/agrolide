# Évaluations

Un jeu de briefs fixes, avec des critères mesurables, pour comparer deux agents sur le même travail et repérer une régression quand la charte, une procédure ou un script change.

## Les briefs

`briefs/<id>.json`. Six briefs, couvrant les quatre registres :

| Brief | Registre | Public |
|---|---|---|
| `01-terrain-aliment-poisson` | Terrain | producteur |
| `02-terrain-poulailler-familial` | Terrain | producteur |
| `03-terrain-manioc-technicien` | Terrain | technicien_conseiller |
| `04-parcours-plan-affaires` | Parcours | entrepreneur_porteur_projet |
| `05-expertise-etude-ingredients-benin` | Expertise | enseignant_chercheur |
| `06-partenariat-aliment-aquaculture` | Partenariat | decideur_institution |

Un brief dit ce qu'un humain dirait : le sujet, le public, l'objectif, le document à proposer en CTA. Il ne dit ni le niveau, ni le pilier, ni la catégorie, ni le plan : l'agent les décide en suivant la charte, et c'est ce qu'on compare.

## Utilisation

```bash
cd agrolide
npm run ed:eval -- --liste                                   # les briefs et leurs sorties
npm run ed:eval -- --prompt 02-terrain-poulailler-familial --agent mon-agent   # le prompt à donner à l'agent
npm run ed:eval                                              # note toutes les sorties
npm run ed:eval -- --brief 02 --agent mon-agent              # une sortie
```

Un agent écrit `sorties/<brief>/<agent>/01-cadrage.md` et `02-article.md`. Le script ne lance jamais d'agent : il note ce qui a été écrit. Pour tester Antigravity, donner le prompt, laisser l'agent écrire dans son dossier, relancer `ed:eval`.

## Les critères

Bloquants (un seul échec = ÉCHEC) :

- les deux fichiers existent ;
- `ed:check` : zéro erreur et zéro avertissement sur le cadrage et sur l'article ;
- `ed:valider` : zéro erreur sur le cadrage et sur l'article ;
- `ed:sources` : zéro erreur (liens testés avec `--en-ligne`) ;
- en-tête de l'article : public, registre, objectif, cta_cible et domaine conformes au brief, niveau parmi ceux admis, statut `redaction`, documents liés obligatoires présents ;
- l'en-tête du cadrage et celui de l'article disent les mêmes choses ;
- aucune promesse de résultat non garanti.

De qualité (comptés dans le score) : les concepts que le sujet impose, un nombre minimal de sources.

## Comparer deux agents

Quand un brief a deux sorties ou plus, le script compare chaque paire. Elles sont comparables si :

- le public, le registre, l'objectif, la cible du CTA et le domaine sont identiques ;
- le rapport entre les deux longueurs ne dépasse pas 1,6.

Le script signale aussi les écarts de niveau, de pilier et de catégorie, les documents liés en commun et les concepts trouvés. Ce que le script ne mesure pas : la clarté, la justesse, le ton. Un humain du public visé relit les textes avant toute publication.

## Ce que cela prouve, et ne prouve pas

Les contrôles prouvent qu'un texte respecte les règles mesurables. Ils ne prouvent pas que deux agents écrivent aussi bien l'un que l'autre. Les sorties de `reference/` sont des textes validés par un humain, qui servent à vérifier que les critères sont atteignables. Les sorties des autres agents sont à relire.

## Formats courts

Les posts, la fiche et la newsletter ne passent pas par les briefs : leur évaluation est le jeu modèle de `declinaisons/aliment-poisson-sacs-par-bassin/`, vérifié par `npm run ed:test`. Le test exige que huit fichiers (six posts, une fiche, une newsletter) passent `ed:valider` et `ed:check`, et il prouve que les contrôles refusent une copie de l'article, un chiffre absent de la source, un second appel à l'action, un registre que le canal n'admet pas, trop d'emojis ou de hashtags, et une fiche validée sans référent. Pour comparer deux agents sur ce format, donner la même consigne (« décline l'article <slug> ») et lancer `npm run ed:valider -- --tous`.
