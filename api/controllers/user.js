"user strict";

var User = require("../models/user"); //loading the model
var Follow = require("../models/follow"); //load the follow model
var Publication = require("../models/publication"); //load the follow model

var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
var paginate = require("mongoose-pagination");
var fs = require("fs");
var path = require("path");
//const user = require('../models/user');

//routes
function home(req, res) {
  res.status(200).send({
    message: "Hello, you are in home",
  });
}

function pruebas(req, res) {
  console.log(req.body);
  res.status(200).send({
    message: "Hello, you are testing the app",
  });
}

function pruebas2(req, res) {
  console.log(req.body);
  res.status(200).send({
    message: "Hello, you are testing the app 2",
  });
}

function cuartoNivel(req, res) {
  console.log(req.body);
  res.status(200).send({
    message: "Hello, you are in the fourth level",
  });
}

function handleError(err) {
  console.error(err);
  // handle your error
}

function saveUser(req, res) {
  var params = req.body;
  var user = new User();
  if (
    params.name &&
    params.surname &&
    params.nick &&
    params.email &&
    params.password
  ) {
    user.name = params.name;
    user.surname = params.surname;
    user.nick = params.nick;
    user.email = params.email;
    user.role = "ROLE_USER";
    user.image = null;
    //Control if duplicate user exist
    User.find({
      $or: [
        { email: user.email.toLowerCase() },
        { nick: user.nick.toLowerCase() },
      ],
    }).exec((err, users) => {
      console.log(users);
      if (err) {
        res.status(500).send({
          message: "Error en la petición",
        });
      }
      if (users && users.length >= 1) {
        return res.status(200).send({
          message: "El usuario que intenta registrar ya existe",
        });
      } else {
        bcrypt.hash(params.password, null, null, (err, hash) => {
          user.password = hash;
          user.save((err, userStored) => {
            //o tendrá un error o un usuario guardado
            if (err) {
              return res.status(500).send({
                message: "Error al guardar usuario",
              });
            }
            if (userStored) {
              res.status(200).send({
                user: userStored,
              });
            } else {
              res.status(404).send({
                message: "No se ha registrado el usuario",
              });
            }
          });
        });
      }
    });
  } else {
    //without return if just one possible return
    res.status(200).send({
      message: "Debes rellenar todos los campos.",
    });
  }
}

//Login de usuario
function login(req, res) {
  var params = req.body;
  var email = params.email;
  var password = params.password;

  User.findOne({ email: email }, (err, user) => {
    if (err)
      return res.status(500).send({ message: "Error en la petición de login" });

    if (user) {
      //compare pw with the one on the db
      bcrypt.compare(password, user.password, (err, check) => {
        if (check) {
          //genera y devuelve token
          //devuelve el usuario también
          return res.status(200).send({
            token: jwt.createToken(user),
            user: user,
          });
        } else {
          return res.status(404).send({
            message: "El usuario no se ha podido identificar correctamente",
          });
        }
      });
    } else {
      return res.status(404).send({ message: "Credenciales inválidas" });
    }
  });
}

function getUser(req, res) {
  var userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).send({
        message: "Error en la petición",
      });
    }
    if (!user) {
      //un id no existe
      return res.status(404).send({
        message: "El usuario no existe",
      });
    }

    followThisUser(req.user.sub, userId).then((value) => {
      user.password = undefined;
      return res.status(200).send({
        user,
        following: value.following,
        followed: value.followed,
      });
    });
  });
}


async function followThisUser(identity_user_id, user_id) {
  //returns a propmise
  try {
    var following = await Follow.findOne({
      user: identity_user_id,
      followed: user_id,
    })
      .exec()
      .then((following) => {
        console.log(following);

        return following;
      })
      .catch((err) => {
        return handleError(err);
      });

    //console.log(following);

    var followed = await Follow.findOne({
      user: user_id,
      followed: identity_user_id,
    })
      .exec()
      .then((followed) => {
        return followed;
      })
      .catch((err) => {
        return handleError(err);
      });
    return {
      following: following,
      followed: followed,
    };
  } catch (error) {
    return handleError(error);
  }
}

//presentacion 2, p18
function getUsers(req, res) {
  var identity_user_id = req.user.sub;
  var page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  var itemsPerPage = 5;

  User.find()
    .sort("_id")
    .paginate(page, itemsPerPage, (err, users, total) => {
      if (err) return res.status(500).send({ message: "Error en la peticion" });
      if (!users)
        return res.status(404).send({ message: "No hay usuarios disponibles" });

      followUserIds(identity_user_id).then((value) => {
        return res.status(200).send({
          users,
          users_following: value.following,
          users_follow_me: value.followed,
          total,
          pages: Math.ceil(total / itemsPerPage),
        });
      });
    });
}

async function followUserIds(user_id) {
  var following = await Follow.find({ user: user_id })
    .select({ _id: 0, __v: 0, user: 0 })
    .exec()
    .then((follows) => {
      return follows;
    })
    .catch((err) => {
      return handleError(err);
    });

  var followed = await Follow.find({ followed: user_id })
    .select({ _id: 0, __v: 0, followed: 0 })
    .exec()
    .then((follows) => {
      return follows;
    })
    .catch((err) => {
      return handleError(err);
    });

  //Procesar following ids
  var following_clean = [];
  following.forEach((follow) => {
    following_clean.push(follow.followed);
  });

  //Procesar followed ids
  var followed_clean = [];
  followed.forEach((follow) => {
    followed_clean.push(follow.user);
  });

  return {
    following: following_clean,
    followed: followed_clean,
  };
}

function updateUser(req, res) {
  var userId = req.params.id;
  var update = req.body; //all the object with the information I want to update, except from pw
  //delete the pw property
  delete update.password;
  if (userId != req.user.sub) {
    return res.status(500).send({
      message: "No tienes permiso para actualizar los datos de usuario",
    });
  }
  User.findByIdAndUpdate(
    userId,
    update,
    {
      new: true, //returns the modified object not the original without the update
    },
    (error, userUpdated) => {
      if (error) {
        return res.status(500).send({
          message: "Error en la petición",
        });
      }
      if (!userUpdated) {
        return res.status(404).send({
          message: "No se ha podido actualizar el usuario",
        });
      }
      return res.status(200).send({
        user: userUpdated,
      });
    }
  );
}

function uploadImage(req, res) {
  var userId = req.params.id;
  if (req.files) {
    var file_path = req.files.image.path;
    console.log(file_path);
    //split the path by /
    //Para que funcione, al menos en mi mac
    var file_split = file_path.split("\\");
    //var file_split = file_path.split('\\');
    console.log(file_split);
    //take the third position
    var file_name = file_split[2];
    //split the name in order to taKe the file extension
    //take the 2 position
    var file_ext = file_name.split(".")[1];
    //console.log(file_ext);

    if (userId != req.user.sub) {
      removeFileUploaded(
        res,
        file_path,
        "No tiene permiso para subir el fichero"
      );
    }
    if (
      file_ext == "png" ||
      file_ext == "jpg" ||
      file_ext == "jpeg" ||
      file_ext == "gif"
    ) {
      //upload the file and update the db object
      User.findByIdAndUpdate(
        userId,
        { image: file_name },
        { new: true },
        (err, userUpdated) => {
          if (err) {
            res.status(500).send({ message: "Error en la petición" });
          }
          if (!userUpdated) {
            res
              .status(404)
              .send({ message: "No se ha podido actualizar el usuario" });
          }
          //Si todo va bien se devuelve el objeto actualizado
          return res.status(200).send({ user: userUpdated });
        }
      );
    } else {
      //delete the file and send the error. We need to delete it because the extension  it anyway
      removeFileUploaded(res, file_path, "Extensión no válida");
    }
  } else {
    return res.status(200).send({
      message: "No se han subido los archivos",
    });
  }
}

function removeFileUploaded(res, file_path, message) {
  fs.unlink(file_path, (error) => {
    return res.status(200).send({
      message,
    });
  });
}

function getImageFile(req, res) {
  var userId = req.params.id;
  //var user = getUser(req,res);
  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).send({
        message: "Error en la petición",
      });
    }
    if (!user) {
      //un id que no existe
      return res.status(404).send({
        message: "El usuario no existe",
      });
    }

    var imageFile = user.image;
    var path_file = "./uploads/users/" + imageFile;
    fs.exists(path_file, (exists) => {
      if (exists) {
        res.sendFile(path.resolve(path_file));
      } else {
        res.status(200).send({
          message: "No existe la imagen",
        });
      }
    });
  });
}

function getCounter(req, res) {
  var userId = req.user.sub;
  if (req.params.id) {
    userId = req.params.id;
  }
  getCountFollow(userId).then((value) => {
    return res.status(200).send(value);
  });
}

async function getCountFollow(user_id) {
  var following = await Follow.count({ user: user_id })
    .exec()
    .then((count) => {
      return count;
    })
    .catch((err) => {
      return handleError(err);
    });

  var followed = await Follow.count({ followed: user_id })
    .exec()
    .then((count) => {
      return count;
    })
    .catch((err) => {
      return handleError(err);
    });

  var publications = await Publication.count({ user: user_id })
    .exec()
    .then((count) => {
      return count;
    })
    .catch((err) => {
      return handleError(err);
    });

  return {
    following: following,
    followed: followed,
    publications: publications,
  };
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
  getCounter,
};
