$(function(){
    console.log('si');
    $('#btnEnviar').click(function(){
		console.log('entre');
		let http = new XMLHttpRequest();
		http.open('POST','/upload/', true);
		http.onreadystatechange=function(){
			if(http.readyState== 4 && http.status==200){
				console.log(http.responseText);
			}
		}
		http.send(null);
	});

})