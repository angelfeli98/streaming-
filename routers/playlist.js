'use strict'

var express = require('express')

var playlistController = require('../controllers/playlist')

var api = express.Router();

//api.get('/auto/:id?',autoController.prueba)

api.post('/playlist/usuario',playlistController.getPlaylist)
api.post('/playlist/save/:token?',playlistController.savePlaylist)
api.post('/playlist/cancion/:id?',playlistController.updatePlaylist)
api.delete('/playlist/:id?',playlistController.deletePlaylist)

module.exports = api;
