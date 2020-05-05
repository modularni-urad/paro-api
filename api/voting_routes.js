import { getExisting, createVote, deleteVote } from './voting'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/:id([0-9]+)', auth.required, (req, res, next) => {
    getExisting(knex, auth.getUID(req), req.params.id)
      .then(found => {
        res.json(found)
      })
      .catch(next)
  })

  app.post('/:id([0-9]+)/:projID([0-9]+)', auth.required, JSONBodyParser, (req, res, next) => {
    const { id, projID } = req.params
    try {
      res.json(createVote(knex, auth.getUID(req), id, projID, req.body))
    } catch (err) {
      next(err)
    }
  })

  app.delete('/:id([0-9]+)/:projID([0-9]+)', auth.required, (req, res, next) => {
    deleteVote(knex, auth.getUID(req), req.params.id, req.params.projID)
      .then(info => {
        res.json(info)
      })
      .catch(next)
  })

  return app
}
