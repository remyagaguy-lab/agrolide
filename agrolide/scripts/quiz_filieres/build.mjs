// Génère src/content/filieres/quiz_banque.ts à partir des sources src_*.mjs (6 questions par leçon).
// Usage : node scripts/quiz_filieres/build.mjs  (depuis agrolide/). Positions de la bonne réponse équilibrées.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
let seed = 20261115;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
function suite(n) {
  const out = [];
  while (out.length < n) {
    const b = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    if (out.length > 1 && b[0] === out[out.length - 1] && out[out.length - 1] === out[out.length - 2]) b.push(b.shift());
    out.push(...b);
  }
  return out.slice(0, n);
}
const all = {};
for (const f of fs.readdirSync(dir).filter((f) => /^src_.+\.mjs$/.test(f)).sort()) Object.assign(all, (await import(pathToFileURL(path.join(dir, f)).href)).default);
const total = Object.values(all).reduce((s, q) => s + q.length, 0);
const pos = suite(total);
let k = 0, plusLong = 0;
const stats = [0, 0, 0, 0];
const out = {};
for (const [id, qs] of Object.entries(all)) {
  if (qs.length < 5) throw new Error(`${id} : 5 questions au moins`);
  out[id] = qs.map(([question, ok, ko, explanation]) => {
    if (ko.length !== 3) throw new Error(`3 distracteurs attendus — ${question}`);
    const p = pos[k++];
    const options = [...ko];
    options.splice(p, 0, ok);
    if (new Set(options).size !== 4) throw new Error(`options identiques — ${question}`);
    stats[p]++;
    if (options.every((o, i) => i === p || o.length < ok.length)) plusLong++;
    return { question, options, correctAnswer: p, explanation };
  });
}
console.log(`${Object.keys(out).length} leçons, ${total} questions ; positions ${stats.join(' / ')} ; bonne réponse la plus longue : ${plusLong} (${Math.round((100 * plusLong) / total)} %)`);
const ts = `// FICHIER GÉNÉRÉ par scripts/quiz_filieres/build.mjs — ne pas modifier à la main.
// Banques de quiz des modules par filière, par identifiant de leçon. Fichier serveur : ne jamais l'importer côté client
// (les bonnes réponses ne quittent le serveur qu'après correction, voir src/lib/formations/filieres-quiz.server.ts).
export type QuizQuestionFiliere = { question: string; options: string[]; correctAnswer: number; explanation: string };

export const QUIZ_FILIERES: Record<string, QuizQuestionFiliere[]> = ${JSON.stringify(out, null, 2)};
`;
const dest = path.resolve(dir, '../../src/content/filieres/quiz_banque.ts');
fs.writeFileSync(dest, ts.replace(/\n/g, '\r\n'));
console.log('écrit', dest);
