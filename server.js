const express = require('express');
require('dotenv').config();
const Logger = require('./src/services/logger');

const app = express();
const logger = Logger({ outputs: ['file', 'console'] });

// Middlewares
app.use(function(req, res, next) {
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
});

app.get('/', (req, res) => {
  res.status(200)
    .send('Hello, world');
});

app.listen(3000, () => {
  console.log('Express application running on port 3000');
});