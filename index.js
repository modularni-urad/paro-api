import initPaRoCallRoutes from './api/call'
import initPaRoProjectRoutes from './api/project'
import initPaRoSupportRoutes from './api/support'
import initPaRoVotesRoutes from './api/voting_routes'
import schedulePaRoTasks from './tasks/projectstate'

export default (ctx) => {
  const app = ctx.express()

  app.use('/call', initPaRoCallRoutes(ctx))
  app.use('/project', initPaRoProjectRoutes(ctx))
  app.use('/support', initPaRoSupportRoutes(ctx))
  app.use('/votes', initPaRoVotesRoutes(ctx))

  schedulePaRoTasks(ctx.knex)

  return app
}
