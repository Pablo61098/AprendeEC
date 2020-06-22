$(document).on("click", ".eliminar_direccion", function() {
    var id_direccion = $(this).data('id');
    $("#modal_eliminar_direccion").val(id_direccion);
    $("#body_modal_eliminar_direccion").html("Se procederá a eliminar la dirección: ")
    var texto = $("#body_modal_eliminar_direccion").html();
    $("#body_modal_eliminar_direccion").html(texto + " " + $(this).data('info'));
});

$(document).on("click", "#aceptar_eliminar_direccion", function() {
    elemento = document.getElementById($("#modal_eliminar_direccion").val());
    if (!elemento) {
        alert("El elemento seleccionado ya no existe.");
    } else {
        var id_element = elemento.getAttribute('id');
        var len_id = id_element.length;
        borrar(id_element.substring(9, len_id));
        padre = elemento.parentNode;
        padre.removeChild(elemento);
    }
});