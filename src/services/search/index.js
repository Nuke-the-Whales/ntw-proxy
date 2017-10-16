'use strict'

const request = require('request')
const service = require('express')()
const validation = require('./validation')
const config = require('../../config')

const headers = {
  'Content-Type': 'application/json',
  'trakt-api-version': '2',
  'trakt-api-key': config.trakt.apiKey
}

const baseUrl = 'https://api.trakt.tv/search/movie,show?query='

const searchAll = (req, res, next) => {
  const url = `${baseUrl}${req.query.title}`

  request({ url, headers }, function (err, traktResponse, body) {
    if (err) return next(err)

    try {
      body = JSON.parse(body)
    } catch (e) {
      next(e)
    }

    return res.json(body)
  });
}

service.get('/', validation, searchAll)

module.exports = service
