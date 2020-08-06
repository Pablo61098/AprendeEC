CREATE TABLE usuario (
    username VARCHAR(100),
    ciudad INT,
    provincia INT,
    contrasena VARCHAR(255),
    correo VARCHAR(75),
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    foto varchar(255),
    valoracion FLOAT,
    cedula VARCHAR(10),
    acerca VARCHAR(255),
    confirmado boolean,
    tipoRegistro tinyint,
    tipo tinyint,
    PRIMARY KEY (username)
);

CREATE TABLE redes(
    username VARCHAR(100),
    red VARCHAR(255),
    link VARCHAR(255),
    FOREIGN KEY (username) REFERENCES usuario(username)
);

CREATE TABLE telefono_usuario(
    username VARCHAR(100), 
    telefono VARCHAR(15), 
    PRIMARY KEY (username, telefono), 
    FOREIGN KEY (username) REFERENCES usuario(username)
);

create table institucion (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50),
    ciudad INT,
    provincia INT,
    direccion VARCHAR(50),
    numero_cuenta_bancaria VARCHAR(255),
    dominio_correo VARCHAR(255),
    pagina_web VARCHAR(255),
    valoracion FLOAT,
    PRIMARY KEY (id)
);

create table usuario_academico(
    username VARCHAR(100),
    id_institucion INT,
    PRIMARY KEY (id_institucion, username),
    FOREIGN KEY (username) REFERENCES usuario(username),
    FOREIGN KEY (id_institucion) REFERENCES institucion(id) 
);

create table usuario_admin_inst(
    username VARCHAR(100),
    id_institucion INT,
    cargo VARCHAR(255),
    PRIMARY KEY (id_institucion, username),
    FOREIGN KEY (username) REFERENCES usuario(username),
    FOREIGN KEY (id_institucion) REFERENCES institucion(id) 
);

create table usuario_admin_plat(
    username VARCHAR(20),
    contrasena VARCHAR(255),
    PRIMARY KEY (username)
);

create table solicitud (
    id INT NOT NULL AUTO_INCREMENT,
    nombre_institucion VARCHAR(255),
    ciudad INT,
    provincia INT,
    direccion VARCHAR(255),
    pagina_web VARCHAR(255),
    numero_cuenta_bancaria VARCHAR(255),
    certificado_caces VARCHAR(255),
    nombres_administrador VARCHAR(255),
    apellidos_administrador VARCHAR(255),
    cedula_administrador VARCHAR(10),
    cargo_administrador VARCHAR(255),
    correo_administrador VARCHAR(255),
    dominio_correo_institucion VARCHAR(255),
    username_usuario_admin_plat VARCHAR(20),
    pendiente BOOLEAN,
    aceptado BOOLEAN,
    PRIMARY KEY (id),
    FOREIGN KEY (username_usuario_admin_plat) REFERENCES usuario_admin_plat(username) 
);

create table direccion (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(100),
    nombre_encargado VARCHAR(255),
    cedula_encargado VARCHAR(10),
    ciudad VARCHAR(255),
    provincia VARCHAR(255),
    codigo_postal VARCHAR(6),
    telefono VARCHAR(15), 
    linea_direccion_1 VARCHAR(255),
    linea_direccion_2 VARCHAR(255),
    activa BOOLEAN,
    PRIMARY KEY (id, username_usuario),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username) 
);

create table metodo_pago (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(100),
    titular VARCHAR(255),
    token VARCHAR(255),
    cuatro_ultimos_digitos VARCHAR(4),
    anio_expiracion INT,
    mes_expiracion INT,
    compania VARCHAR(255),
    tipo VARCHAR(255),
    activo BOOLEAN,
    PRIMARY KEY (id, username_usuario),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username) 
);

create table producto (
    id INT NOT NULL AUTO_INCREMENT,
    username_inst VARCHAR(100),
    id_institucion INT,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    precio DECIMAL(19,2),
    foto VARCHAR(255),
    stock INT,
    eliminado BOOLEAN,
    PRIMARY KEY (id, username_inst, id_institucion),
    FOREIGN KEY (username_inst) REFERENCES usuario_admin_inst(username),
    FOREIGN KEY (id_institucion) REFERENCES institucion(id)
);

create table carrito (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(100),
    costo DECIMAL(19,2),
    fecha_hora_creacion VARCHAR(255),
    fecha_hora_pago VARCHAR(255),
    direccion_envio VARCHAR(255),
    metodo_pago VARCHAR(255),
    pendiente BOOLEAN,
    PRIMARY KEY (id, username_usuario),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table carrito_producto (
    id_carrito INT,
    id_producto INT,
    cantidad INT,
    costo_unitario DECIMAL(19,2),
    nombre_producto VARCHAR(255),
    nombre_institucion VARCHAR(255),
    PRIMARY KEY (id_carrito, id_producto),
    FOREIGN KEY (id_carrito) REFERENCES carrito(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id) 
);

create table categoria (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255),
    PRIMARY KEY (id)
);

create table post (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(100),
    valoracion FLOAT,
    titulo VARCHAR(255),
    fecha_hora VARCHAR(255),
    publicado BOOLEAN,
    contenido BLOB,
    PRIMARY KEY (id, username_usuario),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table foro (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(100),
    titulo VARCHAR(255),
    fecha_hora VARCHAR(255),
    contenido BLOB,
    publicado BOOLEAN,
    PRIMARY KEY (id, username_usuario),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table categoria_post (
    id_categoria INT,
    id_post INT,
    PRIMARY KEY (id_categoria, id_post),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id),
    FOREIGN KEY (id_post) REFERENCES post(id) ON DELETE CASCADE
);

create table categoria_foro (
    id_categoria INT,
    id_foro INT,
    PRIMARY KEY (id_categoria, id_foro),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id),
    FOREIGN KEY (id_foro) REFERENCES foro(id) ON DELETE CASCADE
);

create table usuario_post_comentario (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(100),
    id_post INT,
    texto TEXT,
    fecha_hora VARCHAR(250),
    PRIMARY KEY (id, id_post, username_usuario),
    FOREIGN KEY (id_post) REFERENCES post(id) ON DELETE CASCADE,
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table usuario_foro_comentario (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(100),
    id_foro INT,
    texto TEXT,
    fecha_hora VARCHAR(250),
    PRIMARY KEY (id, id_foro, username_usuario),
    FOREIGN KEY (id_foro) REFERENCES foro(id) ON DELETE CASCADE,
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table usuario_post_calificacion (
    username_usuario VARCHAR(100),
    id_post INT,
    calificacion INT,
    PRIMARY KEY (id_post, username_usuario),
    FOREIGN KEY (id_post) REFERENCES post(id) ON DELETE CASCADE,
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table usuario_foro_respuesta (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(100),
    id_foro INT,
    respuesta BLOB,
    valoracion INT,
    fecha_hora VARCHAR(250),
    PRIMARY KEY (id, id_foro, username_usuario),
    FOREIGN KEY (id_foro) REFERENCES foro(id) ON DELETE CASCADE,
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table usuario_respuesta_calificacion (
    username_usuario VARCHAR(100),
    id_respuesta INT,
    calificacion INT,
    PRIMARY KEY (id_respuesta, username_usuario),
    FOREIGN KEY (id_respuesta) REFERENCES usuario_foro_respuesta(id) ON DELETE CASCADE,
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table provincia (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255),
    PRIMARY KEY (id)
);

create table ciudad (
    id INT NOT NULL AUTO_INCREMENT,
    id_provincia INT,
    nombre VARCHAR(255),
    PRIMARY KEY (id, id_provincia),
    FOREIGN KEY (id_provincia) REFERENCES provincia(id)
);


CREATE TABLE notificaciones (
	id_notificacion INT NOT NULL AUTO_INCREMENT,
    username_to VARCHAR(100),
    username_from VARCHAR(100),
    sms VARCHAR(300),
    tipo VARCHAR(50),
    id_tipo INT,
    visto BOOLEAN,
    PRIMARY KEY (id_notificacion, username_to, username_from),
    FOREIGN KEY (username_to) REFERENCES usuario(username),
    FOREIGN KEY (username_from) REFERENCES usuario(username)
);

DELIMITER //
CREATE TRIGGER update_post_valoraciones 
AFTER INSERT ON usuario_post_calificacion 
FOR EACH ROW 
BEGIN 
#Obtengo la valoración actual del post que se está calificando
DECLARE valoracion_actual FLOAT; 
DECLARE contar FLOAT;
#SET valoracion_actual = (SELECT post.valoracion FROM post WHERE post.id=NEW.id_post); 
#Obtengo el numero de veces que se ha calificado el post
SET contar = (SELECT COUNT(id_post) AS contar FROM usuario_post_calificacion where usuario_post_calificacion.id_post=NEW.id_post);
SET valoracion_actual = (SELECT SUM(usuario_post_calificacion.calificacion) FROM usuario_post_calificacion where usuario_post_calificacion.id_post=NEW.id_post);
#Incremento la valoración dada la calificación 
SET valoracion_actual = valoracion_actual / contar; 
#Ingreso el nuevo valor de la valoracion en la tabla POST 
UPDATE post SET post.valoracion=valoracion_actual WHERE post.id = NEW.id_post; 
END;
//

DELIMITER //
CREATE TRIGGER updateCalificacionUsuario 
AFTER UPDATE ON post 
FOR EACH ROW 
BEGIN 
DECLARE estadoPublicacion BOOLEAN;
DECLARE username VARCHAR(255);
DECLARE cuantosPosts FLOAT;
DECLARE valoracionTotalPosts FLOAT;
DECLARE totalPosts FLOAT;
DECLARE totalForosRespuesta FLOAT;
DECLARE esUsuarioAcademico INT;
DECLARE valorActualUsuario FLOAT;
DECLARE valorNuevoUsuario FLOAT;
DECLARE id_institucion INT;
DECLARE usernameInstitucion VARCHAR(255);
DECLARE calificacionInstitucionActual FLOAT;
DECLARE esUsuarioInstitucion INT;
DECLARE calificacionActualInsti FLOAT;
SET estadoPublicacion = NEW.publicado;
SET username = NEW.username_usuario;
    IF (estadoPublicacion = 1) THEN
        SET cuantosPosts = (SELECT COUNT(post.username_usuario) FROM post WHERE post.username_usuario = username);
        SET valoracionTotalPosts = (SELECT SUM(post.valoracion) FROM post WHERE post.username_usuario = username);
        SET totalPosts = valoracionTotalPosts / cuantosPosts;
        SET totalForosRespuesta = (SELECT SUM(usuario_respuesta_calificacion.calificacion) FROM `usuario_foro_respuesta` INNER JOIN `usuario_respuesta_calificacion` WHERE usuario_foro_respuesta.id = usuario_respuesta_calificacion.id_respuesta AND usuario_foro_respuesta.username_usuario=username);
        SET esUsuarioAcademico = (SELECT COUNT(usuario_academico.username) FROM usuario_academico WHERE
usuario_academico.username=username);
		SET  valorNuevoUsuario = totalPosts + totalForosRespuesta;
		IF esUsuarioAcademico = 1 THEN
        	SET valorActualUsuario = (SELECT usuario.valoracion FROM usuario WHERE usuario.username = username);
        	UPDATE usuario SET usuario.valoracion = valorNuevoUsuario
        	WHERE usuario.username = username;
            SET id_institucion = (SELECT `usuario_academico`.`id_institucion` FROM `usuario_academico` where `usuario_academico`.`username` = username);
            
            SET usernameInstitucion = (SELECT usuario_admin_inst.username FROM usuario_admin_inst WHERE usuario_admin_inst.id_institucion = id_institucion);
            
            SET calificacionInstitucionActual = (SELECT usuario.valoracion FROM usuario WHERE usuario.username = usernameInstitucion);
            UPDATE usuario SET usuario.valoracion = calificacionInstitucionActual + (valorNuevoUsuario - valorActualUsuario)
        	WHERE usuario.username = usernameInstitucion;
        ELSE
        	
        	SET esUsuarioInstitucion = (SELECT COUNT(usuario_admin_inst.username) FROM usuario_admin_inst WHERE
usuario_admin_inst.username=username);
			IF esUsuarioInstitucion = 1 THEN
                SET calificacionActualInsti = (SELECT usuario.valoracion FROM usuario WHERE usuario.username = username);
                UPDATE usuario SET usuario.valoracion = calificacionActualInsti + valorNuevoUsuario
        		WHERE usuario.username = usernameInstitucion;
            ELSE
            	UPDATE usuario SET usuario.valoracion = valorNuevoUsuario
        		WHERE usuario.username = username;
            END IF;
        END IF;        
    END IF;
END;
//

DELIMITER //
CREATE TRIGGER updateCalificacionUsuarioForos 
AFTER INSERT ON usuario_respuesta_calificacion 
FOR EACH ROW 
BEGIN 
DECLARE estadoPublicacion BOOLEAN;
DECLARE username VARCHAR(255);
DECLARE cuantosPosts FLOAT;
DECLARE valoracionTotalPosts FLOAT;
DECLARE totalPosts FLOAT;
DECLARE totalForosRespuesta FLOAT;
DECLARE esUsuarioAcademico INT;
DECLARE valorActualUsuario FLOAT;
DECLARE valorNuevoUsuario FLOAT;
DECLARE id_institucion INT;
DECLARE usernameInstitucion VARCHAR(255);
DECLARE calificacionInstitucionActual FLOAT;
DECLARE esUsuarioInstitucion INT;
DECLARE calificacionActualInsti FLOAT;
SET estadoPublicacion = 1;
SET username = (SELECT usuario_foro_respuesta.username_usuario FROM usuario_foro_respuesta WHERE usuario_foro_respuesta.id =NEW.id_respuesta);
    IF (estadoPublicacion = 1) THEN
        SET cuantosPosts = (SELECT COUNT(post.username_usuario) FROM post WHERE post.username_usuario = username);
        SET valoracionTotalPosts = (SELECT SUM(post.valoracion) FROM post WHERE post.username_usuario = username);
        SET totalPosts = valoracionTotalPosts / cuantosPosts;
        SET totalForosRespuesta = (SELECT SUM(usuario_respuesta_calificacion.calificacion) FROM `usuario_foro_respuesta` INNER JOIN `usuario_respuesta_calificacion` WHERE usuario_foro_respuesta.id = usuario_respuesta_calificacion.id_respuesta AND usuario_foro_respuesta.username_usuario=username);
        SET esUsuarioAcademico = (SELECT COUNT(usuario_academico.username) FROM usuario_academico WHERE
usuario_academico.username=username);
		SET  valorNuevoUsuario = totalPosts + totalForosRespuesta;
		IF esUsuarioAcademico = 1 THEN
        	SET valorActualUsuario = (SELECT usuario.valoracion FROM usuario WHERE usuario.username = username);
        	UPDATE usuario SET usuario.valoracion = valorNuevoUsuario
        	WHERE usuario.username = username;
            SET id_institucion = (SELECT `usuario_academico`.`id_institucion` FROM `usuario_academico` where `usuario_academico`.`username` = username);
            
            SET usernameInstitucion = (SELECT usuario_admin_inst.username FROM usuario_admin_inst WHERE usuario_admin_inst.id_institucion = id_institucion);
            
            SET calificacionInstitucionActual = (SELECT usuario.valoracion FROM usuario WHERE usuario.username = usernameInstitucion);
            UPDATE usuario SET usuario.valoracion = calificacionInstitucionActual + (valorNuevoUsuario - valorActualUsuario)
        	WHERE usuario.username = usernameInstitucion;
        ELSE
        	
        	SET esUsuarioInstitucion = (SELECT COUNT(usuario_admin_inst.username) FROM usuario_admin_inst WHERE
usuario_admin_inst.username=username);
			IF esUsuarioInstitucion = 1 THEN
                SET calificacionActualInsti = (SELECT usuario.valoracion FROM usuario WHERE usuario.username = username);
                UPDATE usuario SET usuario.valoracion = calificacionActualInsti + valorNuevoUsuario
        		WHERE usuario.username = usernameInstitucion;
            ELSE
            	UPDATE usuario SET usuario.valoracion = valorNuevoUsuario
        		WHERE usuario.username = username;
            END IF;
        END IF;        
    END IF;
END;
//

create table datos_programa (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255),
    valor VARCHAR(255),
    PRIMARY KEY (id)
);

insert into datos_programa(nombre, valor) values ('iva', '12');
insert into provincia(nombre) values ('Azuay');
insert into provincia(nombre) values ('Pichincha');
insert into provincia(nombre) values ('Guayas');
insert into provincia(nombre) values ('Manabí');
insert into ciudad(id_provincia, nombre) values (1, 'Cuenca');
insert into ciudad(id_provincia, nombre) values (1, 'Paute');
insert into ciudad(id_provincia, nombre) values (1, 'Gualaceo');
insert into ciudad(id_provincia, nombre) values (2, 'Quito');
insert into ciudad(id_provincia, nombre) values (3, 'Guayaquil');
insert into ciudad(id_provincia, nombre) values (4, 'Portoviejo');
insert into ciudad(id_provincia, nombre) values (4, 'Manta');
commit;

