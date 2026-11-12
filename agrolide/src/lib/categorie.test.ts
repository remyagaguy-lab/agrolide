import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluerChangement } from './categorie'

const AUJOURDHUI = new Date('2027-03-01T10:00:00Z')

test('même catégorie : rien à faire', () => {
  assert.equal(evaluerChangement({ actuelle: 'junior', demandee: 'junior', finCotisationPayee: null, maintenant: AUJOURDHUI }).mode, 'identique')
})

test('Partenaire et Sénior passent par la validation, même pendant la gratuité', () => {
  assert.equal(evaluerChangement({ actuelle: 'passionne', demandee: 'partenaire', finCotisationPayee: null, maintenant: AUJOURDHUI }).mode, 'validation')
  assert.equal(evaluerChangement({ actuelle: 'professionnel', demandee: 'senior', finCotisationPayee: null, maintenant: AUJOURDHUI }).mode, 'validation')
})

test('pendant la gratuité, le changement libre est immédiat dans les deux sens', () => {
  assert.deepEqual(evaluerChangement({ actuelle: 'passionne', demandee: 'professionnel', finCotisationPayee: null, maintenant: AUJOURDHUI }), { mode: 'immediat', regularisationFcfa: 0, effetLe: null })
  assert.equal(evaluerChangement({ actuelle: 'professionnel', demandee: 'junior', finCotisationPayee: null, maintenant: AUJOURDHUI }).mode, 'immediat')
})

test('quitter Partenaire ou Sénior est libre', () => {
  assert.equal(evaluerChangement({ actuelle: 'partenaire', demandee: 'professionnel', finCotisationPayee: null, maintenant: AUJOURDHUI }).mode, 'immediat')
})

test('cotisation payée en cours : une montée est immédiate avec régularisation au prorata', () => {
  // Il reste 73 jours (un cinquième d'année) : (25 000 − 10 000) × 73 / 365 = 3 000
  const r = evaluerChangement({ actuelle: 'junior', demandee: 'professionnel', finCotisationPayee: '2027-05-13', maintenant: AUJOURDHUI })
  assert.deepEqual(r, { mode: 'immediat', regularisationFcfa: 3000, effetLe: null })
})

test('cotisation payée en cours : une baisse attend la prochaine échéance', () => {
  const r = evaluerChangement({ actuelle: 'professionnel', demandee: 'junior', finCotisationPayee: '2027-05-13', maintenant: AUJOURDHUI })
  assert.deepEqual(r, { mode: 'prochaine_echeance', regularisationFcfa: 0, effetLe: '2027-05-13' })
})

test('cotisation échue : le changement est immédiat, sans régularisation', () => {
  assert.deepEqual(evaluerChangement({ actuelle: 'professionnel', demandee: 'junior', finCotisationPayee: '2027-02-01', maintenant: AUJOURDHUI }), { mode: 'immediat', regularisationFcfa: 0, effetLe: null })
})

test('après validation par un administrateur, la règle de tarif s’applique', () => {
  const r = evaluerChangement({ actuelle: 'professionnel', demandee: 'senior', finCotisationPayee: '2027-05-13', dejaValide: true, maintenant: AUJOURDHUI })
  assert.equal(r.mode, 'immediat')
  assert.equal(r.regularisationFcfa, Math.round((20000 * 73) / 365))
})
