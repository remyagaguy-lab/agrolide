import test from 'node:test'
import assert from 'node:assert/strict'
import { carteDepuis, carteEstPublique } from './carte-publique'

const base = { prenom: 'Awa', nom: 'Koné', photo_url: null, specialite: 'Agronomie', pays: 'Bénin', secteurs_expertise: '["Élevage","Agritech","Commerce","Recherche"]' }

test('carte publique : prénom + initiale, 3 thématiques au plus', () => {
  const c = carteDepuis(base)
  assert.equal(c.nom, 'Awa K.')
  assert.deepEqual(c.thematiques, ['Élevage', 'Agritech', 'Commerce'])
  assert.equal(c.pays, 'Bénin')
})

test('carte publique : aucun champ hors tableau de visibilité', () => {
  const c = carteDepuis({ ...base, ...{ email: 'a@b.c', organisation: 'X' } } as typeof base)
  assert.deepEqual(Object.keys(c).sort(), ['nom', 'pays', 'photo_url', 'specialite', 'thematiques'])
})

test('carte publique : nom manquant, initiale accentuée', () => {
  assert.equal(carteDepuis({ ...base, prenom: null, nom: null }).nom, 'Membre agrolide')
  assert.equal(carteDepuis({ ...base, nom: 'élodie' }).nom, 'Awa É.')
})

test('carte publique : désactivée par défaut, jamais pour un profil masqué', () => {
  assert.equal(carteEstPublique({ profil_public: null, annuaire_visible: true }), false)
  assert.equal(carteEstPublique({ profil_public: false, annuaire_visible: true }), false)
  assert.equal(carteEstPublique({ profil_public: true, annuaire_visible: false }), false)
  assert.equal(carteEstPublique({ profil_public: true, annuaire_visible: null }), true)
})
