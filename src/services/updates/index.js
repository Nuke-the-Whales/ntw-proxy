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

function getShowUpdates(date, callback) {
  const url = `${updatesUrl}${date}?limit=100`
  const headers = updateHeaders

  request({ url, headers }, function (err, traktResponse, body) {
    if (err) return callback(err)

    try {
      body = JSON.parse(body)
    } catch (e) {
      return callback(e)
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

    return callback(null, result)
  });
}

const searchUpdates = (req, res, next) => {
  getShowUpdates(req.query.date, function (err, updates) {
    if (err) return next(err)

    return res.json(udates)
  })
}

service.get('/tv-updates', validation, searchUpdates)

module.exports = service

module.exports.getShowUpdates = getShowUpdates
