import MWarez from './project'

export default (ctx, app) => {
  const { auth, bodyParser } = ctx
  const MW = MWarez(ctx)

  function getCall (req, res, next) {
    MW.getCall(req.params.id, req.tenantid).then(call => {
      req.call = call
      next()
    }).catch(next)
  }

  app.get('/:id([0-9]+)', (req, res, next) => {
    MW.list(req.query, req.tenantid).then(found => {
      res.json(found)
    }).catch(next)
  })

  app.get('/:id([0-9]+)/uploadinfo', auth.session, auth.required, (req, res, next) => {
    MW.uploadinfo(req.params.id, req.user, req.tenantid).then(found => {
      res.json(found)
    }).catch(next)
  })

  app.post('/:id([0-9]+)', getCall, auth.session, auth.required, bodyParser, (req, res, next) => {
    MW.create(req.call, req.body, req.user, req.tenantid).then(created => {
      res.json(created)
    }).catch(next)
  })

  app.put('/:id([0-9]+)/:pid([0-9]+)', getCall, auth.session, bodyParser, (req, res, next) => {
    MW.update(req.call, req.params.pid, req.body, req.tenantid).then(updated => {
      res.json(updated)
    }).catch(next)
  })

  app.put('/:id([0-9]+)/:pid([0-9]+)/publish', getCall, auth.session, (req, res, next) => {
    MW.publish(req.call, req.params.pid, req.tenantid).then(updated => {
      res.json(updated)
    }).catch(next)
  })
}
