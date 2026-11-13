// Charge les sources src_N.mjs et applique ajustements.mjs (bonnes réponses raccourcies, distracteurs rallongés).
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
  const toutes = Object.values(all).flat();
  for (const [extrait, ok, ko] of aj) {
    const trouvees = toutes.filter((q) => q[0].includes(extrait));
    if (trouvees.length !== 1) { console.log(`ERREUR « ${extrait} » : ${trouvees.length}`); continue; }
    if (ok) trouvees[0][1] = ok;
    if (ko) trouvees[0][2] = ko;
  }
  return all;
}
