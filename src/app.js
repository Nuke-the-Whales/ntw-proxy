'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const middleware = require('./middleware')
const services = require('./services')
const config = require('./config')

const app = express()
const log = console

app.use(
  middleware.cors,
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json()
)

let appServices = Object.keys(services).map(name => services[name])

app.use(...appServices)

// error-handler, must be added last (see express doc)
app.use(middleware.errorHandler)

module.exports = app

module.exports.start = () => {
  return app.listen(process.env.PORT, function () {
    log.info(`Running service on port ${config.server.port}...`)
  })
}
