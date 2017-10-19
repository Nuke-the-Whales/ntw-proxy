'use strict'

const request = require('request')
const service = require('express')()
const RutrackerAPI = require('rutracker-api')
const validation = require('./validation')
const config = require('../../config')
const constants = require('../../constants')
const GoogleImages = require('google-images')

const MAX_MEME_IMG_WIDTH = 1024

const cse = "018444463665243025195:mtyxwnde2ou"
const api = "AIzaSyDyiR2Z_PEUFqihvi0OwEVhe8_2NjJgELE"

const client = new GoogleImages(cse, api);

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

const { showUrl, posterUrl, lastEpisodeUrl } = constants

const showQueries = {
    external_source: 'imdb_id',
    language: 'ru',
    api_key: config.tmdb.apiKey
}

const lastEpisodeHeaders = {
  'Content-Type': 'application/json',
  'trakt-api-version': '2',
  'trakt-api-key': config.trakt.apiKey
}

const MAX_TORRENTS = 5

function processTorrents (torrents) {
  let results = torrents.sort((a, b) => parseInt(b.seeds) - parseInt(a.seeds))
  results = results.slice(0, 5)
  return results
}

const lastEpisode = (req, res, next) => {
  const url = `${lastEpisodeUrl}${req.query.id}/last_episode`
  const headers = lastEpisodeHeaders

  request({ url, headers }, function (err, tmdbResponse, body) {
    if (err) return next(err)

    try {
      body = JSON.parse(body)
    } catch (e) {
      return next(e)
    }

    const result = body
    result.imdb = result.ids.imdb
    delete result.ids

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

    if (!result) return res.json(null)

    const query = result.name
    const callback = (torrents) => {
      const processedTorrents = processTorrents(torrents)
      result.torrents = processedTorrents
      if (result.poster_path) {
        result.poster = `${posterUrl}${result.poster_path}`
      }
      client.search(`${result.original_name} meme`)
        .then(images => {
          const memes = images
            .filter(img => img.width <= MAX_MEME_IMG_WIDTH)
            .map(img => img.url)
            .slice(0, 5)
            
          result.memes = memes
          return res.json(result)
          })
          .catch(err => console.log('Image search error', err));
    }

    rutracker.search(query, callback)
  });
}

service.get('/show', validation, showDetails)
service.get('/show/last', validation, lastEpisode)

module.exports = service
