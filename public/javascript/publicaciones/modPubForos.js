$(function() {
    $('#btnCrear').click(function() {
        window.open('/editorForo', '_self')
    });
    $('#btnPublicar').click(function() {
        //Debajo debe ir el evento que se genera. En este caso la publicación del foro en el sitio
        var revisarCheck = revisor1.checked;
        //Antes de revisar el ckecked, debe verificar si ese post ya ha sido publicado. Para eso 
        //Necesitamos lectura de la base de datos
        if (revisarCheck == true) {
            //Aquí se debería verificar en la base de datos por motivos de seguridad
            if ($('#estadoPost1').text() != 'Publicado') {
                var respuesta = confirm('¿Está seguro de publicar el foro?', revisarCheck);
                if (respuesta == true) {
                    revisor1.checked = false;
                    $('#estadoPost1').text('Publicado');
                }
            } else {
                alert('EL foro ya fue publicado');
            }

        } else {
            alert('Debe estar marcado al menos un foro');
        }
    });

    $('#btnEliminar').click(function() {
        var revisarCheck = revisor1.checked;
        if (revisarCheck == true) {
            var respuesta = confirm('¿Esta seguro de eliminar el/los post/s?. Si acepta se eliminará permanentemente.');
            if (respuesta == true) {
                $('#showPost1').remove();
            }
        } else {
            alert('Debe seleccionar al menos un foro');
        }

    });

    $('#btnEditar').click(function() {
        //Aquí se debe obtener de la base de datos el foro publicado y mandarlo al editor de texto
    });

    $('#btnVer').click(function() {
        //Aquí se debe obtener de la base de datos lo que se debe mostrar y mandarlo al html vista para visualizarlo. 
        var revisarCheck = revisor1.checked;
        if (revisarCheck == true) {
            window.open('/viewForo', '_blank');
        } else {
            alert('Debe seleccionar un foro.');
        }
    });

});