'use strict'

const request = require('request')
const service = require('express')()
const validation = require('./validation')
const config = require('../../config')
const constants = require('../../constants')

const { searchUrl } = constants

const searchHeaders = {
  'Content-Type': 'application/json',
  'trakt-api-version': '2',
  'trakt-api-key': config.trakt.apiKey
}

const searchAll = (req, res, next) => {
  const url = `${searchUrl}${req.query.title}`
  const headers = searchHeaders

  request({ url, headers }, function (err, traktResponse, body) {
    if (err) return next(err)

    try {
      body = JSON.parse(body)
    } catch (e) {
      next(e)
    }

    const result = body
      .filter(item => item[item.type].ids.imdb)
      .map(item => {
        item.imdb = item[item.type].ids.imdb
        item.title = item[item.type].title
        item.year = item[item.type].year
        delete item[item.type]
        return item
      })

    return res.json(result)
  });
}

service.get('/search', validation, searchAll)

module.exports = service
