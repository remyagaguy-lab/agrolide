import test from 'node:test'
import assert from 'node:assert/strict'
import { validerReponses } from './questionnaire'

const bonnes = { projet: 'oui', domaine: 'Maraîchage', objectif: 'Lever des fonds pour ma ferme', attentes: 'Un business plan complet' }

test('réponses valides, nettoyées', () => {
  const r = validerReponses({ ...bonnes, objectif: '  Lever   des fonds pour ma ferme ' })
  assert.equal(r.ok, true)
  if (r.ok) assert.equal(r.reponses.objectif, 'Lever des fonds pour ma ferme')
})
test('projet inconnu refusé', () => assert.equal(validerReponses({ ...bonnes, projet: 'peut-être' }).ok, false))
test('domaine hors liste refusé', () => assert.equal(validerReponses({ ...bonnes, domaine: 'Crypto' }).ok, false))
test('objectif trop court refusé', () => assert.equal(validerReponses({ ...bonnes, objectif: 'ok' }).ok, false))
test('attentes trop longues refusées', () => assert.equal(validerReponses({ ...bonnes, attentes: 'a'.repeat(601) }).ok, false))
test('entrée absente ou non objet refusée', () => {
  assert.equal(validerReponses(undefined).ok, false)
  assert.equal(validerReponses('x').ok, false)
})
