function processUser()
{
    let parameters = location.search.substring(1).split("&");
    id = parameters[0].split("=")[1];
    console.log(id);
    
    let nombres = document.getElementById("nombres");
    let cedula = document.getElementById("cedula");
    let linea1 = document.getElementById("linea1");
    let linea2 = document.getElementById("linea2");
    let ciudad = document.getElementById("ciudad");
    let provincia = document.getElementById("provincia");
    let telefono = document.getElementById("telefono");
    let codigo = document.getElementById("codigo");


    let request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8181/me/compras/direcciones/'+id ,  true);

    request.onload = function(){
        console.log("hola");
        let data = JSON.parse(this.response);
        console.log(data);
        if(request.status >= 200 && request.status < 400){
            nombres.setAttribute("value", data.responsable);
            cedula.setAttribute("value", data.cedula);
            linea1.setAttribute("value", data.direccion);
            linea2.setAttribute("value", data.direccionDos);
            ciudad.setAttribute("value", data.ciudad);
            provincia.setAttribute("value", data.provincia);
            telefono.setAttribute("value", data.telefono);
            codigo.setAttribute("value", data.codigoPostal);

        }else{
            
        }
    }

    request.send();
    
    // nombres.setAttribute();

//   var temp = parameters[0].split("=");
//   l = unescape(temp[1]);
//   temp = parameters[1].split("=");
//   p = unescape(temp[1]);
//   document.getElementById("log").innerHTML = l;
//   document.getElementById("pass").innerHTML = p;
}

processUser();
