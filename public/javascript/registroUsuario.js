

function init(){
    let btnAceptar = document.getElementById("btnAceptar");
    let inputContrasena = document.getElementById("contrasena");
    let inputContrasenaConfirm = document.getElementById("confirmacionContrasena");

    let universityNames = document.getElementById("universityNames");
    let correoInput = document.getElementById("correoInput");
    let correo = document.getElementById("correo");
    let opcionesDominio = document.getElementById("opcionesDominio");

    universityNames.selectedIndex = '1';
    opcionesDominio.selectedIndex = '0';

    btnAceptar.addEventListener('click', function(e){
        console.log(inputContrasena.value);
        console.log(inputContrasenaConfirm.value);
        if(inputContrasena.value != inputContrasenaConfirm.value){
            alert("Las contraseñas introducidas no son iguales");
            e.preventDefault();
        }
        // }else if(inputContrasena.value.length == 0 || inputContrasenaConfirm.value == 0){
        //     alert("intro");
        //     e.preventDefault();
        // }
    });

    universityNames.addEventListener("click", function(e){
        console.log(this.selectedIndex);
        if(this.selectedIndex == 0){
            correoInput.innerHTML = "";
            let input = `<input class= "col-12" name="correo" type="text" required id="correo">`;
            $("#correoInput").append(input);
            // correoInput.selectedIndex = '1';
        }else{
            correoInput.innerHTML = "";
            correoInput.appendChild(correo);
            correoInput.appendChild(opcionesDominio);
            opcionesDominio.selectedIndex = String(this.selectedIndex - 1);

        }
    });
}

init();
