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

//exportar en forma de objeto, 
//así están dispoblies fuera de este fichero

module.exports = {
    home, 
    pruebas
}


