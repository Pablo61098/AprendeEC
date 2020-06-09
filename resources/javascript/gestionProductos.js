

// let divProductos = document.getElementById("productosOfertados");
// let productos = divProductos.getElementsByTagName('*');


// for(let i=0; i<productos.length; i++){
//     e=productos[i];
    
//     if(e.tagName == "INPUT"){
//         console.log(e.tagName);
//     }
// }
let btnEliminar = document.getElementById("btn-eliminar");
let btnEditar = document.getElementById("btn-editar");
let checkboxes = document.querySelectorAll("input[type=checkbox]");
let btnBorrarCampos = document.getElementById("btn-borrar-campos");


console.log(checkboxes);

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

        } 
    });
}


btnEliminar.addEventListener("click", function(){

    for(let i=0; i<checkboxes.length; i++){
        
        if(checkboxes[i].checked){
            checkboxes[i].parentNode.parentNode.removeChild(checkboxes[i].parentNode);
        }
    }
    checkboxes = document.querySelectorAll("input[type=checkbox]");

    let txtTitulo = document.getElementById("txt-titulo");
    let txtDescripcion = document.getElementById("txt-descripcion");
    let txtPrecio = document.getElementById("txt-precio");
    let txtStock = document.getElementById("txt-stock");

    txtTitulo.value = '';
    txtDescripcion.value = '';
    txtPrecio.value = '';
    txtStock.value = '';

});

btnEditar.addEventListener("click", function(){

    for(let i=0; i<checkboxes.length; i++){
        
        if(checkboxes[i].checked){
            
            let txtTitulo = document.getElementById("txt-titulo");
            let txtDescripcion = document.getElementById("txt-descripcion");
            let txtPrecio = document.getElementById("txt-precio");
            let txtStock = document.getElementById("txt-stock");
            
            txtTitulo.value = 'Casaca ASO sistemas 2020';
            txtDescripcion.value = 'Casaca de la Aso de Sistemas en el periodo 2020 Febrero-Marzo';
            txtPrecio.value = 'Casaca ASO sistemas 2020';
            txtStock.value = '30';
        }
    }
    
});




btnBorrarCampos.addEventListener("click", function(){

    let txtTitulo = document.getElementById("txt-titulo");
    let txtDescripcion = document.getElementById("txt-descripcion");
    let txtPrecio = document.getElementById("txt-precio");
    let txtStock = document.getElementById("txt-stock");
    
    txtTitulo.value = '';
    txtDescripcion.value = '';
    txtPrecio.value = '';
    txtStock.value = '';

});