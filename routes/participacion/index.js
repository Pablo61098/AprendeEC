var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var middleware = require("../../middleware");

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'luis',
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: 'aprendecdb',
    multipleStatements: true
});

conn.connect();

router.get("/", middleware.isLoggedIn, function (req, res) {
    let sql = `select username, foto, valoracion from usuario where username = ${mysql.escape(res.locals.userName)}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./participacion', { results: results });
        }
    });
});

router.get("/comentarios_posts", middleware.isLoggedIn, function (req, res) {
    var pagina = req.query.pagina;
    if (!pagina) {
        pagina = 1;
    }
    let sql = `select usuario_post_comentario.id as id, post.username_usuario as autor, post.titulo as titulo, 
    post.fecha_hora as fecha_hora_post, usuario_post_comentario.texto as comentario, usuario_post_comentario.fecha_hora as fecha_hora_comentario
    from usuario_post_comentario JOIN post on usuario_post_comentario.id_post = post.id
    where usuario_post_comentario.username_usuario = ${mysql.escape(res.locals.userName)} order by usuario_post_comentario.id DESC LIMIT 3 
    OFFSET ${(pagina - 1) * 3}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./participacion/comentarios_posts', { results: results, pagina: pagina });
        }
    });
});

router.delete("/comentarios_posts/:id_comentario", middleware.isLoggedIn, function (req, res) {
    let sql = `delete from usuario_post_comentario where username_usuario = ${mysql.escape(res.locals.userName)} and
    id = ${req.params.id_comentario}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.get("/calificaciones_posts", middleware.isLoggedIn, function (req, res) {
    var pagina = req.query.pagina;
    if (!pagina) {
        pagina = 1;
    }
    let sql = `select post.username_usuario as autor, post.titulo as titulo, post.fecha_hora as fecha_hora_post, post.id as id,
    usuario_post_calificacion.calificacion as calificacion from usuario_post_calificacion JOIN post on usuario_post_calificacion.id_post = post.id
    where usuario_post_calificacion.username_usuario = ${mysql.escape(res.locals.userName)} order by post.id DESC LIMIT 3 
    OFFSET ${(pagina - 1) * 3}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./participacion/calificaciones_posts', { results: results, pagina: pagina });
        }
    });
});

router.get("/comentarios_foros", middleware.isLoggedIn, function (req, res) {
    var pagina = req.query.pagina;
    if (!pagina) {
        pagina = 1;
    }
    let sql = `select usuario_foro_comentario.id as id, foro.username_usuario as autor, foro.titulo as titulo, 
    foro.fecha_hora as fecha_hora_foro, usuario_foro_comentario.texto as comentario, usuario_foro_comentario.fecha_hora as fecha_hora_comentario
    from usuario_foro_comentario JOIN foro on usuario_foro_comentario.id_foro = foro.id
    where usuario_foro_comentario.username_usuario = ${mysql.escape(res.locals.userName)} order by usuario_foro_comentario.id DESC LIMIT 3 
    OFFSET ${(pagina - 1) * 3}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./participacion/comentarios_foros', { results: results, pagina: pagina });
        }
    });
});

router.delete("/comentarios_foros/:id_comentario", middleware.isLoggedIn, function (req, res) {
    let sql = `delete from usuario_foro_comentario where username_usuario = ${mysql.escape(res.locals.userName)} and
    id = ${req.params.id_comentario}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.get("/respuestas_foros", middleware.isLoggedIn, function (req, res) {
    var pagina = req.query.pagina;
    if (!pagina) {
        pagina = 1;
    }
    let sql = `select usuario_foro_respuesta.id as id, foro.username_usuario as autor, foro.titulo as titulo, 
    foro.fecha_hora as fecha_hora_foro, usuario_foro_respuesta.fecha_hora as fecha_hora_respuesta
    from usuario_foro_respuesta JOIN foro on usuario_foro_respuesta.id_foro = foro.id
    where usuario_foro_respuesta.username_usuario = ${mysql.escape(res.locals.userName)} order by usuario_foro_respuesta.id DESC LIMIT 3 
    OFFSET ${(pagina - 1) * 3}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./participacion/respuestas_foros', { results: results, pagina: pagina });
        }
    });
});

router.delete("/respuestas_foros/:id_respuesta", middleware.isLoggedIn, function (req, res) {
    let sql = `delete from usuario_foro_respuesta where username_usuario = ${mysql.escape(res.locals.userName)} and
    id = ${req.params.id_respuesta}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.get("/calificaciones_respuestas", middleware.isLoggedIn, function (req, res) {
    var pagina = req.query.pagina;
    if (!pagina) {
        pagina = 1;
    }
    let sql = `select foro.username_usuario as forista, foro.titulo as titulo, foro.fecha_hora as fecha_hora_foro, usuario_foro_respuesta.username_usuario as autor, foro.id as id,
    usuario_foro_respuesta.username_usuario as autor, usuario_foro_respuesta.fecha_hora as fecha_hora_respuesta, usuario_respuesta_calificacion.calificacion as calificacion from usuario_respuesta_calificacion JOIN usuario_foro_respuesta on 
    usuario_respuesta_calificacion.id_respuesta = usuario_foro_respuesta.id JOIN foro on usuario_foro_respuesta.id_foro = foro.id
    where usuario_respuesta_calificacion.username_usuario = ${mysql.escape(res.locals.userName)} order by usuario_foro_respuesta.id DESC LIMIT 3 
    OFFSET ${(pagina - 1) * 3}`;
    conn.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.render('./error', { error: "Internal Server Error", status: 500, stack: "Error en el servidor." });
        } else {
            res.render('./participacion/calificaciones_respuestas', { results: results, pagina: pagina });
        }
    });
});

module.exports = router;