'use strict'

const request = require('request')
const moment = require('moment')
const service = require('express')()
const validation = require('./validation')
const config = require('../../config')
const constants = require('../../constants')
const mockUsers = require('mock-users')

const getShowUpdates = require('../updates').getShowUpdates

const updateHeaders = {
  'Content-Type': 'application/json',
  'trakt-api-version': '2',
  'trakt-api-key': config.trakt.apiKey
}

const addSubscription = (req, res, next) => {
  const { userId, showId, showName } = req.body;
  mockUsers.addSubscription(userId, showId, showName)

  return res.status(200).send()
}

const getUserUpdates = (req, res, next) => {
  const { userId } = req.query;
  const date = moment().subtract(1, 'year').format('YYYY-MM-DD')
  getShowUpdates(date, function (err, updates) {
    if (err) return next(err)

    const userSubscriptions = Object.keys(mockUsers.getUserSubscriptions(userId))

    const userUpdates = updates.filter(item => userSubscriptions.includes(item.imdb))

    return res.json(userUpdates)
  })

}

const getUserSubscriptions = (req, res, next) => {
  const { userId } = req.query

  return res.json(mockUsers.getUserSubscriptions(userId))
}

const deleteUserSubscriptions = (req, res, next) => {
  const { userId, showId } = req.body

  mockUsers.removeSubscription(userId, showId)
  return res.send(200)
}

service.post('/subscriptions', validation.post, addSubscription)
service.delete('/subscriptions', validation.delete, deleteUserSubscriptions)
service.get('/subscriptions', validation.get, getUserUpdates)
service.get('/subscriptions/all', validation.get, getUserSubscriptions)

module.exports = service
