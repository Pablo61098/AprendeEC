$(document).on("click", ".eliminar_pago", function () {
    var id_direccion = $(this).data('id');
    $("#modal_eliminar_pago").val(id_direccion);
    $("#body_modal_eliminar_pago").html("Se procederá a eliminar el método de pago: ")
    var texto = $("#body_modal_eliminar_pago").html();
    $("#body_modal_eliminar_pago").html(texto + " " + $(this).data('info'));
});

$(document).on("click", "#aceptar_eliminar_pago", function () {
    var id_pago = $("#modal_eliminar_pago").val();
    var elemento = document.getElementById(id_pago);
    if (!elemento) {
        alert("El elemento seleccionado ya no existe.");
    } else {
        var padre = elemento.parentNode;
        $.ajax({
            url: `/compras/metodos_pago/${id_pago}`, type: 'DELETE', success: function (result) {
                padre.removeChild(elemento);
                if (!padre.children.length) {
                    padre.innerHTML = `<div class="vacio">
                    <p><i class="fas fa-ban icono_vacio"></i></p>
                    <h5>No tiene métodos de pago agregados.</h5>
                    <hr>
                </div>`;
                }
            }
        });
    }
});