var express = require("express");
var router = express.Router();
var mysql = require("mysql");
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

const conn = mysql.createPool({
    connectionLimit: 100,
    host: process.env.LOCAL_MYSQL_HOST,
    port: 3306,
    user: process.env.LOCAL_MYSQL_USER,
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: process.env.LOCAL_MYSQL_DB
});

conn.getConnection(function (err, conn) {
    if (err) {
        console.log('No se ha podido conectar.');
        return callback(err);
    } else {
        console.log('Conectado a BD.');
    }
});

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
                    subject: 'AprendEC - Catálogo de Productos',
                    html: '<h1>AprendEC - Catálogo de Productos</h1><p>Muchas gracias por consultar el catálogo de la tienda online de AprendEC.</p><p>Catálogo en el archivo PDF ajunto.</p>',
                    attachments: [
                        {
                            filename: 'catalogo.pdf',
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

router.get("/", function (req, res) {
    var pagina = req.query.pagina;
    if (!pagina) {
        pagina = 1;
    }
    let sql = `select institucion.nombre as institucion, producto.id as id, producto.nombre as articulo, producto.descripcion as descripcion,
    producto.precio as precio, producto.foto as foto, producto.stock as stock from producto JOIN institucion on producto.id_institucion = institucion.id where producto.eliminado = false
    order by producto.id DESC LIMIT 3 OFFSET ${(pagina - 1) * 3}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./tienda', { results: results, busqueda: false, pagina: pagina });
        }
    });
});

router.get("/buscar", function (req, res) {
    var busqueda = req.query.busqueda;
    var pagina = req.query.pagina;
    if (!pagina) {
        pagina = 1;
    }
    if (busqueda) {
        let sql = `select institucion.nombre as institucion, producto.id as id, producto.nombre as articulo, producto.descripcion as descripcion,
        producto.precio as precio, producto.foto as foto, producto.stock as stock from producto JOIN institucion on producto.id_institucion = institucion.id where producto.eliminado = false
        and (UPPER(institucion.nombre) LIKE UPPER('%${busqueda}%') or UPPER(producto.nombre) LIKE UPPER('%${busqueda}%') or UPPER(producto.descripcion) LIKE UPPER('%${busqueda}%'))
        order by producto.id DESC LIMIT 3 OFFSET ${(pagina - 1) * 3}`;
        conn.query(sql, function (error, results) {
            if (error) {
                console.log(error);
                res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
            } else {
                res.render('./tienda', { results: results, busqueda: busqueda, pagina: pagina });
            }
        });
    } else {
        res.redirect('/tienda');
    }
});

router.post("/catalogo", function (req, res) {
    var correo = req.body.correo;
    var contenido = '<!DOCTYPE html> <html> <head> <meta charset="utf-8"> <style> table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid black; text-align: center; } </style> </head> <body> <div> <h2>AprendEC - Catálogo de Productos</h2> <br> <table> <thead> <tr> <th>Institución</th> <th>Artículo</th> <th>Descripción</th> <th>Precio ($ USD)</th> </tr> </thead> <tbody>';
    var archivo = "./private/temp/catalogos/";
    let sql = `select institucion.nombre as institucion, producto.nombre as articulo, producto.descripcion as descripcion,
    producto.precio as precio from producto JOIN institucion on producto.id_institucion = institucion.id where producto.eliminado = false
    order by institucion.nombre`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            let date = new Date();
            archivo += `${(mysql.escape(correo) + date.toLocaleDateString() + date.toLocaleTimeString()).replace(/[/\\?%*:|"<>]/g, '-').replace(/ /g, "")}`;
            if (results.length) {
                for (let i = 0; i < results.length; i++) {
                    contenido += `<tr>
                    <td>${results[i].institucion}</td>
                    <td>${results[i].articulo}</td>
                    <td>${results[i].descripcion}</td>
                    <td>${results[i].precio}</td>
                </tr>`
                }
                contenido += '</tbody></table></div></body></html>';
            } else {
                contenido += 'No hay productos en el catálogo de la tienda.<br><br></tbody></table></div></body></html>';
            }
            enviarPDFCorreo(correo, archivo, contenido);
            res.render('./mensaje', { tipo: "success", redireccion: "tienda", volver: "Tienda", mensaje: `Se ha enviado el catálogo al correo: ${correo}` });
        }
    });
});

router.put("/agregar/:id_producto", middleware.isLoggedIn, function (req, res) { 
    let sql = `insert into carrito_producto (id_carrito, id_producto, cantidad) values ((select id from carrito where pendiente = true
    and username_usuario =  ${mysql.escape(res.locals.userName)}), ${req.params.id_producto}, 1)`;
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