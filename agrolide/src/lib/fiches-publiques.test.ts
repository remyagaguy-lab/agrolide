import test from 'node:test'
import assert from 'node:assert/strict'
import { ficheMembre } from './fiches-publiques'

test('une fiche publique a son équivalent dans l’espace membre', () => {
  assert.equal(ficheMembre('/formations/abc'), '/membres/formations/abc')
  assert.equal(ficheMembre('/bibliotheque/abc'), '/membres/bibliotheque/abc')
  assert.equal(ficheMembre('/bibliotheque/abc/lire'), '/membres/bibliotheque/abc/lire')
  assert.equal(ficheMembre('/evenements/abc/'), '/membres/evenements/abc')
  assert.equal(ficheMembre('/annuaire/abc'), '/membres/annuaire/abc')
})

test('les listes, le mode lecture hors bibliothèque et les autres pages restent publics', () => {
  assert.equal(ficheMembre('/formations'), null)
  assert.equal(ficheMembre('/annuaire'), null)
  assert.equal(ficheMembre('/evenements/abc/lire'), null)
  assert.equal(ficheMembre('/blog/un-article'), null)
  assert.equal(ficheMembre('/membres/formations/abc'), null)
  assert.equal(ficheMembre('/formations/abc/autre'), null)
})
