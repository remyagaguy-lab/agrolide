import test from 'node:test'
import assert from 'node:assert/strict'
import { repartirEvenements, resumerExamens, resumerLivrables } from './bilan'

test('examens : ignore les tentatives non terminées, garde le meilleur score', () => {
  const r = resumerExamens([
    { fin_le: '2027-01-02', pourcent: 55, reussi: false },
    { fin_le: '2027-01-09', pourcent: 82, reussi: true },
    { fin_le: null, pourcent: null, reussi: null },
  ])
  assert.deepEqual(r, { passes: 2, meilleur: 82, reussis: 1 })
})

test('examens : aucun passage', () => {
  assert.deepEqual(resumerExamens([]), { passes: 0, meilleur: null, reussis: 0 })
})

test('livrables : compte par statut, moyenne des notes attribuées', () => {
  const r = resumerLivrables([
    { statut: 'valide', note: 16 },
    { statut: 'valide', note: 13 },
    { statut: 'a_revoir', note: 8 },
    { statut: 'soumis', note: null },
  ])
  assert.deepEqual(r, { remis: 4, valides: 2, aRevoir: 1, enAttente: 1, moyenne: 12.3 })
})

test('livrables : sans note, pas de moyenne', () => {
  assert.equal(resumerLivrables([{ statut: 'soumis', note: null }]).moyenne, null)
})

test('événements : à venir triés, passés comptés, doublons ignorés', () => {
  const now = new Date('2027-03-01T00:00:00Z')
  const e = (id: string, d: string) => ({ id, titre: id, type_evt: 'webinaire', date_debut: d })
  const r = repartirEvenements([e('b', '2027-04-01T10:00:00Z'), e('a', '2027-03-10T10:00:00Z'), e('p', '2027-02-01T10:00:00Z'), e('a', '2027-03-10T10:00:00Z')], now)
  assert.deepEqual(r.aVenir.map((x) => x.id), ['a', 'b'])
  assert.equal(r.passes, 1)
})
