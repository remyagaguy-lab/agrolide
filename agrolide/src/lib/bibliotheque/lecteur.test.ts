import test from 'node:test'
import assert from 'node:assert/strict'
import { choisirSimilaires, estAuBas, pageCourante, type DocSimilaire } from './lecteur'

test('pageCourante : suit le seuil', () => {
  assert.equal(pageCourante([-300, -100, 150, 400], 200, false), 3)
})

test('pageCourante : tout en bas, la dernière page est atteinte (cas 18 sur 20)', () => {
  // Les hauts des pages 19 et 20 restent sous le seuil de lecture même au bas du défilement.
  const hauts = Array.from({ length: 20 }, (_, i) => (i - 17) * 179 + 41)
  assert.equal(pageCourante(hauts, 200, false), 18)
  assert.equal(pageCourante(hauts, 200, true), 20)
})

test('estAuBas', () => {
  assert.equal(estAuBas(3014, 574, 3588), true)
  assert.equal(estAuBas(2000, 574, 3588), false)
  assert.equal(estAuBas(0, 574, 574), false)
})

const doc = (id: string, o: Partial<DocSimilaire> = {}): DocSimilaire => ({ id, titre: id, type_doc: 'guide', thematique: 'autre', published_at: '2027-01-01', ...o })

test('similaires : exclut le courant et les doublons, classe par proximité', () => {
  const courant = { id: 'c', thematique: 'finance', domaine: 'agroeconomie', sous_domaine: 'bp' }
  const res = choisirSimilaires(courant, [
    doc('c', { domaine: 'agroeconomie', sous_domaine: 'bp' }),
    doc('a', { domaine: 'agroeconomie' }),
    doc('b', { domaine: 'agroeconomie', sous_domaine: 'bp' }),
    doc('b', { domaine: 'agroeconomie', sous_domaine: 'bp' }),
    doc('d', { thematique: 'finance' }),
    doc('e', { domaine: 'agroeconomie', published_at: '2027-02-01' }),
  ])
  assert.deepEqual(res.map((d) => d.id), ['b', 'e', 'a', 'd'])
})

test('similaires : complète avec les plus récents si trop peu ressemblent', () => {
  const courant = { id: 'c', thematique: 'x', domaine: 'y', sous_domaine: null }
  const res = choisirSimilaires(courant, [doc('p', { domaine: 'y' }), doc('q', { published_at: '2027-05-01' }), doc('r', { published_at: '2027-03-01' })], 10, 3)
  assert.deepEqual(res.map((d) => d.id), ['p', 'q', 'r'])
})

test('similaires : respecte le maximum', () => {
  const courant = { id: 'c', thematique: 'x', domaine: 'y' }
  const tous = Array.from({ length: 20 }, (_, i) => doc(`d${i}`, { domaine: 'y' }))
  assert.equal(choisirSimilaires(courant, tous, 8).length, 8)
})
