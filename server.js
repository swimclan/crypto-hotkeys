const express = require('express');
require('dotenv').config();
const Logger = require('./src/services/logger');

const app = express();
const logger = Logger({ outputs: ['file', 'console'] });

app.get('/', (req, res) => {
  logger.log('info', 'About to send hello, world');
  res.status(200)
    .send('Hello, world');
});

app.listen(3000, () => {
  console.log('Express application running on port 3000');
});