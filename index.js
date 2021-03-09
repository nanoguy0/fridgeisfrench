const { green, reset, bright, underscore } = require('./src/features/colors');

const http = require('http');
const express = require('express');

var port = 8080;
var app = express();
var server = http.createServer(app);

// connect to express router
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./src/api'));
app.use(express.static('public'))

app.get('/', (req, res) => res.redirect('/home.html'));

server.listen(port);
console.log(`${bright}Now listening for incoming connections at ${green}${underscore}http://localhost:${port}${reset}.`);