const mysql = require('mysql');

const connection = mysql.createConnection({
    connectionLimit: 100,
    host: process.env.LOCAL_MYSQL_HOST,
    port: 3306,
    user: process.env.LOCAL_MYSQL_USER,
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: process.env.LOCAL_MYSQL_DB,
    multipleStatements: true
});

/*connection.getConnection(function (err, conn) {
    if (err) {
        console.log('No se ha podido conectar.');
        console.log(err);
    } else {
        console.log('Conectado a BD.');
    }
});*/
connection.connect(function (err, conn) {
    if (err) {
        console.log('No se ha podido conectar.');
        console.log(err);
    } else {
        console.log('Conectado a BD.');
    }
});

module.exports = connection;