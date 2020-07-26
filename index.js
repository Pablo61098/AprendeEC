const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      fileUpload = require('express-fileupload')
      ;




const sesionRoutes = require("./routes/sesion");



app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.use(sesionRoutes);


app.listen(process.env.PORT || 3000, process.env.IP ,function(){
    console.log("Se ha iniciado un servidor en el puerto 3000");
});

