// This file manages all api resources
const express = require('express');
const knex = require('knex')({

});

// Run setup on database init
require('./database')(knex);

// create an express router
var router = express.Router();

// TODO here



module.exports = router;