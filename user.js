const mongoose = require('mongoose');
var Schema = mongoose.Schema;


//conectando con la db
mongoose.connect("mongodb://localhost/fotos");

var var_gender = ["F","M"];
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Direccion de correo no valido"];

//definiendo el , las validaciones en vez de hacerlas en frontend, en mongo se pueden hacer desde el modelo
/* --mediante la siguiente sintaxis se pueden hacer validaciones personalizadas--
validate:{validator:function(){},message:"Error"},
la function debe retornar un Boolean false = no paso la validacion & true = !false
*/
pw_validator = {
    validator:function(pw) {
        //this hace referencia al objeto del cual se puede obtener cualquier metodo o atributo;
        //El parametro de la function se obtine del valor donde se hace la validacion;
        return this.password_confirmation == pw;
    },
    message:"Las Contrasenas no son iguales"
};


var user_schema = new Schema({
    name:{type:String},
    username:{type:String,required:"Nombre de usuario es obligatorio",maxlength:[50,"Nombre de usuario ha excedido el maximo de caracteres"]},
    password:{type:String,required:"Contrasena es obligatorio",minlength:[8,"Contrasena debe conterner un maximo de 8 caracteres"]},
    age:{type:Number,max:[100,"edad maxima 100"],min:[10,"edad minima 10"]},
    email:{type:String,required:"El correo es obligatorio",match:email_match,validate:pw_validator},
    date_of_birth:{type:Date},
    gender:{type:String,enum:{values:var_gender},message:"Opcion no valida"}
});

// crea un atributo de un documento que no se guarda en la db
user_schema.virtual("password_confirmation").get(function() {
    return this.pass_confirm;
}).set(function(password) {
    this.pass_confirm = password;
})
//exportando el modelo
var User = mongoose.model("User",user_schema);

module.exports.User = User;

//DATATYPES
/*
String
Number
Boolean
Array
Mixed
Buffer
Objectid
*/
