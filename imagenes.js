const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var img_schema = new Schema({
    title:{type:String,required:true},
    creator:{type:Schema.Types.ObjectId,ref:"User"},
    extension:{type:String,required:true}
});

var Imagen = mongoose.model("Imagen",img_schema);

module.exports = Imagen;
