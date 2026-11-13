// Test « téléphone d'entrée de gamme + réseau lent » (règle 31 de l'audit de performance).
// Ouvre des pages dans un faux Pixel 5 avec un processeur 4 fois plus lent et un réseau 3G rapide
// (1,6 Mb/s, 150 ms d'aller-retour), puis mesure ce que voit un visiteur.
//
// Utilisation (depuis le dossier agrolide/) :
//   node scripts/test-reseau-lent.mjs                         -> site en production
//   node scripts/test-reseau-lent.mjs http://localhost:3000   -> site local
//   node scripts/test-reseau-lent.mjs https://www.agrolide.org /blog /formations
//   RESEAU=lent node scripts/test-reseau-lent.mjs             -> « 3G lente » (400 Kb/s, 400 ms)
//
// Mesures : FCP = premier contenu affiché ; LCP = plus gros élément affiché (visé : moins de 2,5 s) ;
// chargé = fin du chargement de la page ; poids = octets transférés (compressés).
import { chromium, devices } from '@playwright/test'

const args = process.argv.slice(2)
const base = (args.find((a) => a.startsWith('http')) ?? 'https://www.agrolide.org').replace(/\/$/, '')
const chemins = args.filter((a) => a.startsWith('/'))
const pages = chemins.length ? chemins : ['/', '/bibliotheque', '/evenements', '/blog', '/formations']

const RESEAUX = {
  rapide: { nom: '3G rapide (1,6 Mb/s, 150 ms)', latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 },
  lent: { nom: '3G lente (400 Kb/s, 400 ms)', latency: 400, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8 },
}
const reseau = RESEAUX[process.env.RESEAU === 'lent' ? 'lent' : 'rapide']

const secondes = (ms) => (ms == null ? '   –  ' : `${(ms / 1000).toFixed(1)} s`.padStart(6))

// Chrome installé sur l'ordinateur (sinon Edge, sinon le Chromium de Playwright).
let navigateur
for (const channel of ['chrome', 'msedge', undefined]) {
  try { navigateur = await chromium.launch({ channel }); break } catch { /* essai suivant */ }
}
if (!navigateur) throw new Error('Aucun navigateur trouvé : installer Chrome ou lancer « npx playwright install chromium ».')
console.log(`Téléphone : Pixel 5, processeur ralenti x4 — Réseau : ${reseau.nom}`)
console.log(`Site : ${base}\n`)
console.log('Page'.padEnd(18), 'FCP'.padStart(6), 'LCP'.padStart(6), 'chargé'.padStart(7), 'poids'.padStart(9))

for (const chemin of pages) {
  const contexte = await navigateur.newContext({ ...devices['Pixel 5'] })
  const page = await contexte.newPage()
  const cdp = await contexte.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Network.emulateNetworkConditions', { offline: false, ...reseau })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })

  let octets = 0
  cdp.on('Network.loadingFinished', (e) => { octets += e.encodedDataLength })

  await page.addInitScript(() => {
    window.__lcp = 0
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true })
  })

  try {
    await page.goto(base + chemin, { waitUntil: 'load', timeout: 120000 })
    await page.waitForTimeout(1500)
    const m = await page.evaluate(() => ({
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
      lcp: window.__lcp || null,
      charge: performance.getEntriesByType('navigation')[0]?.loadEventEnd ?? null,
    }))
    console.log(chemin.padEnd(18), secondes(m.fcp), secondes(m.lcp), secondes(m.charge).padStart(7), `${Math.round(octets / 1024)} Ko`.padStart(9))
  } catch (e) {
    console.log(chemin.padEnd(18), 'échec :', e.message.split('\n')[0])
  }
  await contexte.close()
}
await navigateur.close()
