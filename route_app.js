const express = require('express');
const Imagen = require('./models/imagenes');
var router = express.Router();
const findImage = require('./middlewares/find_image');
const fs = require('fs');
router.get("/",function (req,res) {
    res.render("app/home")
});

/*--REST--*/
//CRUD: Create,read,update,delete
router.all("/imagenes/:id*",findImage);

router.get("/imagenes/new",function (req,res) {
    res.render("app/imagenes/new");

});

router.get("/imagenes/:id/edit", function (req,res) {
        res.render("app/imagenes/edit");


});


//imagen individual
router.route("/imagenes/:id")
.get(function (req,res) {
        res.render("app/imagenes/show");
})
.put(function (req,res) {
        res.locals.imagen.title = req.fields.title;
        res.locals.imagen.save(function (err) {
            if(!err){
                res.render("app/imagenes/show");
            }
            else
            {
                res.render("app/imagenes/"+req.params.id+"/edit")
            }
        })
})
.delete(function (req,res) {
    //uso este por busca y elimina el documento en un solo query

    Imagen.findOneAndRemove({_id:req.params.id},function (err) {
        if (!err) {
            res.redirect("/app/imagenes");
        } else {
            console.log(err);
            res.redirect("/app/imagenes/"+req.params.id);
        }
    });
  /* //otra forma , la que tu hiciste solo
  Imagen.find({_id:req.params.id}).remove(function(err){   //.exec();
       if(err){res.render(err)};
       res.redirect("/app/imagenes");

   })*/
})


        /*{
            //imagen.remove();
            //res.redirect("/app/imagenes");
})*/
//collecion de imagenes
router.route("/imagenes")
.get(function (req,res) {
    Imagen.find({creator:res.locals.user._id},function (err,imagenes) {
        if (err) { res.redirect("/app");return; }
        res.render("app/imagenes/index",{imagenes:imagenes});
    })

})
.post(function (req,res) {

 var data = {
     title: req.fields.title,
     creator: res.locals.user._id,
     extension: req.files.archivo.name.split(".").pop()
 }

 imagen = new Imagen(data);
console.log(req.files.archivo);
 imagen.save(function (err) {
     if (!err) {
         fs.rename(req.files.archivo.path,"public/imagenes/"+imagen._id+"."+imagen.extension);
         res.redirect("/app/imagenes/"+imagen._id);
     }else {
         res.render(err);
     }
 });

})



module.exports = router;
