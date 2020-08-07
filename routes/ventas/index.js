const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const { connect } = require('../admin');
var bigDecimal = require('js-big-decimal');

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


router.get("/productos/", middleware.isLoggedIn, function(req, res){

    connection.query(`select * from producto where username_inst = '${req.user.username}'`, function(err, results, fields){
        if(err){
            console.log("Error al sacar los productos");
            return res.send(err);
        }
        res.render("./gestion_tienda/gestionProductos", {productos: results});
    });
});


router.get("/pedidos/", middleware.isLoggedIn, function(req, res){
    connection.query(`select * from producto where username_inst = '${req.user.username}'`, function(err, results, fields){
        if(err){
            console.log("Error al sacar los productos");
            return res.send(err);
        }
        res.render("./gestion_tienda/gestionPedidos", {productos: results});
    });
});

router.post("/productos/", middleware.isLoggedIn, function(req, res){

    console.log(req.params);
    console.log(req.body);
    console.log(req.files);

    if(req.files){
        console.log("Si hay archivo");
        let query = `insert into 
        producto(username_inst, id_institucion, nombre, descripcion, precio, foto, stock, eliminado) 
        values('${req.user.username}', ${req.user.institucionId}, '${req.body.nombre}', '${req.body.descripcion}', ${Number(req.body.precio)}, '${req.files.picture.name}', ${Number(req.body.stock)}, 0)`;

        connection.query(query, function(err, results, fields){
            if(err){
                console.log(err);
                return res.send(err);
            }

            console.log("Se ha realizado la insercion del producto");

            let picture = req.files.picture;

            picture.mv(`./public/images/productos/${picture.name}`, function(err){
                if(err){
                    return res.send(err);
                }
                console.log('Se ha introducido todo correctamente');
            });
            res.redirect(`/ventas/productos`);
        });
    }else{
        console.log("No ha subido ningun archivo");
        res.redirect(`/ventas/productos`);
    }
});


router.delete('/productos/:idProducto', middleware.isLoggedIn, function(req, res){
    console.log("\n\nhey it is deleting");
    connection.query(`update producto set eliminado=1 where id=${req.params.idProducto}`,function(err,results,fields){
        if(err){
            console.log('Ha habido un error');
            return res.sendStatus(404);
        }
        console.log('Se ha hecho la eliminacion');
        return res.sendStatus(200);
    });
    
});

router.put("/productos", middleware.isLoggedIn, function(req, res){
    console.log("\n\nSe esta haciendo una edicion de un producto");
    console.log(req.params);
    console.log(req.body);
    console.log(req.files);

    if(req.files){
        let picture = req.files.picture;
        connection.query(`update producto set foto='${picture.name}' where id =${req.query.id}`, function(err, results, fields){
            if(err){
                console.log(err);
                return res.send(err);
            }
            picture.mv(`./public/images/productos/${picture.name}`, function(err2){
                if(err2){
                    console.log(err2);
                    return res.send(err2);
                }
                console.log('Se ha actualizado la foto correctamente');
            });
            
        });
    }else{
        console.log("No ha habido ningun archivo");
    }

    connection.query(`update producto set nombre='${req.body.nombre}', descripcion='${req.body.descripcion}', precio=${req.body.precio}, stock=${req.body.stock} where id =${req.query.id}`, function(err2, results2, fields2){
        if(err2){
            console.log(err2);
            return res.send(err2);
        }
        console.log("Se ha actualizado todo correctamente");
        res.redirect(`/ventas/productos`);
    });
});

router.get("/pedidos/:idProducto", middleware.isLoggedIn, function(req, res){
    console.log("\n\nSe ha hecho una peticion de informacion de un producto")
    console.log(req.params);
    console.log(req.body);

    connection.query(`select * from producto where id = ${req.params.idProducto}`, function(err0, results0, fields0){
        if(err0){
            console.log(err0);
            return res.send(err0);
        }

        connection.query(`select * from carrito_producto where id_producto = ${req.params.idProducto}`, function(err, results, fields){
            if(err){
                console.log(err);
                return res.send(err);
            }
            if(results.length == 0){
                console.log("No hay pedidos de ese producto")
                return res.send(results);
            }
            let dineroTotal = '0.00';
            let cantidadTotalComprada = '0';
            for(let i=0; i<results.length; i++){
                connection.query(`select * from carrito where fecha_hora_pago is not null && id = ${results[i].id_carrito}`, function(err2, results2, fields2){
                    if(err2){
                        console.log(err2);
                        return res.send(err2);
                    }
                    if(results2.length > 0){
                        
                        dineroTotal = bigDecimal.add(dineroTotal, bigDecimal.multiply(    results[i].costo_unitario,results[i].cantidad ) );
                        cantidadTotalComprada = bigDecimal.add(cantidadTotalComprada, results[i].cantidad);
                    }
                    if(i == results.length-1){
                        return res.send({producto: results0[0], dineroTotal: dineroTotal, cantidadTotalComprada:cantidadTotalComprada});
                    }
                });
            }
            
        });

    });
});

module.exports = router;




