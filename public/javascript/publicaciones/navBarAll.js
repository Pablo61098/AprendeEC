let contNotiNew=0;
var presion=0;
$(function(){
    
    console.log('HOl');
    $('#btnFiltro').click(function(){
        presion++;
        verificar();
    });
    $('#btnSearch').click(function(){
        console.log('Busqueda');
        buscar($('#barraBuscar').val().trim());
    });
    $('#notificacionesBtn').click(function(){
        console.log('Se ha presionado el boton de notificaciones');
    })

    obtenerNotificaciones();
    escucharNotificaciones();
});

function obtenerNotificaciones(){
    //Obtiene las notificaciones siempre y cuando esté logeado el usuario
    if($("#usuarioActivo").text()){
        let http = new XMLHttpRequest();
        http.open("GET", "/notificacion/getAllNotificaciones/"+$("#usuarioActivo").text(), true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function(){
            if(http.readyState == 4 && http.status == 200){
                let notificaciones = JSON.parse(http.responseText);
                console.log('Notificaciones obtenidas..');
                console.log(notificaciones);
                printNotificaciones(notificaciones);
            }
        }
        http.send(null);
    }
}

//Funcion para imprimir las notificaciones en la barra de notificaciones
function printNotificaciones(notificaciones){
    for (var i=0; i< notificaciones.length; i++){
        putNotify(notificaciones[i]);
    }
    
}

//Mandar notificacion y poner en el contenedor de notificaciones
function putNotify(noti){
    let ref = "";
    if(noti.tipo == "foro"){
        ref="/viewForo/"+noti.id_tipo+"/-1/1";
    }else if(noti.tipo == "post"){
        ref="/viewPost/"+noti.id_tipo+"/-1/1";
    }else{
        ref="#";
    }
    let noti_tag = '<a id=noti'+noti.id_notificacion+' class="dropdown-item" href="'+ref+'">'+
    noti.sms+'</a> ' + '<div class="dropdown-divider"></div>';
    $('#notificacionContainer').append(noti_tag);
}

function escucharNotificaciones(){
    //Si hay algo en usuario activo me pongo a la escucha delas notificaciones
    if($('#usuarioActivo').text()){
        var socket = io('http://localhost:4000');
        socket.on($("#usuarioActivo").text(),function(sms){
            console.log(sms);
            contNotiNew++;
            $.notify("Nueva notificación de "+sms.from,{
                autoHide: true,
                className: "success",
            });
            let notiNuevo = {};
            notiNuevo.tipo=sms.tipo;
            notiNuevo.id_tipo = sms.id;
            notiNuevo.sms=sms.Message;
            notiNuevo.id_notificacion = (contNotiNew*-1);
            putNotify(notiNuevo);
        })
    }
}

function verificar(){
    if(presion==1){
        $('#navFilter').prop('style','background-color: #e3f2fd');
    }else if(presion==2){
        $('#navFilter').prop('style','background-color: #e3f2fd; display: none');
    }
    if(presion>=2){
        presion=0;
    }
}

function buscar(texto){
    //verificamos si el texto contiene algo
    if(texto){
        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("POST", "/informativoSet", true);
        ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajaxRequest.onreadystatechange = function(){
            if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
                console.log('Definiendo buscar');
                window.open('/informativo','_self')
            }
        }
        let post_foro='foro' ;
        if($('#search_tipo').prop('checked')==true){
            post_foro='post';
        }
        let categoria = $('#search_categoria').prop('checked');
        let username = $('#search_username').prop('checked');
        console.log(post_foro + " "+categoria+" "+username);
        let objetoBusqueda="post_foro="+post_foro+"&"+
        "categoria="+categoria + "&username="+username + "&texto="+texto;
        ajaxRequest.send(objetoBusqueda);
    }

}