'use strict'

const request = require('request')
const service = require('express')()
const validation = require('./validation')
const config = require('../../config')
const constants = require('../../constants')

const { showUrl, posterUrl } = constants

const showQueries = {
    external_source: 'imdb_id',
    language: 'en-US',
    api_key: config.tmdb.apiKey
}

const showDetails = (req, res, next) => {
  const url = `${showUrl}${req.query.id}`
  const qs = showQueries

  request({ url, qs }, function (err, tmdbResponse, body) {
    if (err) return next(err)

    try {
      body = JSON.parse(body)
    } catch (e) {
      return next(e)
    }

    const result = body.movie_results[0] || body.tv_results[0] || null

    if (result && result.poster_path) {
      result.poster = `${posterUrl}${result.poster_path}`
    }

    return res.json(result)
  });
}

service.get('/show', validation, showDetails)

module.exports = service
