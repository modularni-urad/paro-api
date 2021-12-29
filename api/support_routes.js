import { TABLE_NAMES, CALL_STATUS, getQB } from '../consts'
import { addSupport, removeSupport } from './support'

export default (ctx, app) => {
  const { knex, auth, ErrorClass } = ctx
  const { session, required, getUID } = auth

  async function _fetchInfo (req, res, next) {
    let found = await getQB(knex, TABLE_NAMES.PARO_PROJECT, req.tenantid)
      .where({ id: req.params.pid })
    if (found.length === 0) return next(new ErrorClass(404, 'project not found'))
    req.project = found[0]
    found = await getQB(knex, TABLE_NAMES.PARO_CALL, req.tenantid)
      .where({ id: req.project.call_id })
    req.call = found[0]
    // check we are in supportable time window
    if (req.call.status !== CALL_STATUS.OPEN) {
      return next(new ErrorClass(400, 'NOT_IN_SUPPORTABLE_PHASE'))
    }
    next()
  }

  app.get('/:id([0-9]+)/:pid([0-9]+)/support', session, required, (req, res, next) => {
    const cond = { project_id: req.params.pid, author: getUID(req) }
    getQB(knex, TNAMES.PARO_SUPPORT, req.tenantid)
        .where(cond).select('created').then(info => {
      res.json(info)
    }).catch(next)
  })

  app.post('/:id([0-9]+)/:pid([0-9]+)/support', session, required, _fetchInfo, (req, res, next) => {
    addSupport(req.project, req.call, req.user, req.tenantid, knex).then(savedid => {
      res.json(savedid)
    }).catch(next)
  })

  app.delete('/:id([0-9]+)/:pid([0-9]+)/support', session, required, _fetchInfo, (req, res, next) => {
    removeSupport(req.project, req.user, req.tenantid, knex).then(removed => {
      res.json(removed)
    }).catch(next)
  })

  return app
}
