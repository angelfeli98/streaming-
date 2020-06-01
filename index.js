'user stric'

var app = require('./app');
var database = require('./conection');

var port = process.env.PORT || 7060;

app.listen(7060, function(){
    console.log('Servicio de musica corriendo')
});
