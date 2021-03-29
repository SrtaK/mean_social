'use strict'

//load express router

var express = require('express');

var UserController = require('../controllers/user');
//Load the express router -get, post, put... methods available
var api = express.Router(); 
//var md_auth = require('../middlewares/authentication');

//routes
api.get('/home', UserController.home);
api.get('/pruebas', UserController.pruebas);
api.post('/pruebas2', UserController.pruebas2);
api.get('/uno/dos/tres/cuartoNivel', UserController.cuartoNivel);
api.post('/saveUser', UserController.saveUser);
api.post('/login', UserController.login);


module.exports = api;