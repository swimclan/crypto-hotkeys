const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser')
const Logger = require('./src/services/logger');
const RouterFactory = require('./src/services/router');
const DB = require('./src/services/db');
const router = express.Router();

const app = express();

function configureMiddlware(db) {
  router.use(bodyParser.json({ strict: false }))
  app.use('/coinbase', RouterFactory.coinbase(router, db));
  app.use('/user', RouterFactory.user(router, db));
}

DB().then(db => configureMiddlware(db));

app.listen(3000, () => {
  console.log('Express application running on port 3000');
});