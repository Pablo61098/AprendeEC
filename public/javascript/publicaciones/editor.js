
var mapaCategorias=new Map();
var tam=0;
$(function() {
    CKEDITOR.replace("editor1",{
        extraPlugins: 'imagebrowser',
        removePlugins: 'easyimage',
        //filebrowserBrowseUrl: '/files',
        imageBrowser_listUrl: '/files'
        // filebrowserUploadUrl: '/upload'
    });
    cargarCategorias();
    // $('#barraNavegacion').load('navbar.html');
    $('#btnGuardar').click(function() {
        var contenido = CKEDITOR.instances.editor1.getData();
        var centi = 0;
        if (tituloPost.value.length == 0) {
            centi = centi + 1;
        }
        if (contenido.length == 0) {
            centi = centi + 1;
        }

        if (centi != 0) {
            alert('Verifique que los campos no estén vacíos.');
        } else {
            if(tam==0){
                alert('El post debe pertenecer a una o varias categorías');
            }else{
                alert('Se ha guardado los cambios');
                titulo = $('#tituloPost').val();
                savePost(contenido,titulo);
            }
            
            
        }
    });
    $('#btnSalir').click(function() {
        window.open('/modPublicaciones', '_self');
    });

    $('#btnSeleccionar').click(function(){
        //Boton que va a estar al tanto de las categorías seleccionadas
        var id=$('#categoria').find('option:selected').attr('id');
        var nombre = $('#categoria').find('option:selected').text();
        console.log(id+' - '+nombre);
        /*Almaceno el id como clave y la categoría como valor para las categorias seleccionadas de un post*/
        mapaCategorias.set(id,nombre);
        cargarSeleccion(mapaCategorias);
    });

    $('#btnEliminar').click(function(){
        var id=$('#categoria').find('option:selected').attr('id');
        delete mapaCategorias.delete(id);
        cargarSeleccion(mapaCategorias);
    });

    $('#btnEnviar').click(function(event){
        console.log($('#myFile').val());
    });
});

//Funcion para cargar las categorias seleccionadas
function cargarSeleccion(mapa){
    limpiar();
    for (let [key, value] of mapa) {
        let boton = '<button type="button" class="btn btn-secondary mr-1">'+value+'</button>';
        $('#catSel').append(boton);
        console.log(key + " = " + value);
        tam=tam+1;
    }
}

//Funcion para limpiar los botones de las categorias 
function limpiar(){
    tam=0;
    $('#catSel').children('button').each(function(){
        $(this).remove();
    });
}


//Funcion para cargar las categorías disponibles para los post y foros
function cargarCategorias(){
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", "/categorias", true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            console.log(ajaxRequest.responseText);
            var categorias=JSON.parse(ajaxRequest.responseText);
            llenarCombo(categorias);
        }
    
    }
    ajaxRequest.send(null);
}

//Llenar el comb de categorias
function llenarCombo(listaObjetos){
    //Obtengo las opciones del select
    for(var i=0; i<listaObjetos.length; i++){
        let opcion = "<option id=" + listaObjetos[i].id+">"+ listaObjetos[i].nombre +"</option>"
        $('#categoria > select').append(opcion);
    }
    
}

//Funcion para guardar los posts del usuario
function savePost(contenido, titulo){
    let fecha = new Date();
    let cat = getCategorias(mapaCategorias);
    let user= $('#usuarioActivo').text();
    let post = 'id=null'+
    '&username_usuario='+user+
    '&valoracion=0.0'+
    '&publicado=false'+
    '&titulo='+titulo+
    '&fecha_hora='+fecha+
    '&contenido='+contenido+'&'+cat;
    console.log(post); 

    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("POST", "/savePost", true);
    ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajaxRequest.onreadystatechange = function(){
    if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
        let respuesta  =ajaxRequest.responseText;
        console.log('Respuesta exitoso');
        console.log(respuesta);
        window.location.href = "/modPublicaciones";
        }
    }
    ajaxRequest.send(post);
}

//FUnción para formar la cadena de categorias.
function getCategorias(mapa){
    let cadena="";
    let i=0;
    for (let [key, value] of mapa) {
        cadena=cadena+"id_categoria="+key+"&";
        i++; 
        console.log(cadena);
    }
    return cadena.substring(0,cadena.length-1);
}

