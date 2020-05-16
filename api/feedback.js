import { TNAMES, CALL_STATUS } from '../consts'
import _ from 'underscore'
import { whereFilter } from 'knex-filter-loopback'

async function get (projID, query, knex) {
  Object.assign(query, { project_id: projID })
  return knex(TNAMES.PARO_FEEDBACK).where(whereFilter(query))
}

async function checkCallState (callID, knex) {
  const foundCall = await knex(TNAMES.PARO_CALL).where({ id: callID })
  const call = foundCall[0]
  if (call.status !== CALL_STATUS.VERIFICATION) {
    throw new Error('not in verification state')
  }
}

async function create (callID, projID, body, UID, knex) {
  await checkCallState(callID, knex)
  body = _.pick(body, 'message', 'status')
  const data = Object.assign({ author: UID, project_id: projID }, body)
  const res = await knex(TNAMES.PARO_FEEDBACK).returning('id').insert(data)
  return Object.assign(data, { id: res[0] })
}

async function update (callID, feedbackID, body, UID, knex) {
  await checkCallState(callID, knex)
  body = _.pick(body, 'message', 'status')
  const cond = { id: feedbackID, author: UID }
  return knex(TNAMES.PARO_FEEDBACK).where(cond).update(body)
}

export default { create, update, get }
