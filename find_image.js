//un middleware recibe 3 parametros request,response,next(la funcion que le sigue sabra dios cual)
const Imagen = require('../models/imagenes');
var owner_check = require("./image_permission")
module.exports = function(req,res,next) {
    Imagen.findById(req.params.id)
    .populate("creator")
    .exec(function (err,imagen){
        if(imagen != null && owner_check(imagen,req,res) )
        {
            res.locals.imagen = imagen;
            next();
        }
        else if (req.url == "/imagenes/new") {

            next();
        }
        else {
            res.redirect("/app");
        }
    })
};
