'use strict'

var express = require('express')

var artistaController = require('../controllers/artista')

var api = express.Router();

//api.get('/auto/:id?',autoController.prueba)

api.post('/artista/buscar',artistaController.getArtista)
api.post('/artista',artistaController.saveArtista)
api.put('/artista/:id?',artistaController.updateArtista)
api.delete('/artista/:id?',artistaController.deleteArtista)

module.exports = api;
