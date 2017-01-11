var Imagen = require('../models/imagenes');

module.exports = function (imagen,req,res) {
    //aqui se brindan los permisos de modificacion de una imagen
    //return true = eres el owner
    //return false = no eres el owner, get the fuck out
    if (req.method === "GET" && req.path.indexOf("edit") < 0) {
        //si entra aqui, es que solo va a ver la imagen
        return true;
    }
    if (typeof imagen.creator == "undefined"){return false;}
        //no tiene owner, nadie las toca


    if(imagen.creator._id.toString() == res.locals.user._id){
        //se verifica que es el owner de la imagen
        
        return true;

    }


    return false;
}
