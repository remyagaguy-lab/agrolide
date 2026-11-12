import test from 'node:test'
import assert from 'node:assert/strict'
import { classerSuggestions, profilSuffisant, scoreSuggestion, SEUIL_SUGGESTION, type CandidatPourScore, type ProfilPourScore } from './suggestions'
import { motifGlob, motsSignificatifs, normaliser } from './texte'
import { completionProfil, profilSchema } from './profil-schema'

const moi: ProfilPourScore = {
  specialite: 'Agronomie et élevage de volailles',
  thematiques: ['Élevage', 'Agritech'],
  langues: ['Français'],
  pays: 'Bénin',
  ville: 'Cotonou',
  categorie: 'professionnel',
}

const base = (id: string, extra: Partial<CandidatPourScore> = {}): CandidatPourScore => ({
  id,
  specialite: null,
  thematiques: [],
  langues: [],
  pays: null,
  ville: null,
  categorie: null,
  profilRenseigne: false,
  created_at: '2026-01-01T00:00:00.000Z',
  ...extra,
})

test('normaliser : accents, casse, apostrophes', () => {
  assert.equal(normaliser('Élevage'), 'elevage')
  assert.equal(normaliser("  Côte d’Ivoire "), "cote d'ivoire")
  assert.equal(normaliser('Œuvre'), 'oeuvre')
  assert.equal(normaliser(null), '')
})

test('motsSignificatifs : sans mots vides, pluriels ramenés au singulier', () => {
  const mots = motsSignificatifs('Élevage de volailles et des cultures')
  assert.deepEqual([...mots.keys()].sort(), ['culture', 'elevage', 'volaille'])
  assert.equal(mots.get('elevage'), 'élevage')
})

test('aucune donnée en commun : score nul et aucune raison', () => {
  const r = scoreSuggestion(moi, base('a', { pays: 'Canada', categorie: 'junior' }))
  assert.equal(r.score, 0)
  assert.deepEqual(r.raisons, [])
})

test('même pays seulement : 20 points, une raison', () => {
  const r = scoreSuggestion(moi, base('a', { pays: 'Bénin' }))
  assert.equal(r.score, 20)
  assert.equal(r.raisons.length, 1)
})

test('même ville : 25 points', () => {
  assert.equal(scoreSuggestion(moi, base('a', { pays: 'Bénin', ville: 'cotonou' })).score, 25)
})

test('même région, autre pays : 8 points, région nommée', () => {
  const r = scoreSuggestion(moi, base('a', { pays: 'Togo' }))
  assert.equal(r.score, 8)
  assert.match(r.raisons[0], /Afrique de l'Ouest/)
})

test('thématiques : insensible aux accents, plafonné à 25', () => {
  const m = { ...moi, thematiques: ['Élevage', 'Agritech', 'Commerce', 'Recherche'] }
  const r = scoreSuggestion(m, base('a', { thematiques: ['elevage', 'AGRITECH', 'Commerce', 'Recherche'] }))
  assert.equal(r.score, 25)
})

test('relations en commun : 8 chacune, plafonné à 24', () => {
  assert.equal(scoreSuggestion(moi, base('a'), 2).score, 16)
  assert.equal(scoreSuggestion(moi, base('a'), 9).score, 24)
})

test('spécialité proche : mots communs affichés avec leur graphie d’origine', () => {
  const r = scoreSuggestion(moi, base('a', { specialite: 'Elevage' }))
  assert.match(r.raisons[0], /^Spécialité proche : /)
  assert.ok(r.score > 0 && r.score <= 30)
})

test('au plus 3 raisons, les plus lourdes d’abord, jamais de score dans le texte', () => {
  const candidat = base('a', {
    specialite: 'Agronomie',
    thematiques: ['Élevage'],
    langues: ['Français'],
    pays: 'Bénin',
    ville: 'Cotonou',
    categorie: 'professionnel',
    profilRenseigne: true,
  })
  const r = scoreSuggestion(moi, candidat, 1)
  assert.equal(r.raisons.length, 3)
  assert.match(r.raisons[0], /Spécialité proche/)
  assert.match(r.raisons[1], /Même ville/)
  assert.match(r.raisons[2], /Thématique commune/)
  for (const t of r.raisons) assert.doesNotMatch(t, /\bpoints?\b|\d{2,}/)
})

test('le bonus « profil renseigné » seul ne suffit jamais à être suggéré', () => {
  const { suggeres, nouveaux } = classerSuggestions(moi, [base('a', { profilRenseigne: true })])
  assert.equal(suggeres.length, 0)
  assert.equal(nouveaux.length, 1)
  assert.deepEqual(nouveaux[0].raisons, [])
})

test('seuil : 20 points suggèrent, 19 non', () => {
  const m: ProfilPourScore = { ...moi, specialite: null, thematiques: ['Élevage', 'Agritech'] }
  // 10 + 5 (langue) + 5 (catégorie) = 20 → suggéré
  const vingt = base('v', { thematiques: ['Élevage'], langues: ['Français'], categorie: 'professionnel' })
  // 10 + 5 = 15 → pas suggéré
  const quinze = base('q', { thematiques: ['Élevage'], langues: ['Français'] })
  const { suggeres, nouveaux } = classerSuggestions(m, [quinze, vingt])
  assert.deepEqual(suggeres.map((s) => s.membre.id), ['v'])
  assert.equal(suggeres[0].score, SEUIL_SUGGESTION)
  assert.deepEqual(nouveaux.map((s) => s.membre.id), ['q'])
})

test('départage stable : score, profil renseigné, récence, identifiant', () => {
  const a = base('a', { pays: 'Bénin', created_at: '2026-01-01T00:00:00.000Z' })
  const b = base('b', { pays: 'Bénin', created_at: '2026-03-01T00:00:00.000Z' })
  const c = base('c', { pays: 'Bénin', created_at: '2026-03-01T00:00:00.000Z' })
  const d = base('d', { pays: 'Bénin', profilRenseigne: true, created_at: '2025-01-01T00:00:00.000Z' })
  const e = base('e', { pays: 'Bénin', thematiques: ['Élevage'] })
  const ordre = (liste: CandidatPourScore[]) => classerSuggestions(moi, liste).suggeres.map((s) => s.membre.id)
  assert.deepEqual(ordre([a, b, c, d, e]), ['e', 'd', 'b', 'c', 'a'])
  assert.deepEqual(ordre([e, d, c, b, a]), ['e', 'd', 'b', 'c', 'a'])
})

test('nouveaux membres : du plus récent au plus ancien', () => {
  const x = base('x', { created_at: '2026-01-01T00:00:00.000Z' })
  const y = base('y', { created_at: '2026-06-01T00:00:00.000Z' })
  assert.deepEqual(classerSuggestions(moi, [x, y]).nouveaux.map((n) => n.membre.id), ['y', 'x'])
})

test('relations en commun transmises par identifiant', () => {
  const { suggeres } = classerSuggestions(moi, [base('a')], new Map([['a', 3]]))
  assert.equal(suggeres[0].score, 24)
  assert.deepEqual(suggeres[0].raisons, ['3 relations en commun'])
})

test('profilSuffisant : deux informations au minimum', () => {
  assert.equal(profilSuffisant({ ...moi, specialite: null, thematiques: [], langues: [], pays: null }), false)
  assert.equal(profilSuffisant({ ...moi, specialite: 'Agronomie', thematiques: [], langues: [], pays: null }), false)
  assert.equal(profilSuffisant({ ...moi, specialite: 'Agronomie', thematiques: [], langues: [], pays: 'Bénin' }), true)
})

test('profilSchema : liens https uniquement, champs vides acceptés', () => {
  const ok = profilSchema.safeParse({
    prenom: 'Awa', nom: 'Kone', organisation: '', specialite: '', pays: '', ville: '', niveau_etudes: '', biographie: '',
    thematiques: ['Élevage', 'Élevage'], langues: [], linkedin_url: ' https://www.linkedin.com/in/awa ', site_web_url: '',
  })
  assert.ok(ok.success)
  if (ok.success) {
    assert.deepEqual(ok.data.thematiques, ['Élevage'])
    assert.deepEqual(ok.data.centres_interet, [])
    assert.equal(ok.data.linkedin_url, 'https://www.linkedin.com/in/awa')
  }
  for (const mauvais of ['http://exemple.org', 'javascript:alert(1)', 'exemple.org']) {
    const r = profilSchema.safeParse({
      prenom: 'Awa', nom: 'Kone', organisation: '', specialite: '', pays: '', ville: '', niveau_etudes: '', biographie: '',
      thematiques: [], langues: [], linkedin_url: '', site_web_url: mauvais,
    })
    assert.equal(r.success, false, mauvais)
  }
})

test('profilSchema : centres d’intérêt dédoublonnés, 12 au maximum', () => {
  const socle = { prenom: 'Awa', nom: 'Kone', organisation: '', specialite: '', pays: '', ville: '', niveau_etudes: '', biographie: '', thematiques: [], langues: [], linkedin_url: '', site_web_url: '' }
  const ok = profilSchema.safeParse({ ...socle, centres_interet: ['Agritech', 'Agritech', 'Commerce'] })
  assert.ok(ok.success)
  if (ok.success) assert.deepEqual(ok.data.centres_interet, ['Agritech', 'Commerce'])
  assert.equal(profilSchema.safeParse({ ...socle, centres_interet: Array.from({ length: 13 }, (_, i) => 'x' + i) }).success, false)
})

test('completionProfil : calculée sur les champs réels', () => {
  assert.equal(completionProfil({}).pourcentage, 0)
  const c = completionProfil({ prenom: 'A', nom: 'B', specialite: 'x', thematiques: '["Élevage"]', langues: '' })
  assert.equal(c.pourcentage, Math.round((4 / 13) * 100))
  assert.ok(c.manquants.includes('Langues'))
  assert.ok(!c.manquants.includes('Thématiques'))
})

test('motifGlob : classes de caractères pour casse et accents, caractères spéciaux protégés', () => {
  const m = motifGlob('élevage')
  assert.ok(m.startsWith('*[') && m.endsWith(']*'))
  assert.match(m, /\[eEéÉèÈêÊëË\]|\[eE[^\]]*\]/)
  assert.match(motifGlob('a*b'), /[*]/)
})
