

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
let btnAceptar = document.getElementById("btnAceptar");

let idProducto = '';

let formProduct = document.getElementById("formProduct");
let inputPicture = document.getElementById("inputPicture");

let tituloAnadirEditar= document.getElementById("tituloAnadirEditar");

let editando = false;

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
            
            idProducto = this.parentNode.parentNode.id;

            console.log(idProducto);
        } else{
            idProducto = '';
            liSelected = undefined;
            console.log("hey" + idProducto);
        }
    });
}


btnEliminar.addEventListener("click", function(){

    // for(let i=0; i<checkboxes.length; i++){
        
    //     if(checkboxes[i].checked){
    //         checkboxes[i].parentNode.parentNode.removeChild(checkboxes[i].parentNode);
    //     }
    // }
    $.ajax({
        url: `/ventas/productos/${idProducto}`, type: 'DELETE', success: function (result) {
            window.location.replace("/ventas/productos");
        },
        statusCode: {
            404: function () {
                alert("Seleccione un producto y despues presione ELIMINAR");
            }
        }
    });

    // checkboxes = document.querySelectorAll("input[type=checkbox]");

    // let txtTitulo = document.getElementById("txt-titulo");
    // let txtDescripcion = document.getElementById("txt-descripcion");
    // let txtPrecio = document.getElementById("txt-precio");
    // let txtStock = document.getElementById("txt-stock");

    // txtTitulo.value = '';
    // txtDescripcion.value = '';
    // txtPrecio.value = '';
    // txtStock.value = '';

});

btnEditar.addEventListener("click", function(){
    if(idProducto == ''){
        alert("Tiene que elegir un producto a EDITAR");
    }else{
        for(let i=0; i<checkboxes.length; i++){
        
            if(checkboxes[i].checked){
                
                let txtTitulo = document.getElementById("txt-titulo");
                let txtDescripcion = document.getElementById("txt-descripcion");
                let txtPrecio = document.getElementById("txt-precio");
                let txtStock = document.getElementById("txt-stock");


                let nombre = document.getElementById(`nombre${idProducto}`).innerHTML;
                console.log(nombre);
                let descripcion = document.getElementById(`descripcion${idProducto}`).innerHTML;
                console.log(descripcion);
                let precio = document.getElementById(`precio${idProducto}`).innerHTML;
                console.log(precio);
                let stock = document.getElementById(`stock${idProducto}`).innerHTML;
                console.log(stock);

                tituloAnadirEditar.innerHTML = "Editando producto";
                btnAceptar.innerHTML = "Guardar Cambios";
                formProduct.action = formProduct.action + "?_method=PUT&id="+idProducto;
                inputPicture.required="";
                btnBorrarCampos.innerHTML = "Cancelar Edicion";

                txtTitulo.value = nombre;
                txtDescripcion.value = descripcion;
                txtPrecio.value = precio;
                txtStock.value = stock;
                editando = true;
            }
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

    if(editando){
        editando = false;

        tituloAnadirEditar.innerHTML = "Añadir Producto";
        btnAceptar.innerHTML = "Enviar";
        formProduct.action = "/ventas/productos";
        inputPicture.required="required";
        btnBorrarCampos.innerHTML = "Borrar Campos";
    }
    

});