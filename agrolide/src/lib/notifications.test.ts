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
