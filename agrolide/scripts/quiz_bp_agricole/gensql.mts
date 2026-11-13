// Génère le SQL de mise à jour ciblée (contenu + quiz_json) des leçons du parcours, à passer à wrangler d1 execute.
import fs from 'fs';
import { parcours1 } from '../../src/db/content/bp_agricole/parcours_1';
import { parcours2 } from '../../src/db/content/bp_agricole/parcours_2';
import { parcours3 } from '../../src/db/content/bp_agricole/parcours_3';
import { parcours4 } from '../../src/db/content/bp_agricole/parcours_4';
import { parcours5 } from '../../src/db/content/bp_agricole/parcours_5';
import { parcours6 } from '../../src/db/content/bp_agricole/parcours_6';
const q = (s: string) => s.replace(/'/g, "''");
const ids = (process.argv[3] ?? '').split(',').filter(Boolean); // leçons dont on met aussi le contenu à jour
let sql = '';
for (const p of [parcours1, parcours2, parcours3, parcours4, parcours5, parcours6]) for (const l of p.lecons) {
  const sets = [`quiz_json='${q(JSON.stringify(l.quiz_json))}'`];
  if (ids.includes(l.id)) sets.push(`contenu='${q(l.contenu)}'`);
  sql += `UPDATE formation_lecons SET ${sets.join(', ')} WHERE id='${l.id}';\n`;
}
fs.writeFileSync(process.argv[2], sql);
console.log(process.argv[2], sql.length);
