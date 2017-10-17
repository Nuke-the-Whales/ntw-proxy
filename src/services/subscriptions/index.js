'use strict'

const request = require('request')
const service = require('express')()
const validation = require('./validation')
const config = require('../../config')
const constants = require('../../constants')

const { updatesUrl } = constants

const updateHeaders = {
  'Content-Type': 'application/json',
  'trakt-api-version': '2',
  'trakt-api-key': config.trakt.apiKey
}

const searchAll = (req, res, next) => {
  const url = `${updatesUrl}${req.query.date}?limit=100`
  const headers = updateHeaders

  request({ url, headers }, function (err, traktResponse, body) {
    if (err) return next(err)

    try {
      body = JSON.parse(body)
    } catch (e) {
      next(e)
    }

    const result = body
      .filter(item => item.show.ids.imdb)
      .map(item => {
        item.imdb = item.show.ids.imdb
        item.title = item.show.title
        item.year = item.show.year
        delete item.show
        return item
      })

    return res.json(result)
  });
}

service.post('/subscriptions', validation.post, searchAll)
service.get('/subscriptions', validation.get, searchAll)

module.exports = service
