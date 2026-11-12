import test from 'node:test'
import assert from 'node:assert/strict'
import { aDesPointsCommuns, pointsCommuns } from './en-commun'
import type { ProfilPourScore } from './suggestions'

const moi: ProfilPourScore = {
  specialite: 'Agronomie et élevage de volailles',
  thematiques: ['Élevage', 'Agritech'],
  langues: ['Français', 'Anglais'],
  pays: 'Bénin',
  ville: 'Cotonou',
  categorie: 'professionnel',
}

const vide: ProfilPourScore = { specialite: null, thematiques: [], langues: [], pays: null, ville: null, categorie: null }

test('points communs : thématiques et langues sans tenir compte des accents ni de la casse', () => {
  const p = pointsCommuns(moi, { ...vide, thematiques: ['elevage', 'Commerce'], langues: ['français'] })
  assert.deepEqual(p.thematiques, ['elevage'])
  assert.deepEqual(p.langues, ['français'])
  assert.equal(p.pays, null)
  assert.equal(aDesPointsCommuns(p), true)
})

test('points communs : la ville n’est commune que si le pays l’est aussi', () => {
  assert.equal(pointsCommuns(moi, { ...vide, pays: 'Togo', ville: 'Cotonou' }).ville, null)
  const p = pointsCommuns(moi, { ...vide, pays: 'Bénin', ville: 'Cotonou' })
  assert.equal(p.pays, 'Bénin')
  assert.equal(p.ville, 'Cotonou')
})

test('points communs : profil vide ou sans rapport = aucun point commun', () => {
  const p = pointsCommuns(moi, { ...vide, thematiques: ['Commerce'], pays: 'Mali' })
  assert.equal(aDesPointsCommuns(p), false)
  assert.equal(aDesPointsCommuns(pointsCommuns(vide, vide)), false)
})

test('points communs : spécialité proche = mots significatifs partagés', () => {
  const p = pointsCommuns(moi, { ...vide, specialite: 'Agronomie tropicale' })
  assert.equal(p.specialite.length, 1)
  assert.match(p.specialite[0].toLowerCase(), /agronomie/)
})
