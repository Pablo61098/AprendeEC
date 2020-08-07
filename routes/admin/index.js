const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const middleware = require("../../middleware");

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

router.get("/adminSolicitudes", middleware.isAdmin, (req, res) => {

    console.log("heyyyy");
    console.log(req.query);

    connection.query('select * from solicitud where pendiente = 1', function (err, results, fields) {
        // console.log(results);
        // console.log('-------------');

        // for(let i=0; i<results.length; i++){
        //     console.log(results[i]);
        // }

        // console.log(fields);
        res.render("./registro/adminSolicitudes", { results: results, institucion: req.query.institucion, tipo: req.query.tipo });
    });
});

router.get("/", function (req, res) {
    res.render("./registro/adminLogin");
});

router.post("/", function (req, res) {

    connection.query(`select * from usuario_admin_plat where (username = '${req.body.username}' &&  contrasena = '${req.body.password}')`, function (err, results, fields) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        if (results.length > 0) {
            req.session.admin = req.body.username;
            return res.redirect("/admin/adminSolicitudes");
        } else {
            return res.redirect("/admin");
        }

    })


});

router.put("/aceptarSolicitud/:idSolicitud", function (req, res) {
    console.log("hola");
    connection.query(`update solicitud set pendiente = 0, aceptado = 1 where id = ${req.params.idSolicitud}`, function (err, results, fields) {
        if (err) {
            res.send(error);
        } else {
            console.log("Se ha actualizado la solicitud " + req.params.idSolicitud);
            // connection.query(`insert into institucion(nombre, ciudad, direccion, numero_cuenta_bancaria, dominio_correo, pagina_web) 
            //     values( '${nombre}', '${ciudad}', '${direccion}', '${numero_cuenta_bancaria}', '${dominio_correo}', '${pagina_web}')`, function(err, results, fields){
            //     });
            connection.query(`select * from solicitud where id=${req.params.idSolicitud}`, function (err2, results2, fields2) {
                if (err2) {
                    res.send(err2);
                } else {
                    console.log(results2);
                    //Institute information
                    let nombreInstitucion = results2[0].nombre_institucion;
                    let ciudad = results2[0].ciudad;
                    let provincia = results2[0].provincia;
                    let direccion = results2[0].direccion;
                    let numeroCuentaBancaria = results2[0].numero_cuenta_bancaria;
                    let dominioCorreo = results2[0].dominio_correo_institucion;
                    let paginaWeb = results2[0].pagina_web;
                    //User information
                    let nombreAdministrador = results2[0].nombres_administrador;
                    let apellidosAdministrador = results2[0].apellidos_administrador;
                    let cedula_administrador = results2[0].cedula_administrador;
                    let correo_administrador = results2[0].correo_administrador;
                    let cargoAdministrador = results2[0].cargo_administrador;

                    console.log("HEY GOT HERE");
                    connection.query(`insert into institucion(nombre, ciudad, provincia, direccion, numero_cuenta_bancaria, dominio_correo, pagina_web, valoracion)
                         values('${nombreInstitucion}', ${ciudad},  ${provincia},'${direccion}', '${numeroCuentaBancaria}' 
                        ,'${dominioCorreo}', '${paginaWeb}', 0)`, function (err3, results3, fields3) {
                        if (err3) {
                            res.send(err3);
                        } else {
                            console.log("Se ha insertado la institucion");
                            let idInstitucion = results3.insertId;
                            // console.log(fields3);
                            let contrasena = returnGibberish(15); // Should be radomly generated and encrypted
                            connection.query(
                                `insert into usuario(username, ciudad, provincia ,contrasena, correo, cedula, nombre, apellido,valoracion, confirmado, tipoRegistro) values('${nombreAdministrador} ${apellidosAdministrador}',${ciudad}, ${provincia}, '${contrasena}','${correo_administrador}', '${cedula_administrador}','${nombreAdministrador}','${apellidosAdministrador}',0, 0, 0)`, function (err4, results4, fields4) {
                                    if (err4) {
                                        console.log(err4);
                                        res.send(err4);
                                    } else {
                                        console.log("Se ha insertado el usuario");
                                        connection.query(`insert into usuario_admin_inst values('${nombreAdministrador} ${apellidosAdministrador}', ${idInstitucion}, '${cargoAdministrador}')`, function (err5, results5, fields5) {
                                            if (err5) {
                                                console.log(err5);
                                                res.send(err5);
                                            } else {
                                                let date = new Date();
                                                let fecha = date.toLocaleDateString();
                                                let hora = date.toLocaleTimeString();
                                                connection.query(`insert into carrito(username_usuario, fecha_hora_creacion, pendiente) values('${nombreAdministrador} ${apellidosAdministrador}', '${fecha} ${hora}', true)`, function (err6, results6, fields6) {
                                                    if (err6) {
                                                        console.log(err6);
                                                        return res.send(err6);
                                                    }
                                                    console.log("Se ha insertado el usuario_admin_inst");
                                                    console.log(`${correo_administrador}`);
                                                    const msg = {
                                                        to: `${correo_administrador}`,
                                                        from: 'pablosolano61098@gmail.com',
                                                        subject: 'Se ha acepto su solicitud de registro.',
                                                        text: 'Mensaje automatico de AprendEC',
                                                        html: `<div class='text-center'> 
                                                                        <label><strong>APRENDEC</strong></label>
                                                                        </div>
                                                                        <div>
                                                                            <p>
                                                                            <label>Querido usuario, su solicitud para la inclusión de su institucion: <strong>${nombreInstitucion}</strong>, en nuestra aplicación ha sido aceptada.
                                                                                    Sus alumnos podran resgitrarse a la aplicación con el correo institucional que termine de esta forma: ${dominioCorreo}.
                                                                                    Agradecemos su preferencia. Puede entrar a nuestra aplicacion mediante este link: <a href="${process.env.SITE_URL}/firstLogin/">AprendEC login</a>, con el el nombre de usuario: <strong>${nombreAdministrador} ${apellidosAdministrador}</strong> y la clave: <strong>${contrasena}</strong>. Para configurar su contraseña permanentemente.</label> 
                                                                            <br>
                                                                            </p>
                                                                        </div>`,
                                                    };
                                                    sgMail.send(msg)
                                                        .then(function (result) {
                                                            console.log(result);
                                                            res.send({ nombreInstitucion: nombreInstitucion, tipo: "aceptado" });
                                                            console.log("Se ha enviado el correo exitosamente");
                                                        })
                                                        .catch(function (err) {
                                                            console.log(err);
                                                            console.log("No se envio el correo");
                                                        });
                                                });
                                            }
                                        });
                                    }
                                });
                        }
                    });
                }
            });
        }
    });
    console.log(req.params);
});

router.get("/downloadCertificado/:fileName", function (req, res) {
    console.log("heyyy DOWNLOADING");
    console.log(req.params.fileName);
    let fileName = req.params.fileName;
    res.download(`./certificados/${fileName}`, function (err) {
        if (err) {
            console.log(err);
        }
    });
});

router.put("/rechazarSolicitud/:idSolicitud", function (req, res) {
    console.log("holaRechazar");
    connection.query(`update solicitud set pendiente = 0, aceptado = 0 where id = ${req.params.idSolicitud}`, function (err, results, fields) {
        if (err) {
            res.send(error);
        } else {
            console.log("Se ha actualizado la solicitud " + req.params.idSolicitud);
            // connection.query(`insert into institucion(nombre, ciudad, direccion, numero_cuenta_bancaria, dominio_correo, pagina_web) 
            //     values( '${nombre}', '${ciudad}', '${direccion}', '${numero_cuenta_bancaria}', '${dominio_correo}', '${pagina_web}')`, function(err, results, fields){
            //     });
            connection.query(`select * from solicitud where id=${req.params.idSolicitud}`, function (err2, results2, fields2) {
                let nombreInstitucion = results2[0].nombre_institucion;

                const msg = {
                    to: 'pablosolano61098@gmail.com',
                    from: 'pablosolano61098@gmail.com',
                    subject: 'Se ha rechazó su solicitud de registro.',
                    text: '',
                    html: `<div class='text-center'> 
                           <label><strong>APRENDEC</strong></label>
                           </div>
                           <div>
                               <p>
                               <label>Querido usuario lamentamos informarle que su solicitud de añadir a la institucion <strong>${nombreInstitucion}</strong> ha sido rechazada.
                                       Esto puede ser debido a que la información proporcionada fue incorrecta o que no cubre los requisitos para ser aceptada.
                                       Puede intentar una solicitud nuevamente dando click en <a href='${process.env.SITE_URL}/registrarUniversidad'>REALIZAR UNA NUEVA SOLICITUD</a></label> 
                               <br>
                               </p>
                           </div>`,
                };
                sgMail.send(msg)
                    .then(function (result) {
                        console.log(result);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

                res.send({ nombreInstitucion: nombreInstitucion, tipo: "rechazado" });
            });

        }
    });
    console.log(req.params);
});

function returnGibberish(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}


module.exports = router;
