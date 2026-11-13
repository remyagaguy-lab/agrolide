// Réaligne duree_minutes sur la longueur réelle : lecture à 200 mots/min + 2 min de quiz (+ 20 min si la leçon contient un exercice).
// Usage : npx tsx scripts/quiz_bp_agricole/durees.mts <fichier.sql>   (réécrit aussi les parcours_*.ts)
import fs from 'fs';
import { parcours1 } from '../../src/db/content/bp_agricole/parcours_1';
import { parcours2 } from '../../src/db/content/bp_agricole/parcours_2';
import { parcours3 } from '../../src/db/content/bp_agricole/parcours_3';
import { parcours4 } from '../../src/db/content/bp_agricole/parcours_4';
import { parcours5 } from '../../src/db/content/bp_agricole/parcours_5';
import { parcours6 } from '../../src/db/content/bp_agricole/parcours_6';
const ps = [parcours1, parcours2, parcours3, parcours4, parcours5, parcours6];
let sql = '', total = 0;
ps.forEach((p, k) => {
  const f = `src/db/content/bp_agricole/parcours_${k + 1}.ts`;
  let s = fs.readFileSync(f, 'utf8');
  for (const l of p.lecons) {
    const mots = l.contenu.replace(/[|>#*_`-]+/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
    const d = Math.ceil(mots / 200) + (l.quiz_json.length ? 2 : 0) + (l.contenu.includes('### Exercice') ? 20 : 0);
    total += d;
    console.log(l.id, mots, 'mots ->', d, 'min (avant', l.duree_minutes + ')');
    s = s.replace(new RegExp(`(id: "${l.id}",\r?\n\s*titre: "[^\n]*\r?\n\s*duree_minutes: )\d+`), `$1${d}`);
    sql += `UPDATE formation_lecons SET duree_minutes=${d} WHERE id='${l.id}';\n`;
  }
  fs.writeFileSync(f, s);
});
fs.writeFileSync(process.argv[2], sql);
console.log('total', total, 'min =', (total / 60).toFixed(1), 'h');
