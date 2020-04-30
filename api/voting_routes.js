import { getExisting, createVote, deleteVote } from './voting'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/:id([0-9]+)', auth.required, (req, res, next) => {
    getExisting(knex, req)
      .then(found => {
        res.json(found)
      })
      .catch(next)
  })

  app.post('/:id([0-9]+)/:proj_id([0-9]+)', auth.required, JSONBodyParser, (req, res, next) => {
    try {
      res.json(createVote(knex, req))
    } catch (err) {
      next(err)
    }
  })

  app.delete('/:id([0-9]+)/:proj_id([0-9]+)', auth.required, (req, res, next) => {
    deleteVote(knex, req)
      .then(info => {
        res.json(info)
      })
      .catch(next)
  })

  return app
}
