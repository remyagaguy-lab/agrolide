// Génère src/db/content/bp_agricole/examen_banque.ts à partir des sources src_N.mjs (150 questions).
// Usage : node scripts/examen_bp_agricole/build.mjs  (depuis agrolide/)
// Place la bonne réponse selon une suite équilibrée (25 % par position), sans motif prévisible.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { charger } from './charger.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));

let seed = 20261114;
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
    if (out.length > 1 && b[0] === out[out.length - 1] && out[out.length - 1] === out[out.length - 2]) b.push(b.shift());
    out.push(...b);
  }
  return out.slice(0, n);
}

const all = await charger();
const total = Object.values(all).reduce((s, q) => s + q.length, 0);
if (total !== 150) throw new Error(`150 questions attendues, ${total} trouvées`);
const pos = suite(total);
let k = 0;
const stats = { pos: [0, 0, 0, 0], plusLong: 0 };
const seen = new Set();
const out = [];
for (const [mod, qs] of Object.entries(all)) {
  const m = Number(mod.replace('mod_', ''));
  qs.forEach(([question, ok, ko, explanation]) => {
    if (ko.length !== 3) throw new Error(`3 distracteurs attendus — ${question}`);
    if (seen.has(question)) throw new Error(`doublon — ${question}`);
    seen.add(question);
    const p = pos[k++];
    const options = [...ko];
    options.splice(p, 0, ok);
    if (new Set(options).size !== 4) throw new Error(`options identiques — ${question}`);
    stats.pos[p]++;
    if (options.every((o, i) => i === p || o.length < ok.length)) stats.plusLong++;
    out.push({ module: m, question, options, correctAnswer: p, explanation });
  });
}
console.log(`${out.length} questions`);
console.log('par module :', [1, 2, 3, 4, 5, 6].map((m) => out.filter((q) => q.module === m).length).join(' / '));
console.log('positions A/B/C/D :', stats.pos.join(' / '));
console.log(`bonne réponse la plus longue : ${stats.plusLong} (${Math.round((100 * stats.plusLong) / out.length)} %)`);

const ts = `// FICHIER GÉNÉRÉ par scripts/examen_bp_agricole/build.mjs — ne pas modifier à la main.
// Banque de l'examen final « Business plan agricole » : 150 questions, 30 tirées par tentative
// (5 par module, voir src/lib/formations/examen.server.ts). Ne jamais importer côté client.
export type QuestionExamen = { module: number; question: string; options: string[]; correctAnswer: number; explanation: string };

export const EXAMEN_BANQUE: QuestionExamen[] = ${JSON.stringify(out, null, 2)};
`;
const dest = path.resolve(dir, '../../src/db/content/bp_agricole/examen_banque.ts');
fs.writeFileSync(dest, ts.replace(/\n/g, '\r\n'));
console.log('écrit', dest);
