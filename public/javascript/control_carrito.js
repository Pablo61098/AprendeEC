$(document).on("click", ".mas", function () {
    var esto = $(this);
    var id_producto = esto.data("id").slice(4);
    var input_id = "#" + esto.data("id");
    var id_costo_producto = "#" + esto.data("info");
    var objeto_input_id = $(input_id);
    var objeto_costo_producto = $(id_costo_producto);
    if (parseInt(objeto_input_id.val(), 10) < parseInt(objeto_input_id.attr('max'), 10)) {
        var cant = parseInt(objeto_input_id.val(), 10) + 1;
        $.ajax({
            url: `/compras/modificar/${id_producto}/cantidad/${cant}`, type: 'PUT', success: function (result) {
                objeto_input_id.val(cant);
                var nuevo_costo = bigDecimal.add(document.getElementById('costo').innerHTML, objeto_costo_producto.html());
                document.getElementById('costo').innerHTML = `${nuevo_costo}`;
            },
            statusCode: {
                404: function () {
                    window.location.replace("/login");
                }
            }
        });
    }
});

$(document).on("click", ".menos", function () {
    var esto = $(this);
    var id_producto = esto.data("id").slice(4);
    var input_id = "#" + esto.data("id");
    var id_costo_producto = "#" + esto.data("info");
    var objeto_input_id = $(input_id);
    var objeto_costo_producto = $(id_costo_producto);
    if (parseInt(objeto_input_id.val(), 10) > 1) {
        var cant = parseInt(objeto_input_id.val(), 10) - 1;
        $.ajax({
            url: `/compras/modificar/${id_producto}/cantidad/${cant}`, type: 'PUT', success: function (result) {
                objeto_input_id.val(cant);
                var nuevo_costo = bigDecimal.subtract(document.getElementById('costo').innerHTML, objeto_costo_producto.html());
                document.getElementById('costo').innerHTML = `${nuevo_costo}`;
            },
            statusCode: {
                404: function () {
                    window.location.replace("/login");
                }
            }
        });
    }
});