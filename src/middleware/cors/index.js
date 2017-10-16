'use strict'

const cors = require('cors')
const config = require('./../../config')

function prepareCorsList (corsOrigins) {
  if (typeof corsOrigins === 'string') {
    let corsList = corsOrigins.split(/\s*,\s*/)
    if (corsList.length > 1) return corsList
  }
  return corsOrigins
}

const corsOptions = {
  origin: prepareCorsList(config.corsOrigins) || false
}

module.exports = cors(corsOptions)
