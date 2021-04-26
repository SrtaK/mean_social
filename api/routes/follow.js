'use strict'

//load express router

var express = require('express');

var UserController = require('../controllers/follow');
//Load the express router -get, post, put... methods available
var api = express.Router(); 
var md_auth = require('../middlewares/authentication');

//para las imagenes
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'../uploads/users'})

var FollowController = require('../controllers/follow');
//Load the express router -get, post, put... methods available
var api = express.Router(); 
var md_auth = require('../middlewares/authentication');

//routes
api.get('/pruebaFollow', md_auth.ensureAuth, FollowController.pruebaFollow);
api.post('/saveFollow', md_auth.ensureAuth, FollowController.saveFollow);

module.exports = api;
