var express = require('express');

var router = express.Router();
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



var mysql = require('mysql')
const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database : 'aprendecdb',
	password: '1234'
});

conn.connect(function(err) {
  if (err){
  		console.error('Error connecting: ' + err.stack);
        return;
  }
  console.log("Conectado a la base de datos!");
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
		console.log('Insertado exitosamente');
		recuperarIdMaxAndSaveCategorias('luchoCode','id','post','username_usuario',req.body.id_categoria,'id_categoria','id_post','categoria_post');

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





router.get('/modPublicaciones', function (req, res) {
	res.render('./publicaciones_views/modPublicaciones');
});

router.get('/modPubForos',function(req,res){
	res.render('./publicaciones_views/modPubForos')
});

router.get('/editor',function(req,res){
	res.render('./publicaciones_views/editor')
});

router.get('/viewPost/:id_post/:username',function(req,res){
	let where = "";
	console.log(req.params.username);
	//Verifico que el usuario sea diferente de -1, si lo es, quiere decir que es una petición desde la página informativa
	if(req.params.username != '-1'){
		where = "AND username_usuario='"+req.params.username+"'";
	}else{
		where = "AND publicado=true";
	}
	//Obtengo el post que necesito para mostrar en la vista
	let query = 'Select post.id, post.username_usuario, post.valoracion, post.titulo, post.fecha_hora, '+
	'categoria.nombre, post.contenido, post.publicado from post INNER JOIN categoria_post '+
	'INNER JOIN categoria ON post.id = '+req.params.id_post+' AND categoria_post.id_categoria = categoria.id '+
	' '+where;  
	console.log(query);
	conn.query(query, (err,respuesta)=>{
		if(err){
			console.error(err);
			res.status(404).send('Not found');
		}
		console.log(respuesta);
		let respuesta_view = JSON.stringify(respuesta);
		console.log(respuesta_view);
		res.render('./publicaciones_views/viewPost',{respuesta_view: respuesta_view});
	});
	
});

router.get('/informativo',function(req,res){
	res.render('./publicaciones_views/informativo')
});

router.get('/editorForo',function(req,res){
	res.render('./publicaciones_views/editorForo')
});

router.get('/viewForo',function(req,res){
	res.render('./publicaciones_views/viewForo')
});


module.exports = router;