



let checkboxes = document.querySelectorAll("input[type=checkbox]");

let idProducto = '';

let btnListar = document.getElementById("btnListar");
let btnLimpiar = document.getElementById("btnLimpiar");
let informacionCompra = document.getElementById("informacionCompra");

for(let i=0; i<checkboxes.length; i++){
    checkboxes[i].addEventListener( 'change', function() {
        
        if(this.checked) {
            var checkboxes = document.querySelectorAll("input[type=checkbox]");
            console.log(checkboxes);

            for(let i=0; i<checkboxes.length; i++){
                if(this != checkboxes[i]){
                    checkboxes[i].checked = false;
                }
            }
            
            idProducto = this.parentNode.parentNode.id;

            console.log(idProducto);
        } else{
            idProducto = '';
            liSelected = undefined;
            console.log("hey" + idProducto);
        }
    });
}

btnListar.addEventListener("click", function(){
    if(idProducto != ''){
        $.ajax({
            url: `/ventas/pedidos/${idProducto}`, type: 'GET', success: function (result) {
                console.log("SUCCEEEESS");
                console.log(result);
                let informacion = `<li>
                                    <div class="row flex-row align-items-center border-bottom mb-2">
                                        <div class="col-12 col-sm-8 col-md-9">
                                            <div class="row flex-column">
                                                <div class="col-6 col-sm-12">
                                                    <h3><strong>${result.producto.nombre}</strong></h3>
                                                    <h4>Dinero total de ventas: </h4>
                                                    <h4>$ <strong>${result.dineroTotal}</strong></h4>
                                                    <h4>Cantidad Vendida: </h4>
                                                    <h4><strong>${result.cantidadTotalComprada}</strong></h4>
                                                </div>     
                                            </div>
                                        </div>                                          
                                    </div>
                                </li>`;
                $('#informacionCompra').append(informacion);
            },
            statusCode: {
                404: function () {
                    alert("No se ha podido conseguir la infomracion del producto, intentelo otra vez.");
                }
            }
        });

    }else{
        alert('Elija un producto para listar su informacion');
    }
});

btnLimpiar.addEventListener("click", function(){
    informacionCompra.innerHTML = "";
});