'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Middlewares(everytime before calling a controller)
app.use(bodyParser.urlencoded({
    extended:false
}));

app.use(bodyParser.json()) //transforma a json todo lo que reciba 

//cors

//routes
app.get('/pruebas',(req,res) => {
    res.status(200).send({
        message: 'Test GET action'
    });
})

app.post('/pruebas',(req,res) => {
    //console.log(req.body);
    var cuerpo = req.body;
    res.status(200).send({
        message: 'Test POST action', cuerpo
    });
})

app.get('/',(req,res) => {
    res.status(200).send({
        message: 'Testing ROOT'
    });
})


//exportar la configuración 
module.exports = app;

