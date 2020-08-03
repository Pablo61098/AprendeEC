
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: 'aprendecdb'
});

connection.connect();

let middlewareObj = {}

middlewareObj.isLoggedIn = function(req, res, next){
    console.log("\nhey 1");
    if(!req.user){
        console.log("hey 2");
        return res.redirect("/login");
    }
    console.log("hey 3");
    next();
}

middlewareObj.isFirstLogin = function(req, res, next){
    console.log('\ncomo vamos 1');
    if(!req.session.firstLogin){
        console.log('\ncomo vamos 2');
        return res.redirect("/login");
    }
    console.log('\ncomo vamos 2');
    next();
}


module.exports = middlewareObj;