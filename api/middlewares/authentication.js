'use strict'

var jwt = require('jwt-simple'); //json web
var moment = require('moment');
var secret_salt= 'secret_password_social_network';

exports.ensureAuth = function(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({
            message: 'La petición no tiene la cabecera de autenticación'
        })
    }
    //quito también el 'Bearer '
    var token = req.headers.authorization.replace('Bearer ', '').replace('/[\'\"]+/g', '');
    //payload decode
    try{
        var payload = jwt.decode(token, secret_salt);
        if(payload.exp <= moment.unix()){
            return res.status(401).send({
                message: 'EL token ha expirado'
            });
        }
    }catch (error){
        return res.status(404).send({
            message: 'EL token no es valido'
        });
    }
    req.user = payload; //add the payload to the request, to have access to it in the controllers
    next();
        
}