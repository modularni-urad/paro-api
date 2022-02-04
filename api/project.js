import { TABLE_NAMES, CALL_STATUS, getQB, PROJECT_STATE } from '../consts'
const conf = {
  tablename: TABLE_NAMES.PARO_PROJECT,
  editables: ['name', 'desc', 'content', 'budget', 'photo', 'poloha']
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const _ = ctx.require('underscore')
  const entityMWBase = ctx.require('entity-api-base').default
  const MW = entityMWBase(conf, knex, ErrorClass)

  return { list, create, update, getCall, publish }

  function list (query, schema) {
    query.filter = query.filter ? JSON.parse(query.filter) : {}
    return MW.list(query, schema)
  }

  async function create (call, body, user, schema) {
    if (call.status !== CALL_STATUS.OPEN) {
      throw new ErrorClass(400, 'call not open')
    }
    MW.check_data(body)
    Object.assign(body, {
      author: user.id,
      call_id: call.id
    })
    return MW.create(body, schema)
  }

  async function getCall (callId, schema) {
    const p = await getQB(knex, TABLE_NAMES.PARO_CALL, schema).where({ id: callId })
    if (p.length === 0) throw new ErrorClass(404, 'unknown call')
    return p[0]
  }

  async function update (call, projID, body, schema) {
    const now = new Date()
    if (now > call.submission_end) throw new ErrorClass(400, 'too late')
    MW.check_data(body)
    return MW.update(projID, body, schema)
  }

  async function publish (call, projID, schema) {
    const now = new Date()
    if (now > call.submission_end) throw new ErrorClass(400, 'too late')
    return getQB(knex, TABLE_NAMES.PARO_PROJECT, schema)
      .where({ id: projID }).update({ state: PROJECT_STATE.NEW })
  }
}
