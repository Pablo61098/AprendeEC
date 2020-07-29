document.getElementById('costo').innerHTML = `${document.getElementById('costo').innerHTML.toFixed(2)}`;

$(document).on("click", ".mas", function () {
    var esto = $(this);
    var input_id = "#" + esto.data("id");
    var id_costo_producto = "#" + esto.data("info");
    var objeto_input_id = $(input_id);
    var objeto_costo_producto= $(id_costo_producto);
    if (parseInt(objeto_input_id.val(), 10) < parseInt(objeto_input_id.attr('max'), 10)) {
        var cant = parseInt(objeto_input_id.val(), 10) + 1;
        objeto_input_id.val(cant);
        var nuevo_costo = parseFloat(document.getElementById('costo').innerHTML) + parseFloat(objeto_costo_producto.html());
        document.getElementById('costo').innerHTML = `${nuevo_costo.toFixed(2)}`;
    }
});

$(document).on("click", ".menos", function () {
    var esto = $(this);
    var input_id = "#" + esto.data("id");
    var id_costo_producto = "#" + esto.data("info");
    var objeto_input_id = $(input_id);
    var objeto_costo_producto= $(id_costo_producto);
    if (parseInt(objeto_input_id.val(), 10) > 1) {
        var cant = parseInt(objeto_input_id.val(), 10) - 1;
        objeto_input_id.val(cant);
        var nuevo_costo = parseFloat(document.getElementById('costo').innerHTML) - parseFloat(objeto_costo_producto.html());
        document.getElementById('costo').innerHTML = `${nuevo_costo.toFixed(2)}`;
    }
});