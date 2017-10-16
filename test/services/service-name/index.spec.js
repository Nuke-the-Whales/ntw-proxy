'use strict'

const expect = require('chai').expect
const request = require('supertest')
const service = require('./../../src/app')

describe('Service spec', () => {
  it('Test case', done => {
    request(service)
      .get('/')
      .end((err, res) => {
        expect(err).to.not.be.ok
        done()
      })
  })
})

