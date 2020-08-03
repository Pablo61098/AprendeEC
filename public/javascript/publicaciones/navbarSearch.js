$(document).ready(function(){
    $("#barraBuscar").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#contenido div").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});