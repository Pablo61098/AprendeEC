var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');
var crypto = require('crypto');


//Add config multer
// var storage = multer.diskStorage({
// 	//Carpeta donde se almacenaran los archivos
// 	destination: 'public/images/usuarios/',
// 	filename: function(req,file,cb){
// 		console.log('dentro');
// 		cb(null,Math.floor(Math.random()*9000000000) + 10000000000 + path.extname(file.originalname))
// 		// crypto.pseudoRandomBytes(16,function(err,raw){
// 		// 	if(err){
// 		// 		console.error(err);
// 		// 		return cb(err);
// 		// 	}
// 		// 	console.log(file);
// 		// 	cb(null,Math.floor(Math.random()*9000000000) + 10000000000 + path.extname(file.originalname))
// 		// })
// 	}
// });

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/usuarios/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});	
//var upload = multer({dest:'uploads/'});

//Add a controller
//Show all images in folder upload 
router.get('/files',function(req,res){
	const images = fs.readdirSync('public/images/usuarios/');
	var sorted = [];
	for (let item of images){
		if(item.split('.').pop()=== 'png' ||
		item.split('.').pop()=== 'jpg' ||
		item.split('.').pop()=== 'jpeg' ||
		item.split('.').pop()=== 'svg'){
			var abc = {
				"image": "/images/usuarios/"+item,
				"folder": "/"
			}
			sorted.push(abc);
		} 
	}
	res.send(sorted);
});
//Upload image to folder upload 
router.post('/upload',function(req,res,next){
	console.log(req.files);
	//copiamos el archivo a la carpeta definitiva de fotos
	//fs.createReadStream('uploads/'+req.files.filename.name).pipe(fs.createWriteStream('public/images/usuarios/'+req.files.filename.name, function(error){}));
	// //borramos el archivo temporal creado
	// fs.unlink('./uploads/'+req.files[x].filename, function(error){});
	let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('filename');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
    });
	console.log('entrando');
	res.send('back');
});

///delete file
router.post('delete_file',function(req,res,next){
	var url_del = 'public/'+req.body.url_del;
	console.log(url_del);
	if(fs.existsSync(url_del)){
		fs.unlinkSync(url_del);
	}
	res.send('back');
});

//Para subir imagenes al servidor

var middleware = require("../../middleware");

// var app  = express();
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: true}));
// app.set("view engine", "ejs");


// var server = app.listen(3000, function(){
// 	var host = server.address().address
// 	var port = server.address().port

// 	console.log('Conexión exitosa, escuchando en el puerto ', port);
// });


// const {Pool,Client} = require('mysql');
// const poolNosotros = new Pool({
//     user: "luis",
//     password: "1234",
//     host: "localhost",
//     port: 5432,
//     database: "aprendecdb",
//     ssl: { rejectUnauthorized: false }
// });

// poolNosotros.connect()
// .then(() => console.log("Connected succesfully to aprendecdb Database"))
// .catch((e) => console.log(e))
// .finally(() => console.log(""))

var publicacion={};
var publicacionForo={};

router.use(function(req,res,next){
	res.locals.publicacion = publicacion;
	res.locals.publicacionForo = publicacionForo;
	next();
});

var mysql = require('mysql')
const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
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



//Funcion para guardar el foro
router.post('/saveForo',function(req,res){
	console.log(req.body);
	let query= 'Insert into foro values('+req.body.id+','+"'"+req.body.username_usuario+"'"+",'"+req.body.titulo+"'"+','+"'"+req.body.fecha_hora+"'"+','+"'"+req.body.contenido+"',"+""+req.body.publicado+")";
	console.log(query);
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
            res.status(404).send('Not found');
		}
		// comsole.log(req.locals.userName);
		console.log('Insertado exitosamente');
		recuperarIdMaxAndSaveCategorias(req.body.username_usuario,'id','foro','username_usuario',req.body.id_categoria,'id_categoria','id_foro','categoria_foro');
		res.send('Agregado exitosamente');
	});	
});







//Funcion para guardar el post
router.post('/savePost',function(req,res){
	console.log(req.body);
	let query= 'Insert into post values('+req.body.id+','+"'"+req.body.username_usuario+"'"+','+req.body.valoracion+','+"'"+req.body.titulo+"'"+','+"'"+req.body.fecha_hora+"'"+','+""+req.body.publicado+",'"+req.body.contenido+"')";
	console.log(query);
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
            res.status(404).send('Not found');
		}
		// comsole.log(req.locals.userName);
		console.log('Insertado exitosamente');
		recuperarIdMaxAndSaveCategorias(req.body.username_usuario,'id','post','username_usuario',req.body.id_categoria,'id_categoria','id_post','categoria_post');

		res.send('Agregado exitosamente');
	});	
});


//Función para guardar las categorias de un post o foro 
function saveCatePostOrForo(idPostForo, idsCategoria,nomCampoCategoria, nomCampoPostForo,nombreTabla){
	let query='Insert into ' + nombreTabla + '('+nomCampoPostForo+','+ nomCampoCategoria+')'+' values '+formarValores(idPostForo,idsCategoria);
	console.log(query);
	conn.query(query, (err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log('Insertando en saveCatePostOrForo');

	});
}




//Función para formar la cadena que tendrá el contenido de los valores
function formarValores(idPostForo,listaCategorias){
	let valores = "";
	for (var i = 0 ; i< listaCategorias.length; i++){
		valores = valores+'('+idPostForo+','+listaCategorias[i]+'),';
	}
	console.log(valores.substring(0,valores.length-1));
	return valores.substring(0,valores.length-1);
}

//Funcion para recuperar el id max de un post o foro dado un username y segui el hilo para guardar las categorias
function recuperarIdMaxAndSaveCategorias(username,nombreCampo, nombreTabla,campoUserId,idsCategoria,nomCampoCategoria,nomCampoPostForo,nombreTablaCategoria){
	let query = 'Select max(' + nombreCampo+') as max_id from '+ nombreTabla + ' where '+campoUserId+"='" + username +"'";
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
			return;
		}
		let id = respuesta[0].max_id;
		saveCatePostOrForo(id,idsCategoria,nomCampoCategoria,nomCampoPostForo,nombreTablaCategoria);
		console.log(id)
	});
}

//Consulta para traer las categorias
router.get('/categorias',function(req,res){
	let query = 'Select * from categoria';
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
            res.status(404).send('Not found');
		}
		console.log('Obteniendo las categorias.');
		res.send(respuesta);
	});
});

//Funcion para obtener los posts
router.get('/getForo/:username',function(req,res){
	let query = "Select * from foro where username_usuario='"+req.params.username+"'";
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		res.send(respuesta);		
	});
});

//Funcion para obtener los posts
router.get('/getPost/:username',function(req,res){
	let query = "Select * from post where username_usuario='"+req.params.username+"'";
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		res.send(respuesta);		
	});
});

//Servicio para alterar la publicacion o foro
router.put('/publicarPub/:username/:id/:tabla',function(req,res){
	let query = 'UPDATE ' +req.params.tabla + ' set publicado=true'+' WHERE id='+req.params.id+" AND username_usuario='"+req.params.username+"'";
	console.log(query);
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found')
		}
		console.log(respuesta);
		res.send('publicado');
	});
});

//Servicio para eliminar un post o foro
router.delete('/deletePub/:username/:id/:tabla',function(req,res){
	let query = 'DELETE from '+req.params.tabla + ' WHERE id='+req.params.id+" AND username_usuario='"+req.params.username+"'";
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		res.send('Eliminado');
	});
});

//--------- PARA INFORMATIVO ---------------
router.get('/getLastPost',function(req,res){
	//Obtenemos los últimos posts de todos los usuarios para mostrar en informativo
	let query = 'Select post.id, post.username_usuario, post.valoracion, post.titulo, post.fecha_hora, '+
	'categoria.nombre from post INNER JOIN categoria_post '+
	'INNER JOIN categoria ON post.id = categoria_post.id_post AND categoria_post.id_categoria = categoria.id '+
	'AND post.publicado=true ORDER BY `post`.`id` DESC ';
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		res.send(respuesta);
	});
});

//--------- PARA INFORMATIVO ---------------
router.get('/getLastForo',function(req,res){
	//Obtenemos los últimos posts de todos los usuarios para mostrar en informativo
	let query = 'Select foro.id, foro.username_usuario, foro.titulo, foro.fecha_hora, '+
	'categoria.nombre from foro INNER JOIN categoria_foro '+
	'INNER JOIN categoria ON foro.id = categoria_foro.id_foro AND categoria_foro.id_categoria = categoria.id '+
	'AND foro.publicado=true ORDER BY `foro`.`id` DESC ';
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		res.send(respuesta);
	});
});

//Servicio para añadir un comentario a un post o foro
router.post('/putComentario',function(req,res){
	//obtenemos el nombre de los campos y los valores, así como también las tablas
	console.log(req.body);
	let id = req.body.id;
	let username_usuario=req.body.username_usuario;
	let id_post_foro=req.body.id_post_foro;
	let texto = req.body.texto;
	let fecha_hora = req.body.fecha_hora;
	let tabla = req.body.tabla;
	let id_c=req.body.campos[0];
	let username_usuario_c=req.body.campos[1];
	let id_post_foro_c=req.body.campos[2];
	let texto_c=req.body.campos[3];
	let fecha_hora_c=req.body.campos[4];
	//Armamos la consulta
	let query = 'Insert into '+ tabla + '('+id_c+", "+username_usuario_c+","+id_post_foro_c+", "+texto_c+","+fecha_hora_c+")"+
	" values"+ '('+id+",'"+username_usuario+"',"+id_post_foro+", '"+texto+"','"+fecha_hora+"')";
	console.log(query);
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		res.send('Ok');
	});
})

//Servicio para obtener los comentarios de un post o foro
router.get('/getComentarios/:id_p_f/:tabla/:campo_p_f',function(req,res){
	console.log(req.params);
	const tabla = req.params.tabla;
	const id_p_f= req.params.id_p_f;
	const campo_p_f = req.params.campo_p_f;
	//Armo la consulta
	const query = "SELECT "+tabla+".id, "+tabla+".username_usuario, "+
	tabla+"."+campo_p_f+", "+tabla+".texto, "+tabla+".fecha_hora, "+
	"usuario.foto FROM "+tabla+" INNER JOIN usuario ON "+
	tabla+".username_usuario=usuario.username AND "+tabla+"."+campo_p_f+"="+id_p_f+" ORDER BY "+tabla+".fecha_hora DESC ";
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		//Mando la respuesta en json
		console.log(respuesta);
		let respuesta_view = JSON.parse(JSON.stringify(respuesta));
		console.log(respuesta_view);
		//COnvertimos los bytes
		//let convertido = new Buffer(respuesta_view[0].contenido.data).toString('ascii');
		//console.log(convertido);
		//respuesta_view[0].contenido = convertido;
		res.send(respuesta_view);
	});
})


//Servicio para poner una respuesta en la base de datos
router.post('/putRespuesta',function(req,res){
	let insertar= "INSERT INTO usuario_foro_respuesta(id,username_usuario,id_foro,respuesta,fecha_hora) VALUES("+
	"null,'"+req.body.username_usuario+"',"+req.body.id_foro+", '"+req.body.respuesta+"', '"+req.body.fecha_hora+"')";
	conn.query(insertar,(err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		res.send('Respuesta insertada.');
	})
})

//Funcion para obtener las respuestas
function filtrar(lista){
	for(var i=0; i<lista.length; i++){
		let convertido= new Buffer(lista[i].respuesta.data).toString('ascii');
		console.log(convertido);
		lista[i].respuesta=convertido;
	}
	return lista;
}

//Servicio para obtener respuestas
router.get('/respuestas/:id_foro/',function(req,res){
	let consulta= "SELECT * FROM usuario_foro_respuesta WHERE id_foro="+req.params.id_foro;
	conn.query(consulta, (err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		let respuesta_view = JSON.parse(JSON.stringify(respuesta));
		//Convertimos los bytes
		respuesta_view=filtrar(respuesta_view);
		console.log(respuesta_view);
		console.log('Respondiendo....')
		res.send(respuesta_view);
	});
});

router.get('/modPublicaciones', middleware.isLoggedIn ,function (req, res) {
	res.render('./publicaciones_views/modPublicaciones');
});

router.get('/modPubForos',function(req,res){
	res.render('./publicaciones_views/modPubForos')
});

router.get('/editor',function(req,res){
	res.render('./publicaciones_views/editor')
});


//Servicio para ver el foro 
router.get('/viewForo/:id_foro/:username/:action',function(req,res){
	let where = "";
	console.log(req.params.username);
	//Siempre va a ser diferente de -1. 
	if(req.params.username != '-1'){
		where = "AND username_usuario='"+req.params.username+"'";
	}else{
		where = "AND publicado=true";
	}
	//Obtengo el post que necesito para mostrar en la vista
	let query = 'Select foro.id, foro.username_usuario, foro.titulo,'+
	'foro.publicado from foro WHERE foro.id = '+req.params.id_foro+' '+where;  
	console.log(query);
	conn.query(query, (err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		let respuesta_view = JSON.parse(JSON.stringify(respuesta));
		publicacionForo=respuesta_view[0];
		console.log(publicacionForo);
		if(req.params.action=='0')
			res.send('Encontrado');
		if(req.params.action=='1')
			res.redirect('/viewForo');
	});
	
});




//Servicio para ver el post 
router.get('/viewPost/:id_post/:username/:action',function(req,res){
	let where = "";
	console.log(req.params.username);
	//Verifico que el usuario sea diferente de -1, si lo es, quiere decir que es una petición desde la página informativa
	if(req.params.username != '-1'){
		where = "AND username_usuario='"+req.params.username+"'";
	}else{
		where = "AND publicado=true";
	}
	//Obtengo el post que necesito para mostrar en la vista
	let query = 'Select post.id, post.username_usuario, post.titulo,'+
	'post.publicado from post WHERE post.id = '+req.params.id_post+' '+where;  
	console.log(query);
	conn.query(query, (err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		let respuesta_view = JSON.parse(JSON.stringify(respuesta));
		publicacion=respuesta_view[0];
		console.log(publicacion);
		if(req.params.action=='0')
			res.send('Encontrado');
		if(req.params.action=='1')
			res.redirect('/verPost');
	});
	
});

//Servicio para obtener todo lo necesario para ver el foro
router.get('/getForoView/:id/:username',function(req,res){
	let id_foro = req.params.id;
	let username_foro = req.params.username;

	let query = 'Select * from foro where id = '+id_foro + " AND username_usuario='"+ username_foro + "'";
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		let respuesta_view = JSON.parse(JSON.stringify(respuesta));
		console.log(respuesta_view[0]);
		console.log(respuesta_view[0].contenido.data);
		//COnvertimos los bytes
		let convertido = new Buffer(respuesta_view[0].contenido.data).toString('ascii');
		console.log(convertido);
		respuesta_view[0].contenido = convertido;
		res.send(respuesta_view[0]);
	});
});

//Servicio para obtener las categorias a las que pertenece determinado foro
router.get('/categoriaForo/:foro_id',function(req,res){
	let foro_id = req.params.foro_id;
	let consulta = 'SELECT categoria.nombre from categoria INNER JOIN categoria_foro ON '+
	'categoria_foro.id_categoria = categoria.id AND categoria_foro.id_foro ='+foro_id;
	conn.query(consulta, (err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		let respuesta_view = JSON.parse(JSON.stringify(respuesta));
		res.send(respuesta_view);

	});
});





//Servicio para obtener todo lo necesario para ver el post
router.get('/getPostView/:id/:username',function(req,res){
	let id_post = req.params.id;
	let username_post = req.params.username;

	let query = 'Select * from post where id = '+id_post + " AND username_usuario='"+ username_post + "'";
	conn.query(query,(err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		let respuesta_view = JSON.parse(JSON.stringify(respuesta));
		console.log(respuesta_view[0]);
		console.log(respuesta_view[0].contenido.data);
		//COnvertimos los bytes
		let convertido = new Buffer(respuesta_view[0].contenido.data).toString('ascii');
		console.log(convertido);
		respuesta_view[0].contenido = convertido;
		res.send(respuesta_view[0]);
	});
});

router.get('/categoriaPost/:post_id',function(req,res){
	let post_id = req.params.post_id;
	let consulta = 'SELECT categoria.nombre from categoria INNER JOIN categoria_post ON '+
	'categoria_post.id_categoria = categoria.id AND categoria_post.id_post ='+post_id;
	conn.query(consulta, (err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		let respuesta_view = JSON.parse(JSON.stringify(respuesta));
		res.send(respuesta_view);

	});
});

//Servicio para verificar si ya se califico a un post o a una respusta de un foro
router.get('/verificar_calificacion/:id_/:username/:tabla/:campo_p_f', function(req,res){
	let id_p_f = req.params.id_;
	let username = req.params.username;
	let  tabla = req.params.tabla;
	let name_campo_f_p = req.params.campo_p_f;

	let consulta = 'SELECT calificacion FROM '+tabla + " WHERE username_usuario='"+username+"' AND "+name_campo_f_p+"="+id_p_f;
	conn.query(consulta, (err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta)
		res.send(respuesta)
	})
})

//Servicio para calificar un post o foro
router.post('/calificar/',function(req,res){
	let tabla = req.body.tabla;
	let id_=req.body.id_;
	let campo_p_f = req.body.nameCampo;
	let calificacion = req.body.calificacion;
	let username_usuario=req.body.username_usuario;
	let consulta = 'INSERT INTO '+tabla + "(username_usuario,"+campo_p_f+",calificacion)"+
	" VALUES('"+username_usuario+"',"+id_+","+calificacion+")";
	conn.query(consulta, (err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		res.send(calificacion);
	});
})


router.get('/modPublicaciones', function (req, res) {
	res.render('./publicaciones_views/modPublicaciones');
});

router.get('/modPubForos',function(req,res){
	res.render('./publicaciones_views/modPubForos')
});

router.get('/editor',function(req,res){
	res.render('./publicaciones_views/editor')
});


router.get('/verPost',function(req,res){
	res.render('./publicaciones_views/viewPost');
});

router.get('/informativo',function(req,res){
	console.log('Aqui');
	res.render('./publicaciones_views/informativo')
});

router.get('/editorForo',function(req,res){
	res.render('./publicaciones_views/editorForo')
});

router.get('/viewForo',function(req,res){
	res.render('./publicaciones_views/viewForo')
});


module.exports = router;