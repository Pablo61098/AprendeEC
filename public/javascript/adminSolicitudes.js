


function init(){
    
    let btnAceptar = document.getElementsByClassName('btnAceptar');
    let btnRechazar = document.getElementsByClassName('btnRechazar');
    let btnDescargar = document.getElementsByClassName('btnDescargar');

    let nameFiles = document.getElementsByClassName('fileName');
    let idSolicitudes = document.getElementsByClassName('id');

    for(let i=0; i<btnAceptar.length; i++){
        btnAceptar[i].addEventListener('click', function(e){
            
            console.log(idSolicitudes[i].innerHTML);

            let peticion = new XMLHttpRequest();
            let idSolicitud = idSolicitudes[i].innerHTML;
            let url = `/admin/aceptarSolicitud/${idSolicitud}`;

            peticion.open("PUT", url , true);
            // peticion.setRequestHeader("Content-type", "application/x-222-form-urlencoded");
            peticion.onreadystatechange = function(){
                if(peticion.readyState == 4 && peticion.status == 200){
                    console.log(peticion.responseText);
                    console.log(peticion);
                    let data = JSON.parse(this.response);
                    console.log(data);
                    let institucion = data.nombreInstitucion;
                    let tipo = data.tipo;
                    window.location.href = `/admin/adminSolicitudes?institucion=${institucion}&tipo=${tipo}`;
                }
            }
            peticion.send();
        });
    }

    for(let i =0; i<btnDescargar.length; i++){
        btnDescargar[i].addEventListener('click', function(e){
            // let peticion = new XMLHttpRequest();
            let nombreFile = nameFiles[i].innerHTML;
            let url = `/admin/downloadCertificado/${nombreFile}`;
            window.open(url);
            // peticion.open("GET", url, true);
            // peticion.onreadystatechange = function(){
            //     if(peticion.readyState == 4 && peticion.status == 200){
            //         console.log('SE DEBE ESTAR DESCARGANDO');

            //     }
            // }
            // console.log(nameFiles[i].innerHTML);
        });
    }

    for(let i=0;i<btnRechazar.length; i++){
        btnRechazar[i].addEventListener('click', function(e){
            
            console.log(idSolicitudes[i].innerHTML);

            let peticion = new XMLHttpRequest();
            let idSolicitud = idSolicitudes[i].innerHTML;
            let url = `/admin/rechazarSolicitud/${idSolicitud}`;

            peticion.open("PUT", url , true);
            // peticion.setRequestHeader("Content-type", "application/x-222-form-urlencoded");
            peticion.onreadystatechange = function(){
                if(peticion.readyState == 4 && peticion.status == 200){
                    console.log(peticion.responseText);

                    let data = JSON.parse(this.response);
                    console.log(data);
                    let institucion = data.nombreInstitucion;
                    let tipo = data.tipo;
                    window.location.href = `/admin/adminSolicitudes?institucion=${institucion}&tipo=${tipo}`;
                    //-----
                }
            }
            
            peticion.send();

        });
    }
    
}



init();