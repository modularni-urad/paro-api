import feedback from './feedback'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/:projID([0-9]+)', (req, res, next) => {
    feedback.get(req.params.projID, req.query, knex)
      .then(found => res.json(found))
      .catch(next)
  })

  app.post('/:callID([0-9]+)/:projID([0-9]+)', auth.required, JSONBodyParser, (req, res, next) => {
    const { callID, projID } = req.params
    feedback.create(callID, projID, req.body, auth.getUID(req), knex)
      .then(created => res.json(created))
      .catch(next)
  })

  app.put('/:callID([0-9]+)/:feedbackID([0-9]+)', auth.required, JSONBodyParser, (req, res, next) => {
    const { callID, feedbackID } = req.params
    feedback.update(callID, feedbackID, req.body, auth.getUID(req), knex)
      .then(result => res.json(result))
      .catch(next)
  })

  return app
}
