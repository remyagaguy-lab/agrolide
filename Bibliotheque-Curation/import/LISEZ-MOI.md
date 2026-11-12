# Import des 273 documents publiés

Ordre à suivre, depuis le dossier `agrolide` (terminal où wrangler est connecté).

1. **Migration** (ajoute les colonnes, ne touche à aucune donnée)

```bash
npx wrangler d1 execute agrolide-d1 --remote --file drizzle/0008_bibliotheque_classification.sql
```

2. **Envoi des PDF vers R2** (654 Mo, reprend où il s'est arrêté si on le relance, ne supprime rien)

```bash
node --env-file=.env.local scripts/envoyer-bibliotheque-r2.mjs ../Bibliotheque-Curation/import/manifeste_upload.json
```

3. **Contrôle R2** (n'écrit rien : doit afficher « OK : les 273 fichiers sont dans R2 »)

```bash
node --env-file=.env.local scripts/envoyer-bibliotheque-r2.mjs ../Bibliotheque-Curation/import/manifeste_upload.json --verifier
```

4. **Import en base** (INSERT OR IGNORE : le relancer ne crée pas de doublons)

```bash
npx wrangler d1 execute agrolide-d1 --remote --file ../Bibliotheque-Curation/import/documents.sql
```

5. **Contrôle base** (attendu : 273 / 213 public / 60 membres)

```bash
npx wrangler d1 execute agrolide-d1 --remote --command "SELECT COUNT(*) AS total, SUM(acces='public') AS publics, SUM(acces='membres') AS membres FROM documents;"
```

6. Déployer le nouveau code (les pages lisent les nouvelles colonnes : la migration doit passer avant).

Les fichiers `documents.sql` et `manifeste_upload.json` se régénèrent avec `python -I generer_import.py` si une décision change.
