import test from 'node:test'
import assert from 'node:assert/strict'
import { estMasquee, limiteMasquageLues } from './notifications'

const MAINTENANT = new Date('2027-03-31T12:00:00Z')

test('limite de masquage : 30 jours avant', () => {
  assert.equal(limiteMasquageLues(MAINTENANT), '2027-03-01T12:00:00.000Z')
})

test('une notification lue de plus de 30 jours est masquée', () => {
  assert.equal(estMasquee({ lu: true, created_at: '2027-02-20T08:00:00.000Z' }, MAINTENANT), true)
})

test('une notification lue récente reste affichée', () => {
  assert.equal(estMasquee({ lu: true, created_at: '2027-03-15T08:00:00.000Z' }, MAINTENANT), false)
})

test('une notification non lue reste affichée, même ancienne', () => {
  assert.equal(estMasquee({ lu: false, created_at: '2026-01-01T00:00:00.000Z' }, MAINTENANT), false)
})

test('sans date, jamais masquée', () => {
  assert.equal(estMasquee({ lu: true, created_at: null }, MAINTENANT), false)
})

import { grouperParJour, libelleJour } from './notifications'

test('jours : aujourd’hui, hier, date longue, sans date', () => {
  const now = new Date(2027, 2, 31, 12, 0, 0)
  assert.equal(libelleJour(new Date(2027, 2, 31, 8).toISOString(), now), "Aujourd'hui")
  assert.equal(libelleJour(new Date(2027, 2, 30, 20).toISOString(), now), 'Hier')
  assert.match(libelleJour(new Date(2027, 1, 3, 9).toISOString(), now), /3 février 2027/)
  assert.equal(libelleJour(null, now), 'Plus ancien')
})

test('regroupement par jour : ordre conservé', () => {
  const now = new Date(2027, 2, 31, 12, 0, 0)
  const n = (id: string, d: Date) => ({ id, created_at: d.toISOString() })
  const g = grouperParJour([n('a', new Date(2027, 2, 31, 10)), n('b', new Date(2027, 2, 31, 9)), n('c', new Date(2027, 2, 30, 9))], now)
  assert.deepEqual(g.map((x) => [x.jour, x.items.map((i) => i.id)]), [["Aujourd'hui", ['a', 'b']], ['Hier', ['c']]])
})
