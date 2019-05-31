'use stric'

var Cancion = require('../models/cancion');
var Artista = require('../models/artista');
var Album = require('../models/album');

var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

function getCancion(req, res){

    var mode = req.body.mode;
    var promise = null;
    var campo_busqueda = null;

    switch (mode) {
        case mode = 1:
            var salto = req.body.salto;
            promise = Cancion
            .find()
            .populate({
              path: 'artista',
              // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
              select: 'nombre',
              //options: { limit: 10 , noConsultas: -1 }
            })
            .select('nombre imagen artista')
            .sort({'noConsultas' : -1})
            .limit(10)
            .skip(salto)
            .exec(function(err,canciones){
                 if(err){
                    return console.log(err);
                    res.status(500).send({ message: 'Error al obtener las canciones', error: err });
                 }else{
                    if (!canciones) {
                        res.status(404).send({ message: 'No se encontro ninguna cancion.' });
                    }
                    else {
                          res.status(200).send({ canciones })
                    }
                 }
              });

        break;

        case mode = 2:
            idcancion = req.body.id;
            var idValido = mongoose.Types.ObjectId.isValid(idcancion);

            if (!idValido) {
                res.status(409).send({ message: 'Id no valido' });
            }
            else {
                promise  = Cancion
                .findById(idcancion)
                .populate({
                  path: 'artista',
                  // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
                  select: 'nombre',
                  //options: { limit: 10 , noConsultas: -1 }
                })
                .populate({
                  path: 'album',
                  // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
                  select: 'nombre',
                  //options: { limit: 10 , noConsultas: -1 }
                })
                .select('nombre imagen artista album')
                .exec(function(err, cancion){
                    if(err){
                       return console.log(err);
                       res.status(500).send({ message: 'Error al obtener la cancion', error: err });
                    }else{
                         if (!cancion) {
                             res.status(404).send({ message: 'No se encontro ninguna cancion.' });
                         }
                         else {
                               res.status(200).send({ cancion })
                         }
                    }
                });
            }

        break;

        case mode = 3:
            idcancion = req.body.id;
            var idValido = mongoose.Types.ObjectId.isValid(idcancion);

            if (!idValido) {
                res.status(409).send({ message: 'Id no valido' });
            }
            else {
                promise = Cancion
                .findById(idcancion)
                .select('audio noConsultas')
                .exec(function(err, cancion){
                    if (err){
                        return console.log(err);
                        res.status(500).send({ message: 'Error al obtener la cancion', error: err });
                    } else {
                        if (!cancion) {
                            res.status(404).send({ message: 'No se encontro ninguna cancion.' });
                        }
                        else {
                              var numerupdate = cancion.noConsultas;
                              numerupdate = numerupdate + 1;
                              promise = Cancion
                              .findByIdAndUpdate(idcancion,{'noConsultas' : numerupdate } ,{new:true})
                              .select('audio noConsultas')
                              .exec(function(err, cancionUpdate){
                                  if (err) {
                                      console.log(err)
                                      res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                                  } else {
                                      if (!cancionUpdate) {
                                          res.status(404).send({ message: 'No se encuentra la cancion.' });
                                      }else{
                                          res.status(200).send({ cancionUpdate })
                                      }
                                  }
                              });
                        }
                    }
                });
            }

        break;

        case mode = 4:
            campo_busqueda = req.body.campo;

            promise = Cancion
            .find({"nombre" : campo_busqueda})
            .populate({
              path: 'artista',
              // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
              select: 'nombre',
              //options: { limit: 10 , noConsultas: -1 }
            })
            .select('nombre imagen artista')
            .sort({'noConsultas' : -1})
            .limit(10)
            .exec(function(err,canciones){
                 if(err){
                    return console.log(err);
                    res.status(500).send({ message: 'Error al obtener las canciones', error: err });
                 }else{
                    if (!canciones) {
                        res.status(404).send({ message: 'No se encontro ninguna cancion.' });
                    }
                    else {
                        res.status(200).send({ canciones })
                    }
                 }
              });
        break;
      default:

    }

}

function saveCancion(req, res){

    var cancion = new Cancion(req.body);

    cancion.save(function (err, cancionSaved) {
      if (err) {
          console.log(err)
          res.status(500).send({ message: 'Error al guardar la cancion.', error: err });
      }
      else {
        Album.findByIdAndUpdate(req.body.album, {$push: { canciones : cancionSaved._id }} , {new:true} ,function (err, albumUpdate) {
              if (err) {
                  console.log(err)
                  res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
              } else {
                  if (!albumUpdate) {
                      res.status(404).send({ message: 'No se encuentra la Casa discografica.' });
                  }else{
                      //res.status(200).send({ saved: artistaSaved })
                  }
              }
          });
          Artista.findByIdAndUpdate(req.body.artista, {$push: { canciones : cancionSaved._id }} , {new:true} ,function (err, artistaUpdate) {
              if (err) {
                  console.log(err)
                  res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
              } else {
                  if (!artistaUpdate) {
                      res.status(404).send({ message: 'No se encuentra la Casa discografica.' });
                  }else{
                      //res.status(200).send({ saved: artistaSaved })
                  }
              }
          });
          res.status(200).send({ saved: cancionSaved })
      }
    });

}

function updateCancion(req, res) {
    /*
    var params = req.body;
    res.status(200).send({ metodo: "updateAuto", auto: params})
    */
    var cancionId = req.params.id;
    var idValidor = mongoose.Types.ObjectId.isValid(cancionId);

    if (!idValidor) {
        res.status(409).send({ message: 'Id no valido' });
    }
    else {
        var promise = Cancion.findByIdAndUpdate(cancionId, req.body, {new:true});

        promise.exec(function(err,cancionUpdate){
            if (err) {
                console.log(err)
                res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
            } else {
                if (!cancionUpdate) {
                    res.status(404).send({ message: 'No se encuentra la cancion.' });
                }else{
                    res.status(200).send({ data: cancionUpdate })
                }
            }
        });
    }
}

function delate_CancionArtista(id_artista, res) {
    Cancion.deleteMany({artista: id_artista}, function(err, cancionesDeleted){
        if (err) {
            console.log(err)
            res.status(500).send({ message: 'Error al eliminar las canciones.', error: err })
        }else{
            if (!cancionesDeleted) {
                res.status(404).send({ message: 'Esas canciones no se encuentra en la base' });
            }else{
                //res.status(200).send({ message: 'Las canciones han sido eliminadas' })
            }
        }
    });
}

function delate_CancionAlbum(id_album, res) {
    Cancion.deleteMany({album: id_album}, function(err, cancionesDeleted){
        if (err) {
            console.log(err)
            res.status(500).send({ message: 'Error al eliminar las canciones.', error: err })
        }else{
            if (!cancionesDeleted) {
                res.status(404).send({ message: 'Esas canciones no se encuentra en la base' });
            }else{
                //res.status(200).send({ message: 'Las canciones han sido eliminadas' })
            }
        }
    });
}

function deleteCancion(req, res) {
    var cancionId = req.params.id;
    var idValidor = mongoose.Types.ObjectId.isValid(cancionId);

    if (!idValidor) {
        res.status(409).send({ message: 'Id no valido' });
    }
    else {
        /*model.findByIdAndRemove(autoIdr, function(err,auto){
            res.status(200).send({auto})
        });*/
        Cancion.findByIdAndRemove(cancionId, function(err,cancionDelated){
            if (err) {
                console.log(err)
                res.status(500).send({ message: 'Error al eliminar la cancion.', error: err })
            }else{
                if (!cancionDelated) {
                    res.status(404).send({ message: 'Esa cancion no se encunetra en la base' });
                }else{
                  Album.findByIdAndUpdate(cancionDelated.album, { $pull: { canciones : cancionDelated._id } } , {new:true} ,function (err, albumUpdate) {
                        if (err) {
                            console.log(err)
                            res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                        } else {
                            if (!albumUpdate) {
                                res.status(404).send({ message: 'No se encuentra la Casa discografica.' });
                            }else{
                                //res.status(200).send({ saved: artistaSaved })
                            }
                        }
                    });
                    Artista.findByIdAndUpdate(cancionDelated.artista, { $pull: { canciones : cancionDelated._id } } , {new:true} ,function (err, artistaUpdate) {
                        if (err) {
                            console.log(err)
                            res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                        } else {
                            if (!artistaUpdate) {
                                res.status(404).send({ message: 'No se encuentra la Casa discografica.' });
                            }else{
                                //res.status(200).send({ saved: artistaSaved })
                            }
                        }
                    });
                    res.status(200).send({ message: 'La cancion ha sido eliminada' })
                }
            }
        });

    }
}

module.exports = {
    getCancion,
    saveCancion,
    updateCancion,
    deleteCancion,
    delate_CancionArtista,
    delate_CancionAlbum,
}
