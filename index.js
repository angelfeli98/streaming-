'user stric'

var app = require('./app');
var database = require('./conection');

var port = process.env.PORT || 7080;

app.listen(7070, function(){
    console.log('Servicio de musica corriendo')
});
