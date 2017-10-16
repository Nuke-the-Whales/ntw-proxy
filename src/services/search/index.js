'use strict'

const request = require('request')
const service = require('express')()
const validation = require('./validation')
const config = require('../../config')
const constants = require('../../constants')

const { searchUrl, showUrl, posterUrl } = constants

const searchHeaders = {
  'Content-Type': 'application/json',
  'trakt-api-version': '2',
  'trakt-api-key': config.trakt.apiKey
}

const showQueries = {
    external_source: 'imdb_id',
    language: 'en-US',
    api_key: config.tmdb.apiKey
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

service.get('/search', validation.search, searchAll)
service.get('/show', validation.show, showDetails)

module.exports = service
