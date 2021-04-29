'user strict'

var path = require('path'); //path module
var paginate = require('mongoose-pagination');  //pagination module
var fs = require('fs'); //fs module
var moment = require('moment'); //moment module

var User = require('../models/user'); //load user model
var Follow = require('../models/follow'); //load follow model
var Publication = require('../models/publication'); //load publication model



//Create de prueba method 
function prueba(req, res){ 
  console.log(req.body);
  res.status(200).send({
      message: 'Hello, from publication controller'
  });
}



module.exports = {
  prueba
}