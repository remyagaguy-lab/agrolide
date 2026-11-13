// Liste les questions dont la bonne réponse est la plus longue (biais à corriger) et les doublons de distracteurs.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { charger } from './charger.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
let n = 0, longues = 0;
const all = await charger();
for (const [id, qs] of Object.entries(all)) {
  qs.forEach(([q, ok, ko], i) => {
    n++;
    const mx = Math.max(...ko.map((x) => x.length));
    if (ok.length > mx) { longues++; console.log(`${id}#${i} ok=${ok.length} max=${mx} :: ${ok}`); }
  });
}
console.log(`${longues}/${n} bonnes réponses les plus longues`);
