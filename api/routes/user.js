'use strict'

//load express router

var express = require('express');

var UserController = require('../controllers/user');
//Load the express router -get, post, put... methods available
var api = express.Router(); 

//routes
//api.get('/home', UserController.home);
api.get('/pruebas', UserController.pruebas);

module.exports = api;