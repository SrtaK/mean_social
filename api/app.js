// Utilizar funcionalidades del Ecmascript 6
'use strict'

// Cargamos los módulos de express y body-parser
var express = require('express');
var bodyParser = require('body-parser');

// Llamamos a express para poder crear el servidor
var app = express();

//importamos las rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');

//Middlewares(everytime before calling a controller)
app.use(bodyParser.urlencoded({
    extended:false
}));

app.use(bodyParser.json()); //transforma a json todo lo que reciba 

//cors

//routes
app.use('/api', user_routes); //middleware para reescribir las routes api/home 
app.use('/api', follow_routes); 
app.use('/api', publication_routes); 
//exportar la configuración 
module.exports = app;

