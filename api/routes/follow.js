'use strict'

//load express router
var express = require('express');

var FollowController = require('../controllers/follow');
//Load the express router -get, post, put... methods available
var api = express.Router(); 
var md_auth = require('../middlewares/authentication');

//para las imagenes
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/follows'})

var FollowController = require('../controllers/follow');
//Load the express router -get, post, put... methods available
var api = express.Router(); 
var md_auth = require('../middlewares/authentication');

//routes
api.get('/follow/prueba', md_auth.ensureAuth, FollowController.pruebaFollow); //funciona
api.post('/follow/save', md_auth.ensureAuth, FollowController.saveFollow); //funciona
api.delete('/follow/delete/:id', md_auth.ensureAuth, FollowController.deleteFollow); //en clase funciona
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers); //funciona  pero no se si bien
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers); //funciona pero no se si bien
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, FollowController.getMyFollows); //funciona pero revisar

module.exports = api;
