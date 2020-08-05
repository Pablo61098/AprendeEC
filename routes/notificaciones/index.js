var express = require('express');
var router = express.Router();
var http = require('http').createServer(router);
var io = require('socket.io')(http);


var mysql = require('mysql');
const middlewareObj = require('../../middleware');
const conn = mysql.createConnection({
	host: 'localhost',
	user: 'luis',
	database : 'aprendecdb',
	password: process.env.LOCAL_MYSQL_PASSWORD
});

conn.connect(function(err) {
  if (err){
  		console.error('Error connecting: ' + err.stack);
        return;
  }
  console.log("Conectado a la base de datos!");
});



http.listen(4000,function(){
    console.log("EScuchando");
    io.on("connection",function(socket){
        console.log("Usuario "+ socket.id);
        socket.on("SMS", function(sms){
            console.log('RECIBIDOOOOOOOOOOOOOOOOOOOOOOOOOO')
            console.log(sms);   
            if(sms.from!=sms.To){
                if(sms.from){
                    guardarNotificacion(sms);
                    socket.broadcast.emit(sms.To,sms);
                }else{
                    console.log('Usuario no logeado')
                }
                
            }else{
                console.log('No se va a enviar el mensaje porque va para el mismo.')
            }
        })
    })
})

router.get('/getAllNotificaciones/:usuario', middlewareObj.isLoggedIn, function(req,res){
    let consulta = "SELECT * FROM notificaciones WHERE username_to='"+req.params.usuario+"'";
    conn.query(consulta,(err,respuesta)=>{
        if(err){
			console.error(err);
        }
        console.log('Imprimiendo respuesta de getAllNotificaciones...');
        console.log(respuesta);
        res.send(respuesta);
    })
})

//Funcion para guardar los datos en la base de datos
function guardarNotificacion(sms){
    let consulta = 'INSERT INTO notificaciones(id_notificacion,username_to,username_from, sms, tipo, visto, id_tipo) '+
    "VALUES(null,'"+sms.To+"','"+sms.from+"','"+sms.Message + "','"+sms.tipo+"',false,"+sms.id+")";
    conn.query(consulta,(err,respuesta)=>{
        if(err){
			console.error(err);
        }
        console.log('Imprimiendo repsuesta de guardarNotificaciones');
        console.log(respuesta);
    });
}


module.exports = router;