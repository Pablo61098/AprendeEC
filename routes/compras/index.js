var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var bigDecimal = require('js-big-decimal');
var Prince = require("prince")
var util = require("util")
var fs = require('fs');
var nodemailer = require('nodemailer');
var middleware = require("../../middleware");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aprendec.tienda@gmail.com',
        pass: process.env.TIENDA_MAIL_PASSWD
    }
});

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: 'aprendecdb',
    multipleStatements: true
});

conn.connect();

function enviarPDFCorreo(mail, filename, content) {
    fs.appendFile(`${filename}.html`, content, function (err) {
        if (err) throw err;
        console.log('Saved!');
        Prince()
            .inputs(`${filename}.html`)
            .output(`${filename}.pdf`)
            .execute()
            .then(function () {
                console.log("OK: done")
                var mailOptions = {
                    from: 'aprendec.tienda@gmail.com',
                    to: `${mail}`,
                    subject: 'AprendEC - Gracias por su Compra',
                    html: '<h1>AprendEC - Informe de Compra</h1><p>Muchas gracias por su compra en la tienda online de AprendEC.</p><p>Factura en el archivo PDF ajunto.</p>',
                    attachments: [
                        {
                            filename: 'factura.pdf',
                            path: `${filename}.pdf`
                        }
                    ]
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        fs.unlink(`${filename}.html`, function (err) {
                            if (err) throw err;
                            console.log('File deleted!');
                            fs.unlink(`${filename}.pdf`, function (err) {
                                if (err) throw err;
                                console.log('File deleted!');
                            });
                        });
                    }
                });
            }, function (error) {
                console.log("ERROR: ", util.inspect(error))
            })
    });
}

router.get("/", middleware.isLoggedIn, function (req, res) {
    let sql = `select producto.id as id, producto.foto as foto, producto.nombre as nombre, producto.precio as precio, 
    institucion.nombre as institucion, carrito_producto.cantidad as cantidad, producto.stock as stock from carrito JOIN carrito_producto on carrito.id = carrito_producto.id_carrito 
    JOIN producto on carrito_producto.id_producto = producto.id JOIN institucion on producto.id_institucion = institucion.id 
    where carrito.username_usuario = ${mysql.escape(res.locals.userName)} and carrito.pendiente = true and producto.eliminado = false`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./compras', { results: results, bigDecimal: bigDecimal });
        }
    });
});

router.get("/informe", middleware.isLoggedIn, function (req, res) {
    conn.beginTransaction(function (error) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        }
        let sql = `select usuario.nombre as nombre, usuario.apellido as apellido, usuario.cedula as cedula,
        direccion.linea_direccion_1 as direccion, direccion.ciudad as ciudad, direccion.provincia as provincia,
        metodo_pago.compania as compania, metodo_pago.cuatro_ultimos_digitos as digitos from usuario JOIN direccion
        on usuario.username = direccion.username_usuario JOIN metodo_pago on usuario.username = metodo_pago.username_usuario
        where usuario.username = ${mysql.escape(res.locals.userName)} and direccion.activa = true and metodo_pago.activo = true`;
        conn.query(sql, function (error, results) {
            if (error) {
                console.log(error);
                res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error al recuperar datos de usuario." });
            } else {
                if (results.length) {
                    var buyerData = results;
                    let sql = `select valor from datos_programa where nombre = 'iva'`;
                    conn.query(sql, function (error, results) {
                        var iva = results;
                        if (error) {
                            console.log(error);
                            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error al recuperar IVA." });
                        } else {
                            let sql = `select producto.nombre as nombre, producto.precio as precio, institucion.nombre as institucion, 
                            carrito_producto.cantidad as cantidad from carrito JOIN carrito_producto on carrito.id = carrito_producto.id_carrito 
                            JOIN producto on carrito_producto.id_producto = producto.id JOIN institucion on producto.id_institucion = institucion.id 
                            where carrito.username_usuario = ${mysql.escape(res.locals.userName)} and carrito.pendiente = true and producto.eliminado = false`;
                            conn.query(sql, function (error, results) {
                                if (error) {
                                    console.log(error);
                                    res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error al recuperar datos de pedido." });
                                } else {
                                    res.render('./compras/confirmar_compra', { results: results, iva: iva, buyerData: buyerData, bigDecimal: bigDecimal });
                                }
                            });
                        }
                    });
                } else {
                    res.render('./mensaje', { tipo: "wtf", redireccion: "compras", volver: "Carrito", mensaje: "Al parecer no tiene una dirección o método de pago activados." });
                }
            }
        });
    });
});

router.get("/confirmar", middleware.isLoggedIn, function (req, res) {
    var contenido = '<!DOCTYPE html> <html> <head> <meta charset="utf-8"> <style> table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid black; text-align: center; } </style> </head> <body> <div> <h2>AprendEC - Informe de Compra</h2>';
    var correo = "";
    var archivo = "./private/temp/facturas/";
    var subtotal = "0.00";
    var stock_actual = 0;
    var id_producto_actual = 0;
    var rollbackDone = false;
    conn.beginTransaction(function (error) {
        if (error) {
            console.log(error);
            conn.rollback(function () {
                res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
            });
        } else {
            let sql = `select usuario.correo as correo, usuario.nombre as nombre, usuario.apellido as apellido, usuario.cedula as cedula,
            direccion.linea_direccion_1 as direccion, direccion.ciudad as ciudad, direccion.provincia as provincia,
            metodo_pago.compania as compania, metodo_pago.cuatro_ultimos_digitos as digitos from usuario JOIN direccion
            on usuario.username = direccion.username_usuario JOIN metodo_pago on usuario.username = metodo_pago.username_usuario
            where usuario.username = ${mysql.escape(res.locals.userName)} and direccion.activa = true and metodo_pago.activo = true`;
            conn.query(sql, function (error, results) {
                if (error) {
                    console.log(error);
                    conn.rollback(function () {
                        res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
                    });
                } else {
                    if (results.length) {
                        correo = results[0].correo;
                        contenido += `<p><b>Nombre: </b>${results[0].nombre} ${results[0].apellido}</p>
                    <p><b>CI: </b>${results[0].cedula}</p>
                    <p><b>Fecha: </b>${(new Date()).toLocaleDateString()}</p>
                    <p><b>Dirección de Envío: </b>${results[0].direccion} | ${results[0].ciudad}, ${results[0].provincia}</p>
                    <p><b>Forma de Pago: </b>${results[0].compania.toUpperCase()} (**********${results[0].digitos})</p>
                    <br>
                    <table>
                        <thead>
                            <tr>
                                <th>Institución</th>
                                <th>Artículo</th>
                                <th>Costo Unitario ($ USD)</th>
                                <th>Cantidad</th>
                                <th>Costo ($ USD)</th>
                            </tr>
                        </thead>
                        <tbody>`
                        let sql = `update carrito set direccion_envio = '${results[0].direccion} | ${results[0].ciudad}, ${results[0].provincia}',
                        metodo_pago = '${results[0].compania.toUpperCase()} (**********${results[0].digitos})' where username_usuario = ${mysql.escape(res.locals.userName)}
                        and pendiente = true`;
                        conn.query(sql, function (error, results) {
                            if (error) {
                                console.log(error);
                                conn.rollback(function () {
                                    res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
                                });
                            } else {
                                let sql = `select producto.id as id_producto, producto.nombre as nombre, producto.precio as precio, institucion.nombre as institucion, 
                                carrito_producto.cantidad as cantidad, producto.stock as stock, carrito_producto.id_carrito as id_carrito from carrito JOIN carrito_producto on carrito.id = carrito_producto.id_carrito 
                                JOIN producto on carrito_producto.id_producto = producto.id JOIN institucion on producto.id_institucion = institucion.id 
                                where carrito.username_usuario = ${mysql.escape(res.locals.userName)} and carrito.pendiente = true and producto.eliminado = false`;
                                conn.query(sql, function (error, results) {
                                    if (error) {
                                        console.log(error);
                                        conn.rollback(function () {
                                            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
                                        });
                                    } else {
                                        for (let i = 0; i < results.length; i++) {
                                            if (results[i].stock < results[i].cantidad) {
                                                conn.rollback(function () {
                                                    res.render('./mensaje', { tipo: "fail", redireccion: "compras", volver: "Carrito", mensaje: `Hay ${results[i].stock} unidad(es) del producto: ${results[i].nombre}. Disminuya la cantidad o quite el producto del carrito.` });
                                                });
                                                rollbackDone = true;
                                                break;
                                            } else {
                                                let costo = bigDecimal.multiply(results[i].precio, results[i].cantidad);
                                                subtotal = bigDecimal.add(subtotal, costo);
                                                contenido += `<tr>
                                            <td>${results[i].institucion}</td>
                                            <td>${results[i].nombre}</td>
                                            <td>${results[i].precio}</td>
                                            <td>${results[i].cantidad}</td>
                                            <td>${costo}</td>
                                        </tr>`
                                                stock_actual = results[i].stock - results[i].cantidad;
                                                id_producto_actual = results[i].id_producto;
                                                let sql = `update carrito_producto set costo_unitario = ${results[i].precio}, nombre_producto = '${results[i].nombre}',
                                                nombre_institucion = '${results[i].institucion}' where id_carrito = ${results[i].id_carrito} and id_producto = ${results[i].id_producto};
                                                update producto set stock = ${stock_actual} where id = ${id_producto_actual}`;
                                                conn.query(sql, function (error, results) {
                                                    if (error) {
                                                        console.log(error);
                                                        conn.rollback(function () {
                                                            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                        if (!rollbackDone) {
                                            let sql = `select valor from datos_programa where nombre = 'iva'`;
                                            conn.query(sql, function (error, results) {
                                                if (error) {
                                                    console.log(error);
                                                    conn.rollback(function () {
                                                        res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
                                                    });
                                                } else {
                                                    let porcentaje_iva = results[0].valor
                                                    let porcentaje_iva_entero = porcentaje_iva
                                                    porcentaje_iva = "0." + porcentaje_iva
                                                    let valor_iva = bigDecimal.round(bigDecimal.multiply(subtotal, porcentaje_iva), 2, bigDecimal.RoundingModes.HALF_DOWN)
                                                    let total_factura = bigDecimal.add(subtotal, valor_iva)
                                                    contenido += `<tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <th>Subtotal:</th>
                                                <td>${subtotal}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <th>IVA (${porcentaje_iva_entero}%):</th>
                                                <td>${valor_iva}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <th>Total a Pagar:</th>
                                                <td>${total_factura}</td>
                                            </tr>
                                            </tbody>
                                            </table>
                                            </div>
                                            </body>
                                            
                                            </html>`;
                                                    let date = new Date();
                                                    let sql = `update carrito set costo = ${total_factura}, fecha_hora_pago = '${date.toLocaleDateString()} ${date.toLocaleTimeString()}',
                                                    pendiente = false where username_usuario = ${mysql.escape(res.locals.userName)} and pendiente = true`;
                                                    conn.query(sql, function (error, results) {
                                                        if (error) {
                                                            console.log(error);
                                                            conn.rollback(function () {
                                                                res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
                                                            });
                                                        } else {
                                                            let date = new Date();
                                                            let sql = `insert into carrito(username_usuario, fecha_hora_creacion, pendiente) values(${mysql.escape(res.locals.userName)}, 
                                                            '${date.toLocaleDateString()} ${date.toLocaleTimeString()}', true)`
                                                            conn.query(sql, function (error, results) {
                                                                if (error) {
                                                                    console.log(error);
                                                                    conn.rollback(function () {
                                                                        res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
                                                                    });
                                                                } else {
                                                                    conn.commit(function (error) {
                                                                        if (error) {
                                                                            console.log(error);
                                                                            conn.rollback(function () {
                                                                                res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
                                                                            });
                                                                        } else {
                                                                            let date = new Date();
                                                                            archivo += `${(mysql.escape(res.locals.userName) + date.toLocaleDateString() + date.toLocaleTimeString()).replace(/[/\\?%*:|"<>]/g, '-').replace(/ /g, "")}`;
                                                                            enviarPDFCorreo(correo, archivo, contenido);
                                                                            res.render('./mensaje', { tipo: "success", redireccion: "tienda", volver: "Tienda", mensaje: "¡Compra Exitosa! Su factura fue enviada a su correo." });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        
                                    }
                                });
                            }
                        });
                    } else {
                        conn.rollback(function () {
                            res.render('./mensaje', { tipo: "wtf", redireccion: "compras", volver: "Carrito", mensaje: "Al parecer no tiene una dirección o método de pago activados." });
                        });
                    }
                }
            });
        }
    });
});

router.put("/modificar/:id_producto/cantidad/:cantidad", middleware.isLoggedIn, function (req, res) {
    let sql = `update carrito_producto set cantidad = ${mysql.escape(req.params.cantidad)} where 
    id_producto = ${mysql.escape(req.params.id_producto)} and id_carrito = (select id from carrito where pendiente = true
    and username_usuario = ${mysql.escape(res.locals.userName)})`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            conn.commit(function (error) {
                if (error) {
                    console.log(error);
                    conn.rollback(function () {
                        res.sendStatus(500);
                    });
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

router.delete("/quitar/:id_producto", middleware.isLoggedIn, function (req, res) {
    let sql = `delete from carrito_producto where id_producto = ${mysql.escape(req.params.id_producto)} 
    and id_carrito = (select id from carrito where pendiente = true and username_usuario = ${mysql.escape(res.locals.userName)})`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.get("/historial", middleware.isLoggedIn, function (req, res) {
    let sql = `select carrito.id as id, carrito.fecha_hora_pago as fecha_hora_pago, carrito_producto.nombre_producto as nombre, 
    carrito_producto.costo_unitario as precio, carrito_producto.cantidad as cantidad, carrito_producto.nombre_institucion as institucion, 
    carrito.costo as costo, carrito.direccion_envio as direccion_envio, carrito.metodo_pago as metodo_pago from carrito
    JOIN carrito_producto on carrito.id = carrito_producto.id_carrito where carrito.username_usuario = ${mysql.escape(res.locals.userName)} and 
    carrito.pendiente = false and carrito_producto.costo_unitario is not null order by carrito.id DESC`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./compras/historial', { results: results, bigDecimal: bigDecimal });
        }
    });

});

router.get("/direcciones", middleware.isLoggedIn, function (req, res) {
    let sql = `select * from direccion where username_usuario = ${mysql.escape(res.locals.userName)}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./compras/direcciones', { results: results });
        }
    });
});

router.get("/direcciones/editar_direccion/:id_direccion", middleware.isLoggedIn, function (req, res) {
    let sql = `select * from direccion where username_usuario = ${mysql.escape(res.locals.userName)} and id = ${mysql.escape(req.params.id_direccion)}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            if (results.length === 0) {
                res.render('./error', { error: "Forbidden", status: 403, stack: "No tiene permisos para ver este contenido." });
            } else {
                res.render('./compras/editar_direccion', { results: results });
            }
        }
    });
});

router.get("/direcciones/provincias/", function (req, res) {
    let sql = `select * from provincia order by nombre`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.send(results);
        }
    });
});

router.get("/direcciones/cantones/:id_provincia", function (req, res) {
    let sql = `select nombre from ciudad where id_provincia = ${mysql.escape(req.params.id_provincia)} order by nombre`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.send(results);
        }
    });
});

router.post("/direcciones", middleware.isLoggedIn, function (req, res) {
    let encargado = req.body.nombres;
    let cedula = req.body.cedula;
    let linea1 = req.body.linea1;
    let linea2 = req.body.linea2;
    let canton = req.body.canton;
    let provincia = req.body.provincia;
    let codigo = req.body.codigo;
    let telefono = req.body.telefono;
    let sql = `insert into direccion (username_usuario, nombre_encargado, cedula_encargado, linea_direccion_1, 
    linea_direccion_2, ciudad, provincia, codigo_postal, telefono, activa) values (${mysql.escape(res.locals.userName)}, ${mysql.escape(encargado)},
    ${mysql.escape(cedula)}, ${mysql.escape(linea1)}, ${mysql.escape(linea2)}, ${mysql.escape(canton)}, ${mysql.escape(provincia)}, 
    ${mysql.escape(codigo)}, ${mysql.escape(telefono)}, false)`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.redirect('/compras/direcciones');
        }
    });
});

router.post("/direcciones/:id_direccion", middleware.isLoggedIn, function (req, res) {
    let encargado = req.body.nombres;
    let cedula = req.body.cedula;
    let linea1 = req.body.linea1;
    let linea2 = req.body.linea2;
    let canton = req.body.canton;
    let provincia = req.body.provincia;
    let codigo = req.body.codigo;
    let telefono = req.body.telefono;
    let sql = `update direccion set nombre_encargado = ${mysql.escape(encargado)}, cedula_encargado = ${mysql.escape(cedula)}, 
    linea_direccion_1 = ${mysql.escape(linea1)}, linea_direccion_2 = ${mysql.escape(linea2)}, ciudad = ${mysql.escape(canton)}, 
    provincia = ${mysql.escape(provincia)}, codigo_postal = ${mysql.escape(codigo)}, telefono = ${mysql.escape(telefono)} 
    where username_usuario = ${mysql.escape(res.locals.userName)} and id = ${mysql.escape(req.params.id_direccion)}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.redirect('/compras/direcciones');
        }
    });
});

router.put("/direcciones/:id_direccion", middleware.isLoggedIn, function (req, res) {
    conn.beginTransaction(function (error) {
        if (error) {
            console.log(error);
            conn.rollback(function () {
                res.sendStatus(500);
            });
        }
        let sql = `update direccion set activa = false where username_usuario = ${mysql.escape(res.locals.userName)} and activa = true`;
        conn.query(sql, function (error, results) {
            if (error) {
                console.log(error);
                conn.rollback(function () {
                    res.sendStatus(500);
                });
            } else {
                let sql = `update direccion set activa = true where username_usuario = ${mysql.escape(res.locals.userName)} and id = ${mysql.escape(req.params.id_direccion)}`;
                conn.query(sql, function (error, results) {
                    if (error) {
                        console.log(error);
                        conn.rollback(function () {
                            res.sendStatus(500);
                        });
                    } else {
                        conn.commit(function (error) {
                            if (error) {
                                console.log(error);
                                conn.rollback(function () {
                                    res.sendStatus(500);
                                });
                            } else {
                                res.sendStatus(200);
                            }
                        });
                    }
                });
            }
        });
    });
});

router.delete("/direcciones/:id_direccion", middleware.isLoggedIn, function (req, res) {
    let sql = `delete from direccion where username_usuario = ${mysql.escape(res.locals.userName)} and id = ${mysql.escape(req.params.id_direccion)}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.get("/metodos_pago", middleware.isLoggedIn, function (req, res) {
    let sql = `select * from metodo_pago where username_usuario = ${mysql.escape(res.locals.userName)}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./compras/metodos_pago', { results: results });
        }
    });
});

router.post("/metodos_pago", middleware.isLoggedIn, function (req, res) {
    let companias = ["amex", "diners-club", "discover", "mastercard", "visa"];
    let tipos = ["Crédito", "Débito"];
    let titular = req.body.titular;
    let tarjeta = req.body.tarjeta;
    let fecha = req.body.mes.split('-');
    let compania = companias[Math.floor(Math.random() * (4 - 0 + 1)) + 0];
    let tipo = tipos[Math.floor(Math.random() * (1 - 0 + 1)) + 0];
    let mes = parseInt(fecha[1], 10);
    let anio = parseInt(fecha[0], 10);
    let cuatro_digitos = tarjeta.slice(-4);
    let token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    let sql = `insert into metodo_pago (username_usuario, titular, token, cuatro_ultimos_digitos, anio_expiracion, mes_expiracion,
    compania, tipo, activo) values (${mysql.escape(res.locals.userName)}, ${mysql.escape(titular)}, ${mysql.escape(token)}, 
    ${mysql.escape(cuatro_digitos)}, ${mysql.escape(anio)}, ${mysql.escape(mes)}, ${mysql.escape(compania)}, ${mysql.escape(tipo)}, 
    false)`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.redirect('/compras/metodos_pago');
        }
    });
});

router.put("/metodos_pago/:id_metodo", middleware.isLoggedIn, function (req, res) {
    conn.beginTransaction(function (error) {
        if (error) {
            console.log(error);
            conn.rollback(function () {
                res.sendStatus(500);
            });
        }
        let sql = `update metodo_pago set activo = false where username_usuario = ${mysql.escape(res.locals.userName)} and activo = true`;
        conn.query(sql, function (error, results) {
            if (error) {
                console.log(error);
                conn.rollback(function () {
                    res.sendStatus(500);
                });
            } else {
                let sql = `update metodo_pago set activo = true where username_usuario = ${mysql.escape(res.locals.userName)} and id = ${mysql.escape(req.params.id_metodo)}`;
                conn.query(sql, function (error, results) {
                    if (error) {
                        console.log(error);
                        conn.rollback(function () {
                            res.sendStatus(500);
                        });
                    } else {
                        conn.commit(function (error) {
                            if (error) {
                                console.log(error);
                                conn.rollback(function () {
                                    res.sendStatus(500);
                                });
                            } else {
                                res.sendStatus(200);
                            }
                        });
                    }
                });
            }
        });
    });
});

router.delete("/metodos_pago/:id_metodo", middleware.isLoggedIn, function (req, res) {
    let sql = `delete from metodo_pago where username_usuario = ${mysql.escape(res.locals.userName)} and id = ${mysql.escape(req.params.id_metodo)}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;
