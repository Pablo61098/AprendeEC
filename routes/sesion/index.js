const express = require("express");
const router = express.Router();
const mysql = require("mysql");


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'luis',
    password: '1234',
    database: 'aprendecdb'
});

connection.connect();

router.get("/login", function(req, res){
    console.log("Peticion a Login");
    console.log(process.env.PWD);
    connection.query('select * from usuario_admin_plat', function(error, results, fields){
        if(error){
            console.log(error);
        }else{
            console.log(results);
            console.log(fields);
        }
    });

    res.render("./registro/login");
});

router.get("/registrarUniversidad", function(req, res){
    res.render("./registro/inscripcionU");
});

router.post("/registrarUniversidad", function(req, res){
    console.log("Se esta tratando de registrar una universidad");

    if(req.files){
        console.log(req.files);

        let certificado =  req.files.certificadoCACES;
        let certificadoName =  req.files.certificadoCACES.name;
        
        certificado.mv('./certificados/' + certificadoName, function(err){
            if(err){
                res.send(err);
            }else{

                let nombreInstitucion = req.body.nombreInstitucion;
                let ciudad = req.body.ciudad;
                let direccion = req.body.direccion;
                let paginaWeb = req.body.paginaWeb;
                let numeroCuentaBancaria = req.body.numeroCuentaBancaria;
                let nombres = req.body.nombres;
                let apellidos = req.body.apellidos;
                let numeroCedula = req.body.numeroCedula;
                let cargo = req.body.cargo;
                let cargoAdministrador = req.body.cargoAdministrador;
                let correoInstitucional = req.body.correoInstitucional;

                connection.query(`insert into solicitud (nombre_institucion, ciudad , direccion,pagina_web,numero_cuenta_bancaria,certificado_caces,nombres_administrador,apellidos_administrador,cedula_administrador,cargo_administrador,correo_administrador, dominio_correo_institucion, pendiente, aceptado) 
                    values( '${nombreInstitucion}', '${ciudad}' , '${direccion}', '${paginaWeb}','${numeroCuentaBancaria}', '${certificadoName}' ,'${nombres}', '${apellidos}', '${numeroCedula}', '${cargo}', '${cargoAdministrador}', '${correoInstitucional}', 1, 0)`, function(error, results, fields){
                    if(error){
                        res.send(error);
                    }else{
                        res.redirect("/login");
                    }
                });

            }
        });            
    }    
});

router.get("/adminSolicitudes", (req, res) => {

    connection.query('select * from solicitud where pendiente = 1', function(err, results, fields){
        // console.log(results);
        // console.log('-------------');

        // for(let i=0; i<results.length; i++){
        //     console.log(results[i]);
        // }

        // console.log(fields);

        res.render("./registro/adminSolicitudes", {results : results});
    });
    
    
});

router.put("/aceptarSolicitud/:idSolicitud", function(req, res){
    console.log("hola");
    connection.query(`update solicitud set pendiente = 0, aceptado = 1 where id = ${req.params.idSolicitud}`, function(err, results, fields){
        if(err){
            res.send(error);
        }else{
            console.log("Se ha actualizado la solicitud " + req.params.idSolicitud);
        }



    });



    console.log(req.params);
});

module.exports = router;

