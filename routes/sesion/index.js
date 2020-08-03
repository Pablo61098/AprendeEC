const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');
const middleware = require("../../middleware");


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'luis',
    password: '1234',
    database: 'aprendecdb'
});

connection.connect();

router.get("/hola", middleware.isLoggedIn ,function(req, res){
    console.log("YOU ARE LOGGED IN");
    res.send("hola" + res.locals.userName);
});


router.get("/login", function(req, res){
    console.log("Peticion a Login");
    // console.log(process.env.PWD);
    // connection.query('select * from usuario_admin_plat', function(error, results, fields){
    //     if(error){
    //         console.log(error);
    //     }else{
    //         console.log(results);
    //         console.log(fields);
    //     }
    // });
    res.render("./registro/login");
});

router.post("/login", function(req, res){
    console.log(req.body);

    let userName = req.body.username;
    let contrasena = req.body.password;

    connection.query(`select * from usuario where(username = '${userName}')`, function(err, results, fields){
        if(err){
            console.log("Ha habido un error al buscar el usuario");
            res.send(err);
        }else{
            console.log(results);
            if(results.length == 0){
                return res.render("./registro/login", {wrongCredentials: "Nombre de usuario o contraseña incorrecta"});
            }
            if(bcrypt.compareSync(contrasena, results[0].contrasena)){
                //Aqui se debe llamar al dashboard de la aplicacion
                req.session.userName = results[0].username;
                // res.locals.userName = req.session.userName;
                return res.render("./registro/login", {wrongCredentials: "Correcto"});
            }else{
                return res.render("./registro/login", {wrongCredentials: "Nombre de usuario o contraseña incorrecta"});
            }
        }
    });    

});

router.get("/register", function(req, res){
    connection.query('select * from institucion', function(err, results, fields){
        if(err){
            console.log("err");
            console.log(err);
        }else{
            console.log(results);
            res.render("./registro/registroUsuario", {instituciones: results});     
        }
    });    
});

router.get("/register/:tipo/:user", function(req, res){
    console.log("hola");
    console.log(req.params);

    let tipo = -1;
    if(req.params.tipo == 'aceptar'){
        tipo = 1;
    }else if(req.params.tipo == 'rechazar'){
        tipo = -1;
    }


    connection.query(`select * from usuario where(username='${req.params.user}')`, function(err, results, fields){
        if(err){
            console.log("Error en la seleccion del usuario");
            res.send(err);
        }else{
            console.log(results);
            if(results[0].confirmado == 0){
                connection.query(`update usuario set confirmado = ${tipo} where(username = '${req.params.user}')`, function(err2, results2, fields){
                    if(err2){
                        console.log("No se pudo confirmar ni rechazar el usuario");
                        res.send(err2);
                    }else{
                        if(tipo == 1){
                            console.log("Se CONFIRMO el usuario");
                        }else if(tipo == -1){
                            console.log("Se RECHAZO el usuario");
                        }
                        console.log(results2);
                        if(tipo == 1){
                            res.render("./registro/confirmation", { confirmado : tipo });
                        }else if(tipo == -1){
                            res.render("./registro/confirmation", { confirmado : tipo });
                        }
                    }
                });
            }else{
                console.log("El usuario ya ha sido confirmado o rechazado");
                if(results[0].confirmado == 1){
                    res.render("./registro/confirmation", { confirmado : 2 });
                }else if(results[0].confirmado == -1){
                    res.render("./registro/confirmation", { confirmado : -2 });
                }
                
            }
        }
    });
});

router.post("/register", function(req, res){
    
    console.log(req.body);

    if(req.body.contrasena == req.body.contrasenaConfirm){
        let userName = req.body.userName;
        let contrasena = bcrypt.hashSync(req.body.contrasena, 14);

        if(req.body.universityName == '-1'){
            console.log(`${req.body.correo}`);
            let correo = `${req.body.correo}`;

            connection.query(`insert into usuario(username, contrasena, correo, valoracion, confirmado) 
                values('${userName}', '${contrasena}', '${correo}', 0, 0 )`, function(err, results, fields){

                    console.log(results);

            });

        }else{
            console.log(`${req.body.correo}${req.body.correoDominio}`);
            let correo = `${req.body.correo}${req.body.correoDominio}`;
            let universityID = req.body.universityId;

            connection.query(`insert into usuario(username, contrasena, correo, valoracion, confirmado) 
                values('${userName}', '${contrasena}', '${correo}', 0, 0 )`, function(err, results, fields){

                if(err){
                    res.send(err);
                }else{
                    console.log(results);

                    connection.query(`insert into usuario_academico(username, id_institucion) values('${userName}', ${universityID})`, function(err2, results2, fields2){
                        if(err2){
                            res.send(err2);
                        }else{
                            console.log(results2);

                            const msg = {
                                to: `${correo}`,
                                from: 'pablosolano61098@gmail.com',
                                subject: 'AprendEC confirmación.',
                                text: 'Mensaje automatico de AprendEC',
                                html:   `<div class='text-center'> 
                                            <label><strong>APRENDEC</strong></label>
                                        </div>
                                        <div>
                                            <label> Se ha hecho una peticion de registro para la aplicacion <strong>AprendEC</strong> con el correo electronico <strong></strong>.</label>
                                            <br>
                                            <label>Si usted ha realizado esta peticion de click en el boton CONFIRMAR</label>
                                            <br>
                                            <label>De otro modo de click en el boton RECHAZAR</label>
                                            <br>
                                            <label>Username: ${userName}</label>
                                            <br>
                                            <label>E-mail: ${correo}</label>
                                            <div><a href="http://localhost:3000/register/aceptar/${userName}"><button>CONFIRMAR</button></a> <a href="http://localhost:3000/register/rechazar/${userName}"><button>RECHAZAR</button></a></div>
                                        </div>`,
                            };
                            sgMail.send(msg)
                            .then(function(result){
                                console.log(result);
                                console.log("Se ha enviado el correo exitosamente");
                                res.redirect('/login');
                            })
                            .catch(function(err){
                                console.log(err);
                                console.log("No se envio el correo");
                            });

                        }
                    });
                }
            });
            
            
        }
    }else{
        res.send("Wrong information!!");
    }

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