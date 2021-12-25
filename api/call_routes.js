import { GROUPS } from '../consts'
import MWare from './call'
import ProjectRoutes from './project_routes'
import SupportRoutes from './support_routes'

export default (ctx) => {
  const { bodyParser, auth } = ctx
  const MW = MWare(ctx)
  const app = ctx.express()

  app.get('/', (req, res, next) => {
    MW.list(req.query, req.tenantid).then(info => {
      res.json(info)
    }).catch(next)
  })

  app.post('/',
    auth.session,
    auth.requireMembership(GROUPS.ADMIN),
    bodyParser,
    (req, res, next) => {
      MW.create(req.body, req.tenantid).then(savedid => {
        res.json(savedid)
      }).catch(next)
    })

  app.put('/:id([0-9]+)',
    auth.session,
    auth.requireMembership(GROUPS.ADMIN),
    bodyParser,
    (req, res, next) => {
      MW.update(req.params.id, req.body, req.tenantid).then(savedid => {
        res.json(savedid)
      }).catch(next)
    })

  app.put('/:id([0-9]+)/start',
    auth.session,
    auth.requireMembership(GROUPS.ADMIN),
    (req, res, next) => {
      MW.start(req.params.id, req.tenantid).then(savedid => {
        res.json(savedid)
      }).catch(next)
    })

  ProjectRoutes(ctx, app)
  SupportRoutes(ctx, app)

  return app
}
