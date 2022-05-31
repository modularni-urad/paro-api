import path from 'path'
import express from 'express'
import dbinit from './dbinit'
import { initErrorHandlers, APIError } from 'modularni-urad-utils'
import surveyMock from './survey_mock'
import { attachPaginate } from 'knex-paginate'
const SessionServiceMock = require('modularni-urad-utils/test/mocks/sessionService')

module.exports = (g) => {
  process.env.NODE_ENV = 'test'
  process.env.SURVEY_API = 'http://localhost:40000/'
  process.env.SESSION_SERVICE_PORT = 24000
  process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`
  process.env.FILESTORAGE_ACCESS_TOKEN_URL = 'koko'
  
  const port = process.env.PORT || 3333
  Object.assign(g, {
    port,
    baseurl: `http://localhost:${port}`,
    mockUser: { id: 42, email: 'gandalf@shire' },
    sessionBasket: []
  })
  g.require = function(name) {
    try {
      return require(name)
    } catch (err) {
      console.error(err)
    }    
  }
  g.sessionSrvcMock = SessionServiceMock.default(process.env.SESSION_SERVICE_PORT, g)
  g.surveyMock = surveyMock.listen(40000)

  g.InitApp = async function (ApiModule) {
    const auth = require('modularni-urad-utils/auth').default
    const knex = await dbinit()
    attachPaginate()
    await ApiModule.migrateDB(knex)

    const app = express()
    const appContext = { 
      express, knex, auth, 
      bodyParser: express.json(),
      ErrorClass: APIError,
      require: function(name) {
        try {
          return require(name)
        } catch (err) {
          console.error(err)
        }    
      }
    }
    const mwarez = ApiModule.init(appContext)
    app.use(mwarez)

    initErrorHandlers(app)

    return new Promise((resolve, reject) => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  g.close = async function() {
    g.sessionSrvcMock.close()
    g.surveyMock.close()
    g.server.close()
  }
}