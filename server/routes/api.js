const express = require('express');

const api = express.Router();

api.get('/', (req, res) => {
  res.json({'key':'value'});
});

module.exports = api;
