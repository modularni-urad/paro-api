import { TNAMES } from '../consts'
import _ from 'underscore'

export function getExisting (knex, UID, callID) {
  const cond = { author: UID, call_id: callID }
  return knex(TNAMES.PARO_VOTES).where(cond)
}

export async function createVote (knex, UID, callID, projID, value) {
  const foundCall = await knex(TNAMES.PARO_CALL).where({ id: callID })
  const call = foundCall[0]
  if (call.status !== 'voting') {
    throw new Error('not in voting state')
  }
  const existing = await getExisting(knex, UID, callID)
  const existingPositives = _.filter(existing, i => i.value > 0).length
  if (value > 0 && existingPositives >= call.positive_votes) {
    throw new Error('maximum positive votes exceeded')
  }
  const existingNegatives = _.filter(existing, i => i.value < 0).length
  if (value < 0 && existingNegatives >= call.negative_votes) {
    throw new Error('maximum negative votes exceeded')
  }
  const data = { author: UID, call_id: callID, proj_id: projID, value }
  return knex(TNAMES.PARO_VOTES).insert(data)
}

export function deleteVote (knex, UID, callID, projID) {
  const cond = { author: UID, call_id: callID, proj_id: projID }
  return knex(TNAMES.PARO_VOTES).where(cond).delete()
}
