console.log('hola');

var botonContinuar= document.getElementById("btnEnviar");

// var inputNombreInstitucion= document.getElementById("nombreInstitucion");
// var inputCiudad= document.getElementById("ciudad");
// var inputDireccion= document.getElementById("direccion");
// var inputPaginaWeb= document.getElementById("paginaWeb");
// var inputCuentaBancaria= document.getElementById("numeroCuentaBancaria");
// var inputNombres= document.getElementById("btnEnviar");
// var inputApellidos= document.getElementById("btnEnviar");
// var inputNumeroCedula= document.getElementById("btnEnviar");
// var inputCargo= document.getElementById("btnEnviar");
// var inputCorreoInstitucional= document.getElementById("btnEnviar");

var inputs = document.getElementsByTagName("input");




botonContinuar.addEventListener("click", function(){
    
    var flag = true;
    for(var i=0; i<inputs.length; i++){
        if(inputs[i].type=="text"){
            if(inputs[i].value==""){
                console.log(i);
                flag = false;
            }else{
                // console.log(i);
            }
        }else if(inputs[i].checked==false){
            console.log("asdasd");
            flag = false;
        }
    }

    if(flag){
        console.log("hola");
        alert("En los próximos días se le enviará un correo de verificación para que sepa si la solicitud es aceptada o no. De ser aceptada, se le enviara una clave que tendra que ingresar al momento del registro de la universidad/instituto, asi como támbien el enlace de la página de registro.");
    }else{
        console.log("heyyy");
    }

    
});