let post_Show={};
let categoria_post={};
$(function() {
    //CKEDITOR.replace("editor1");
    
        //Visualización de las estrellas entrada
    $('#btnStar1').mouseover(function() {
            pintarEstrellas($(this).attr('id'));
        })
        .mouseout(function() {
            despintarEstrellas($(this).attr('id'));
        });
    $('#btnStar2').mouseover(function() {
            pintarEstrellas($(this).attr('id'));
        })
        .mouseout(function() {
            despintarEstrellas($(this).attr('id'));
        });
    $('#btnStar3').mouseover(function() {
            pintarEstrellas($(this).attr('id'));
        })
        .mouseout(function() {
            despintarEstrellas($(this).attr('id'));
        });
    $('#btnStar4').mouseover(function() {
            pintarEstrellas($(this).attr('id'));
        })
        .mouseout(function() {
            despintarEstrellas($(this).attr('id'));
        });
    $('#btnStar5').mouseover(function() {
            pintarEstrellas($(this).attr('id'));
        })
        .mouseout(function() {
            despintarEstrellas($(this).attr('id'));
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
});

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

//Ponemos el contenido del post en el front end
function putPostFrontEnd(objeto, categorias){
    document.title = objeto.titulo;
    let titulo = '<h3 style="text-align:center">'+objeto.titulo+'</h3>';
    $('#contenidoPost').append(titulo);
    $('#contenidoPost').append(objeto.contenido);
}
