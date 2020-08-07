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

const connection = mysql.createPool({
    connectionLimit: 100,
    host: process.env.LOCAL_MYSQL_HOST,
    port: 3306,
    user: process.env.LOCAL_MYSQL_USER,
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: process.env.LOCAL_MYSQL_DB
});

connection.getConnection(function (err, conn) {
    if (err) {
        console.log('No se ha podido conectar.');
        return callback(err);
    } else {
        console.log('Conectado a BD.');
    }
});

router.get("/hola", middleware.isLoggedIn ,function(req, res){
    console.log("YOU ARE LOGGED IN");
    res.send("hola" + res.locals.userName);
});


router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect("/modPublicaciones");
})

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
                            console.log(correoDomain);
                            connection.query(`select * from institucion where dominio_correo = '@${correoDomain}'`, function(err2, results2, fields2){
                                if(err2){
                                    return req.send(err2);
                                }
                                if(results2.length == 0){
                                    console.log("NO HAY Us");
                                    console.log(results2);
                                    connection.query(`insert into usuario(username, correo, nombre, apellido, foto, tipoRegistro, valoracion) values('${userInformation.id}', '${userInformation.email}','${userInformation.given_name}', '${userInformation.family_name}', '${userInformation.picture}', 1, 0)`, function(err3, results3, fields3){
                                        if(err3){
                                            return res.send(err3);
                                        }
                                        console.log("insetando usuario normal");
                                        let date = new Date();
                                        let fecha = date.toLocaleDateString();
                                        let hora = date.toLocaleTimeString();
                                        connection.query(`insert into carrito(username_usuario, fecha_hora_creacion, pendiente) values('${userInformation.id}', '${fecha} ${hora}', true)`, function(err4, results4, fields4){
                                            if(err4){
                                                console.log(err4);
                                                return res.send(err4);
                                            }
                                            req.session.userName = userInformation.id;
                                            return res.redirect("/modPublicaciones");
                                        });
                                        
                                    });
                                }else{
                                    console.log("SI HAY Us");
                                    connection.query(`insert into usuario(username, ciudad, provincia, correo, nombre, apellido, foto, tipoRegistro, valoracion) values('${userInformation.id}', ${results2[0].ciudad}, ${results2[0].provincia},'${userInformation.email}', '${userInformation.given_name}', '${userInformation.family_name}', '${userInformation.picture}',1, 0)`, function(err3, results3, fields3){
                                        if(err3){
                                            return res.send(err3);
                                        }
                                        connection.query(`insert into usuario_academico values('${userInformation.id}', ${results2[0].id})`, function(err4, results4, fields4){
                                            if(err4){
                                                res.send(err4);
                                            }

                                            console.log("insertando usuario academico");
                                            let date = new Date();
                                            let fecha = date.toLocaleDateString();
                                            let hora = date.toLocaleTimeString();
                                            connection.query(`insert into carrito(username_usuario, fecha_hora_creacion, pendiente) values('${userInformation.id}', '${fecha} ${hora}', true)`, function(err5, results5, fields5){
                                                if(err5){
                                                    console.log(err5);
                                                    return res.send(err5);
                                                }
                                                req.session.userName = userInformation.id;
                                                return res.redirect("/modPublicaciones");     
                                            });   
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
                        // connection.query(`update usuario set foto = '${userInformation.picture}' where username='${userInformation.id}';`)
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

            connection.query(`select * from provincia`, function(err2, results2, fields2){
                if(err2){
                    console.log(err2);
                    return res.send(err2);
                }
                connection.query(`select * from ciudad where id_provincia = ${results2[19].id}`, function(err3, results3, fields3){
                    if(err3){
                        console.log(err3);
                        return res.send(err3);
                    }
                    console.log(results3);
                    res.render("./registro/registroUsuario", {instituciones: results, provincias: results2, cantones: results3});
                });
                
            });
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
        let ciudad = req.body.ciudad;
        let provincia = req.body.provincia;
        let nombre = req.body.nombres;
        let apellido = req.body.apellidos;

        if(req.body.universityId == '-1'){
            console.log(`${req.body.correo}`);
            let correo = `${req.body.correo}`;

            connection.query(`insert into usuario(username, nombre, apellido,ciudad, provincia,contrasena, correo, cedula, acerca, valoracion, confirmado, tipoRegistro) 
                values('${userName}', '${nombre}', '${apellido}', ${ciudad}, ${provincia},'${contrasena}', '${correo}', '${cedula}' ,'${acerca}',0, 0, 0)`, function(err, results, fields){
                    if(err){
                        return res.send(err);
                    }else{
                        console.log("Se ha registrado al usuario correctamente");
                        console.log(results);

                        let date = new Date();
                        let fecha = date.toLocaleDateString();
                        let hora = date.toLocaleTimeString();
                        connection.query(`insert into carrito(username_usuario, fecha_hora_creacion, pendiente) values('${userName}', '${fecha} ${hora}', true)`, function(err2, results2, fields2){
                            if(err2){
                                console.log(err2);
                                return res.send(err2);
                            }
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
                                            <div><a href="${process.env.SITE_URL}/register/aceptar/${userName}"><button>CONFIRMAR</button></a> <a href="http://localhost:3000/register/rechazar/${userName}"><button>RECHAZAR</button></a></div>
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
                        });
                    }
            });

        }else{
            console.log(`${req.body.correo}${req.body.correoDominio}`);
            let correo = `${req.body.correo}${req.body.correoDominio}`;
            let universityID = req.body.universityId;

            connection.query(`insert into usuario(username, nombre, apellido, ciudad, provincia,contrasena, cedula, correo, acerca,valoracion, confirmado, tipoRegistro) 
                values('${userName}', '${nombre}', '${apellido}', ${ciudad}, ${provincia},'${contrasena}', '${cedula}','${correo}', '${acerca}', 0, 0, 0)`, function(err, results, fields){

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
                            let date = new Date();
                            let fecha = date.toLocaleDateString();
                            let hora = date.toLocaleTimeString();
                            connection.query(`insert into carrito(username_usuario, fecha_hora_creacion, pendiente) values('${userName}', '${fecha} ${hora}', true)`, function(err3, results3, fields3){
                                if(err3){
                                    console.log(err3);
                                    return res.send(err3);
                                }
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
                                                <div><a href="${process.env.SITE_URL}/register/aceptar/${userName}"><button>CONFIRMAR</button></a> <a href="http://localhost:3000/register/rechazar/${userName}"><button>RECHAZAR</button></a></div>
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
    connection.query(`select * from provincia`, function(err, results, fields){
        if(err){
            console.log(err);
            return res.send(err);
        }
        connection.query(`select * from ciudad where id_provincia = ${results[19].id}`, function(err2, results2, fields2){
            if(err2){
                console.log(err2);
                return res.send(err2);
            }
            res.render("./registro/inscripcionU", {provincias: results, cantones: results2});
        });
        
    });
});

router.post("/registrarUniversidad", function(req, res){
    console.log("Se esta tratando de registrar una universidad");
    console.log(req.body);
    console.log(req.params);
    
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
                let provincia = req.body.provincia;
                let direccion = req.body.direccion;
                let paginaWeb = req.body.paginaWeb;
                let numeroCuentaBancaria = req.body.numeroCuentaBancaria;
                let nombres = req.body.nombres;
                let apellidos = req.body.apellidos;
                let numeroCedula = req.body.numeroCedula;
                let cargo = req.body.cargo;
                let correoAdministrador = req.body.correoAdministrador;
                let correoInstitucional = req.body.correoInstitucional;

                connection.query(`insert into solicitud (nombre_institucion, ciudad, provincia, direccion,pagina_web,numero_cuenta_bancaria,certificado_caces,nombres_administrador,apellidos_administrador,cedula_administrador,cargo_administrador,correo_administrador, dominio_correo_institucion, pendiente, aceptado) 
                    values( '${nombreInstitucion}', ${ciudad}, ${provincia}, '${direccion}', '${paginaWeb}','${numeroCuentaBancaria}', '${certificadoName}' ,'${nombres}', '${apellidos}', '${numeroCedula}', '${cargo}', '${correoAdministrador}' ,'${correoInstitucional}', 1, 0)`, function(error, results, fields){
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
                    }else{
                        res.redirect("/login");
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

router.get("/cantones/:idProvincia", function(req, res){
    console.log("Se esta haciendo una peticion de cantones de una provincia");

    connection.query(`select * from ciudad where id_provincia= ${req.params.idProvincia}`, function(err, results, fields){
        if(err){
            console.log(err);
            return res.send(err);
        }
        console.log("Enviando informacion de cantones");
        res.send(results);
    });

});

module.exports = router;