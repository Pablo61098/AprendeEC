let post_Show={};
let categoria_post={};
$(function() {
    //CKEDITOR.replace("editor1");
    getComentarios($('#id_post').text(),'usuario_post_comentario','id_post');
        //Visualización de las estrellas entrada
    $('#btnStar1').mouseover(function() {
            pintarEstrellas($(this).attr('id'));
        })
        .mouseout(function() {
            despintarEstrellas($(this).attr('id'));
        }).click(function(){
            //Si hace click le daremos una valoracion de 1 al post
            calificar(1, $('#id_post').text(),$('#usuarioActivo').text(),'usuario_post_calificacion','id_post');
        });
    $('#btnStar2').mouseover(function() {
            pintarEstrellas($(this).attr('id'));
        })
        .mouseout(function() {
            despintarEstrellas($(this).attr('id'));
        }).click(function(){
            //Si hace click le daremos una valoracion de 1 al post
            calificar(2, $('#id_post').text(),$('#usuarioActivo').text(),'usuario_post_calificacion','id_post');
        });
    $('#btnStar3').mouseover(function() {
            pintarEstrellas($(this).attr('id'));
        })
        .mouseout(function() {
            despintarEstrellas($(this).attr('id'));
        }).click(function(){
            //Si hace click le daremos una valoracion de 1 al post
            calificar(3, $('#id_post').text(),$('#usuarioActivo').text(),'usuario_post_calificacion','id_post');
        });
    $('#btnStar4').mouseover(function() {
            pintarEstrellas($(this).attr('id'));
        })
        .mouseout(function() {
            despintarEstrellas($(this).attr('id'));
        }).click(function(){
            //Si hace click le daremos una valoracion de 1 al post
            calificar(4, $('#id_post').text(),$('#usuarioActivo').text(),'usuario_post_calificacion','id_post');
        });
    $('#btnStar5').mouseover(function() {
            pintarEstrellas($(this).attr('id'));
        })
        .mouseout(function() {
            despintarEstrellas($(this).attr('id'));
        }).click(function(){
            //Si hace click le daremos una valoracion de 1 al post
            calificar(5, $('#id_post').text(),$('#usuarioActivo').text(),'usuario_post_calificacion','id_post');
        });


    function pintarEstrellas(cod) {
        var rep = cod.substring(cod.length - 1, cod.length);
        //console.log(rep);
        for (var i = 1; i <= rep; i++) {
            $('#btnStar' + i).attr('class', 'btn-primary');
        }
    }

    function despintarEstrellas(cod) {
        var rep = cod.substring(cod.length - 1, cod.length);
        for (var i = 1; i <= rep; i++) {
            $('#btnStar' + i).attr('class', 'btn');
        }
    }
    printPost();
    

    $('#btnEnviar').click(function(){
        //Aqui mandamos a guardar en la base de datos el comentario 
        let comentario_texto = $('#comentario').val();
        comentario_texto=comentario_texto.trim();
        let username = $('#usuarioActivo').text();
        console.log(comentario_texto + " "+ username);
        console.log($('#id_post').text());
        if($('#publicado').text()==1){
            if(comentario_texto==""){
                mensaje('Comentario inválido','No se puede guardar un comentario vacío.','Ok');
            }else{
                
                saveComment(comentario_texto,username,$('#id_post').text());
            }
        }else{
            mensaje('Post no publicado','Para comentar debe publicar el post.','Aceptar');
            $('#comentario').val('');
        }
        
    });

    $('#btnYesPublicar').click(function(){
        //Aqui mandamos a cambiar el estado de la publicación en true 
        $('#modalMessage').modal('toggle');  
    });

    verificacionCalificacion($('#id_post').text(),$('#usuarioActivo').text(),'usuario_post_calificacion','id_post');
});

//Verifico si el usuario ya ha calificado o no
function verificacionCalificacion(id_, username,tabla,campoBuscar){
    let http = new XMLHttpRequest();
    http.open('GET','/verificar_calificacion/'+id_+'/'+username+'/'+tabla+'/'+campoBuscar, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            let respuesta=JSON.parse(http.responseText);
            console.log('respuesta')
            console.log(respuesta);
            //Si ya esta calificado solo quito las estrellas
            if(respuesta.length>0){
                quitarEstrellasYPonerCalificacion(respuesta[0].calificacion,1);
            }else{
                if($('#publicado').text()=='0'){
                    quitarEstrellasYPonerCalificacion(0,0);
                }
            }
                
            
        }
    }
    http.send(null);
}

//Función para poner la calificación en pantalla
function quitarEstrellasYPonerCalificacion(puntaje,accion){
    $('#contenedorEstrellas > button').each(function(){
        $(this).remove();
    });
    let frase='';
    if(accion==1){
        frase = '<p><strong>Calificación otorgada: </strong>'+puntaje+' ptos</p>';
    }else if (accion==0){
        //El post aun no está publicado, entonces no debo mostrar la calificación
        frase = '<p><strong>Aún no está publicado el post para calificarlo</strong></p>';

    }
    $('#contenedorEstrellas').append(frase);
}

//Funcion para mandar la valoración a la base de datos. Solo se va a poder valorar una vez.
function calificar(puntaje, id_, username,tabla,campoBuscar){
    //let tabla = 'usuario_post_calificacion';
    //let campoBuscar='id_post';//Este campo es el unico que varia en la base de datos en dicha tabla para post o foro.
    let http = new XMLHttpRequest();
    http.open('POST','/calificar/', true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            let calificacion = http.responseText;
            console.log(calificacion);
            //Una vez calificado tengo que quitar las estrellas
            quitarEstrellasYPonerCalificacion(calificacion,1);
        }
    }
    let objeto = "username_usuario="+username+
    "&id_="+id_+
    "&calificacion="+puntaje+
    "&tabla="+tabla+
    "&nameCampo="+campoBuscar;
    console.log(objeto);
    http.send(objeto);
}

//Funcion para obtener los comentarios del post
function getComentarios(id_,tabla,campoBuscar){
    console.log(id_+" "+tabla + " "+ campoBuscar);
    let http = new XMLHttpRequest();
    http.open('GET','/getComentarios/'+id_+'/'+tabla+'/'+campoBuscar, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            let comentariosLista = JSON.parse(http.responseText);
            console.log(comentariosLista);
            //Ahora mando a imprimir esos comentarios
            if(comentariosLista.length>0)
                printComentario(comentariosLista);
            else
                $('#seccionComentarios').append('<div><strong>No existe comentarios en esta publicación.</strong></div>');
        }
    }
    http.send(null);
}

function limpiarComentarios(){
    $('#seccionComentarios > div').each(function(){
        $(this).remove();
    })
}

function printComentario(lista){
    for (var i=0 ; i<lista.length; i++){
        let imagen = lista[i].foto;
        if(imagen==null){
            imagen='images/user_default.png';
        }
        //Recorremos la lista y armamos el comentario
        let registro = '<div class="row" id=comm'+lista[i].id+'>'+
        '<div class="col-sm-1 text-right">'+
            //'<img src="'+imagen+'" width="60px" height="60px">'+
            '<img src="'+imagen+'" width="60px" height="60px">'+
            '</div>' +
            '<div class="col-sm-11 ">'+
                '<h6><strong>'+lista[i].username_usuario+'</strong></h6>'+
                '<p id=comm_txt='+lista[i].id+'>'+lista[i].texto+'</p>'+
            '</div>'+
        '</div>'+
        '<hr>';
        $('#seccionComentarios').append(registro);
    }
}

//Funcion para mostrar un mensaje
function mensaje(titulo,cuerpo,smsBoton){
    $('#exampleModalLabel').text(titulo);
    $('#contenidoModel').text(cuerpo);
    $('#btnYesPublicar').text(smsBoton);
    $('#modalMessage').modal('show');
}


//Funcion para guardar el comentario del post de un usuario registrado
function saveComment(comentario,username,id_post){
    let http = new XMLHttpRequest();
    http.open('POST','/putComentario/', true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            console.log(http.responseText);
            //En este objeto se almacena el post que se requiere
            mensaje('Guardado','Se ha guardado el comentario exitosamente','OK');
            $('#comentario').val('');
            limpiarComentarios();
            getComentarios($('#id_post').text(),'usuario_post_comentario','id_post');

        }
    }
    //Construimos el objeto que vamos a mandar 
    let fecha = new Date();
    let objeto = "id=null"+
    "&username_usuario="+username+
    "&id_post_foro="+id_post+
    "&texto="+comentario+
    "&fecha_hora="+fecha+
    "&tabla=usuario_post_comentario"+
    "&campos=id&campos=username_usuario&campos=id_post&campos=texto&campos=fecha_hora";
    console.log(objeto);
    http.send(objeto);
}

//Funcion para imprimir los datos necesarios
function printPost(){
    let titulo = $('#pub').text();
    console.log('Titulo del post-> '+ titulo);
    if(titulo){
        //Si título contiene algo, entonces si existe un post que mostrar
        let id_post=$('#id_post').text();
        let username_post=$('#username_post').text();
        console.log(username_post + " "+ id_post);
        //Con esos parametros mando a obtener todos los datos necesarios para mostrar el post
        //Entre esos parametros estan comentarios y categoria del post
        getPostShow(id_post,username_post);
    }else{
        //NO existe un post y debemos retornar al modulo informativo
        window.open('/informativo','_self');
    }
}

//Funcion para hacer una petición al servidor para obtener el post
function getPostShow(id,username){
    let http = new XMLHttpRequest();
    http.open('GET','/getPostView/'+id+'/'+username, true);
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            console.log(http.responseText);
            //En este objeto se almacena el post que se requiere
            post_Show = JSON.parse(http.responseText);
            //Ahora obtenemos la categoria al que pertenece el post
            getCategoriasPost(post_Show.id);
        }
    }
    http.send(null);
}

//Funcion para obtener las categorias de un post
function getCategoriasPost(id){
    let http = new XMLHttpRequest();
    http.open('GET','/categoriaPost/'+id, true);
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            console.log(http.responseText);
            //En este objeto se almacena las categorias del post que se requiere
            categoria_post = JSON.parse(http.responseText);
            //Ahora imprimimos el contenido del post en el front end
            putPostFrontEnd(post_Show,categoria_post);
        }
    }
    http.send(null);
}

function getCategoriasTag(lista){
    let tag = "<strong>Tags: </strong>";
    for(var i=0 ; i< lista.length; i++){
        tag = tag + "<em>"+ lista[i].nombre + "</em>, "
    }
    tag = tag.substring(0,tag.length-2)+".";
    return tag;
}

//Ponemos el contenido del post en el front end
function putPostFrontEnd(objeto, categorias){
    document.title = objeto.titulo;
    let titulo = '<h3 style="text-align:center">'+objeto.titulo+'</h3>';
    $('#contenidoPost').append(titulo);
    $('#contenidoPost').append(objeto.contenido);
    $('#tags').append(getCategoriasTag(categorias));
}
