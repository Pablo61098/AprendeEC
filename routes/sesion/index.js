const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');
const middleware = require("../../middleware");
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const axios = require('axios');

oauth2Credentials={
    client_id:"332811985088-nbu9qlpo23mpdplm3uffdk53td2pfr7u.apps.googleusercontent.com",
    project_id:"aprendec-285201",
    auth_uri:"https://accounts.google.com/o/oauth2/auth",
    token_uri:"https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs",
    client_secret:"jYWJx2cKuqJiHKJJFmuOwpSf",
    redirect_uris:["http://localhost:3000/signin-google"],
    javascript_origins:["http://localhost:3000"],
    scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    ]
}

const oauth2Client = new OAuth2(oauth2Credentials.client_id, oauth2Credentials.client_secret, oauth2Credentials.redirect_uris[0]);

const loginLink = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: oauth2Credentials.scopes
});

// console.log("\n\nSOY EL LINK: " + loginLink);


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: 'aprendecdb'
});

connection.connect();

router.get("/hola", middleware.isLoggedIn ,function(req, res){
    console.log("YOU ARE LOGGED IN");
    res.send("hola");
});


router.get("/signin-google", function(req, res){
    console.log("\n\nHOLA ESTE ES LA INFOMRACION DE GOOGLE");
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);

    // const oauth2Client = new OAuth2(oauth2Credentials.client_id, oauth2Credentials.client_secret, oauth2Credentials.redirect_uris[0]);
    if (req.query.error) {
        // The user did not give us permission.
        return res.redirect('/');
    } else {
        const data =  oauth2Client.getToken(req.query.code, function(err, token) {
            if (err)
                return res.redirect('/');

            // let tokens = data.tokens;
            console.log(token);
            axios({
                url: 'https://www.googleapis.com/oauth2/v2/userinfo',
                method: 'get',
                headers: {
                Authorization: `Bearer ${token.access_token}`,
                },
            }).then(function (response) {
                // handle success
                console.log(response.data);
                let userInformation = response.data;

                connection.query(`select * from usuario where username = '${userInformation.id}'`, function(err, results, fields){
                    if(err){
                        return res.send(err);
                    }
                    if(results.length == 0){
                        try{
                            console.log("Tratando");
                            let correoDomain = userInformation.email.split('@')[1];
                            connection.query(`select * from institucion where dominio_correo = '${correoDomain}'`, function(err2, results2, fields2){
                                if(err2){
                                    return req.send(err2);
                                }
                                if(results2 == 0){
                                    console.log("NO HAY Us");
                                    connection.query(`insert into usuario(username, correo, nombre, apellido, foto, tipoRegistro) values('${userInformation.id}', '${userInformation.email}','${userInformation.given_name}', '${userInformation.family_name}', '${userInformation.picture}', 1)`, function(err3, results3, fields3){
                                        if(err3){
                                            return res.send(err3);
                                        }
                                        console.log("insetando usuario normal");
                                        req.session.userName = userInformation.id;
                                        return res.redirect("/modPublicaciones");
                                    });
                                }else{
                                    console.log("SI HAY Us");
                                    connection.query(`insert into usuario(username, correo, nombre, apellido, foto, tipoRegistro) values('${userInformation.name}', '${userInformation.email}', '${userInformation.given_name}', '${userInformation.family_name}', '${userInformation.picture}',1)`, function(err3, results3, fields3){
                                        if(err3){
                                            return res.send(err3);
                                        }
                                        connection.query(`insert into usuario_academico values('${userInformation.name}', ${results2[0].id})`, function(err4, results4, fields4){
                                            if(err4){
                                                res.send(err4);
                                            }
                                            console.log("insertando usuario academico");
                                            req.session.userName = userInformation.id;
                                            return res.redirect("/modPublicaciones");       
                                        });
                                    });
                                    
                                }
                            });
                            
                        }catch(e){
                            console.log("Se ha dado un error");
                            return res.send(e);
                        }
                        
                    }else{
                        console.log("Si existe el usuario");
                        connection.query(`update usuario set foto = '${userInformation.picture}' where username='${userInformation.id}';`)
                        req.session.userName = results[0].username;
                        return res.redirect("/modPublicaciones");
                    }
                });
              }).catch(function (error) {
                // handle error
                console.log(error);
              })
              .finally(function () {
                // always executed
              });;
            
            
        });
    }

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
    

    res.render("./registro/login", {loginLink: loginLink});
});

router.post("/login", function(req, res){
    console.log(req.body);

    let userName = req.body.username;
    let contrasena = req.body.password;

    connection.query(`select * from usuario where(username = '${userName}' && confirmado=1)`, function(err, results, fields){
        if(err){
            console.log("Ha habido un error al buscar el usuario");
            res.send(err);
        }else{
            console.log(results);
            if(results.length == 0){
                return res.render("./registro/login", {wrongCredentials: "Nombre de usuario o contraseña incorrecta", loginLink: loginLink});
            }
            if(bcrypt.compareSync(contrasena, results[0].contrasena)){
                //Aqui se debe llamar al dashboard de la aplicacion
                req.session.userName = results[0].username;
                // res.locals.userName = req.session.userName;
                return res.redirect("/modPublicaciones");
            }else{
                return res.render("./registro/login", {wrongCredentials: "Nombre de usuario o contraseña incorrecta", loginLink: loginLink});
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
        if(err || results.length == 0){
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
        let acerca = req.body.acerca;
        let cedula = req.body.cedula;

        if(req.body.universityId == '-1'){
            console.log(`${req.body.correo}`);
            let correo = `${req.body.correo}`;

            connection.query(`insert into usuario(username, contrasena, correo, cedula, acerca, valoracion, confirmado, tipoRegistro) 
                values('${userName}', '${contrasena}', '${correo}', '${cedula}' ,'${acerca}',0, 0, 0)`, function(err, results, fields){
                    if(err){
                        return res.send(err);
                    }else{
                        console.log("Se ha registrado al usuario correctamente");
                        console.log(results);

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
                            return res.redirect('/login');
                        })
                        .catch(function(err){
                            console.log(err);
                            console.log("No se envio el correo");
                        });

                        
                    }
            });

        }else{
            console.log(`${req.body.correo}${req.body.correoDominio}`);
            let correo = `${req.body.correo}${req.body.correoDominio}`;
            let universityID = req.body.universityId;

            connection.query(`insert into usuario(username, contrasena, cedula, correo, acerca,valoracion, confirmado, tipoRegistro) 
                values('${userName}', '${contrasena}', '${cedula}','${correo}', '${acerca}', 0, 0, 0)`, function(err, results, fields){

                if(err){
                    return res.send(err);
                }else{
                    console.log(results);

                    connection.query(`insert into usuario_academico(username, id_institucion) values('${userName}', ${universityID})`, function(err2, results2, fields2){
                        if(err2){
                            return res.send(err2);
                        }else{
                            console.log("Se ha registrado al usuario academico exitosamente");
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
        return res.send("Wrong information!!");
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

router.get('/firstLogin', function(req, res){
    res.render('./registro/firstLogin');
});

router.post('/firstLogin', function(req, res){
    console.log('\n1');
    let data = req.body;
    console.log(data);
    connection.query(`select * from usuario_admin_inst where username = '${data.username}'`, function(err, results, fields){
        if(err){
            return res.send(err);
        }
        console.log('2');
        if(results.length > 0){
            connection.query(`select * from usuario where (username = '${data.username}' && confirmado=0)`, function(err2, results2, fields2){
                if(err2){
                    return res.send(err2);
                }
                console.log('3');
                if(results2 == 0){
                    console.log('4');
                    return res.redirect("/login");
                }else{
                    //compare
                    console.log('5');
                    console.log(results2);
                    
                    if(data.password == results2[0].contrasena){
                        console.log('6');
                        req.session.firstLogin = data.username;
                        res.redirect('/stablishPassword');
                    }
                }
            });
        }else{
            return res.redirect('/login');
        }
    });    
});


router.get('/stablishPassword', middleware.isFirstLogin ,function(req, res){
    res.render('./registro/stablishPassword');
});

router.post('/stablishPassword', middleware.isFirstLogin ,function(req, res){
    let data = req.body;
    console.log("\nStablish password");
    console.log(data);
    if(data.password == data.confirmPassword){
        let contrasena = bcrypt.hashSync(data.password, 14);
        console.log("Aqui toy");
        connection.query(`update usuario set contrasena = '${contrasena}', confirmado = 1 where username = '${req.session.firstLogin}' `, function(err, result, fields){
            if(err){
                return res.send(err);
            }
            req.session.destroy();
            console.log("Se ha destruido la sesion");
            return res.redirect('/login');
        });
    }
    
});

module.exports = router;