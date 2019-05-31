'use strict'

var express = require('express')

var cancionController = require('../controllers/cancion')

var api = express.Router();

//api.get('/auto/:id?',autoController.prueba)

api.post('/cancion/buscar',cancionController.getCancion)
api.post('/cancion',cancionController.saveCancion)
api.put('/cancion/:id?',cancionController.updateCancion)
api.delete('/cancion/:id?',cancionController.deleteCancion)

module.exports = api;
