const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const User = require('./models/user').User;
const session = require('express-session');
const cookieSession = require('cookie-session');
const route_app = require('./route_app');
const session_middleware = require('./middlewares/session');
const methodOverride = require('method-override');
const formidable = require('express-formidable');


//para servir archivos estaticos
app.use('/public',express.static('public'));//para servir archivos estaticos

app.use(bodyParser.json());//para peticiones apliccation/json
app.use(bodyParser.urlencoded({extended: true}));//para obtener datos de la url ya sea get o post
//para usar demas verbos http rest
app.use(methodOverride("_method"))
//cookies
app.use(cookieSession({
    name: "session",
    keys: ["llave-1","llave-2"]
    })
);

app.use(formidable({keepExtension:true}));
/*--sesiones
app.use(session({
    secret: "123akjjyglc123kingz",
    resave: false,
    saveUninitialized: false

    })
);*/

app.set('view engine',"jade");//motor de vistas

app.get('/',(req,res) =>{
    res.render('index');
    console.log(req.session.user_id);
});

app.get('/signup',(req,res) =>{
    User.find(function(err,doc){
        console.log(doc);
        res.render('signup');
    });

});

app.post('/users',(req,res) =>{
    // los datos se obtienen como atributo del objeto body, con el nombre que tiene el input en el html
    console.log("Contraseña: "+req.body.password);
    console.log("Email: "+req.body.email);
    var user = new User({email:req.fields.email,
                        password:req.fields.password,
                        password_confirmation: req.fields.pass_confirm,
                        username:req.fields.username
                    });
    console.log(user.password_confirmation);
    user.save(function(us){
        res.send("Informacion guardada exitosamente");
    },function(err){
        if (err){
            console.log(String(err));
            res.send("Error al guardar informacion");
            }
        })
});

app.get('/login',(req,res) =>{

        res.render('login');
});

/*---este es el uso de find en moongose, este devuelve un arreglo con los documentos que cumplan el requisito----
User.find({email: req.body.email,password:req.body.password}<++el query,"los campos a devolver",callback++>function(err,docs){
if(err){console.log(err);}
else{
console.log(docs);
res.send("hola");
}
 }
*/


app.post("/sessions",function (req,res){

    User.findOne({email: req.fields.email,password:req.fields.password},function(err,doc){
            req.session.user_id = doc._id;
            res.redirect("/app");

    })
});

app.use("/app",session_middleware);
app.use("/app",route_app);
app.listen(8080);
