'use strict'

const fs = require('fs')
const path = require('path')
const cjson = require('cjson')
let config = null

function replaceEnvironmentVariable (match, capture) {
  let val = process.env[capture]
  return (typeof val === 'undefined' ? null : `${val}`)
}

function load () {
  let contents = fs.readFileSync(path.resolve(__dirname, './../config.json'), 'utf-8')
  contents = contents.replace(/\$([a-z_]+)/gi, replaceEnvironmentVariable)
  return cjson.parse(contents)
}

if (config == null) {
  config = load()
}

module.exports = config
