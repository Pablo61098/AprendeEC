
let selectTipo = document.getElementById("selectTipo");
let universidades = document.getElementById("universidades");
let provinciasDiv = document.getElementById("provinciasDiv");
let ciudadesDiv = document.getElementById("ciudadesDiv");
let provincias = document.getElementById("provincias");
let ciudades = document.getElementById("ciudades");

provinciasDiv.style.display = 'none';
ciudadesDiv.style.display = 'none';

selectTipo.addEventListener("click", function(e){
    console.log(this.selectedIndex);
    if(this.selectedIndex == 0){
        window.location = '/ranking';
    }else if(this.selectedIndex == 1){
        
        provinciasDiv.style.display = 'none';
        ciudadesDiv.style.display = 'flex';
        ciudades.selectedIndex = '0';
        provincias.selectedIndex = '0';
        getRanking('canton', 1);

    }else if(this.selectedIndex == 2){
        
        ciudadesDiv.style.display = 'none';
        provinciasDiv.style.display = 'flex';
        ciudades.selectedIndex = '0';
        provincias.selectedIndex = '0';
        getRanking('provincia', 1);
    }
});

provincias.addEventListener("click", function(e){
    console.log(this.selectedIndex);
    let optionProvincia = document.getElementById(`provincia${this.selectedIndex}`);
    console.log("optionProvincia");
    console.log(optionProvincia.value);
    getRanking('provincia', optionProvincia.value);
});


ciudades.addEventListener("click", function(e){
    console.log(this.selectedIndex);
    let optionCiudad = document.getElementById(`ciudad${this.selectedIndex}`);
    console.log("optionCiudad");
    console.log(optionCiudad.value);
    getRanking('canton', optionCiudad.value);
});




function getRanking(tipo, id){
    universidades.innerHTML = "";
    $.ajax({
        url: `/ranking/${tipo}/${id}`, type: 'GET', success: function (result) {
            console.log("SUCCEEEESS");
            console.log(result);
            let informacion = ''
            for(let i = 0; i < result.length ; i++ ){
                 if(i==0){ 
                    informacion += `<div class="row col-12 align-items-center p-3 posicion">
                        <div class="col-12 col-lg-3 text-center ">
                            <img src="../../images/first.png" alt="" id="primerLugar">
                        </div>
                        <div class="col-12 col-lg-9">
                            <div class="row flex-column align-items-center text-center">
                                <div class="col-12">
                                    <h1> ${result[i].nombre} </h1>
                                </div>
                                <div class="col-12">
                                    <div class="row col-12">
                                        <div class="col-12 col-sm-6">
                                            <label for="">Puntuacion: </label>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <label for=""> ${result[i].valoracion} </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`

            }else if(i==1){
                informacion += `<div class="row col-12 align-items-center p-3 posicion">
                        <div class="col-12 col-lg-3 text-center">
                            <img src="../../images/second.png" alt="" id="segundoLugar">
                        </div>
                        <div class="col-12 col-lg-9">
                            <div class="row flex-column align-items-center text-center">
                                <div class="col-12">
                                    <h1>  ${result[i].nombre} </h1>
                                </div>
                                <div class="col-12">
                                    <div class="row col-12">
                                        <div class="col-12 col-sm-6">
                                            <label for="">Puntuacion: </label>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <label for="">  ${result[i].valoracion} </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                }else if(i==2){
                    informacion += `<div class="row col-12 align-items-center p-3 posicion">
                        <div class="col-12 col-lg-3 text-center">
                            <img src="../../images/third.png" alt="" id="segundoLugar">
                        </div>
                        <div class="col-12 col-lg-9">
                            <div class="row flex-column align-items-center text-center">
                                <div class="col-12">
                                    <h1> ${result[i].nombre} </h1>
                                </div>
                                <!-- <div class="col-12">
                                    <div class="row col-12">
                                        <div class="col-12 col-sm-6">
                                            <label for="">Estudiantes registrados: </label>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <label for="">1723</label>
                                        </div>
                                    </div>
                                </div> -->
                                <div class="col-12">
                                    <div class="row col-12">
                                        <div class="col-12 col-sm-6">
                                            <label for="">Puntuacion: </label>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <label for=""> ${result[i].valoracion} </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                }else{
                    informacion += `<div class="row col-12 align-items-center p-3 posicion">
                        <div class="col-12 col-sm-3 text-center">
                            <h1><%= i+1 %></h1>
                        </div>
                        <div class="col-12 col-sm-9">
                            <div class="row flex-column align-items-center text-center">
                                <div class="col-12">
                                    <h1> ${result[i].nombre} </h1>
                                </div>
                                <!-- <div class="col-12">
                                    <div class="row col-12">
                                        <div class="col-12 col-sm-6">
                                            <label for="">Estudiantes registrados: </label>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <label for="">1723</label>
                                        </div>
                                    </div>
                                </div> -->
                                <div class="col-12">
                                    <div class="row col-12">
                                        <div class="col-12 col-sm-6">
                                            <label for="">Puntuacion: </label>
                                        </div>
                                        <div class="col-12 col-sm-6">
                                            <label for=""> ${result[i].valoracion} </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                }
            }

            $('#universidades').append(informacion);
        },
        statusCode: {
            404: function () {
                alert("No se ha podido conseguir la infomracion del producto, intentelo otra vez.");
            }
        }
    });
}
