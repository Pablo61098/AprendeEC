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


});

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