'use strict'

const s = require('strummer')
const sware = require('strummer-middleware')

module.exports.post = sware({
  body: s({
    userId: 'string',
    showId: 'string'
  })
})

module.exports.get = sware({
  body: s({
    userId: 'string'
  })
})
