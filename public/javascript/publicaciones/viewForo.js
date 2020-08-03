let foro_Show={};
let categoria_foro={};
let accion=-1;
$(function() {
    CKEDITOR.replace("editor1",{
        extraPlugins: 'imagebrowser',
        removePlugins: 'easyimage',
        //filebrowserBrowseUrl: '/files',
        imageBrowser_listUrl: '/files'
        // filebrowserUploadUrl: '/upload'
    });
    printPost();
    getComentarios($('#id_foro').text(),'usuario_foro_comentario','id_foro');
    getRespuestas($('#id_foro').text())
    $('#btnEnviar').click(function(){
        //Aqui mandamos a guardar en la base de datos el comentario 
        let comentario_texto = $('#comentario').val();
        comentario_texto=comentario_texto.trim();
        let username = $('#usuarioActivo').text();
        console.log(comentario_texto + " "+ username);
        console.log($('#id_foro').text());
        if($('#publicado').text()==1){
            if(comentario_texto==""){
                mensaje('Comentario inválido','No se puede guardar un comentario vacío.','Ok');
            }else{
                accion=0;//Indica que se enviará un comentario
                saveComment(comentario_texto,username,$('#id_foro').text());
            }
        }else{
            mensaje('Foro no publicado','Para comentar debe publicar el foro.','Aceptar');
            $('#comentario').val('');
        }
        
    });
    $('#btnYesPublicar').click(function(){
            if(accion==1){
            let contenidoRespuesta=CKEDITOR.instances.editor1.getData();
            console.log(contenidoRespuesta);
            putRespuesta($('#usuarioActivo').text(),$('#id_foro').text(),contenidoRespuesta);
        }
        $('#modalMessage').modal('toggle');  
    });

    $('#btnEnviarResp').click(function(){
        if($('#publicado').text()==1){
            if(CKEDITOR.instances.editor1.getData().trim()==""){
                accion=-1;//Indica que se enviará una respuesta
                mensaje('Advertencia','No se puede guardar respuestas vacías.','Aceptar');
            }else{
                accion=1;//Indica que se enviará una respuesta
                mensaje('Confirmación','¿Está seguro de que desea publicar su repuesta?.','Aceptar');
            }
            
        }else{
            accion=-1;
            mensaje('Foro no publicado','Para responder debe publicar el foro.','Aceptar');
        }
        
    });

});

//Funcion para guardar el comentario del foro de un usuario registrado
function saveComment(comentario,username,id_foro){
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
            getComentarios($('#id_foro').text(),'usuario_foro_comentario','id_foro');

        }
    }
    //Construimos el objeto que vamos a mandar 
    let fecha = new Date();
    let objeto = "id=null"+
    "&username_usuario="+username+
    "&id_post_foro="+id_foro+
    "&texto="+comentario+
    "&fecha_hora="+fecha+
    "&tabla=usuario_foro_comentario"+
    "&campos=id&campos=username_usuario&campos=id_foro&campos=texto&campos=fecha_hora";
    console.log(objeto);
    http.send(objeto);
}

function limpiarComentarios(){
    $('#seccionComentarios > div').each(function(){
        $(this).remove();
    })
}

//Funcion para obtener los comentarios del foro
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

function printComentario(lista){
    for (var i=0 ; i<lista.length; i++){
        //Recorremos la lista y armamos el comentario
        let registro = '<div class="row" id=comm'+lista[i].id+'>'+
        '<div class="col-sm-1 text-right">'+
            //'<img src="'+imagen+'" width="60px" height="60px">'+
            '<h6 class="comentarioForoUsername"><strong>'+lista[i].username_usuario+'</strong></h6>'+
            '</div>'+
            '<div class="col-sm-11 ">'+
                '<p class="comentarioForoTexto" id=comm_txt='+lista[i].id+'>'+lista[i].texto+'</p>'+
            '</div>'+
        '</div>';
        
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


//Funcion para imprimir los datos necesarios
function printPost(){
    let titulo = $('#pub').text();
    console.log('Titulo del foro-> '+ titulo);
    if(titulo){
        //Si título contiene algo, entonces si existe un foro que mostrar
        let id_foro=$('#id_foro').text();
        let username_foro=$('#username_foro').text();
        console.log(username_foro + " "+ id_foro);
        //Con esos parametros mando a obtener todos los datos necesarios para mostrar el foro
        //Entre esos parametros estan comentarios y categoria del foro
        getForoShow(id_foro,username_foro);
    }else{
        //NO existe un foro y debemos retornar al modulo informativo
        window.open('/informativo','_self');
    }
}

//Funcion para hacer una petición al servidor para obtener el foro
function getForoShow(id,username){
    let http = new XMLHttpRequest();
    http.open('GET','/getForoView/'+id+'/'+username, true);
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            console.log(http.responseText);
            //En este objeto se almacena el post que se requiere
            foro_Show = JSON.parse(http.responseText);
            //Ahora obtenemos la categoria al que pertenece el post
            getCategoriasForo(foro_Show.id);
        }
    }
    http.send(null);
}

//Funcion para obtener las categorias de un foro
function getCategoriasForo(id){
    let http = new XMLHttpRequest();
    http.open('GET','/categoriaForo/'+id, true);
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            console.log(http.responseText);
            //En este objeto se almacena las categorias del foro que se requiere
            categoria_foro = JSON.parse(http.responseText);
            //Ahora imprimimos el contenido del foro en el front end
            putForoFrontEnd(foro_Show,categoria_foro);
        }
    }
    http.send(null);
}

//Ponemos el contenido del foro en el front end
function putForoFrontEnd(objeto, categorias){
    document.title = objeto.titulo;
    let titulo = '<h3 style="text-align:left">'+objeto.titulo+'</h3>';
    $('#contenidoForo').append(titulo);
    $('#contenidoForo').append(objeto.contenido);
    $('#tags').append(getCategoriasTag(categorias));

}

function getCategoriasTag(lista){
    let tag = "<strong>Tags: </strong>";
    for(var i=0 ; i< lista.length; i++){
        tag = tag + "<em>"+ lista[i].nombre + "</em>, ";
    }
    tag = tag.substring(0,tag.length-2)+".";
    return tag;
}

//------- RESPUESTAS: GET AND PUT ----------

//Funcion para poner la respuesta en la base de datos
function putRespuesta(username,id_foro,resp){
    let http = new XMLHttpRequest();
    http.open('POST','/putRespuesta/', true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            //console.log(http.responseText);
            CKEDITOR.instances.editor1.setData();
            getRespuestas($('#id_foro').text());
        }
    }
    let fecha = new Date();
    let respuesta = "id=null"+
    "&username_usuario="+username+
    "&id_foro="+id_foro+
    "&respuesta="+resp+
    "&fecha_hora="+fecha;
    http.send(respuesta);
}

//Funcion para obtener las respuestas
function getRespuestas(id_foro){
    let http = new XMLHttpRequest();
    http.open('GET','/respuestas/'+id_foro, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            //console.log('Obteniendo respuestas')
            let respuestas=JSON.parse(http.responseText);
            console.log(respuestas);
            limpiarRespuestas()
            printRespuestas(respuestas);
        }
    }
    http.send(null);
}

//Limpiar las respuestas
function limpiarRespuestas(){
    $('#seccionRespuestas > div').each(function(){
        $(this).remove();
    })
}


//Funcion para imprimir las respuestas.
function printRespuestas(lista){
    console.log('tam: '+lista.length);
    if(lista.length<=0){
        $('#seccionRespuestas').append('<div><strong>No existe respuestas en esta publicación.</strong></div>');
    }else{
        for(var i = 0 ; i < lista.length; i++){
            let fin = "<hr>";
            if(i>=lista.length-1)
                fin="";
            let registro = 
            '<div class="row" id="res'+lista[i].id+'">'+
                '<div class="container">'+
                    '<p>'+lista[i].respuesta+'</p>'+
                '</div>'+
                '<div class="col-sm-2">'+
                    '<button class="btn btn-outline-primary" id=btnUp'+lista[i].id+'><i class="fas fa-arrow-circle-up"></i></button>'+
                    '<button class="btn btn-outline-primary" id=btnDown'+lista[i].id+'><i class="fas fa-arrow-circle-down"></i></button>'+
                '</div>'+
                '<div class="col-sm-2">'+
                    '<p id=cali'+lista[i].id+'><strong>Calificación:</strong>...</p>'+
                '</div>'+
                '<div class="col-sm-4">'+
                    '<p><strong>Respondido: </strong><em id="respFecha'+lista[i].id+'">'+lista[i].fecha_hora+'</em></p>'+
                '</div>'+
                '<div class="col-sm-4 text-center">'+
                    '<img src="images/user_default.png" style="width: 60px; height: 60px">'+
                    '<p><strong>'+lista[i].username_usuario+'</strong><br>'+
                        // '<strong>Puntos: </strong>0'+
                    '</p>'+
                '</div>'+
            '</div>'+
            //' <hr style="height:2px;border-width:0;color:gray;background-color:black">';
            fin;
            $('#seccionRespuestas').append(registro);
            //Obtengo las calificaciones de cada respuesta
            obtenerCalificacion(lista[i].id);
        }
        listenToButtons('seccionRespuestas');
        
    }
}

//Funcion para obtener la calificación de la respuesta
function obtenerCalificacion(id_respuesta){
    let http = new XMLHttpRequest();
    http.open('GET','/getCalificacionRespuesta/'+id_respuesta, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            let respuesta=JSON.parse(http.responseText);
            console.log('respuesta')
            console.log(respuesta[0].total); 
            printCalificacion(respuesta[0].total,id_respuesta);              
        }
    }
    http.send(null);
}

//Funcion para modificar las calificaciones de las respuestas
function printCalificacion(cali,id_tag){
    $('#cali'+id_tag).text('');
    if(cali ==null){
        cali=0;
    }
    $('#cali'+id_tag).append('<strong>Calificación: </strong>'+cali+' pts');
}

//Funcion para mandar la valoración a la base de datos. Solo se va a poder valorar una vez.
function calificar(puntaje, id_, username,tabla,campoBuscar){
    //let tabla = 'usuario_respuesta_calificacion';
    //let campoBuscar='id_respuesta';//Este campo es el unico que varia en la base de datos en dicha tabla para post o foro.
    let http = new XMLHttpRequest();
    http.open('POST','/calificar/', true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            let calificacion = http.responseText;
            console.log(calificacion);
            //Una vez calificado tengo que quitar las estrellas
            //quitarEstrellasYPonerCalificacion(calificacion,1);
            accion=-1;
            mensaje('Calificado','Respuesta calificada','OK');
            //Actualizo el puntaje de la calificacion
            obtenerCalificacion(id_);
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
//Verifico si el usuario ya ha calificado o no la respuesta
function verificacionCalificacion(id_, username,tabla,campoBuscar,calificacion){
    let http = new XMLHttpRequest();
    http.open('GET','/verificar_calificacion/'+id_+'/'+username+'/'+tabla+'/'+campoBuscar, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange=function(){
        if(http.readyState== 4 && http.status==200){
            let respuesta=JSON.parse(http.responseText);
            console.log('respuesta')
            console.log(respuesta);
            //Si ya esta calificado solo quito las estrellas
            if(respuesta.length<=0){
                //Calificar
                console.log('Mandando a calificar')
                calificar(calificacion,id_, username,tabla,campoBuscar);
            }else{
                accion=-1;
                mensaje('Respuesta ya calificada','La respuesta ya ha sido calificada por ' + $('#usuarioActivo').text(),"OK");
            }
                
            
        }
    }
    http.send(null);
}

//Add listener to Buttons
function listenToButtons(id_seccion){
    console.log('Eyy');
    botones=document.getElementsByTagName("button");
    for(var i = 0 ; i<botones.length ; i++){
        if(botones[i].id.includes('btnUp')){
            let id=botones[i].id.substring(5);
            console.log(id);
            botones[i].addEventListener('click',function(){
                if($('#publicado').text()=='1'){
                    //quitarEstrellasYPonerCalificacion(0,0);
                    verificacionCalificacion(id,$('#usuarioActivo').text(),'usuario_respuesta_calificacion','id_respuesta',1);
                }else{
                    accion=-1;
                    mensaje('Foro no publicado','Para calificar respuestas debe publicar el foro.','Aceptar');
                }
                
            });
        }else if(botones[i].id.includes('btnDown')){
            let id=botones[i].id.substring(7);
            console.log(id);
            botones[i].addEventListener('click',function(){
                if($('#publicado').text()=='1'){
                    //quitarEstrellasYPonerCalificacion(0,0);
                    verificacionCalificacion(id,$('#usuarioActivo').text(),'usuario_respuesta_calificacion','id_respuesta',-1);
                }else{
                    accion=-1;
                    mensaje('Foro no publicado','Para calificar respuestas debe publicar el foro.','Aceptar');
                }
            });
        }

    }
}