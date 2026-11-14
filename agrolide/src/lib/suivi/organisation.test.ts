import test from 'node:test'
import assert from 'node:assert/strict'
import { AGROLIDE_ID, estOrganisation } from './organisation'

test('le compte agrolide et les partenaires sont des organisations', () => {
  assert.equal(estOrganisation(AGROLIDE_ID, null), true)
  assert.equal(estOrganisation('x', 'Partenaire'), true)
  assert.equal(estOrganisation('x', ' partenaire '), true)
})

test('les autres profils ne se suivent pas', () => {
  assert.equal(estOrganisation('x', 'senior'), false)
  assert.equal(estOrganisation('x', null), false)
  assert.equal(estOrganisation(null, undefined), false)
})
