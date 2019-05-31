const uri= "mongodb+srv://angelfelipe:angelfelipe@servidor2-ubkzd.mongodb.net/Paax?retryWrites=true&w=majority";
var usuario = require('mongoose');

options = {
  useNewUrlParser: true
};

usuario.connect(uri,options,function (err) {

   if (!err){
      console.log('Successfully connected to server1');
    }else{
      console.log('Error al conectarse al server1');
    }
});

module.exports = exports = usuario;
