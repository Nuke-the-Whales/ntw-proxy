'use strict'

class CustomError extends Error {
  constructor (status, message, code) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.message = message
    this.code = code
  }
}

module.exports = CustomError
