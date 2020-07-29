$(document).on("click", ".boton_activar_pago", function() {
    $(".boton_activar_pago").prop("disabled", false);
    $(".estado_pago").prop("checked", false);
    $(this).prop("disabled", true);
    var check_id = "#" + $(this).data("id");
    $(check_id).prop("checked", true);
});