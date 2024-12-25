const express = require('express');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
}).listen(process.env.PORT);