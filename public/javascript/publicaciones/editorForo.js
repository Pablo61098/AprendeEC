CKEDITOR.replace("editor1");
$(function() {
    $('#btnGuardar').click(function() {
        var contenido = CKEDITOR.instances.editor1.getData();
        var centi = 0;
        if (tituloForo.value.length == 0) {
            centi = centi + 1;
        }
        if (contenido.length == 0) {
            centi = centi + 1;
        }

        if (centi != 0) {
            alert('Verifique que los campos no estén vacíos.');
        } else {
            alert('Se ha guardado los cambios');
        }

    });
    $('#btnSalir').click(function() {
        window.open('modPubForos.html', '_self');
    });

});