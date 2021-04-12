'user strict'

var User = require('../models/user'); //loading the model
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var paginate = require('mongoose-pagination');

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

function saveUser(req, res){
    var params = req.body;
    var user = new User();
    if(params.name && params.surname && 
        params.nick && params.email && params.password){
            user.name = params.name;
            user.surname = params.surname;
            user.nick = params.nick;
            user.email = params.email;
            user.role = 'ROLE_USER';
            user.image = null;
            //Control if duplicate user exist
            User.find({
                $or: [{email:user.email.toLowerCase()}, 
                        {nick:user.nick.toLowerCase()}
                    ]

            }).exec((err,users) => {
                console.log(users);
                if(err){
                    res.status(500).send({
                        message: 'Error en la petición'
                    });
                }
                if(users && users.length >= 1){
                    return res.status(200).send({
                        message: 'El usuario que intenta registrar ya existe'
                    });
                }else {
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStored) => {
                        //o tendrá un error o un usuario guardado
                        if(err){
                            return res.status(500).send({
                                message: 'Error al guardar usuario'
                            });
                        }
                        if(userStored){
                            res.status(200).send({
                                user: userStored
                            });
                        } else {
                            res.status(404).send({
                                message: 'No se ha registrado el usuario'
                            });
                        }
                    });
                });
                }
            })

    } else {
        //without return if just one possible return
        res.status(200).send({
            message: 'Debes rellenar todos los campos.'
        });
    }
}

//Login de usuario
function login(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la petición de login'});

        if(user){
            //compare pw with the one on the db
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    //genera y devuelve token
                    //devuelve el usuario también
                    return res.status(200).send({
                        token: jwt.createToken(user),
                        user:user                        });
                }else{
                    return res.status(404).send({message: 'El usuario no se ha podido identificar correctamente'});
                }
            });
        }else{
            return res.status(404).send({message: 'Credenciales inválidas'});
 
        }
    });
}

function getUser(req, res){
    var userId = req.params.id;
    User.findById(userId, (err, user) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición'
            });
        }
        if(!user){ //un id no existe 
            return res.status(404).send({
                message: 'El usuario no existe'
            });
        }
        return res.status(200).send({
            user
        });
    }); 
}
//exportar en forma de objeto, 
//así están dispoblies fuera de este fichero
module.exports = {
    home, 
    pruebas,
    pruebas2,
    cuartoNivel, 
    saveUser,
    login,
    getUser,

}


