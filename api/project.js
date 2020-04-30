import { whereFilter } from 'knex-filter-loopback'
import { TNAMES } from '../consts'
import _ from 'underscore'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/', (req, res, next) => {
    knex(TNAMES.PARO_PROJECT).where(whereFilter(req.query)).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  const editables = ['name', 'desc', 'content', 'budget', 'total', 'photo']

  async function createProject (req) {
    const call = await knex(TNAMES.PARO_CALL).where({ id: req.params.id })
    if (call.length === 0) throw new Error(404)
    const now = new Date()
    if (now > call[0].submission_end) throw new Error('too late')
    req.body = _.pick(req.body, editables)
    Object.assign(req.body, { author: req.user, call_id: req.params.id })
    const prj = await knex(TNAMES.PARO_PROJECT).returning('id').insert(req.body)
    return prj
  }

  app.post('/:id([0-9]+)', auth.required, JSONBodyParser, (req, res, next) => {
    createProject(req).then(createdid => (res.json(createdid))).catch(next)
  })

  async function updateProject (req) {
    const getProject = knex(TNAMES.PARO_PROJECT).where({ id: req.params.id })
    const proj = await getProject
    if (!proj.length) throw new Error(404)
    const call = await knex(TNAMES.PARO_CALL).where({ id: proj[0].call_id })
    if (!call.length) throw new Error(404)
    const now = new Date()
    if (now > call[0].submission_end) throw new Error('too late')
    req.body = _.pick(req.body, editables)
    const op = await getProject.update(req.body)
    return op
  }

  app.put('/:id([0-9]+)', auth.required, JSONBodyParser, (req, res, next) => {
    updateProject(req).then(val => (res.json(val))).catch(next)
  })

  return app
}
