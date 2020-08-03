$(document).on("click", ".boton_activar_pago", function () {
    var boton = $(".boton_activar_pago");
    var estado = $(".estado_pago");
    var esto = $(this);
    var check_id = "#" + $(this).data("id");
    var objeto_check_id = $(check_id);
    $.ajax({
        url: `/compras/metodos_pago/${$(this).data("info")}`, type: 'PUT', success: function (result) {
            boton.prop("disabled", false);
            estado.prop("checked", false);
            esto.prop("disabled", true);
            objeto_check_id.prop("checked", true);
        },
        statusCode: {
            404: function () {
                window.location.replace("/login");
            }
        }
    });
});