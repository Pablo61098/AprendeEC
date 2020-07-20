const express = require("express"),
      app = express()
      bodyParser = require("body-parser")
      ;


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.listen(process.env.PORT || 3000, process.env.IP ,function(){
    console.log("Se ha iniciado un servidor en el puerto 3000");
});

