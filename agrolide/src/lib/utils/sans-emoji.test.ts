import test from 'node:test'
import assert from 'node:assert/strict'
import { nettoyerTextes, retirerEmojis } from './sans-emoji'

test('retire les emojis et l’espace qui les suit', () => {
  assert.equal(retirerEmojis('📅 **Date** : 15 août'), '**Date** : 15 août')
  assert.equal(retirerEmojis('Bienvenue 🎉'), 'Bienvenue')
  assert.equal(retirerEmojis('🎙️ Intervenants'), 'Intervenants')
  assert.equal(retirerEmojis('👨‍🌾 Agriculteur 🇸🇳'), 'Agriculteur')
  assert.equal(retirerEmojis('Ok ✅ fait ✔'), 'Ok fait')
})

test('garde le texte courant : accents, ponctuation, © ® ™, flèches, chiffres', () => {
  const t = 'Éléments à vérifier : 100 % © agrolide® → étape 2 #1 *gras*'
  assert.equal(retirerEmojis(t), t)
})

test('nettoie les champs texte mais pas les adresses ni les identifiants', () => {
  const sortie = nettoyerTextes({ titre: 'Atelier 🛠️', lien_inscription: 'https://x.org/?a=🙂', image_url: 'u', id: 'abc', tags: ['🍎 fruits'], n: 3 })
  assert.deepEqual(sortie, { titre: 'Atelier', lien_inscription: 'https://x.org/?a=🙂', image_url: 'u', id: 'abc', tags: ['fruits'], n: 3 })
})
