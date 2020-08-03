

let redDiv = document.getElementsByClassName("redDiv");
let addRed = document.getElementById("addRed");
let redesForm = document.getElementById("redes");

function addListeners(){
    let minusBtn = document.getElementsByClassName("minusBtn");
    for(let i=0; i<minusBtn.length; i++){
        minusBtn[i].addEventListener("click", function(e){
            this.parentNode.parentNode.removeChild(this.parentNode);
        });
    }
}

addRed.addEventListener("click", function(e){
    let abouToadd = `<div class="row col-sm-12 m-0 redDiv">
                        <input name="redes[]" class="col-10 form-control" placeholder="Ingrese su link a su red social aqui..." type="text" >
                        <button type="button" class="col-2 form-control minusBtn"><i class="fas fa-minus"></i></button>
                    </div>`
    $('#redes').append(abouToadd);
    addListeners();
});


addListeners();