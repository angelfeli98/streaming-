var bodyParser = require('body-parser')
var express = require('express')
var cors = require('cors');
var app = express()

var api = require('./routers/cancion');
var api2 = require('./routers/casa');
var api3 = require('./routers/artista');
var api4 = require('./routers/album');
var api5 = require('./routers/playlist');

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors({origin: 'http://localhost:4200'}))

app.use(function(req,res,next){
    //puede ser consumidad desde cualquier lugar
    res.header('Acces-Control-Allow-Origin','*');
    //cabeceras perimtidas
    res.header('Acces-Control-Allow-Headers','X-API-KEY,Origin,X-Requested-With,Content-Type,Accept, Acces-Control-Requested-Method');
    //metodos permitidos
    res.header('Acces-Control-Allow-Methods','GET,POST,PUT,DELETE');
    res.header('Allow','GET,PUT,DELETE,POST');
    next()
});

app.use('/api',api);
app.use('/api',api2);
app.use('/api',api3);
app.use('/api',api4);
app.use('/api',api5);



module.exports = app;
