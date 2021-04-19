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

//presentacion 2, p18
function getUsers(req, res){
    //id of the authenticated user
    var identity_user_id = req.user.sub;
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    var items_per_page = 8;

    User.find().sort('_id').paginate(page, items_per_page, (err, users, total) => {
        if(err){
            return res.status(500).send({
                message: 'Error en la petición'
            });
        }
        if(!users){
            return res.status(404).send({
                message: 'No hay usuarios disponibles'
            });
        }
        return res.status(200).send({
            users, 
            total,
            pages: Math.ceil(total/items_per_page)
        });
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body; //all the object with the information I want to update, except from pw
    //delete the pw property
    delete update.password;
    if(userId != req.user.sub){
        return res.status(500).send({
            message: 'No tienes permiso para actualizar los datos de usuario'
        });
    }
    User.findByIdAndUpdate(userId, update, {
        new: true //returns the modified object not the original without the update
    }, (error, userUpdated) => {
        if(error){
            return res.status(500).send({
                message: 'Error en la petición'
            });
        }
        if(!userUpdated){
            return res.status(404).send({
                message: 'No se ha podido actualizar el usuario'
            });
        }
        return res.status(200).send({
            user: userUpdated
        });
    });
}

function uploadImage(req, res){
    var userId = req.params.id;
    if(req.files){
        var file_path = req.files.image.path;
        console.log(file_path);
        //split the path by /
        var file_split = file_path.split('\\');
        //take the third position
        var file_name = file_split[2]
        //split the name in order to taKe the file extension
        //take the 2 position
        var file_ext = file_name.split('.')[1];
        console.log(file_ext);

        if(userId != req.user.sub){
            removeFileUploaded(res, file_path, 'No tiene permiso para subir el fichero')
        }
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            //upload the file and update the db object
            User.findByIdAndUpdate(userId, { image: file_name }, {new:true}, (err, userUpdated) => {
                if(err) {
                    res.status(500).send({ message: 'Error en la petición' });
                } 
                if(!userUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                }
                //Si todo va bien se devuelve el objeto actualizado
                return res.status(200).send({ user: userUpdated });
            });
        }else{
            //delete the file and send the error. We need to delete it because the extension uploads it anyway
            removeFileUploaded(res, file_path, 'Extensión no válida');
        }
   
    }else{
        return res.status(200).send({
            message: 'No se han subido los archivos'
        });
    }
}

function removeFileUploaded(res, file_path, message){
    fs.unlink(file_path, (error) => {
        return res.status(200).send({
            message
        });
    });
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/' + image_file;
    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    })
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
    getUsers,
    updateUser,
    uploadImage,
    getImageFile, 



}


