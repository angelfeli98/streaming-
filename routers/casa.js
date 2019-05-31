'use strict'

var express = require('express')

var casaController = require('../controllers/casa')

var api = express.Router();

//api.get('/auto/:id?',autoController.prueba)

api.post('/casa/datos',casaController.getCasa)
api.post('/casa',casaController.saveCasa)
api.put('/casa/:id?',casaController.updateCasa)
api.delete('/casa/:id?',casaController.deleteCasa)

module.exports = api;
