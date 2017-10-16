'use strict'

const s = require('strummer')
const sware = require('strummer-middleware')

module.exports.search = sware({
  query: s({
    title: 'string'
  })
})

module.exports.show = sware({
  query: s({
    id: 'string'
  })
})
