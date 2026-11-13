import test from 'node:test'
import assert from 'node:assert/strict'
// @ts-ignore : node:sqlite n'a pas encore de types dans cette version de @types/node
import { DatabaseSync } from 'node:sqlite'
import { diagnostiquerCode, genererCode, MESSAGES_CODE, normaliserCode } from './code-acces'

const MAINTENANT = '2026-11-13T10:00:00.000Z'
const libre = { utilise_par: null, formation_id: null, expire_le: null }

test('code valide (toutes formations)', () => {
  assert.deepEqual(diagnostiquerCode(libre, 'f1', MAINTENANT), { ok: true })
})
test('code valide pour la formation visée', () => {
  assert.deepEqual(diagnostiquerCode({ ...libre, formation_id: 'f1' }, 'f1', MAINTENANT), { ok: true })
})
test('code inconnu', () => {
  assert.deepEqual(diagnostiquerCode(undefined, 'f1', MAINTENANT), { ok: false, erreur: MESSAGES_CODE.inconnu })
})
test('code déjà utilisé', () => {
  assert.deepEqual(diagnostiquerCode({ ...libre, utilise_par: 'u1' }, 'f1', MAINTENANT), { ok: false, erreur: MESSAGES_CODE.utilise })
})
test('code expiré', () => {
  assert.deepEqual(diagnostiquerCode({ ...libre, expire_le: '2026-11-01T00:00:00.000Z' }, 'f1', MAINTENANT), { ok: false, erreur: MESSAGES_CODE.expire })
})
test('code d’une autre formation', () => {
  assert.deepEqual(diagnostiquerCode({ ...libre, formation_id: 'f2' }, 'f1', MAINTENANT), { ok: false, erreur: MESSAGES_CODE.autre_formation })
})
test('normalisation et format généré', () => {
  assert.equal(normaliserCode(' agro-ab12 cd34 '), 'AGRO-AB12CD34')
  assert.match(genererCode(), /^AGRO-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/)
})

// Même requête conditionnelle que consommerCode (acces.server.ts) : « UPDATE … WHERE utilise_par IS NULL ».
// SQLite exécute chaque UPDATE de façon atomique : le second appel ne trouve plus de ligne libre.
test('double usage : un seul des deux gagne', () => {
  const bd = new DatabaseSync(':memory:')
  bd.exec('CREATE TABLE codes (id TEXT, code TEXT, formation_id TEXT, expire_le TEXT, utilise_par TEXT)')
  bd.prepare('INSERT INTO codes VALUES (?,?,?,?,?)').run('1', 'AGRO-AAAA-BBBB', null, null, null)
  const prendre = (u: string) =>
    bd
      .prepare(
        'UPDATE codes SET utilise_par = ? WHERE code = ? AND utilise_par IS NULL AND (formation_id IS NULL OR formation_id = ?) AND (expire_le IS NULL OR expire_le > ?) RETURNING id',
      )
      .all(u, 'AGRO-AAAA-BBBB', 'f1', MAINTENANT).length
  const resultats = [prendre('u1'), prendre('u2')]
  assert.deepEqual(resultats, [1, 0])
  assert.equal((bd.prepare('SELECT utilise_par FROM codes').get() as { utilise_par: string }).utilise_par, 'u1')
})
