import {  TABLE_NAMES, CALL_STATUS, getQB } from '../consts.js'
const conf = {
  tablename: TABLE_NAMES.PARO_CALL,
  editables: [
    'name', 'submission_start', 'submission_end',
    'thinking_start', 'voting_start', 'voting_end',
    'minimum_support'
  ]
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const _ = ctx.require('underscore')
  const entityMWBase = ctx.require('entity-api-base').default
  const MW = entityMWBase(conf, knex, ErrorClass)

  return { list, create, update, start }

  function list (query, schema) {
    query.filter = query.filter ? JSON.parse(query.filter) : {}
    return MW.list(query, schema)
  }

  function create (body, schema) {
    MW.check_data(body)
    return MW.create(body, schema)
  }

  function update(id, body, schema) {
    MW.check_data(body)
    return MW.update(id, body, schema)
  }

  async function start (id, schema) {
    try {
      return getQB(knex, TABLE_NAMES.PARO_CALL, schema)
        .update({ status: CALL_STATUS.OPEN })
        .where({ id }).returning('*')
    } catch (err) {
      throw new ErrorClass(400, err.toString())
    }
  }
}
