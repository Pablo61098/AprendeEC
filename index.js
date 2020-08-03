const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      fileUpload = require('express-fileupload'),
      session = require("express-session"),
      mysql = require("mysql")
    //   flash = require("connect-flash")
      ;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'luis',
    password: '1234',
    database: 'aprendecdb'
});

connection.connect();



const sesionRoutes = require("./routes/sesion");
const comprasRoutes = require("./routes/compras");
const adminRoutes = require("./routes/admin");
const tiendaRoutes = require("./routes/tienda");
const participacionRoutes = require("./routes/participacion");




app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(session({
    name: 'authentication',
    secret: 'hola',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge:  /*1000 * 60  * 10*/1000 * 60  * 60 * 24
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

        req.user = user;
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
app.use(require('./routes/publicaciones'));
app.use("/admin",adminRoutes);
app.use("/tienda", tiendaRoutes);
app.use("/participacion", participacionRoutes);



app.listen(process.env.PORT || 3000, process.env.IP ,function(){
    console.log("Se ha iniciado un servidor en el puerto 3000");
});



//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