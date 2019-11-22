const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser')
const Logger = require('./src/services/logger');
const RouterFactory = require('./src/services/router');
const DB = require('./src/services/db');
const router = express.Router();

const app = express();
const logger = Logger({ outputs: ['file', 'console'] });

// Database connection init
const db = DB();

// Middlewares
router.use(bodyParser.json({ strict: false }))
app.use('/coinbase', RouterFactory.coinbase(router));
app.use('/user', RouterFactory.user(router));

app.listen(3000, () => {
  console.log('Express application running on port 3000');
});