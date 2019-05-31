'use strict'

var album = require('mongoose'),

Schema = album.Schema;
var cancion = require('./cancion');
var artista = require('./artista');

var AlbumSchema = new Schema (
    {
        nombre:{
            type: String,
            trim: true,
            default: '',
            required: [true,'Inserte el nombre del album'],
            index: {
                unique: false,
                dropDups: true
            }
        },
        nocanciones: {
            type: Number,
            trim: true,
            default: 0,
            required: [true,'Inserte el numero de canciones'],
            index: {
                unique: false,
                dropDups: true
            }
        },
        duracion: {
            type: Number,
            trim: true,
            default: 0,
            required: [true,'Inserte la duracion del album'],
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
        pais:{
            type: String,
            trim: true,
            default: '',
            required:false,
            index: {
                unique: false,
                dropDups: true
            }
        },
        canciones:[{
            type: Schema.Types.ObjectId,
            ref: 'Cancion',
            default: null,
            required: false
        }],
        artista:{
            type: Schema.Types.ObjectId,
            ref: 'Artista',
            default: null,
            required: [true, 'Inserte el artista del album']
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


var Album = album.model('Album', AlbumSchema);
module.exports = Album;
