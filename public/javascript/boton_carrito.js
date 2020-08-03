$(document).on("click", ".boton_carrito_agregar", function () {
    var id_producto = $(this).attr('id');
    $.ajax({
        url: `/tienda/agregar/${id_producto}`, type: 'PUT', success: function (result) {
            let modal = document.getElementById("modal_agregar");
            let boton_cerrar = document.getElementById("cerrar_modal_agregar");
            let boton_aceptar = document.getElementById("aceptar_modal_agregar");
            modal.style.display = "block";
            boton_cerrar.onclick = function () {
                modal.style.display = "none";
            }
            boton_aceptar.onclick = function () {
                modal.style.display = "none";
            }
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        },
        statusCode: {
            500: function () {
                let modal = document.getElementById("modal_ya_agregado");
                let boton_cerrar = document.getElementById("cerrar_modal_ya_agregado");
                let boton_aceptar = document.getElementById("aceptar_modal_ya_agregado");
                modal.style.display = "block";
                boton_cerrar.onclick = function () {
                    modal.style.display = "none";
                }
                boton_aceptar.onclick = function () {
                    modal.style.display = "none";
                }
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            },
            404: function () {
                let modal = document.getElementById("modal_sesion");
                let boton_cerrar = document.getElementById("cerrar_modal_sesion");
                let boton_aceptar = document.getElementById("aceptar_modal_sesion");
                modal.style.display = "block";
                boton_cerrar.onclick = function () {
                    modal.style.display = "none";
                    window.location.href = "/login";
                }
                boton_aceptar.onclick = function () {
                    modal.style.display = "none";
                    window.location.href = "/login";
                }
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                        window.location.href = "/login";
                    }
                }
            }
        }
    });
});