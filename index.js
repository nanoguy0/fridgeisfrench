const http = require('http');
const express = require('express');

var app = express();
var server = http.createServer(app);

// connect to express router
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', require('./src/api'));

server.listen(8080);
console.log('Now listening for incoming connections');