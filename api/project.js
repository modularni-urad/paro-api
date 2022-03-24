import axios from 'axios'
import { TABLE_NAMES, CALL_STATUS, getQB, PROJECT_STATE } from '../consts'
const conf = {
  tablename: TABLE_NAMES.PARO_PROJECT,
  editables: ['name', 'desc', 'content', 'budget', 'photo', 'poloha']
}
const TOKEN_URL = process.env.FILESTORAGE_ACCESS_TOKEN_URL
if (!TOKEN_URL) throw new Error('env.FILESTORAGE_ACCESS_TOKEN_URL not set')

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const _ = ctx.require('underscore')
  const entityMWBase = ctx.require('entity-api-base').default
  const MW = entityMWBase(conf, knex, ErrorClass)

  return { list, create, update, getCall, publish, uploadinfo }

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
    if (call.status !== CALL_STATUS.OPEN) {
      if (call.status === CALL_STATUS.VERIFICATION && async function () {
          const p = await getQB(knex, TABLE_NAMES.PARO_PROJECT, schema).where({ id: projID })
          return p.status !== PROJECT_STATE.SUPPORTED
      }()) {
        throw new ErrorClass(400, 'cannot edit unsupported project during verifiaction')
      }
      throw new ErrorClass(400, 'call not open')
    }
    MW.check_data(body)
    return MW.update(projID, body, schema)
  }

  async function publish (call, projID, schema) {
    if (call.status !== CALL_STATUS.OPEN) {
      throw new ErrorClass(400, 'call not open')
    }
    const p = await getQB(knex, TABLE_NAMES.PARO_PROJECT, schema).where({ id: projID })
    if (p[0].state !== PROJECT_STATE.DRAFT) throw new ErrorClass(400, 'not draft')
    return getQB(knex, TABLE_NAMES.PARO_PROJECT, schema)
      .where({ id: projID }).update({ state: PROJECT_STATE.NEW })
  }

  async function uploadinfo (callID, user, schema) {
    const p = await getQB(knex, TABLE_NAMES.PARO_PROJECT, schema).where({ 
      call_id: callID,
      author: user.id
    }).first()
    const desiredPath = `paro/${callID}/${p.id}`
    const tokenUrl = TOKEN_URL.replace('{{TENANTID}}', schema)
    const req = await axios.get(tokenUrl, { paths: [ `${desiredPath}/*` ] })
    return {
      path: desiredPath,
      token: req.body
    }
  }
}
