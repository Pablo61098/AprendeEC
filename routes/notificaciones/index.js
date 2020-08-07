var express = require('express');
var router = express.Router();
var http = require('http').createServer(router);
var io = require('socket.io')(http);
const request = require("request-promise")


var mysql = require('mysql');
const middlewareObj = require('../../middleware');

const conn = mysql.createPool({
    connectionLimit: 100,
    host: process.env.LOCAL_MYSQL_HOST,
    port: 3306,
    user: process.env.LOCAL_MYSQL_USER,
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: process.env.LOCAL_MYSQL_DB
});

conn.getConnection(function (err, conn) {
    if (err) {
        console.log('No se ha podido conectar.');
        return callback(err);
    } else {
        console.log('Conectado a BD.');
    }
});


const RUTA = "https://api.duckduckgo.com";

const RUTA_CORE="https://core.ac.uk:443/api-v2/search/";
const apikey_core = "2k9IVpgoHBwqXvQaPbUDSThixfZ1ytR5";

const respuestaArticulos = titulo =>request({
    uri: `${RUTA_CORE}title=${titulo}?page=1&pageSize=10&apiKey=${apikey_core}`,
    json: true
})


router.get('/getArticleRelated/:titulo',function(req,res){
    console.log('Obteniendo articulo----------');
    console.log(req.params.titulo);
    respuestaArticulos(req.params.titulo)
    .then(respuestaURL =>{
        console.log(respuestaURL);
        res.send(respuestaURL);
    });
});


const respuestaInmediata = busqueda => request({
    uri: `${RUTA}/?q=${encodeURIComponent(busqueda)}&format=json`,
    headers: {
        'Accept-Language': 'es_LA', // Para consumirla en español
    },
    json: true, // Para que lo decodifique automáticamente 
});

router.get('/getTopicsRelated/:q',function(req,res){
    console.log('ENTRANDO A GETTOPICSRELATED..');
    console.log(req.params.q);
    respuestaInmediata(req.params.q)
    .then(datosRespuesta => {
        let definicion = datosRespuesta.Definition,
            resumen = datosRespuesta.AbstractText,
            respuesta = datosRespuesta.Answer,
            url = datosRespuesta.AbstractURL,
            imagen = datosRespuesta.Image,
            relacionados = datosRespuesta.RelatedTopics.map(relacionado => relacionado.Text);
        console.log({ definicion, resumen, respuesta, url, imagen, relacionados });
        res.send(datosRespuesta);
    });
})

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