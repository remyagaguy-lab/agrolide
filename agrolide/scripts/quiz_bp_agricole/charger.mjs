// Charge toutes les sources src_N.mjs et applique ajustements.mjs (bonnes réponses raccourcies, distracteurs rallongés).
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
export async function charger() {
  const all = {};
  for (const f of fs.readdirSync(dir).filter((f) => /^src_.+\.mjs$/.test(f)).sort()) {
    Object.assign(all, (await import(pathToFileURL(path.join(dir, f)).href)).default);
  }
  const aj = (await import(pathToFileURL(path.join(dir, 'ajustements.mjs')).href)).default;
  const dis = (await import(pathToFileURL(path.join(dir, 'distracteurs.mjs')).href)).default;
  for (const [id, qs] of Object.entries(all)) qs.forEach((q, i) => {
    const k = `${id}#${i}`;
    if (aj[k]) q[1] = aj[k];
    if (dis[k]) dis[k].forEach((v, j) => { if (v) q[2][j] = v; });
  });
  for (const k of [...Object.keys(aj), ...Object.keys(dis)]) {
    const [id, i] = k.split('#');
    if (!all[id]?.[Number(i)]) throw new Error('ajustement orphelin : ' + k);
  }
  return all;
}
