import test from 'node:test'
import assert from 'node:assert/strict'
import { decideInvitation } from './invitation'

const moi = 'moi'
const lui = 'lui'
const ligne = (requester_id: string, status: string) => ({ id: 'c1', requester_id, receiver_id: requester_id === moi ? lui : moi, status })

test('crée quand rien n’existe', () => {
  assert.deepEqual(decideInvitation(undefined, moi), { action: 'creer' })
})
test('traite mon invitation en attente comme déjà envoyée (pas d’erreur, pas de doublon)', () => {
  assert.deepEqual(decideInvitation(ligne(moi, 'pending'), moi), { action: 'deja_envoyee', id: 'c1' })
})
test('traite mon invitation refusée comme déjà envoyée (il la voit « en attente »)', () => {
  assert.deepEqual(decideInvitation(ligne(moi, 'rejected'), moi), { action: 'deja_envoyee', id: 'c1' })
})
test('remplace l’invitation que j’ai ignorée', () => {
  assert.deepEqual(decideInvitation(ligne(lui, 'rejected'), moi), { action: 'remplacer', id: 'c1' })
})
test('dit précisément quand il m’a déjà invité(e)', () => {
  const d = decideInvitation(ligne(lui, 'pending'), moi)
  assert.equal(d.action, 'refuser')
  assert.match(d.action === 'refuser' ? d.message : '', /déjà invité/)
})
test('dit précisément quand nous sommes déjà connectés', () => {
  const d = decideInvitation(ligne(moi, 'accepted'), moi)
  assert.match(d.action === 'refuser' ? d.message : '', /déjà connecté/)
})
test('remplace une ligne au statut inconnu au lieu de bloquer', () => {
  assert.deepEqual(decideInvitation(ligne(moi, 'declined'), moi), { action: 'remplacer', id: 'c1' })
  assert.deepEqual(decideInvitation(ligne(lui, 'blocked'), moi), { action: 'remplacer', id: 'c1' })
})
