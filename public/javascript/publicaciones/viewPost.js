$(function() {
    //CKEDITOR.replace("editor1");
    document.title = 'Título del post'
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

});