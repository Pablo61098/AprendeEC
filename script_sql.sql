CREATE TABLE usuario (
    username VARCHAR(20),
    ciudad VARCHAR(25),
    contrasena VARCHAR(255),
    correo VARCHAR(75),
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    id_direccion_activa INT,
    id_pago_activo INT,
    foto BLOB,
    valoracion INT,
    PRIMARY KEY (username)
);

CREATE TABLE telefono_usuario(
    username VARCHAR(20), 
    telefono VARCHAR(15), 
    PRIMARY KEY (username, telefono), 
    FOREIGN KEY (username) REFERENCES usuario(username) 
);

create table institucion (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50),
    ciudad VARCHAR(25),
    direccion VARCHAR(50),
    numero_cuenta_bancaria VARCHAR(255),
    dominio_correo VARCHAR(255),
    pagina_web VARCHAR(255),
    valoracion INT,
    PRIMARY KEY (id)
);

create table usuario_academico(
    username VARCHAR(20),
    id_institucion INT,
    PRIMARY KEY (id_institucion, username),
    FOREIGN KEY (username) REFERENCES usuario(username),
    FOREIGN KEY (id_institucion) REFERENCES institucion(id) 
);

create table usuario_admin_inst(
    username VARCHAR(20),
    id_institucion INT,
    cedula VARCHAR(10),
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
    ciudad VARCHAR(255),
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
    username_usuario VARCHAR(20),
    nombre_encargado VARCHAR(255),
    cedula_encargado VARCHAR(10),
    ciudad VARCHAR(255),
    provincia VARCHAR(255),
    codigo_postal VARCHAR(6),
    telefono VARCHAR(15), 
    linea_direccion_1 VARCHAR(255),
    linea_direccion_2 VARCHAR(255),
    PRIMARY KEY (id, username_usuario),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username) 
);

create table metodo_pago (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(20),
    titular VARCHAR(255),
    numero VARCHAR(255),
    anio_expiracion INT,
    mes_expiracion INT,
    cvv INT,
    PRIMARY KEY (id, username_usuario),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username) 
);

ALTER TABLE usuario 
    ADD FOREIGN KEY (id_direccion_activa) REFERENCES direccion(id), 
    ADD FOREIGN KEY (id_pago_activo) REFERENCES metodo_pago(id);

create table producto (
    id INT NOT NULL AUTO_INCREMENT,
    username_inst VARCHAR(20),
    id_institucion INT,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    precio DECIMAL(19,2),
    foto BLOB,
    PRIMARY KEY (id, username_inst, id_institucion),
    FOREIGN KEY (username_inst) REFERENCES usuario_admin_inst(username),
    FOREIGN KEY (id_institucion) REFERENCES institucion(id)
);

create table carrito (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(20),
    costo DECIMAL(19,2),
    fecha_hora_creacion VARCHAR(25),
    fecha_hora_pago VARCHAR(25),
    PRIMARY KEY (id, username_usuario),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table carrito_producto (
    id_carrito INT,
    id_producto INT,
    cantidad INT,
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
    username_usuario VARCHAR(20),
    valoracion INT,
    titulo VARCHAR(255),
    fecha_hora VARCHAR(25),
    contenido BLOB,
    PRIMARY KEY (id, username_usuario),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table foro (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(20),
    titulo VARCHAR(255),
    fecha_hora VARCHAR(25),
    contenido BLOB,
    PRIMARY KEY (id, username_usuario),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table categoria_post (
    id_categoria INT,
    id_post INT,
    PRIMARY KEY (id_categoria, id_post),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id),
    FOREIGN KEY (id_post) REFERENCES post(id)
);

create table categoria_foro (
    id_categoria INT,
    id_foro INT,
    PRIMARY KEY (id_categoria, id_foro),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id),
    FOREIGN KEY (id_foro) REFERENCES foro(id)
);

create table usuario_post_comentario (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(20),
    id_post INT,
    texto TEXT,
    fecha_hora VARCHAR(25),
    PRIMARY KEY (id, id_post, username_usuario),
    FOREIGN KEY (id_post) REFERENCES post(id),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table usuario_foro_comentario (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(20),
    id_foro INT,
    texto TEXT,
    fecha_hora VARCHAR(25),
    PRIMARY KEY (id, id_foro, username_usuario),
    FOREIGN KEY (id_foro) REFERENCES foro(id),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table usuario_post_calificacion (
    username_usuario VARCHAR(20),
    id_post INT,
    calificacion INT,
    PRIMARY KEY (id_post, username_usuario),
    FOREIGN KEY (id_post) REFERENCES post(id),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table usuario_foro_respuesta (
    id INT NOT NULL AUTO_INCREMENT,
    username_usuario VARCHAR(20),
    id_foro INT,
    respuesta BLOB,
    fecha_hora VARCHAR(25),
    PRIMARY KEY (id, id_foro, username_usuario),
    FOREIGN KEY (id_foro) REFERENCES foro(id),
    FOREIGN KEY (username_usuario) REFERENCES usuario(username)
);

create table usuario_respuesta_calificacion (
    username_usuario VARCHAR(20),
    id_respuesta INT,
    calificacion INT,
    PRIMARY KEY (id_respuesta, username_usuario),
    FOREIGN KEY (id_respuesta) REFERENCES usuario_foro_respuesta(id),
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