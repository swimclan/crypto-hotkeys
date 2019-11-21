const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser')
const Logger = require('./src/services/logger');
const Router = require('./src/services/router');

const app = express();
const logger = Logger({ outputs: ['file', 'console'] });

// Middlewares

app.use('/coinbase', Router.coinbase(express.Router()));
app.use('/user', Router.user(express.Router()));
app.use(bodyParser.json({ strict: false }));

app.listen(3000, () => {
  console.log('Express application running on port 3000');
});