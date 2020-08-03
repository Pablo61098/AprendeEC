$.ajax({
    url: `/compras/direcciones/provincias`, type: 'GET', contentType: "application/json", success: function (result) {
        let provincia = document.getElementById("provincia");
        //let id_provincia = result[0].id;
        for (let i = 0; i < result.length; i++) {
            provincia.innerHTML += `<option value="${result[i].nombre}" id=${result[i].id}">${result[i].nombre}</option>`;
        }
    },
    complete: function (data) {
        document.getElementById("provincia").value = document.getElementById("provincia_seleccionada").innerHTML;
        id_provincia = $(`option[value=${document.getElementById("provincia_seleccionada").innerHTML}]`).attr("id");
        $.ajax({
            url: `/compras/direcciones/cantones/${id_provincia}`, type: 'GET', contentType: "application/json", success: function (result) {
                let canton = document.getElementById("canton");
                for(let i = 0; i < result.length; i++) {
                    canton.innerHTML += `<option value="${result[i].nombre}">${result[i].nombre}</option>`;
                }
            },
            complete: function (data) {
                document.getElementById("canton").value = document.getElementById("canton_seleccionado").innerHTML;
            }
        });
    }
});

$("#provincia").on('change', function() {
    var id = $(this).children(":selected").attr("id");
    $.ajax({
        url: `/compras/direcciones/cantones/${id}`, type: 'GET', contentType: "application/json", success: function (result) {
            let canton = document.getElementById("canton");
            canton.innerHTML = "";
            for(let i = 0; i < result.length; i++) {
                canton.innerHTML += `<option value="${result[i].nombre}">${result[i].nombre}</option>`;
            }
        }
    });
});