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
const VERSION = 'v1'
const PAGES = `ag-pages-${VERSION}`
const STATIQUE = 'ag-static' // fichiers à empreinte : jamais obsolètes, conservés d'une version à l'autre
const IMAGES = 'ag-images' // logo, couvertures, photos : affichées hors ligne comme en ligne
const OFFLINE = '/hors-ligne'
const MAX_PAGES = 40
const MAX_STATIQUE = 400

/** Pages gardées pour la lecture hors ligne (chemin exact, sans paramètres). */
const PAGES_GARDEES = [/^\/hors-ligne$/, /^\/membres\/bibliotheque\/hors-ligne$/, /^\/membres\/bibliotheque\/[\w-]+\/lire$/]
const estGardee = (chemin) => PAGES_GARDEES.some((r) => r.test(chemin))
const cle = (url) => new Request(url.origin + url.pathname.replace(/(.)\/$/, '$1'))

async function elaguer(nom, max) {
  const cache = await caches.open(nom)
  const cles = await cache.keys()
  await Promise.all(cles.slice(0, Math.max(0, cles.length - max)).map((k) => cache.delete(k)))
}

const MOTIF_FICHIER = /(?:\/_next\/)?static\/(?:chunks|css|media)\/[\w\-~.%[\]]+\.(?:js|css|woff2)/g
const fichiersCites = (texte) => [...texte.matchAll(MOTIF_FICHIER)].map((m) => '/_next/' + m[0].replace(/^\/_next\//, ''))

/**
 * Fichiers JS / CSS / polices cités par une page (balises <script>, <link>, données Next), mis en cache avec elle.
 * Un fichier JS cite à son tour ceux qu'il charge à la demande (Turbopack : fichiers d'icônes, de la liseuse…) :
 * on suit ces renvois sur trois niveaux, avec un plafond, pour que la page s'ouvre complète sans réseau.
 */
async function garderFichiers(html) {
  const cache = await caches.open(STATIQUE)
  const vus = new Set()
  let niveau = new Set(fichiersCites(html))
  let restant = 150
  for (let profondeur = 0; profondeur < 3 && niveau.size && restant > 0; profondeur++) {
    const suivant = new Set()
    await Promise.all(
      [...niveau].map(async (u) => {
        if (vus.has(u) || restant <= 0) return
        vus.add(u)
        restant--
        try {
          let r = await cache.match(u)
          if (!r) {
            const net = await fetch(u)
            if (!net.ok) return
            await cache.put(u, net.clone())
            r = net
          }
          if (u.endsWith('.js')) for (const c of fichiersCites(await r.clone().text())) if (!vus.has(c)) suivant.add(c)
        } catch {}
      }),
    )
    niveau = suivant
  }
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
        const r = await fetch(OFFLINE, { credentials: 'same-origin' })
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
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  const p = url.pathname
  // Jamais de cache pour les API, l'authentification, l'administration : le navigateur et le réseau décident seuls.
  if (p.startsWith('/api/') || p.startsWith('/auth/') || p.startsWith('/admin') || p === '/login' || p === '/logout') return

  if (req.mode === 'navigate') {
    event.respondWith(navigation(event, req, url))
    return
  }
  if (p.startsWith('/_next/static/')) {
    event.respondWith(cacheDAbord(req))
    return
  }
  if (p === '/pdf.worker.min.js') {
    event.respondWith(revalider(event, req, STATIQUE))
    return
  }
  if (p === '/_next/image' || req.destination === 'image') {
    event.respondWith(revalider(event, req, IMAGES))
    return
  }
  // Page gardée demandée par le code de l'application (préparation hors ligne, déplacement RSC) : on garde la copie réseau.
  if (estGardee(p) && !req.headers.get('RSC')) {
    event.respondWith(navigation(event, req, url))
    return
  }
})

async function navigation(event, req, url) {
  const chemin = url.pathname.replace(/(.)\/$/, '$1')
  try {
    const r = await fetch(req)
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
  // Les fichiers de /_next/static portent un nom à empreinte : le contenu ne change jamais. Le navigateur peut ajouter
  // un paramètre de version (?dpl=…) au chargement : on l'ignore pour retrouver la copie gardée depuis la page.
  const cache = await caches.open(STATIQUE)
  const deja = await cache.match(req, { ignoreSearch: true })
  if (deja) return deja
  const r = await fetch(req)
  if (r.ok) await cache.put(new URL(req.url).origin + new URL(req.url).pathname, r.clone())
  return r
}

async function revalider(event, req, nom) {
  const cache = await caches.open(nom)
  const deja = await cache.match(req)
  const enLigne = fetch(req).then((r) => {
    if (r.ok) cache.put(req, r.clone()).then(() => elaguer(nom, nom === IMAGES ? 80 : MAX_STATIQUE))
    return r
  })
  if (deja) {
    event.waitUntil(enLigne.catch(() => {}))
    return deja
  }
  return enLigne
}
