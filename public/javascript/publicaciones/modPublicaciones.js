let listaPost=[];
let checked=-1;
const PUBLICADO='Publicado';
const NO_PUBLICADO='No publicado';
let accion=0;
$(function() {
    // $('#barraNavegacion').load('navbar.html');
    disabledButtons();
    getPosts();
    $('#btnCrear').click(function() {
        window.open('/editor', '_self')
    });
    $('#btnPublicar').click(function() {
        //Debajo debe ir el evento que se genera. En este caso la publicación del post en el sitio
        $('#exampleModalLabel').text('Publicar Post');
        $('#contenidoModel').text('¿Está seguro de que desea publicar el post?. Una vez publicado no se podrá editar.');
        $('#modalMessage').modal('show');
        accion=1;
    });
    $('#btnVer').click(function() {
        window.open('/viewPost', '_blanck');
    });
    $('#btnEliminar').click(function(){
        $('#exampleModalLabel').text('Eliminar Post');
        $('#contenidoModel').text('¿Está seguro de que desea eliminar el post?');
        $('#modalMessage').modal('show');
        accion=2;
    });

    $('#btnYesPublicar').click(function(){
        //Aqui mandamos a cambiar el estado de la publicación en true 
        console.log('Publicar');     
        $('#modalMessage').modal('toggle');  
        if(accion==1)
            publicarPost();
        if(accion==2)
            eliminarPost();
    });

});

//Funcion para eliminar un post
function eliminarPost(){
    let id_post = checked;
    let username = 'luchoCode';
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("DELETE", "/deletePub/"+username+'/'+id_post+'/post', true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            console.log('Eliminado exitosamente');
            //window.open('/modPublicaciones')
            $('#'+id_post).remove();
        }
    }
    ajaxRequest.send(null);
}


//Funcion para cabiar el estado de la publicación
function publicarPost(){
    let id_post = checked;
    let username = 'luchoCode';
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("PUT", "/publicarPub/"+username+'/'+id_post+'/post', true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            console.log('Actualizado exitosamente');
            $('#estadoPost'+id_post).text(PUBLICADO);  
            $('#revisor'+id_post).prop('checked',false);
            checked=-1;
            disabledButtons();
        }
    }
    ajaxRequest.send(null);
}

//Inicializo los botones a disabled 
function disabledButtons(){
    $('#btnPublicar').prop('disabled',true);
    $('#btnVer').prop('disabled',true);
    $('#btnEliminar').prop('disabled',true);
    $('#btnEditar').prop('disabled',true);    
}

//Pongo a los botones en enabled
function enabledButtons(){
    $('#btnPublicar').prop('disabled',false);
    $('#btnVer').prop('disabled',false);
    $('#btnEliminar').prop('disabled',false);
    $('#btnEditar').prop('disabled',false);    
}


//Obtenemos los posts del usuario
function getPosts(){
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", "/getPost", true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            listaPost=categorias=JSON.parse(ajaxRequest.responseText);
            console.log(listaPost);   
            printPosts(listaPost);     
        }
    }
    ajaxRequest.send(null);
}

//Add listener to checkboxes
function listenToCheckBox(){
    checkboxes = document.getElementsByClassName("checkbox");
    console.log(checkboxes);
    for(let i=0 ;i<checkboxes.length; i++){
        checkboxes[i].addEventListener('click',function(){
            //Obtengo el id del post
            let id = $(this).attr('id');
            id = id.substring(7,id.length);
            console.log($(this).prop('checked'));
            if($(this).prop('checked')==true){
                //pongo en false a el checkbox que esta activo
                if(checked!=-1){
                    console.log('Doble marcado');
                    $('#revisor'+checked).prop('checked',false);
                }
                checked=id;
                enabledButtons();
                //Verifico si está publicado o no. Si está Publicado, no se puede publicar dos veces y tampoco editar.
                //Caso contrario, sí.
                let estado = $('#estadoPost'+checked).text();
                console.log(estado);
                if(estado==PUBLICADO){
                    $('#btnPublicar').prop('disabled',true);
                    $('#btnEditar').prop('disabled',true);  
                }
            }else{
                checked=-1;
                disabledButtons();
            }
            console.log(checked);
            //if($('#estadoPost'+))
        });
    }
}




//Ponemos los posts en la vista del usuario
function printPosts(lista){
     for(var i=0 ;i<lista.length ; i++){
        //Variable para almacenar el valor de publicado o no publicado. 
        let publicado;
        if(lista[i].publicado==1){
            publicado=PUBLICADO;
        }else{
            publicado=NO_PUBLICADO;
        }

        let registros = '<div class="row" id="'+lista[i].id+'">'+
                    '<div class="col-sm-1 mt-5">'+
                    '<input class=checkbox type="checkbox" id="revisor'+lista[i].id+'" name="checkBox'+lista[i].id+'">'+
                    '</div>'+
                    '<div class="col-sm-11">'+
                    '<h3>'+lista[i].titulo+'</h3>' +
                    '<p><strong>Comentarios: </strong>0<br>'+
                    '<strong>Calificación: </strong>'+lista[i].valoracion+'<br>'+
                    '<strong>Estado: </strong> <em id="estadoPost'+lista[i].id+'">'+publicado+'</em><br>'+
                    '</p>'+
                    '</div>'+
                    '<div class="container">'+
                    '<hr>'+
                    '</div>'+
                    '</div>';
        console.log(registros);
        $('#verPosts').append(registros);
     }
     //Coloco los event listener en los checkboxes
     listenToCheckBox();
}