const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser')
const Logger = require('./src/services/logger');
const RouterFactory = require('./src/services/router');
const DB = require('./src/services/db');
const router = express.Router();

const app = express();

function configureMiddlware(db) {
  router.use(bodyParser.json({ strict: false }));
  router.use(loggerMiddleware);
  app.use('/coinbase', RouterFactory.coinbase(router, db));
  app.use('/user', RouterFactory.user(router, db));
}

const logger = Logger({ outputs: ['file', 'console'] });

DB().then(db => configureMiddlware(db));

app.listen(3000, () => {
  console.log('Express application running on port 3000');
});


// Middleware definitions
function loggerMiddleware(req, res, next) {
  const method = req.method;
  const path = req.url;
  res.on('finish', () => {
    let level;
    if (res.statusCode > 399) {
      level = 'error';
    } else {
      level = 'info';
    }
    logger.log(level, `${method} ${res.statusCode} - '${path}'`);
  });
  next();
}