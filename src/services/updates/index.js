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

function requestUpdates (url, headers, page, callback) {
  console.log('Scanning page', page)
  url = `${url}&page=${page}`
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

    const pagination = {
      page: parseInt(traktResponse.headers['x-pagination-page']) || 1,
      pageCount: parseInt(traktResponse.headers['x-pagination-page-count']) || 1
    }

    return callback(null, pagination, result)
  });
}

function getShowUpdates(date, callback) {
  const url = `${updatesUrl}${date}?limit=100`
  const headers = updateHeaders

  let page = 1

  requestUpdates(url, headers, page, function (err, pagination, result) {
    if (err) return callback(err)

    if (pagination.page < pagination.pageCount) {
      page += 1
      requestUpdates()
    }
  })
}

const searchUpdates = (req, res, next) => {
  getShowUpdates(req.query.date, function (err, updates) {
    if (err) return next(err)

    return res.json(updates)
  })
}

service.get('/tv-updates', validation, searchUpdates)

module.exports = service

module.exports.getShowUpdates = getShowUpdates
