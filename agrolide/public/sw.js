/*
 * Service worker d'agrolide (écrit à la main, versionné : Next 16 construit avec Turbopack, que l'ancien plugin
 * next-pwa ne sait pas gérer, il ne produisait aucun service worker en production).
 *
 * Ce qu'il fait, et seulement cela :
 *  1. page de repli « Vous êtes hors ligne » quand une navigation échoue sans réseau ;
 *  2. garde en cache les pages nécessaires à la lecture hors ligne (Documents hors ligne, page de lecture d'un document)
 *     avec leur code, pour que la liseuse s'ouvre en mode avion ;
 *  3. cache les fichiers versionnés de /_next/static (immuables) et le worker de pdf.js.
 *
 * Ce qu'il ne fait JAMAIS : toucher à /api/*, /auth/*, /login, /admin, aux requêtes POST ou aux autres domaines ;
 * aucune donnée privée (profil, messages, réponses d'API) n'est mise en cache. Seules les pages ci-dessous le sont,
 * et leur cache est vidé à la déconnexion (voir src/lib/bibliotheque/hors-ligne.ts).
 * Mise à jour : ce fichier change → le nouveau worker s'installe, prend la main tout de suite et supprime les anciens caches.
 */
/* TEST-TEMPORAIRE */ let SIM=false; const reseau=(r)=>SIM?Promise.reject(new TypeError('simule')):fetch(r); self.addEventListener('message',(e)=>{if(e.data&&e.data.sim!==undefined)SIM=!!e.data.sim; if(e.source)e.source.postMessage({sim:SIM})});
const VERSION = 'v1'
const PAGES = `ag-pages-${VERSION}`
const STATIQUE = 'ag-static' // fichiers à empreinte : jamais obsolètes, conservés d'une version à l'autre
const OFFLINE = '/hors-ligne'
const MAX_PAGES = 40
const MAX_STATIQUE = 200

/** Pages gardées pour la lecture hors ligne (chemin exact, sans paramètres). */
const PAGES_GARDEES = [/^\/hors-ligne$/, /^\/membres\/bibliotheque\/hors-ligne$/, /^\/membres\/bibliotheque\/[\w-]+\/lire$/]
const estGardee = (chemin) => PAGES_GARDEES.some((r) => r.test(chemin))
const cle = (url) => new Request(url.origin + url.pathname.replace(/(.)\/$/, '$1'))

async function elaguer(nom, max) {
  const cache = await caches.open(nom)
  const cles = await cache.keys()
  await Promise.all(cles.slice(0, Math.max(0, cles.length - max)).map((k) => cache.delete(k)))
}

/** Fichiers JS / CSS / polices cités par une page (balises <script>, <link> et données Next), mis en cache avec elle. */
async function garderFichiers(html) {
  const trouves = new Set()
  for (const m of html.matchAll(/(?:\/_next\/)?static\/(?:chunks|css|media)\/[\w\-~.%[\]]+\.(?:js|css|woff2)/g)) {
    trouves.add('/_next/' + m[0].replace(/^\/_next\//, ''))
  }
  const cache = await caches.open(STATIQUE)
  await Promise.all(
    [...trouves].map(async (u) => {
      if (await cache.match(u)) return
      try {
        const r = await reseau(u)
        if (r.ok) await cache.put(u, r)
      } catch {}
    }),
  )
  await elaguer(STATIQUE, MAX_STATIQUE)
}

async function garderPage(url, reponse) {
  const copie = reponse.clone()
  const cache = await caches.open(PAGES)
  await cache.put(cle(url), reponse.clone())
  await elaguer(PAGES, MAX_PAGES)
  await garderFichiers(await copie.text())
}

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    (async () => {
      try {
        const r = await reseau(OFFLINE, { credentials: 'same-origin' })
        if (r.ok) await garderPage(new URL(OFFLINE, self.location.origin), r)
      } catch {}
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const nom of await caches.keys()) {
        if (nom.startsWith('ag-pages-') && nom !== PAGES) await caches.delete(nom)
        // Anciens caches du plugin Workbox (start-url, pages, apis…) : ils pouvaient contenir des pages privées.
        else if (!nom.startsWith('ag-')) await caches.delete(nom)
      }
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (SIM && req.method==='GET' && new URL(req.url).origin===self.location.origin && !req.url.includes('/sw.js')) { /* laisse la suite décider */ }
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  const p = url.pathname
  // Jamais de cache pour les API, l'authentification, l'administration : le navigateur et le réseau décident seuls.
  if (p.startsWith('/api/') || p.startsWith('/auth/') || p.startsWith('/admin') || p === '/login' || p === '/logout') { if (SIM) event.respondWith(Response.error()); return }

  if (req.mode === 'navigate') {
    event.respondWith(navigation(event, req, url))
    return
  }
  if (p.startsWith('/_next/static/')) {
    event.respondWith(cacheDAbord(req))
    return
  }
  if (p === '/pdf.worker.min.js') {
    event.respondWith(revalider(event, req))
    return
  }
  // Page gardée demandée par le code de l'application (préparation hors ligne, déplacement RSC) : on garde la copie réseau.
  if (estGardee(p) && !req.headers.get('RSC')) {
    event.respondWith(navigation(event, req, url))
    return
  }
  if (SIM) event.respondWith(Response.error())
})

async function navigation(event, req, url) {
  const chemin = url.pathname.replace(/(.)\/$/, '$1')
  try {
    const r = await reseau(req)
    if (r.ok && !r.redirected && r.type === 'basic' && estGardee(chemin) && (r.headers.get('content-type') || '').includes('text/html')) {
      event.waitUntil(garderPage(url, r.clone()).catch(() => {}))
    }
    return r
  } catch {
    const cache = await caches.open(PAGES)
    const copie = await cache.match(cle(url))
    if (copie) return copie
    if (req.mode === 'navigate') return (await cache.match(cle(new URL(OFFLINE, self.location.origin)))) || Response.error()
    return Response.error()
  }
}

async function cacheDAbord(req) {
  const cache = await caches.open(STATIQUE)
  const deja = await cache.match(req)
  if (deja) return deja
  const r = await reseau(req)
  if (r.ok) await cache.put(req, r.clone())
  return r
}

async function revalider(event, req) {
  const cache = await caches.open(STATIQUE)
  const deja = await cache.match(req)
  const enLigne = reseau(req).then((r) => {
    if (r.ok) cache.put(req, r.clone())
    return r
  })
  if (deja) {
    event.waitUntil(enLigne.catch(() => {}))
    return deja
  }
  return enLigne
}
