import { TNAMES } from '../consts'

export default (ctx) => {
  const { knex, auth } = ctx
  const app = ctx.express()

  async function _fetchInfo (req, res, next) {
    let found = await knex(TNAMES.PARO_PROJECT).where({ id: req.params.id })
    if (found.length === 0) return next(404)
    req.project = found[0]
    found = await knex(TNAMES.PARO_CALL).where({ id: req.project.call_id })
    req.call = found[0]
    // check we are in supportable time window
    const now = new Date()
    if (req.call.submission_start >= now || now > req.call.submission_end) {
      return next('NOT_IN_SUPPORTABLE_PHASE')
    }
    next()
  }

  function _tx (req, res, next) {
    knex.transaction(trx => {
      req.trx = trx
      next()
    })
  }

  app.get('/:id([0-9]+)', auth.required, (req, res, next) => {
    const cond = { project_id: req.params.id, author: req.user }
    knex(TNAMES.PARO_SUPPORT).where(cond).select('created')
      .then(info => {
        res.json(info)
        next()
      })
      .catch(next)
  })

  async function addSupport (req) {
    try {
      await knex(TNAMES.PARO_PROJECT)
        .where({ id: req.project.id })
        .increment('support_count', 1)
        .transacting(req.trx)
      const enough = req.project.support_count >= req.call.minimum_support - 1
      if (enough && req.project.state === 'new') {
        await knex(TNAMES.PARO_PROJECT)
          .where({ id: req.project.id })
          .update({ state: 'supprtd' })
          .transacting(req.trx)
      }
      const body = { project_id: req.params.id, author: req.user }
      await knex(TNAMES.PARO_SUPPORT).insert(body).transacting(req.trx)
      req.trx.commit()
      return enough ? 'supprtd' : req.project.state
    } catch (err) {
      req.trx.rollback(err)
      throw err
    }
  }

  app.post('/:id([0-9]+)', auth.required, _tx, _fetchInfo, (req, res, next) => {
    addSupport(req)
      .then(savedid => {
        res.status(201).json(savedid)
        next()
      })
      .catch(next)
  })

  async function removeSupport (req) {
    try {
      await knex(TNAMES.PARO_PROJECT)
        .where({ id: req.project.id })
        .decrement('support_count', 1)
        .transacting(req.trx)
      const cond = { project_id: req.params.id, author: req.user }
      await knex(TNAMES.PARO_SUPPORT).where(cond).del().transacting(req.trx)
      req.trx.commit()
    } catch (err) {
      req.trx.rollback(err)
      throw err
    }
  }

  app.delete('/:id([0-9]+)', auth.required, _tx, _fetchInfo, async (req, res, next) => {
    if (req.project.state !== 'new') {
      return next('ALREADY_SUPPORTED')
    }
    await removeSupport(req)
    res.send('OK')
  })

  return app
}
