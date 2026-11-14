# Journal des décisions éditoriales

Chaque ligne est une décision prise. Pour la changer, on ajoute une nouvelle ligne datée, on ne réécrit pas l'ancienne.

## Décisions validées

| Date | Décision | Détail |
|---|---|---|
| 2026-11-14 | Tirets interdits partout | Ni tiret cadratin, ni demi-cadratin, ni trait d'union entouré d'espaces pour une incise. Utiliser la virgule, les parenthèses, les deux-points ou une nouvelle phrase. Le trait d'union des mots composés reste permis (agro-industrie, ex-nom). |
| 2026-11-14 | Listes : la feuille est la puce | Dans le design system, la puce de liste est la feuille de l'emblème (`Puce`). On écrit des listes en Markdown simple, le rendu pose la feuille. Aucun caractère de puce tapé à la main. |
| 2026-11-14 | BIFERA | Ancien nom d'agrolide. Il reste là où c'est nécessaire (historique, chronologie, anciens supports) et toujours avec la mention « ex-nom d'agrolide » ou « anciennement BIFERA ». Jamais comme nom actuel. |
| 2026-11-14 | Marque | « agrolide » toujours en minuscules, même en début de phrase. |
| 2026-11-14 | Voix du réseau | Collective, sans « je », vouvoiement du lecteur. |
| 2026-11-14 | Voix personnelle de Remyaga | Séparée de la voix du réseau (tutoiement, première personne). Skill `clone-litteraire-remyaga`, jamais mélangée à un contenu publié au nom d'agrolide. |

| 2026-11-14 | Longueur d'un article de fond | 800 à 1 500 mots. Remplace 800 à 1 200 (ancienne charte) et 900 à 1 700 (ancien skill). |
| 2026-11-14 | Typographie : le design system prime | Urbanist pour l'interface et les titres. Libre Baskerville réservée aux articles de blog, citations de témoignages et extraits de la bibliothèque. L'ancienne charte (Libre Baskerville pour tout texte courant) est écartée. |
| 2026-11-14 | Emojis | Aucun sur le site (garanti par `ds-icons.mjs`). Réseaux sociaux : quelques emojis autorisés, avec parcimonie (de 1 à 3 par publication, jamais en série, jamais en remplacement d'un mot). |
| 2026-11-14 | Tirets longs supprimés | Les tirets existants sont retirés du site, et la règle est contrôlée par `npm run ed:check`. |

## À vérifier

| Sujet | Valeur retenue | Pourquoi |
|---|---|---|
| Catégories de membres | Membre Junior, Professionnel, Partenaire, Sénior | À vérifier dans les écrans du site. |

## Écarts connus entre le site et la charte (état au 2026-11-14)

Voir le rapport du garde-fou : `npm run ed:check`.
