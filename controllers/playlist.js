'use stric'

var Playlist = require('../models/playlist');
var Cancion = require('../models/cancion');
var Artista = require('../models/artista');
var Album = require('../models/album');
var mongoose = require('mongoose');
var jwt = require ('jsonwebtoken');
var bcrypt = require ('bcryptjs');
var config = require ('../config');
mongoose.set('useCreateIndex', true);


function getPlaylist(req, res) {

  var mode = req.body.mode;
  var promise = null;

  switch (mode) {
    case mode = 1:
        var token = req.body.token;

        if (token) {
          jwt.verify(token, config.secret, function(err, decoded) {
              if (err) {
                  res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
              } else {
                  promise = Playlist
                  .find({'usuario': decoded.id})
                  .select('titulo foto')
                  .exec(function(err,playlists){
                       if(err){
                          return console.log(err);
                          res.status(500).send({ message: 'Error al obtener tus playlist', error: err });
                       }else{
                          if (!playlists) {
                              res.status(404).send({ message: 'No se encontro ninguna playlist.' });
                          }
                          else {
                                res.status(200).send({ playlists })
                          }
                       }
                    });
              }
          });
        } else {
            res.status(401).send({ auth: false, message: 'Token no provisto.' });
        }

      break;

      case mode = 2:
          var idplay = req.body.id;
          var idValido = mongoose.Types.ObjectId.isValid(idplay);

          if (!idValido) {
              res.status(409).send({ message: 'Id no valido' });
          }
          else {
            promise = Playlist
            .findById(idplay)
            .select('titulo foto canciones_user descripcion duracion')
            .populate({
              path: 'canciones',
              // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
              select: 'nombre imagen',
              //options: { limit: 10 , noConsultas: -1 }
            })
            .exec(function(err,playlists){
                 if(err){
                    return console.log(err);
                    res.status(500).send({ message: 'Error al obtener tus playlist', error: err });
                 }else{
                    if (!playlists) {
                        res.status(404).send({ message: 'No se encontro ninguna playlist.' });
                    }
                    else {
                          res.status(200).send({ playlists })
                    }
                 }
              });
          }

      break;
    default:

  }


}

function savePlaylist(req, res){

  var token = req.params.token;

  if (token) {
      jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
          res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      } else {
          req.body.usuario = decoded.id;
          var playlist = new Playlist(req.body);

          playlist.save(function (err, playlistSaved) {
            if (err) {
                console.log(err)
                res.status(500).send({ message: 'Error al guardar la guardar la playlist.', error: err });
            }
            else {
                res.status(200).send({ message: 'Playlist guardada' })
            }
          });
      }
    });
  } else {
      res.status(401).send({ auth: false, message: 'Token no provisto.' });
  }

}

function updatePlaylist(req, res){
    /*
    var params = req.body;
    res.status(200).send({ metodo: "updateAuto", auto: params})
    */
    var playlistId = req.params.id;
    var mode = req.body.mode;
    var idValidor = mongoose.Types.ObjectId.isValid(playlistId);

    switch (mode) {
      case mode = 1:

          if (!idValidor) {
              res.status(409).send({ message: 'Id no valido' });
          }
          else {
              var promise = Playlist.findByIdAndUpdate(playlistId, req.body, {new:true} ,function (err, playlistUpdate) {});

              promise.exec(function(err,playlistUpdate){
                  if (err) {
                      console.log(err)
                      res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                  } else {
                      if (!playlistUpdate) {
                          res.status(404).send({ message: 'No se encuentra la playlist.' });
                      }else{
                          res.status(200).send({ data: playlistUpdate })
                      }
                  }
              });
          }
        break;
        case mode = 2:
            var idcancion = req.body.cancion;
            if (!idValidor) {
                res.status(409).send({ message: 'Id no valido' });
            }
            else {
                var promise = Playlist
                .findByIdAndUpdate(playlistId, { $pull: { canciones_user : idcancion } } , {new:true} )
                .exec(function(err,playlistUpdate){
                    if (err) {
                        console.log(err)
                        res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                    } else {
                        if (!playlistUpdate) {
                            res.status(404).send({ message: 'No se encuentra la playlist.' });
                        }else{
                              var cambiarnum = playlistUpdate.noCanciones - 1;
                              var cambiarduracion = playlistUpdate.duracion;
                              var aux = null;
                              var promise3 = Cancion
                              .findById(idcancion)
                              .select('duracion')
                              .exec(function (err , cancionget) {
                                if (err) {
                                    console.log(err)
                                    res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                                } else {
                                    if (!cancionget) {
                                        res.status(404).send({ message: 'No se encuentra la playlist.' });
                                    }else{
                                        //res.status(200).send({ playlistUpdate2  })
                                        aux = cambiarduracion - cancionget.duracion ;
                                        var promise2 = Playlist
                                        .findByIdAndUpdate(playlistId,{ "$set": { "noCanciones": cambiarnum, "duracion": aux}} , {new:true})
                                        .populate({
                                          path: 'canciones_user',
                                          // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
                                          select: 'nombre imagen',
                                          //options: { limit: 10 , noConsultas: -1 }
                                        })
                                        //.distinct("canciones_user")
                                        .exec(function(err,playlistUpdate2){
                                            if (err) {
                                                console.log(err)
                                                res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                                            } else {
                                                if (!playlistUpdate2) {
                                                    res.status(404).send({ message: 'No se encuentra la playlist.' });
                                                }else{
                                                    res.status(200).send({ playlistUpdate2  })
                                                }
                                              }
                                        });
                                        //console.log(cancionget.duracion)
                                    }
                                  }
                              });

                        }
                    }
                });
            }
        break;
        case mode = 3:
            var idcancion = req.body.cancion;
            if (!idValidor) {
                res.status(409).send({ message: 'Id no valido' });
            }
            else {
                var promise = Playlist
                .findByIdAndUpdate(playlistId, { $push: { canciones_user : idcancion } } , {new:false} )
                .exec(function(err,playlistUpdate){
                    if (err) {
                        console.log(err)
                        res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                    } else {
                        if (!playlistUpdate) {
                            res.status(404).send({ message: 'No se encuentra la playlist.' });
                        }else{
                            var cambiarnum = playlistUpdate.noCanciones + 1;
                            var cambiarduracion = playlistUpdate.duracion;
                            var aux = null;
                            var promise3 = Cancion
                            .findById(idcancion)
                            .select('duracion')
                            .exec(function (err , cancionget) {
                              if (err) {
                                  console.log(err)
                                  res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                              } else {
                                  if (!cancionget) {
                                      res.status(404).send({ message: 'No se encuentra la playlist.' });
                                  }else{
                                      //res.status(200).send({ playlistUpdate2  })
                                      aux = cambiarduracion + cancionget.duracion ;
                                      var promise2 = Playlist
                                      .findByIdAndUpdate(playlistId,{ "$set": { "noCanciones": cambiarnum, "duracion": aux}} , {new:true})
                                      .populate({
                                        path: 'canciones_user',
                                        // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
                                        select: 'nombre imagen',
                                        //options: { limit: 10 , noConsultas: -1 }
                                      })
                                      //.distinct("canciones_user")
                                      .exec(function(err,playlistUpdate2){
                                          if (err) {
                                              console.log(err)
                                              res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                                          } else {
                                              if (!playlistUpdate2) {
                                                  res.status(404).send({ message: 'No se encuentra la playlist.' });
                                              }else{
                                                  res.status(200).send({ playlistUpdate2  })
                                              }
                                            }
                                      });
                                      //console.log(cancionget.duracion)
                                  }
                                }
                            });


                        }
                    }
                });
            }
        break;
      default:

    }

}

function deletePlaylist(req, res) {
    var playlistId = req.params.id;
    var idValidor = mongoose.Types.ObjectId.isValid(playlistId);

    if (!idValidor) {
        res.status(409).send({ message: 'Id no valido' });
    }
    else {
        /*model.findByIdAndRemove(autoIdr, function(err,auto){
            res.status(200).send({auto})
        });*/
        Playlis.findByIdAndRemove(playlistId, function(err,playlistDelated){
            if (err) {
                console.log(err)
                res.status(500).send({ message: 'Error al eliminar la playlist.', error: err })
            }else{
                if (!playlistDelated) {
                    res.status(404).send({ message: 'Esta playlist en la base' });
                }else{
                    res.status(200).send({ message: 'La playlist ha sido eliminada' })
                }
            }
        });
    }
}

module.exports = {
    getPlaylist,
    savePlaylist,
    updatePlaylist,
    deletePlaylist
}
