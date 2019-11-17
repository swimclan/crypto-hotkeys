const express = require('express');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
  res.status(200)
    .send('Hello, world');
});

app.listen(3000, () => {
  console.log('Express application running on port 3000');
});