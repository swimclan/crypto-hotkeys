const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser')
const Logger = require('./src/services/logger');
const Coinbase = require('./src/services/coinbase');

const app = express();
const logger = Logger({ outputs: ['file', 'console'] });
const coinbase = Coinbase({
  key: process.env.CB_KEY,
  secret: process.env.CB_SECRET,
  passphrase: process.env.CB_PASSPHRASE });

// Middlewares

app.use(bodyParser.json({ strict: false }));
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

app.get('/', (req, res) => { res.status(200).json({ greeting: 'hello, world' }) });

app.get('/products', async (req, res) => {
  const products = await coinbase.getProducts();
  res.status(200).json(products);
});

app.get('/accounts', async (req, res) => {
  const accounts = await coinbase.getAccounts();
  res.status(200).json(accounts);
});

app.get('/fees', async (req, res) => {
  const fees = await coinbase.getFees();
  res.status(200).json(fees);
});

app.post('/buy', async (req, res) => {
  const order = await coinbase.buy(req.body);
  res.status(200).json(order);
});

app.listen(3000, () => {
  console.log('Express application running on port 3000');
});