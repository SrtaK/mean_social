'use strict'

//load express router

var express = require('express');

var UserController = require('../controllers/user');
//Load the express router -get, post, put... methods available
var api = express.Router(); 
var md_auth = require('../middlewares/authentication');

//para las imagenes
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'../uploads/users'})

//routes
api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/pruebas2', UserController.pruebas2);
api.get('/uno/dos/tres/cuartoNivel', UserController.cuartoNivel);
api.post('/saveUser', UserController.saveUser);
api.post('/login', UserController.login);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser)
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers)
api.put('/updateUser/:id?', md_auth.ensureAuth, UserController.updateUser)
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload] ,UserController.uploadImage)
api.post('/get-file/:id',[md_auth.ensureAuth,md_upload], UserController.getImageFile)


module.exports = api;
