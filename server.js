const express = require('express');
require('dotenv').config();
const path = require('path');

// Passport dependencies
const PassportService = require('./src/services/passport');

const bodyParser = require('body-parser')
const Logger = require('./src/services/logger');
const RouterFactory = require('./src/services/router');
const DB = require('./src/services/db');

// Express session dependencies
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session);
const client = redis.createClient();

const app = express();
const router = express.Router();

const logger = Logger({ outputs: ['file', 'console'] });

// View engine settings
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Trust upstream recverse proxies
app.set('trust proxy', 1);

// Setup static file serving middleware
app.use(express.static('assets'));

// Setup express sessions
const sessionMiddleware = session({
  store: new RedisStore({ client }),
  secret: '98_0n9u^wBnwi$90gibO',
  resave: false,
  proxy: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 360000000
  }
});

function configureMiddlware(db) { 
  // Set session and passport middleware
  const passport = PassportService(db);
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  // Set router middleware
  router.use(bodyParser.json({ strict: false }));
  router.use(loggerMiddleware);
  app.use('/coinbase', RouterFactory.coinbase(router, db));
  app.use('/user', RouterFactory.user(router, db, passport));
  app.use('/', RouterFactory.page(router));
}

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