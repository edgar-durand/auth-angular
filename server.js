const express = require('express');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(compression());

app.use(express.static(path.join(__dirname, 'dist/leyes-front')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/leyes-front', 'index.html'));
});

app.all('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist/leyes-front', 'index.html'));
});

app.listen(process.env.PORT || 3006);
