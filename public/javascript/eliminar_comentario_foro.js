$(document).on("click", ".eliminar_comentario_foro", function () {
    var id_comentario = $(this).data('id');
    $("#modal_eliminar_comentario_foro").val(id_comentario);
});

$(document).on("click", "#aceptar_eliminar_comentario_foro", function () {
    var id_comentario = $("#modal_eliminar_comentario_foro").val();
    var elemento = document.getElementById(id_comentario);
    if (!elemento) {
        alert("El elemento seleccionado ya no existe.");
    } else {
        var padre = elemento.parentNode;
        $.ajax({
            url: `/participacion/comentarios_foros/${id_comentario}`, type: 'DELETE', success: function (result) {
                padre.removeChild(elemento);
                if (!padre.children.length) {
                var pagina = parseInt(document.getElementById("pagina").innerHTML, 10);
                    if (pagina > 1) {
                        window.location.href = `/participacion/comentarios_foros?pagina=${pagina - 1}`;
                    } else {
                        window.location.href = `/participacion/comentarios_foros?pagina=${pagina + 1}`;
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