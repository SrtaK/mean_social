'user strict'

var User = require('../models/user'); //loading the model

//routes
function home(req, res){
    res.status(200).send({
        message: 'Hello, you are in home'
    });
}

function pruebas(req, res){
    console.log(req.body);
    res.status(200).send({
        message: 'Hello, you are testing the app'
    });
}

function pruebas2(req, res){
    console.log(req.body);
    res.status(200).send({
        message: 'Hello, you are testing the app 2'
    });
}

function cuartoNivel(req, res){
    console.log(req.body);
    res.status(200).send({
        message: 'Hello, you are in the fourth level'
    });
}


//exportar en forma de objeto, 
//así están dispoblies fuera de este fichero
module.exports = {
    home, 
    pruebas,
    pruebas2,
    cuartoNivel
}


