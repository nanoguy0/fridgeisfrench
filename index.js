const http = require('http');
const express = require('express');

var app = express();
var server = http.createServer(app);

// connect to express router
app.use('/', require('./src/api'));

server.listen(80);
console.log('Now listening for inncoming connections');