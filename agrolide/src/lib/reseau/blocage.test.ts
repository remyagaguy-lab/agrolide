import test from 'node:test'
import assert from 'node:assert/strict'
import { estMotifSignalement, motifLabel, MOTIFS_SIGNALEMENT } from './blocage'

test('motifs de signalement : liste fermée de 5 codes', () => {
  assert.equal(MOTIFS_SIGNALEMENT.length, 5)
  for (const m of MOTIFS_SIGNALEMENT) assert.equal(estMotifSignalement(m.value), true)
  assert.equal(estMotifSignalement('insulte libre'), false)
  assert.equal(estMotifSignalement(undefined), false)
})

test('motifLabel : libellé connu, code inconnu rendu tel quel', () => {
  assert.equal(motifLabel('demarchage'), 'Démarchage ou publicité non sollicités')
  assert.equal(motifLabel('ancien-code'), 'ancien-code')
})
