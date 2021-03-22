'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//DB connections
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mean_social', {
    userNewUrlParse: true
    })
    .then(() => {
        console.log("la conexion a la BBDD se ha realizado con exito");
        //crear el servidor
        app.listen(port, ()=>{
            console.log('Server running')
        });
        }
    )
    .catch(err => console.log(err));

