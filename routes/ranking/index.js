const express = require('express'),
    router = express.Router(),
    connection = require('../../connection/'),
    middleware = require('../../middleware');


router.get("/ranking", function (req, res) {



    connection.query(`select * from provincia`, function (err075, results075, fields075) {
        if (err075) {
            console.log(err075);
            return res.send(err075);
        }
        connection.query(`select * from ciudad`, function (err3, results3, fields3) {
            if (err3) {
                console.log(err3);
                return res.send(err3);
            }
            connection.query(`select * from usuario INNER JOIN usuario_admin_inst ON usuario.username = usuario_admin_inst.username ORDER BY valoracion DESC`, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                console.log(results);
                let instituciones = [];
                for (let i = 0; i < results.length; i++) {
                    connection.query(`select * from institucion where id = ${results[i].id_institucion}`, function (err2, results2, fields2) {
                        if (err2) {
                            console.log(err2);
                            return res.send(err2);
                        }
                        results2[0].valoracion = results[i].valoracion;
                        instituciones.push(results2[0]);
                        if (i == results.length - 1) {
                            console.log(instituciones);
                            res.render("./ranking/rankingU", { instituciones: instituciones, provincias: results075, cantones: results3 });
                        }
                    });
                }
            });
        });

    });
});

router.get("/ranking/canton/:tipo", function (req, res) {
    connection.query(`select * from usuario INNER JOIN usuario_admin_inst ON usuario.username = usuario_admin_inst.username ORDER BY valoracion DESC`, function (err, results, fields) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        console.log(results);
        let instituciones = [];
        for (let i = 0; i < results.length; i++) {
            connection.query(`select * from institucion where (id = ${results[i].id_institucion} && ciudad = ${req.params.tipo})`, function (err2, results2, fields2) {
                if (err2) {
                    console.log(err2);
                    return res.send(err2);
                }
                if (results2.length > 0) {
                    results2[0].valoracion = results[i].valoracion;
                    instituciones.push(results2[0]);
                }
                if (i == results.length - 1) {
                    console.log(instituciones);
                    return res.send(instituciones);
                }
            });
        }
    });
});

router.get("/ranking/provincia/:tipo", function (req, res) {
    connection.query(`select * from usuario INNER JOIN usuario_admin_inst ON usuario.username = usuario_admin_inst.username ORDER BY valoracion DESC`, function (err, results, fields) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        console.log(results);
        let instituciones = [];
        for (let i = 0; i < results.length; i++) {
            connection.query(`select * from institucion where (id = ${results[i].id_institucion} && provincia = ${req.params.tipo})`, function (err2, results2, fields2) {
                if (err2) {
                    console.log(err2);
                    return res.send(err2);
                }
                if (results2.length > 0) {
                    results2[0].valoracion = results[i].valoracion;
                    instituciones.push(results2[0]);
                }
                if (i == results.length - 1) {
                    console.log(instituciones);
                    return res.send(instituciones);
                }
            });
        }
    });
});


module.exports = router;



