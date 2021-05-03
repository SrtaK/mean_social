'use strict'

//load express router

var express = require('express');

var UserController = require('../controllers/user');
//Load the express router -get, post, put... methods available
var api = express.Router(); 
var md_auth = require('../middlewares/authentication');

//para las imagenes
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/users'})

//routes
api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/pruebas2', UserController.pruebas2);
api.get('/uno/dos/tres/cuartoNivel', UserController.cuartoNivel);
api.post('/register', UserController.saveUser); //funciona ok
api.post('/login', UserController.login); //funciona ok
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser) //funciona
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers) //funciona
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser) //funciona
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload] ,UserController.uploadImage) //funciona
api.get('/get-file/:id',[md_auth.ensureAuth,md_upload], UserController.getImageFile) //funciona
api.get('/counter/:id?',md_auth.ensureAuth, UserController.getCounter); //funciona?


module.exports = api;
