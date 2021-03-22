'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//importamos las rutas
var user_routes = require('./routes/user');

//Middlewares(everytime before calling a controller)
app.use(bodyParser.urlencoded({
    extended:false
}));

app.use(bodyParser.json()); //transforma a json todo lo que reciba 

//cors

//routes
app.use('/api', user_routes); //middleware para reescribir las routes api/home 

//exportar la configuración 
module.exports = app;

