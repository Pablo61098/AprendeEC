$(function() {
    CKEDITOR.replace("editor1");
    document.title = 'Título del foro'
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' || ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();;
    $('#respFecha1').text(date);
    $('#respFecha2').text(date);

});