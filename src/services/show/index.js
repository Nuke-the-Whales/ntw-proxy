'use strict'

const request = require('request')
const service = require('express')()
const RutrackerAPI = require('rutracker-api');
const validation = require('./validation')
const config = require('../../config')
const constants = require('../../constants')

const rutracker = new RutrackerAPI({
  username: config.rutracker.username,
  password: config.rutracker.password
})

rutracker.on('login', function (err, res) {
  console.log('We\'re on rutracker ;)')
})

rutracker.on('error', function (err, res) {
  console.log('Cant connect to rutracker, are you browsing from Russia? :)')
})

const { showUrl, posterUrl } = constants

const showQueries = {
    external_source: 'imdb_id',
    language: 'ru',
    api_key: config.tmdb.apiKey
}

const MAX_TORRENTS = 5

function processTorrents (torrents) {
  let results = torrents.sort((a, b) => parseInt(b.seeds) - parseInt(a.seeds))
  results = results.slice(0, 5)
  return results
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

    if (!result) return res.json(null)

    const query = result.name
    const callback = (torrents) => {
      const processedTorrents = processTorrents(torrents)
      result.torrents = processedTorrents
      if (result.poster_path) {
        result.poster = `${posterUrl}${result.poster_path}`
      }
      return res.json(result)
    }

    rutracker.search(query, callback)
  });
}

service.get('/show', validation, showDetails)

module.exports = service
