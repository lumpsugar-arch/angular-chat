const express = require('express'),
      redis = require('redis');

const api = express.Router(),
      client = redis.createClient();


api.use((req, res, next) => {
  client.set("allo", "redis", redis.print);
  next()
});

api.get('/', (req, res) => {
  res.json({'key':'value'});
});

module.exports = api;
