'use stric'
var cancion = require('mongoose'),

Schema = cancion.Schema;
var artista = require('./artista');
var album = require('./album');

var CancionSchema = new Schema(
    {
      _id:{
          type: Schema.Types.ObjectId,
          trim: true,
          default: null,
          required: [true,'Inserte un id']
      },
      nombre: {
          type: String,
          trim: true,
          default: "",
          required: [true,'Inserte un nombre'],
          index: {
              unique: false,
              dropDups: true
            }
        },
        genero: {
            type: String,
            trim: true,
            default: "",
            required: [true,'Inserte el genero de la cancion'],
            index: {
                unique: false,
                dropDups: true
              }
          },
        duracion: {
            type: Number,
            trim: true,
            default: 0.0,
            required: [true,'Inserte la duracion de la cancion'],
            index: {
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
          artista:{
              type: Schema.Types.ObjectId,
              ref: 'Artista',
              default: null,
              require: [true, 'Inserte el artista de la cancion']
          },
          artistacola:[{
              type: Schema.Types.ObjectId,
              ref: 'Artista',
              default: null,
              required: false
          }],
          imagen: {
              type: Buffer,
              default:'',
              required: false,
              index:{
                unique: false,
                dropDups: true
              }
          },
          audio: {
              type: Buffer,
              default:null,
              required: [false, 'Ingresa el audio'],
              index:{
                unique: false,
                dropDups: true
              }
          },
          album: {
              type: Schema.Types.ObjectId,
              ref: 'Album',
              default: null,
              require: [true, 'Inserte el album de la cancion']

          }
    },
    {
        timestamps:true
    }
);

var Cancion = cancion.model('Cancion', CancionSchema);
module.exports = Cancion;
