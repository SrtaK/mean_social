'user strict'

var User = require('../models/user'); //loading the model
var Follow = require('../models/follow');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var paginate = require('mongoose-pagination'); 
var fs = require('fs');
var path = require('path');
const follow = require('../models/follow');

//función de prueba
function pruebaFollow(req, res){
    console.log(req.body);
    res.status(200).send({
        message: 'Hello, you are testing the Follow controller'
    });
}

function saveFollow(req, res){
  //1-Save into params the body from the request
  var params = req.body;
  //2-Create a mew Follow object
  var follow = new Follow();
  if(params.user && params.followed){
    follow.user = req.user.sub; //this is the user that wants to follow somebody, the one asking for following sb
    console.log(follow.user);

    follow.followed = params.followed;
        //salva el follow
        follow.save((err, followStored) => {
          //o tendrá un error o un usuario guardado
          if(err){
              return res.status(500).send({
                  message: 'Error al guardar la acción'
              });
          }
          if(followStored){
              res.status(200).send({
                  follow: followStored
              });
          } else {
              res.status(404).send({
                  message: 'No se ha registrado la acción'
              });
          }
        });
    } else {
    //without return if just one possible return
    res.status(200).send({
        message: 'Debes rellenar todos los campos.'
    });
  }
}

function deleteFollow(req, res){
  //1 Create a userid variable taken form the aauth information
  var userId = req.user.sub;
  //2 Create a following variable with the user that was being followed taken from the request URL
  var followId = req.params.id;

  Follow.find({
    'user' : userId,
    'followed' : followId
  }).remove((err) => {
      if(err){
        return res.status(500).send({
          message: 'Error al eliminar el follow'
        });
      }
      return res.status(200).send({
        message: 'El follow se ha eliminado'
      });
  });
}





//exportar en forma de objeto, 
//así están dispoblies fuera de este fichero
module.exports = {
    pruebaFollow,
    saveFollow,
    deleteFollow,
    
}


