$(document).on("click", ".eliminar_direccion", function () {
    var id_direccion = $(this).data('id');
    $("#modal_eliminar_direccion").val(id_direccion);
    $("#body_modal_eliminar_direccion").html("Se procederá a eliminar la dirección: ")
    var texto = $("#body_modal_eliminar_direccion").html();
    $("#body_modal_eliminar_direccion").html(texto + " " + $(this).data('info'));
});

$(document).on("click", "#aceptar_eliminar_direccion", function () {
    var id_direccion = $("#modal_eliminar_direccion").val();
    var elemento = document.getElementById(id_direccion);
    if (!elemento) {
        alert("El elemento seleccionado ya no existe.");
    } else {
        var padre = elemento.parentNode;
        $.ajax({
            url: `/compras/direcciones/${id_direccion}`, type: 'DELETE', success: function (result) {
                padre.removeChild(elemento);
                if (!padre.children.length) {
                    padre.innerHTML = `<div class="vacio">
                    <p><i class="fas fa-ban icono_vacio"></i></p>
                    <h5>No tiene direcciones de envío agregadas.</h5>
                    <hr>
                </div>`;
                }
            },
            statusCode: {
                404: function () {
                    window.location.replace("/login");
                }
            }
        });
    }
});