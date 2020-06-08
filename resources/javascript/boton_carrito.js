$(document).on("click", ".boton_carrito_agregar", function() {
    $(this).attr('class', 'btn btn-danger boton_carrito_quitar');
    $(this).html('<i class="fas fa-cart-arrow-down"></i>');
});

$(document).on("click", ".boton_carrito_quitar", function() {
    $(this).attr('class', 'btn btn-primary boton_carrito_agregar');
    $(this).html('<i class="fas fa-cart-plus"></i>');
});