'use strict'

const expect = require('chai').expect
const request = require('supertest')
const nock = require('nock')
const service = require('./../../src/app')
const samples = require('./../samples')



describe('Documentation', () => {

  it('Search movies and shows by title', done => {
    nock('https://api.trakt.tv')
      .get('/search/movie,show?query=thrones')
      .reply(200, samples.traktSearch)

    request(service)
      .get('/search?title=thrones')
      .end((err, res) => {
        expect(err).to.not.be.ok
        done()
      })
  })

  it('Show movie or show details', done => {
    nock('https://api.themoviedb.org')
      .get(/\/3\/find\/.+/i)
      .reply(200, samples.tmdbShow)

    request(service)
      .get('/show?id=tt0944947')
      .end((err, res) => {
        expect(err).to.not.be.ok
        done()
      })
  })

})
