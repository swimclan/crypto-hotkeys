const express = require('express');
require('dotenv').config();

// Express session dependencies
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session);
const client = redis.createClient();

// Passport dependencies
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const bodyParser = require('body-parser')
const Logger = require('./src/services/logger');
const RouterFactory = require('./src/services/router');
const DB = require('./src/services/db');
const { checkPassword } = require('./src/utils');

const app = express();
const router = express.Router();

const logger = Logger({ outputs: ['file', 'console'] });

// Trust upstream recverse proxies
app.set('trust proxy', 1);

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
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({
    usernameField: 'email_address',
    passwordField: 'password'
  }, async function(email, password, done) {
    const User = db.getModel('user');
    let user;
    // Retrieve the user from db
    try {
      user = await User.findOne({ where: { email_address: email } })
    } catch (err) {
      logger.log('error', typeof err === 'string' ? err : err.message);
      return done(err, false, { message: 'Something went wrong during password validation' });
    }
    
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    // Check password validity
    let validPassword = false;
    try {
      validPassword = await checkPassword(password, user.password);
    } catch (err) {
      logger.log('error', typeof err === 'string' ? err : err.message);
      return done(err, false, { message: 'Something went wrong during password validation' });
    }

    if (validPassword) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Password is incorrect' });
    }
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    const User = db.getModel('user');
    const Credential = db.getModel('credential');
    let user, error;
    try {
      user = await User.findOne(
        {
          where: { id },
          include: [ 
            { model: Credential, require: true }
          ] 
        }
      );
    } catch (err) {
      logger.log('error', typeof err === 'string' ? err : err.message);
      error = err;
    }
    return done(error, user);
  });

  // Set router middleware
  router.use(bodyParser.json({ strict: false }));
  router.use(loggerMiddleware);
  app.use('/coinbase', RouterFactory.coinbase(router, db));
  app.use('/user', RouterFactory.user(router, db, passport));
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