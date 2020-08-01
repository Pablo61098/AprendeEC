$(document).on("click", ".quitar_producto_carrito", function () {
    var id_producto = $(this).data('id');
    $("#modal_quitar_producto").val(id_producto);
    $("#body_modal_quitar_producto").html("Se procederá a quitar el producto: ")
    var texto = $("#body_modal_quitar_producto").html();
    $("#body_modal_quitar_producto").html(texto + " " + $(this).data('info'));
});

$(document).on("click", "#aceptar_quitar_producto", function () {
    id_producto = $("#modal_quitar_producto").val();
    //console.log(id_producto);
    elemento = document.getElementById(id_producto);
    if (!elemento) {
        alert("El elemento seleccionado ya no existe.");
    } else {
        padre = elemento.parentNode;
        $.ajax({
            url: `/compras/quitar/${id_producto}`, type: 'DELETE', success: function (result) {
                document.getElementById("costo").innerHTML = bigDecimal.subtract(document.getElementById("costo").innerHTML, bigDecimal.multiply(document.getElementById("prod" + id_producto).innerHTML, document.getElementById("cant" + id_producto).value));
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
    }
});