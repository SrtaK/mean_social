'use strict'

//load express router

var express = require('express');

var PublicationController = require('../controllers/publication');
//Load the express router -get, post, put... methods available
var api = express.Router(); 
var md_auth = require('../middlewares/authentication');


//routes
api.get('/publication/prueba', md_auth.ensureAuth, PublicationController.prueba)


module.exports = api;
