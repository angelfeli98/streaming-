'use strict'

var express = require('express')

var albumController = require('../controllers/album')

var api = express.Router();

//api.get('/auto/:id?',autoController.prueba)

api.post('/album/buscar',albumController.getAlbum)
api.post('/album/save',albumController.saveAlbum)
api.put('/album/:id?',albumController.updateAlbum)
api.delete('/album/:id?',albumController.deleteAlbum)

module.exports = api;
