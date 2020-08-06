


let btnAceptar = document.getElementById("btnAceptar");
let inputPassword = document.getElementById("inputPassword");
let inputConfirmPassword = document.getElementById("inputConfirmPassword");

 btnAceptar.addEventListener("click", function(e){
    if(inputPassword.value !=  inputConfirmPassword.value){
        e.preventDefault();
        alert("La contraseña debe ser la misma");
    }
 });