$(document).on("click", ".quitar_producto_carrito", function () {
    var id_producto = $(this).data('id');
    $("#modal_quitar_producto").val(id_producto);
    $("#body_modal_quitar_producto").html("Se procederá a quitar el producto: ")
    var texto = $("#body_modal_quitar_producto").html();
    $("#body_modal_quitar_producto").html(texto + " " + $(this).data('info'));
});

$(document).on("click", "#aceptar_quitar_producto", function () {
    elemento = document.getElementById($("#modal_quitar_producto").val());
    if (!elemento) {
        alert("El elemento seleccionado ya no existe.");
    } else {
        padre = elemento.parentNode;
        padre.removeChild(elemento);
        if (!padre.children.length) {
            padre.innerHTML = `<div class="vacio">
            <p><i class="fas fa-ban icono_vacio"></i></p>
            <h5>No hay productos en el carrito.</h5>
            <hr>
            </div>`;
            document.getElementById("boton_comprar").style.display = "none";
            document.getElementById("contenedor_costo").style.display = "none";
        }
    }
});