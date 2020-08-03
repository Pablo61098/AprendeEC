var mapaCategorias=new Map();
var tam=0;
var edicion=-1;
$(function() {
    CKEDITOR.replace("editor1",{
        extraPlugins: 'imagebrowser',
        removePlugins: 'easyimage',
        //filebrowserBrowseUrl: '/files',
        imageBrowser_listUrl: '/files'
        // filebrowserUploadUrl: '/upload'
    });
    cargarCategorias();
    $('#btnGuardar').click(function() {
        var contenido = CKEDITOR.instances.editor1.getData();
        var centi = 0;
        if (tituloForo.value.length == 0) {
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
                titulo = $('#tituloForo').val();
                if(edicion==-1){
                    saveForo(contenido,titulo);
                }else{
                    console.log('mandando datos para actualizar el foro');
                    updateForo(titulo,contenido);
                }
                
            }
            
            
        }
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

    $('#btnSalir').click(function(){
        window.open('/modPubForos', '_self');
    });

    verificarEdicion($('#editarAccion').text());
    console.log('Editar accion '+ $('#editarAccion').text());

});

//Funcion para verificar si es edicion o creacion
function verificarEdicion(id){
    edicion=id;
    if(id==-1){
        console.log('Creando un nuevo foro');
        return;
    }else{
        console.log('Entrando a fase de edicion');
        cargarForoParaEdicion(edicion)
    }
};

function cargarForoParaEdicion(id_foro_edicion){
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", "/getEditorForo/"+id_foro_edicion, true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            console.log(ajaxRequest.responseText);
            let foro=JSON.parse(ajaxRequest.responseText);
            console.log('>>>>>>>'+foro[0].titulo);
            cargarCategoriasParaEdicion(foro[0]);
        }
    
    }
    ajaxRequest.send(null);
}

function cargarCategoriasParaEdicion(objeto){
    let ajaxRequest = new XMLHttpRequest();
    console.log('Objetoooo >> '+ objeto.id);
    ajaxRequest.open("GET", "/categoriaForo/"+objeto.id, true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            console.log('Categorias pertenecientes: ')
            console.log(ajaxRequest.responseText);
            let categorias=JSON.parse(ajaxRequest.responseText);
            console.log(categorias[0].nombre);
            //Cargamos los datos en los campos correspondientes.
            cargarDatosEdicion(objeto,categorias);
        }
    }
    ajaxRequest.send(null);
}

function cargarDatosEdicion(objeto,categorias){
    $('#tituloForo').val(objeto.titulo);
    CKEDITOR.instances.editor1.setData(objeto.contenido);
    cargarCategoriasEdicionForo(categorias);
}

//funcion papara cargar las categorias para la edicion
function cargarCategoriasEdicionForo(categorias){
    for(var i=0 ; i< categorias.length; i++){
        $('#categoria > select> option').each(function(){
            if(categorias[i].nombre==$(this).text()){
                id=$(this).prop('id');
                nombre=$(this).text()
                mapaCategorias.set(id,nombre);
                //break;
            }
            //console.log($(this).text())
        });
    }
    cargarSeleccion(mapaCategorias);
}

//Funcion para mandar a actualizar los datos
function updateForo(titulo,contenido){
    let cat = getCategorias(mapaCategorias);
    let user= $('#usuarioActivo').text();
    let foroUpdate = 'id='+edicion+
    '&username_usuario='+user+
    '&titulo='+titulo+
    '&contenido='+contenido+'&'+cat;
    console.log(foroUpdate); 
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("PUT", "/updateForo", true);
    ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajaxRequest.onreadystatechange = function(){
    if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
        let respuesta  =ajaxRequest.responseText;
        console.log('Respuesta exitoso');
        console.log(respuesta);
        window.location.href = "/modPublicaciones";
        }
    }
    ajaxRequest.send(foroUpdate);
}

//Funcion para limpiar los botones de las categorias 
function limpiar(){
    tam=0;
    $('#catSel').children('button').each(function(){
        $(this).remove();
    });
}

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

//Funcion para guardar los foros del usuario
function saveForo(contenido, titulo){
    let fecha = new Date();
    let cat = getCategorias(mapaCategorias);
    let user= $('#usuarioActivo').text();
    let foro = 'id=null'+
    '&username_usuario='+user+
    '&publicado=false'+
    '&titulo='+titulo+
    '&fecha_hora='+fecha+
    '&contenido='+contenido+'&'+cat;
    console.log(foro); 

    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("POST", "/saveForo", true);
    ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajaxRequest.onreadystatechange = function(){
    if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
        let respuesta  =ajaxRequest.responseText;
        console.log('Respuesta exitoso');
        console.log(respuesta);
        window.location.href = "/modPubForos";
        }
    }
    ajaxRequest.send(foro);
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