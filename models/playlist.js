'use stric'

var playlist = require('mongoose'),

Schema = playlist.Schema;
var cancion = require('./cancion');

var PlaylistSchema = new Schema(
    {
        canciones_user: [{
            type: Schema.Types.ObjectId,
            ref: 'Cancion',
            default: null,
            required: false,
            index: {
                unique: true,
                dropDups: true
            }
        }],
        titulo: {
            type: String,
            trim: true,
            default: 'Playlist sin titulo',
            required: [true, 'Inserte el nombre del album'],
            index: {
                unique: false,
                dropDups: true
            }
        },
        descripcion: {
            type: String,
            trim: true,
            default: '',
            required: false,
            index: {
                unique: false,
                dropDups: true
            }
        },
        duracion: {
            type: Number,
            trim: true,
            default: 0,
            required: [true, 'Inserte la duracion del album'],
            index: {
                unique: false,
                dropDups: true
            }
        },
        noCanciones:{
            type: Number,
            trim: true,
            default: 0,
            required: [false, 'Inserte el numero de canciones del album'],
            index: {
                unique: false,
                dropDups: true
            }
        },
        usuario: {
            type: Schema.Types.ObjectId,
            //ref: 'pago',
            default: null,
            required: false
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

var Playlist = playlist.model('Playlist', PlaylistSchema);
module.exports = Playlist;
