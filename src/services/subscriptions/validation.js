'use strict'

const s = require('strummer')
const sware = require('strummer-middleware')

module.exports.post = sware({
  body: s({
    userId: 'string',
    showId: 'string',
    showName: 'string'
  })
})

module.exports.delete = sware({
  body: s({
    userId: 'string',
    showId: 'string'
  })
})

module.exports.get = sware({
  query: s({
    userId: 'string'
  })
})
