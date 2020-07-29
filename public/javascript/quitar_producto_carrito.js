$(document).on("click", ".quitar_producto_carrito", function() {
    var id_producto = $(this).data('id');
    $("#modal_quitar_producto").val(id_producto);
    $("#body_modal_quitar_producto").html("Se procederá a quitar el producto: ")
    var texto = $("#body_modal_quitar_producto").html();
    $("#body_modal_quitar_producto").html(texto + " " + $(this).data('info'));
});

$(document).on("click", "#aceptar_quitar_producto", function() {
    elemento = document.getElementById($("#modal_quitar_producto").val());
    if (!elemento) {
        alert("El elemento seleccionado ya no existe.");
    } else {
        padre = elemento.parentNode;
        padre.removeChild(elemento);
    }
});