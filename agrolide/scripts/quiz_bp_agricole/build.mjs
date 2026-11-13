// Génère src/db/content/bp_agricole/quiz_banque.ts à partir des sources src_N.mjs.
// Usage : node scripts/quiz_bp_agricole/build.mjs  (depuis agrolide/)
// Place la bonne réponse selon une suite équilibrée (≈ 25 % par position), sans motif prévisible.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { charger } from './charger.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const sources = fs.readdirSync(dir).filter((f) => /^src_.+\.mjs$/.test(f)).sort();

let seed = 20261113;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
function bloc() {
  const a = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function suite(n) {
  const out = [];
  while (out.length < n) {
    const b = bloc();
    // évite trois positions identiques de suite à la jonction des blocs
    if (out.length && b[0] === out[out.length - 1] && out[out.length - 1] === out[out.length - 2]) b.push(b.shift());
    out.push(...b);
  }
  return out.slice(0, n);
}

const all = await charger();
const total = Object.values(all).reduce((s, q) => s + q.length, 0);
const pos = suite(total);
let k = 0;
const stats = { pos: [0, 0, 0, 0], plusLong: 0, n: 0 };
const out = {};
for (const [id, qs] of Object.entries(all)) {
  out[id] = qs.map(([question, ok, ko, explanation]) => {
    if (ko.length !== 3) throw new Error(`${id}: 3 distracteurs attendus — ${question}`);
    const p = pos[k++];
    const options = [...ko];
    options.splice(p, 0, ok);
    stats.pos[p]++;
    stats.n++;
    if (options.every((o, i) => i === p || o.length < ok.length)) stats.plusLong++;
    return { question, options, correctAnswer: p, explanation };
  });
}
console.log(`${Object.keys(out).length} leçons, ${stats.n} questions`);
console.log('positions A/B/C/D :', stats.pos.join(' / '));
console.log(`bonne réponse la plus longue : ${Math.round((100 * stats.plusLong) / stats.n)} %`);
for (const [id, qs] of Object.entries(out)) if (qs.length < 6) console.log('  <6 questions :', id, qs.length);

const ts = `// FICHIER GÉNÉRÉ par scripts/quiz_bp_agricole/build.mjs — ne pas modifier à la main.
// Banque de questions du parcours « Business plan agricole » : 6 questions ou plus par leçon,
// 4 tirées au hasard à chaque tentative (voir src/lib/formations/quiz.server.ts).
import { QuizQuestion } from './types';

export const QUIZ: Record<string, QuizQuestion[]> = ${JSON.stringify(out, null, 2)};
`;
const dest = path.resolve(dir, '../../src/db/content/bp_agricole/quiz_banque.ts');
fs.writeFileSync(dest, ts.replace(/\n/g, '\r\n'));
console.log('écrit', dest);
