'use strict'

var jwt = require('jwt-simple'); //json web
var moment = require('moment');
var secret_salt= 'secret_password_social_network';
exports.createToken = function (user){
    var payload = {
        sub: user._id, //id document
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix, //token creation date
        exp: moment().add(30, 'days').unix()
    };
    //encrypt the payload token
    return jwt.encode(payload, secret_salt)
}