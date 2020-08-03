var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var username = "WhiteWolf";

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: 'aprendecdb'
});

conn.connect();

router.get("/", function (req, res) {
    let sql = `select producto.id as id, producto.foto as foto, producto.nombre as nombre, producto.precio as precio, 
    institucion.nombre as institucion, carrito_producto.cantidad as cantidad, producto.stock as stock from carrito JOIN carrito_producto on carrito.id = carrito_producto.id_carrito 
    JOIN producto on carrito_producto.id_producto = producto.id JOIN institucion on producto.id_institucion = institucion.id 
    where carrito.username_usuario = ${mysql.escape(username)} and carrito.pendiente = true and producto.eliminado = false`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./compras', { results: results });
        }
    });
});

router.get("/historial", function (req, res) {
    /*let sql = `select carrito.id as id, carrito.fecha_hora_pago as fecha_hora_pago, carrito_producto.nombre_producto as nombre, 
    carrito_producto.costo_unitario as precio, carrito_producto.cantidad as cantidad, carrito_producto.nombre_institucion as institucion, 
    carrito.costo as costo from carrito JOIN carrito_producto on carrito.id = carrito_producto.id_carrito 
    where carrito.username_usuario = ${mysql.escape(username)} and carrito.pendiente = false`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {*/
            res.render('./compras/historial'/*, { results: results }*/, { results: '' });
        //}
    //});

    //JOIN producto on carrito_producto.id_producto = producto.id JOIN institucion on producto.id_institucion = institucion.id 

});

router.get("/direcciones", function (req, res) {
    let sql = `select * from direccion where username_usuario = ${mysql.escape(username)}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./compras/direcciones', { results: results });
        }
    });
});

router.get("/direcciones/editar_direccion/:id_direccion", function (req, res) {
    let sql = `select * from direccion where username_usuario = ${mysql.escape(username)} and id = ${mysql.escape(req.params.id_direccion)}`;
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

router.post("/direcciones", function (req, res) {
    let encargado = req.body.nombres;
    let cedula = req.body.cedula;
    let linea1 = req.body.linea1;
    let linea2 = req.body.linea2;
    let canton = req.body.canton;
    let provincia = req.body.provincia;
    let codigo = req.body.codigo;
    let telefono = req.body.telefono;
    let sql = `insert into direccion (username_usuario, nombre_encargado, cedula_encargado, linea_direccion_1, 
    linea_direccion_2, ciudad, provincia, codigo_postal, telefono, activa) values (${mysql.escape(username)}, ${mysql.escape(encargado)},
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

router.post("/direcciones/:id_direccion", function (req, res) {
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
    where username_usuario = ${mysql.escape(username)} and id = ${mysql.escape(req.params.id_direccion)}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.redirect('/compras/direcciones');
        }
    });
});

router.put("/direcciones/:id_direccion", function (req, res) {
    conn.beginTransaction(function (error) {
        if (error) {
            console.log(error);
            conn.rollback(function () {
                res.sendStatus(500);
            });
        }
        let sql = `update direccion set activa = false where username_usuario = ${mysql.escape(username)} and activa = true`;
        conn.query(sql, function (error, results) {
            if (error) {
                console.log(error);
                conn.rollback(function () {
                    res.sendStatus(500);
                });
            } else {
                let sql = `update direccion set activa = true where username_usuario = ${mysql.escape(username)} and id = ${mysql.escape(req.params.id_direccion)}`;
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

router.delete("/direcciones/:id_direccion", function (req, res) {
    let sql = `delete from direccion where username_usuario = ${mysql.escape(username)} and id = ${mysql.escape(req.params.id_direccion)}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.get("/metodos_pago", function (req, res) {
    let sql = `select * from metodo_pago where username_usuario = ${mysql.escape(username)}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./compras/metodos_pago', { results: results });
        }
    });
});

router.post("/metodos_pago", function (req, res) {
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
    compania, tipo, activo) values (${mysql.escape(username)}, ${mysql.escape(titular)}, ${mysql.escape(token)}, 
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

router.put("/metodos_pago/:id_metodo", function (req, res) {
    conn.beginTransaction(function (error) {
        if (error) {
            console.log(error);
            conn.rollback(function () {
                res.sendStatus(500);
            });
        }
        let sql = `update metodo_pago set activo = false where username_usuario = ${mysql.escape(username)} and activo = true`;
        conn.query(sql, function (error, results) {
            if (error) {
                console.log(error);
                conn.rollback(function () {
                    res.sendStatus(500);
                });
            } else {
                let sql = `update metodo_pago set activo = true where username_usuario = ${mysql.escape(username)} and id = ${mysql.escape(req.params.id_metodo)}`;
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

router.delete("/metodos_pago/:id_metodo", function (req, res) {
    let sql = `delete from metodo_pago where username_usuario = ${mysql.escape(username)} and id = ${mysql.escape(req.params.id_metodo)}`;
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
