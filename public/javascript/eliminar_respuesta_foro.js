$(document).on("click", ".eliminar_respuesta_foro", function () {
    var id_respuesta = $(this).data('id');
    $("#modal_eliminar_respuesta_foro").val(id_respuesta);
});

$(document).on("click", "#aceptar_eliminar_respuesta_foro", function () {
    var id_respuesta = $("#modal_eliminar_respuesta_foro").val();
    var elemento = document.getElementById(id_respuesta);
    if (!elemento) {
        alert("El elemento seleccionado ya no existe.");
    } else {
        var padre = elemento.parentNode;
        $.ajax({
            url: `/participacion/respuestas_foros/${id_respuesta}`, type: 'DELETE', success: function (result) {
                padre.removeChild(elemento);
                if (!padre.children.length) {
                var pagina = parseInt(document.getElementById("pagina").innerHTML, 10);
                    if (pagina > 1) {
                        window.location.href = `/participacion/respuestas_foros?pagina=${pagina - 1}`;
                    } else {
                        window.location.href = `/participacion/respuestas_foros?pagina=${pagina + 1}`;
                    }
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