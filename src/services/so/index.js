'use strict'

const request = require('request')
const service = require('express')()
const stackexchange = require('stackexchange');
const validation = require('./validation')
const config = require('../../config')

const options = { version: 2.2 };
const context = new stackexchange(options);

function normalizeQuery (q) {
  return q.toLowerCase().replace(/\s+/g, ' ').replace(/ /g, '-')
}

const searchSO = (req, res, next) => {
  var filter = {
    key: config.so.apiKey,
    pagesize: 50,
    tagged: normalizeQuery(req.query.query),
    sort: 'activity',
    order: 'asc'
  };

  context.questions.questions(filter, function(err, results){
    if (err) throw err;

    return res.json(results)
  });
}

service.get('/so', validation, searchSO)

module.exports = service
