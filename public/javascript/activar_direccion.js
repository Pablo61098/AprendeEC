$(document).on("click", ".boton_activar_dir", function () {
    var boton = $(".boton_activar_dir");
    var estado = $(".estado_dir");
    var esto = $(this);
    var check_id = "#" + $(this).data("id");
    var objeto_check_id = $(check_id);
    $.ajax({
        url: `/compras/direcciones/${$(this).data("info")}`, type: 'PUT', success: function (result) {
            boton.prop("disabled", false);
            estado.prop("checked", false);
            esto.prop("disabled", true);
            objeto_check_id.prop("checked", true);
        }
    });
});