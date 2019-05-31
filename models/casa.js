'use stric'

var casa = require('mongoose'),

Schema = casa.Schema;

var CasaSchema = new Schema(
      {
          nombre: {
              type: String,
              trim: true,
              default: '',
              required: [true,'Inserta nombre de la casa discografica'],
              index: {
                  unique: true,
                  dropDups: true
              }
          },
          pais: {
              type: String,
              default: '',
              required: [true,'Inserta el pais de origen'],
              index: {
                  unique: false,
                  dropDups: true
              }
          },

          artistas: [{
          type: Schema.Types.ObjectId,
          trim: true,
          default: null,
          ref: 'Artista',
          required: false,
          index: {
              unique: false,
              dropDups: true
          }
          }],
          foto: {
              type: Buffer,
              default: '',
              required: false,
              index: {
                  unique: false,
                  dropDups: true
              }
          }
    },
    {
        timestamps: true
    }
);

var Casa = casa.model('Casa', CasaSchema);
module.exports = Casa;
