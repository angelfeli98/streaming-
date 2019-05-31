'use stric'

var Casa = require('../models/casa');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

function getCasa(req, res) {

  var mode = req.body.mode;
  var promise = null;
  switch (mode) {
    case mode = 1:
        promise = Casa
        .find()
        .select('nombre foto')
        .exec(function(err,casas){
             if(err){
                return console.log(err);
                res.status(500).send({ message: 'Error al obtener las casas discograficas', error: err });
             }else{
                if (!casas) {
                    res.status(404).send({ message: 'No se encontro ninguna Casa discografica.' });
                }
                else {
                      res.status(200).send({ casas })
                }
             }
          });
      break;

      case mode = 2:
        var casaid = req.body.id;
        var idValido = mongoose.Types.ObjectId.isValid(casaid);

        if (!idValido) {
            res.status(409).send({ message: 'Id no valido' });
        }
        else {
            promise = Casa
            .findById(casaid)
            .populate({
                path: 'artistas',
                select: 'nombre foto'
              },
            )
            .exec(function(err, casa){
                if (err) {
                    res.status(500).send({ message: 'Error al hacer la consulta.' });
                } else {
                    if (!casa) {
                        res.status(404).send({ message: 'Usuario no encontrado.' });
                    } else {
                        res.status(200).send({ casa });
                    }
                }
            });
        }

      break;
    default:

  }


}


function saveCasa(req, res){

    var casa = new Casa(req.body);
    casa.save(function (err, casaSaved) {
      if (err) {
          console.log(err)
          res.status(500).send({ message: 'Error al guardar la guardar la Casa discografica.', error: err });
      }
      else {
          res.status(200).send({ saved: casaSaved })
      }
    });

}

function updateCasa(req, res){
    /*
    var params = req.body;
    res.status(200).send({ metodo: "updateAuto", auto: params})
    */
    var casaId = req.params.id;
    var idValidor = mongoose.Types.ObjectId.isValid(casaId);


      if (!idValidor) {
          res.status(409).send({ message: 'Id no valido' });
      }
      else {
          var promise = Casa.findByIdAndUpdate(casaId, req.body, {new:true} ,function (err, casaUpdate) {});

          promise.exec(function(err,casaUpdate){
              if (err) {
                  console.log(err)
                  res.status(500).send({ message: 'Error al actualizar el campo.', error: err })
              } else {
                  if (!casaUpdate) {
                      res.status(404).send({ message: 'No se encuentra la Casa discografica.' });
                  }else{
                      res.status(200).send({ data: casaUpdate })
                  }
              }
          });
      }
}

function deleteCasa(req, res) {
    var casaId = req.params.id;
    var idValidor = mongoose.Types.ObjectId.isValid(casaId);

    if (!idValidor) {
        res.status(409).send({ message: 'Id no valido' });
    }
    else {
        /*model.findByIdAndRemove(autoIdr, function(err,auto){
            res.status(200).send({auto})
        });*/
        Casa.findByIdAndRemove(casaId, function(err,casaDelated){
            if (err) {
                console.log(err)
                res.status(500).send({ message: 'Error al eliminar la playlist.', error: err })
            }else{
                if (!casaDelated) {
                    res.status(404).send({ message: 'Esta casa discografica en la base' });
                }else{
                    res.status(200).send({ message: 'La Casa discografica ha sido eliminada' })
                }
            }
        });
    }
}

module.exports = {
    getCasa,
    saveCasa,
    updateCasa,
    deleteCasa
}
