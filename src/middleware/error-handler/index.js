'use strict'

const statusMessages = require('statuses').codes

const errorHandler = (err, req, res, next) => {
  // pass to default handler
  // see: http://expressjs.com/en/guide/error-handling.html#the-default-error-handler
  if (res.headersSent) {
    return next(err)
  }

  // this means it's a validation error from strummer-middleware
  if (err.details) {
    return res.status(400).send(template('INVALID_REQUEST', 'Invalid request'))
  }

  let status = err.status || err.statusCode || 500
  let message = err.message || statusMessages[status] || 'Unknown error'
  let code = err.code || getErrorCode(message)

  return res.status(status).send(template(code, message, err.info))
}

const template = (code, message, info) => {
  let errorDocument = {
    _type: 'application/ntw.error',
    code: code,
    message: message
  }

  if (info) errorDocument.info = info

  return errorDocument
}

const getErrorCode = (message) => {
  return (
    message.trim()
      .replace(/[^a-zA-Z\d\s:]/g, '')
      .replace(/\s+/g, '_')
      .toUpperCase()
  )
}

module.exports = errorHandler
