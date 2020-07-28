

const express = require("express");
const router = express.Router();
const mysql = require("mysql");


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'legostarte123',
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
                let correoAdministrador = req.body.correoAdministrador;
                let correoInstitucional = req.body.correoInstitucional;

                connection.query(`insert into solicitud (nombre_institucion, ciudad , direccion,pagina_web,numero_cuenta_bancaria,certificado_caces,nombres_administrador,apellidos_administrador,cedula_administrador,cargo_administrador,correo_administrador, dominio_correo_institucion, pendiente, aceptado) 
                    values( '${nombreInstitucion}', '${ciudad}' , '${direccion}', '${paginaWeb}','${numeroCuentaBancaria}', '${certificadoName}' ,'${nombres}', '${apellidos}', '${numeroCedula}', '${cargo}', '${correoAdministrador}' ,'${correoInstitucional}', 1, 0)`, function(error, results, fields){
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


module.exports = router;