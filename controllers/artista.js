'use stric'

var Artista = require('../models/artista');
var Cancion = require('../models/cancion');
var Album = require('../models/album');
var Casa = require('../models/casa');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);


function saveArtista(req, res){

    var artista = new Artista(req.body);

    artista.save(function (err, artistaSaved) {
      if (err) {
          console.log(err)
          res.status(500).send({ message: 'Error al guardar el artista.', error: err });
      }
      else {
          Casa.findByIdAndUpdate(req.body.casa, {$push: { artistas : artistaSaved._id }} , {new:true} ,function (err, casaUpdate) {
              if (err) {
                  console.log(err)
                  res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
              } else {
                  if (!casaUpdate) {
                      res.status(404).send({ message: 'No se encuentra la Casa discografica.' });
                  }else{
                      res.status(200).send({ saved: artistaSaved })
                  }
              }
          });


      }
    });

}

function getArtista(req, res){

    var mode = req.body.mode;
    var promise = null;
    var nombre = null;

    switch (mode) {
        case mode = 1:
            var salto = req.body.salto;
            promise = Artista
            .find()
            .select('nombre foto')
            .sort({'noConsultas' : -1})
            .limit(10)
            .skip(salto)
            .exec(function(err,artistas){
               if(err){
                  return console.log(err);
                  res.status(500).send({ message: 'Error al obtener los artistas', error: err });
               }else{
                  if (!artistas) {
                      res.status(404).send({ message: 'No se encontro ninguna artista.' });
                  }
                  else {
                        res.status(200).send({ artistas })
                  }
               }
            });

        break;

        case mode = 2:
            var campo = req.body.campo;
                promise = Artista
                .find({"nombre" : campo})
                .select('nombre foto')
                .exec(function(err,artistas){
                   if(err){
                      return console.log(err);
                      res.status(500).send({ message: 'Error al obtener los artistas', error: err });
                   }else{
                       if (!artistas) {
                           res.status(404).send({ message: 'No se encontro ninguna artista.' });
                       }
                       else {
                             res.status(200).send({ artistas })
                       }
                   }
                 });

        break;

        case mode = 3:
            var idartista = req.body.id;
            var idValido = mongoose.Types.ObjectId.isValid(idartista);

            if (!idValido) {
                res.status(409).send({ message: 'Id no valido' });
            }
            else {
                promise = Artista
                .findById(idartista)
                .exec(function(err,artista){
                   if(err){
                      return console.log(err);
                      res.status(500).send({ message: 'Error al obtener los artistas', error: err });
                   }else{
                      if (!artista) {
                          res.status(404).send({ message: 'No se encontro ninguna artista.' });
                      }
                      else {
                            var newnumber = artista.noConsultas + 1;
                            var promise2 = null;
                            promise2  = Artista
                            .findByIdAndUpdate(artista._id,{ "noConsultas" : newnumber },{new : true})
                            .populate({
                              path: 'canciones',
                              // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
                              select: 'nombre imagen',
                              options: { limit: 10 , noConsultas: -1 }
                            })
                            .populate({
                              path: 'albums',
                              // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
                              select: 'nombre imagen',
                              //options: { limit: 10 , noConsultas: -1 }
                            })
                            .exec(function(err,artistamas){
                               if(err){
                                  return console.log(err);
                                  res.status(500).send({ message: 'Error al obtener los artistas', error: err });
                               }else{
                                  if (!artistamas) {
                                      res.status(404).send({ message: 'No se encontro ninguna artista.' });
                                  }
                                  else {
                                        res.status(200).send({ artistamas })
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

function updateArtista(req, res) {
    /*
    var params = req.body;
    res.status(200).send({ metodo: "updateAuto", auto: params})
    */
    var artistaId = req.params.id;

    var idValido = mongoose.Types.ObjectId.isValid(artistaId);

    if (!idValido) {
        res.status(409).send({ message: 'Id no valido' });
    }
    else {
        Artista.findByIdAndUpdate(artistaId, req.body, {new:true} ,function (err, artistaUpdate) {
            if (err) {
                console.log(err)
                res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
            } else {
                if (!artistaUpdate) {
                    res.status(404).send({ message: 'No esta la info del pago.' });
                }else{
                    res.status(200).send({ data: artistaUpdate })
                }
            }
        });
    }

}

function deleteArtista(req, res) {
    var artistaId = req.params.id;
    var idValidor = mongoose.Types.ObjectId.isValid(artistaId);

    if (!idValidor) {
        res.status(409).send({ message: 'Id no valido' });
    }
    else {
        /*model.findByIdAndRemove(autoIdr, function(err,auto){
            res.status(200).send({auto})
        });*/
        //Cancion.delate_CancionArtista(artistaId);
        //Album.delate_AlbumArtista(artistaId);

        Artista.findByIdAndRemove(artistaId, function(err,artistaDelated){
            if (err) {
                console.log(err)
                res.status(500).send({ message: 'Error al eliminar la cancion.', error: err })
            }else{
                if (!artistaDelated) {
                    res.status(404).send({ message: 'Este artista no se encunetra en la base' });
                }else{
                    Cancion.deleteMany({artista: artistaDelated._id}, function(err, cancionesDeleted){
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
                    Album.deleteMany({artista: artistaDelated._id}, function(err, artistasDeleted){
                        if (err) {
                            console.log(err)
                            res.status(500).send({ message: 'Error al eliminar las canciones.', error: err })
                        }else{
                            if (!artistasDeleted) {
                                res.status(404).send({ message: 'Esas canciones no se encuentra en la base' });
                            }else{
                                //res.status(200).send({ message: 'Las canciones han sido eliminadas' })
                            }
                        }
                    });
                    Casa.findByIdAndUpdate(artistaDelated.casa, { $pull: { artistas : artistaDelated._id } }  , {new:true} ,function (err, casaUpdate) {
                        if (err) {
                            console.log(err)
                            res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
                        } else {
                            if (!casaUpdate) {
                                res.status(404).send({ message: 'No se encuentra la Casa discografica.' });
                            }else{
                                //res.status(200).send({ saved: artistaSaved })
                            }
                        }
                    });
                    res.status(200).send({ message: 'El artista ha sido eliminada' })
                }
            }
        });

    }
}

module.exports = {
    getArtista,
    saveArtista,
    updateArtista,
    deleteArtista
}
