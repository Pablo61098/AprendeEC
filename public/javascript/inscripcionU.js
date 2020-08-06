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

let ciudades = document.getElementById("ciudades");
let provincias = document.getElementById("provincias");


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

provincias.addEventListener("click", function(e){
    console.log(this.selectedIndex);
    let optionProvincia = document.getElementById(`provincia${this.selectedIndex}`);
    console.log("optionProvincia");
    console.log(optionProvincia.value);
    ciudades.innerHTML = "";
    $.ajax({
        url: `/cantones/${optionProvincia.value}`, type: 'GET', success: function (result) {
            console.log("SUCCEEEESS");
            console.log(result);
            for(let i = 0; i < result.length ; i++ ){
                let informacion = `<option value=" ${result[i].id} "> ${result[i].nombre} </option>`;
                $('#ciudades').append(informacion);
            }  
        },
        statusCode: {
            404: function () {
                alert("No se ha podido conseguir la infomracion del producto, intentelo otra vez.");
            }
        }
    });

});

ciudades.addEventListener("click", function(e){
    console.log(this.selectedIndex);
    
});