import { TNAMES } from '../consts'
import _ from 'underscore'

export function getExisting (knex, req) {
  const cond = {
    author: req.user,
    call_id: req.params.id
  }
  return knex(TNAMES.PARO_VOTES).where(cond)
}

export async function createVote (knex, req) {
  const foundCall = await knex(TNAMES.PARO_CALL).where({ id: req.params.id })
  const call = foundCall[0]
  if (call.status !== 'voting') {
    throw new Error('not in voting state')
  }
  const existing = await getExisting(knex, req)
  const existingPositives = _.filter(existing, i => i.value > 0).length
  if (req.body.value > 0 && existingPositives >= call.positive_votes) {
    throw new Error('maximum positive votes exceeded')
  }
  const existingNegatives = _.filter(existing, i => i.value < 0).length
  if (req.body.value < 0 && existingNegatives >= call.negative_votes) {
    throw new Error('maximum negative votes exceeded')
  }
  const data = {
    author: req.user,
    call_id: req.params.id,
    proj_id: req.params.proj_id,
    value: req.body.value
  }
  return knex(TNAMES.PARO_VOTES).insert(data)
}

export async function deleteVote (knex, req) {
  const cond = {
    author: req.user,
    call_id: req.params.id,
    proj_id: req.params.proj_id
  }
  return knex(TNAMES.PARO_VOTES).where(cond).delete()
}
