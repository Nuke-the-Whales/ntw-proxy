'use strict'

const s = require('strummer')
const sware = require('strummer-middleware')

module.exports = sware({
  query: s({
    title: 'string'
  })
})
