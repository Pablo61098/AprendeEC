


function init(){
    
    let btnAceptar = document.getElementsByClassName('btnAceptar');
    let btnRechazar = document.getElementsByClassName('btnRechazar');

    let idSolicitudes = document.getElementsByClassName('id');

    for(let i=0; i<btnAceptar.length; i++){
        btnAceptar[i].addEventListener('click', function(e){
            
            console.log(idSolicitudes[i].innerHTML);

            let peticion = new XMLHttpRequest();
            let idSolicitud = idSolicitudes[i].innerHTML;
            let url = `/aceptarSolicitud/${idSolicitud}`;

            peticion.open("PUT", url , true);
            peticion.setRequestHeader("Content-type", "application/x-222-form-urlencoded");
            peticion.onreadystatechange = function(){
                if(peticion.readyState == 4 && peticion.status == 200){
                    console.log(peticion.responseText);

                    //-----
                }
            }
            
            peticion.send();
        });
    }
}



init();