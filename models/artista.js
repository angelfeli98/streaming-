'use stric'

var casa = require('./casa');
var cancion = require('./cancion');
var album = require('./album');
var artista = require('mongoose'),


Schema = artista.Schema;

var ArtistaSchema = new Schema(
    {
        nombre: {
            type: String,
            trim: true,
            default: '',
            required: [true, 'Inserte el nombre del artista'],
            index:{
              unique: false,
              dropDups: true
            }
        },
        edad:{
            type: Number,
            trim: true,
            default: 0,
            required: [true, 'Inserte la edad del artista'],
            index:{
              unique: false,
              dropDups: true
            }
        },
        canciones:[{
            type: Schema.Types.ObjectId,
            ref: 'Cancion',
            required: false
        }],
        pais: {
            type: String,
            trim: true,
            default: '',
            required: [true, 'Inserte el pais de origen del artista'],
            index:{
              unique: false,
              dropDups: true
            }
        },
        noConsultas: {
            type: Number,
            trim: true,
            default: 0,
            require: false,
            index: {
                unique: false,
                dropDups: true
              }
        },
        albums:[{
            type: Schema.Types.ObjectId,
            ref: 'Album',
            required: false
        }],
        casa:{
            type: Schema.Types.ObjectId,
            ref: 'casa',
            required: [true, 'Insete la casa discorgrafica del artista']
        },
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

var Artista = artista.model('Artista', ArtistaSchema);
module.exports = Artista;
