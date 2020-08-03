const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      fileUpload = require('express-fileupload'),
      session = require("express-session"),
      mysql = require("mysql"),
      methodOverride = require("method-override")
      fs = require('fs')
    //   flash = require("connect-flash")
      ;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: 'aprendecdb'
});

connection.connect();

const sesionRoutes = require("./routes/sesion");
const comprasRoutes = require("./routes/compras");
const adminRoutes = require("./routes/admin");
const accountRoutes = require("./routes/account");
const tiendaRoutes = require("./routes/tienda");
const participacionRoutes = require("./routes/participacion");


app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(session({
    name: 'authentication',
    secret: 'hola',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge:  1000 * 60 * 10
    }
}));

app.use((req, res, next) => {
    
    console.log('\n0');
    console.log(req.session);
    console.log(res.locals);
    if(!(req.session && req.session.userName)){
        return next();
    }

    connection.query(`select * from usuario where(username = '${req.session.userName}')`, function(err, results, fields){
        console.log('1');
        if(err){
            console.log('2');
            return next(err);
        }
        if(results.length == 0){
            console.log('3');
            return next();
        }

        console.log('4');
        user = results[0];
        user.contrasena = undefined;
        // console.log(user);
        req.user = user;
        
        if(fs.existsSync(`./public/fotos/${req.user.foto}`)) {
            console.log("The file exists.");
            req.user.profilePictureRoute = `http://localhost:3000/fotos/${req.user.foto}`;
        } else {
            console.log('The file does not exist.');
            req.user.profilePictureRoute = `${req.user.foto}`;
        }
        
        if(req.user.tipoRegistro == 1 ){
            res.locals.name = `${req.user.nombre}  ${req.user.apellido}`;
        }else{
            res.locals.name = user.username;
        }
        
        res.locals.userName = user.username;
        console.log(res.locals);
        console.log('5');

        next();
    });

});


// app.use(flash());

// app.use(function(req, res, next){
//     // 
//     next();
// });

app.use(sesionRoutes);
app.use("/compras", comprasRoutes);
app.use("/account", accountRoutes);
app.use(require('./routes/publicaciones'));
app.use("/admin",adminRoutes);
app.use("/tienda", tiendaRoutes);
app.use("/participacion", participacionRoutes);



app.listen(process.env.PORT || 3000, process.env.IP ,function(){
    console.log("Se ha iniciado un servidor en el puerto 3000");
});



//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