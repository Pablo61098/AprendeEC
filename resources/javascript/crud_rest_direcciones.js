function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

let btnDirecciones = document.getElementById("btn-direcciones");
let ctnDirecciones = document.getElementById("contenedor_direcciones");

btnDirecciones.addEventListener('click', function() {

    ctnDirecciones.innerHTML = '';

    console.log("hola");
    let request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8181/me/compras/direcciones/', true);
    console.log(request);


    request.onload = function() {
        console.log("hola");
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            console.log("hola");
            data.forEach(direccion => {

                const elemento = document.createElement('div');
                elemento.setAttribute('id', 'direccion' + direccion.id);

                const subElemento = document.createElement('div');
                subElemento.setAttribute("class", "row ml-2 mr-2");


                const subsubElemento = document.createElement('div');
                subsubElemento.setAttribute("class", "col-xl-1 align-self-sm-center");
                const checkbox = document.createElement('input');
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("id", "check_dir" + direccion.id);
                checkbox.setAttribute("name", "check_dir");
                checkbox.setAttribute("value", "check_dir" + direccion.id);
                checkbox.setAttribute("disabled", "disabled");
                subsubElemento.appendChild(checkbox);


                const subsubElemento2 = document.createElement('div');
                subsubElemento2.setAttribute("class", "col-xl-7");
                const responsable = document.createElement('h4');
                const span = document.createElement('span');
                span.textContent += direccion.responsable;
                responsable.appendChild(span);
                const info = document.createElement('p');
                const subinfo0 = document.createElement('span');
                subinfo0.setAttribute("id", "dir" + direccion.id + "responsable");
                subinfo0.textContent += direccion.responsable;
                const subinfo1 = document.createElement('span');
                subinfo1.setAttribute("id", "dir" + direccion.id + "direccion");
                subinfo1.textContent += direccion.direccion + ", ";
                const subinfo2 = document.createElement('span');
                subinfo2.setAttribute("id", "dir" + direccion.id + "direccionDos");
                subinfo2.textContent += direccion.direccionDos;
                const subinfo3 = document.createElement('span');
                subinfo3.setAttribute("id", "dir" + direccion.id + "provincia");
                subinfo3.textContent += direccion.provincia;
                const subinfo4 = document.createElement('br');
                const subinfo5 = document.createElement('span');
                subinfo5.setAttribute("id", "dir" + direccion.id + "cedula");
                subinfo5.textContent += direccion.cedula;
                const subinfo6 = document.createElement('br');
                const subinfo7 = document.createElement('span');
                subinfo7.setAttribute("id", "dir" + direccion.id + "codigoPostal");
                subinfo7.textContent += direccion.codigoPostal;
                const subinfo8 = document.createElement('br');
                const subinfo9 = document.createElement('span');
                subinfo9.setAttribute("id", "dir" + direccion.id + "telefono");
                subinfo9.textContent += direccion.telefono;
                const subinfo10 = document.createElement('br');
                const subinfo11 = document.createElement('span');
                subinfo11.setAttribute("id", "dir" + direccion.id + "ciudad");
                subinfo11.textContent += direccion.ciudad;
                const subinfo12 = document.createElement('br');

                info.appendChild(subinfo1);
                info.appendChild(subinfo2);
                info.appendChild(subinfo4);
                info.appendChild(subinfo5);
                info.appendChild(subinfo6);
                info.appendChild(subinfo7);
                info.appendChild(subinfo8);
                info.appendChild(subinfo9);
                info.appendChild(subinfo10);
                info.appendChild(subinfo11);
                info.appendChild(subinfo12);
                info.appendChild(subinfo3);

                subsubElemento2.appendChild(responsable);
                subsubElemento2.appendChild(info);

                const subsubElemento3 = document.createElement('div');
                subsubElemento3.setAttribute("class", "col-xl-3 align-self-sm-end btn-group btn-group-sm");
                const btnActivar = document.createElement('button');
                btnActivar.setAttribute("type", "button");
                btnActivar.setAttribute("class", "btn btn-link");
                btnActivar.textContent += "Activar";
                const aEditar = document.createElement('a');
                aEditar.setAttribute("class", "editar");
                aEditar.setAttribute("href", "#");
                const btnEditar = document.createElement("button");
                btnEditar.setAttribute("class", "btn btn-link");
                btnEditar.textContent += "Editar";
                aEditar.appendChild(btnEditar);
                const btnEliminar = document.createElement('button');
                btnEliminar.setAttribute("class", "btn btn-link eliminar_direccion");
                btnEliminar.setAttribute("data-id", "direccion" + direccion.id);
                btnEliminar.setAttribute("data-info", direccion.responsable + " (" + direccion.direccion + ")");
                btnEliminar.setAttribute("data-toggle", "modal");
                btnEliminar.setAttribute("data-target", "#modal_eliminar_direccion");
                btnEliminar.textContent += "Eliminar";

                subsubElemento3.appendChild(btnActivar);
                subsubElemento3.appendChild(aEditar);
                subsubElemento3.appendChild(btnEliminar);


                const divisorDireccion = document.createElement('hr');


                subElemento.appendChild(subsubElemento);
                subElemento.appendChild(subsubElemento2);
                subElemento.appendChild(subsubElemento3);

                elemento.appendChild(subElemento);
                elemento.appendChild(divisorDireccion);

                ctnDirecciones.appendChild(elemento);

            });


        } else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `Gah, it's not working!`;
            ctnDirecciones.appendChild(errorMessage);
        }
        console.log(data);

        if (data.length == 0) {
            console.log("jajaja");
            const elemento = document.createElement('div');
            elemento.setAttribute("class", "vacio");

            const parrafo = document.createElement('p');
            const icono = document.createElement('i');
            icono.setAttribute("class", "fas fa-ban icono_vacio");

            parrafo.appendChild(icono);

            const h5 = document.createElement('h5');
            h5.textContent += "No tiene direcciones de envío agregadas.";

            const divisorDireccion = document.createElement('hr');

            elemento.appendChild(parrafo);
            elemento.appendChild(h5);
            elemento.appendChild(divisorDireccion);

            ctnDirecciones.appendChild(elemento);

        }

        document.querySelectorAll('.editar').forEach(item => {
            item.addEventListener('mousedown', event => {
                let id = item.parentElement.parentElement.parentElement.id.split("direccion")[1];
                console.log(id);
                item.setAttribute("href", "../compras/editar_direccion.html?id=" + id);
                console.log("PABLO");
            })
        })
    }

    request.send();

});

function borrar(elemento) {
    var request = new XMLHttpRequest();
    var link = 'http://localhost:8181/me/compras/direcciones/' + elemento;
    request.open('DELETE', link, true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            alert("El elemento fue borrado.");
        } else {
            alert("El elemento seleccionado ya no existe.");
        }
    }
    request.send();
}

function post(nom, ced, dir1, dir2, canton, prov, codPost, telef) {
    let objeto = new Object();
    objeto.responsable = nom;
    objeto.cedula = ced;
    objeto.direccion = dir1;
    objeto.direccionDos = dir2;
    objeto.ciudad = canton;
    objeto.provincia = prov;
    objeto.codigoPostal = codPost;
    objeto.telefono = telef;
    let jsonPut = JSON.stringify(objeto);
    let request = new XMLHttpRequest();
    let link = 'http://localhost:8181/me/compras/direcciones/';
    request.open('POST', link, true); // true : asynchrone false: synchrone
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            alert("El elemento fue ingresado.");
        } else {
            alert("El elemento no fue ingresado.");
        }
    }
    request.setRequestHeader("Content-type", "application/json");
    request.send(jsonPut);
}