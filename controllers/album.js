'use stric'

var Album = require('../models/album');
var Cancion = require('../models/cancion');
var Artista = require('../models/artista');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

function saveAlbum(req, res){

    var album = new Album(req.body);

    album.save(function (err, albumSaved) {
      if (err) {
          console.log(err)
          res.status(500).send({ message: 'Error al guardar el album.', error: err });
      }
      else {
          Artista.findByIdAndUpdate(req.body.artista, {$push: { albums : albumSaved._id }} , {new:true} ,function (err, albumUpdate) {
              if (err) {
                  console.log(err)
                  res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
              } else {
                  if (!albumUpdate) {
                      res.status(404).send({ message: 'No se encuentra el artista del album.' });
                  }else{
                      res.status(200).send({ saved: albumSaved })
                  }
              }
          });
      }
    });

}

function getAlbum(req, res){


    var mode = req.body.mode;
    var promise = null;
    var nombre = null;

    switch (mode) {
        case mode = 1:
            nombre = req.body.nombre;
            var salto = req.body.salto;
            promise = Album
            .find()
            .populate({
              path: 'artista',
              // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
              select: 'nombre -_id'
            })
            .select('nombre foto artista')
            .sort({'noConsultas' : -1})
            .limit(10)
            .skip(salto)
            .exec(function(err,albums){
               if(err){
                  return console.log(err);
                  res.status(500).send({ message: 'Error al obtener los albums', error: err });
               }else{
                  if (!albums) {
                      res.status(404).send({ message: 'No se encontro ningun album.' });
                  }
                  else {
                        res.status(200).send({ albums })
                  }
               }
            });

        break;

        case mode = 2:
            var campo = req.body.campo;
            promise = Album
            .find({"nombre" : campo})
            .populate({
              path: 'artista',
              // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
              select: 'nombre -_id'
            })
            .select('nombre foto artista')
            .exec(function(err,album){
               if(err){
                  return console.log(err);
                  res.status(500).send({ message: 'Error al obtener los albums', error: err });
               }else{
                  if (!album) {
                      res.status(404).send({ message: 'No se encontro ningun album.' });
                  }
                  else {
                        res.status(200).send({ album })
                  }
               }
             });
        break;

        case mode = 3:
            var idalbum = req.body.id;
            var idValido = mongoose.Types.ObjectId.isValid(idalbum);

            if (!idValido) {
                res.status(409).send({ message: 'Id no valido' });
            }
            else {
                promise = Album
                .findById(idalbum)
                .select('nombre foto artista noConsultas')
                .exec(function(err,album){
                   if(err){
                      return console.log(err);
                      res.status(500).send({ message: 'Error al obtener el album', error: err });
                   }else{
                      if (!album) {
                          res.status(404).send({ message: 'No se encontro ninguna album.' });
                      }
                      else {
                            var newnumber = album.noConsultas + 1;
                            var promise2 = null;
                            promise2  = Album
                            .findByIdAndUpdate(album._id,{ "noConsultas" : newnumber },{new : true})
                            .populate({
                                path: 'artista',
                                select: 'nombre'
                              },
                            )
                            .populate({
                              path: 'canciones',
                              select: 'nombre imagen'
                            })
                            .exec(function(err,albummas){
                               if(err){
                                  return console.log(err);
                                  res.status(500).send({ message: 'Error al obtener los artistas', error: err });
                               }else{
                                  if (!albummas) {
                                      res.status(404).send({ message: 'No se encontro ninguna artista.' });
                                  }
                                  else {
                                        res.status(200).send({ albummas })
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

function updateAlbum(req, res) {
    /*
    var params = req.body;
    res.status(200).send({ metodo: "updateAuto", auto: params})
    */
    var albumId = req.params.id;

    var idValido = mongoose.Types.ObjectId.isValid(albumId);

    if (!idValido) {
        res.status(409).send({ message: 'Id no valido' });
    }
    else {
          Album.findByIdAndUpdate(albumId, req.body, {new:true} ,function (err, albumUpdate) {
            if (err) {
                console.log(err)
                res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
            } else {
                if (!albumUpdate) {
                    res.status(404).send({ message: 'No se encuntra el ambum.' });
                }else{
                    res.status(200).send({ data: albumUpdate })
                }
            }
        });
    }

}

function deleteAlbum(req, res) {
    var albumId = req.params.id;
    var idValidor = mongoose.Types.ObjectId.isValid(albumId);

    if (!idValidor) {
        res.status(409).send({ message: 'Id no valido' });
    }
    else {
        /*model.findByIdAndRemove(autoIdr, function(err,auto){
            res.status(200).send({auto})
        });*/
        //Cancion.delate_CancionAlbum(albumId);

        var promise = Album
        .findByIdAndDelete(albumId)
        .exec(function (err, albumsDeletede) {
            if (err) {
                console.log(err)
                res.status(500).send({ message: 'Error al eliminar el album.', error: err })
            }else{
                if (!albumsDeletede) {
                    res.status(404).send({ message: 'El album no se encuntra en la base' });
                }else{
                    Cancion.deleteMany({album: albumsDeletede._id}, function(err, cancionesDeleted){
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
                    Artista.findByIdAndUpdate(albumsDeletede.artista,{ $pull: { albums : albumsDeletede._id } } , {new:true} ,function (err, albumUpdate) {
                        if (err) {
                            console.log(err)
                            res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                        } else {
                            if (!albumUpdate) {
                                res.status(404).send({ message: 'No se encuentra el artista del album.' });
                            }else{
                                //res.status(200).send({ saved: albumUpdate })
                            }
                        }
                    });
                    res.status(200).send({ message: 'El album ha sido eliminado' })
                }
            }
        });

    }
}

function delate_AlbumArtista(id_artista, res) {
    Album.deleteMany({artista: id_artista}, function(err, albumsDeleted){
        if (err) {
            console.log(err)
            res.status(500).send({ message: 'Error al eliminar los albums.', error: err })
        }else{
            if (!albumsDeleted) {
                res.status(404).send({ message: 'Estos albums no se encuentra en la base' });
            }else{
                //res.status(200).send({ message: 'Los albums han sido eliminadas' })
            }
        }
    });

}

module.exports = {
    getAlbum,
    saveAlbum,
    updateAlbum,
    deleteAlbum,
    delate_AlbumArtista
}
