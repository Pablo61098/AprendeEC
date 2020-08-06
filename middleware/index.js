
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.LOCAL_MYSQL_USER,
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
    delete req.session.admin;
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

middlewareObj.isAdmin = function(req, res, next){


    console.log("\n\ntodo bien 1");
    console.log(req.session)
    if(!req.session.admin){
        console.log("\n\ntodo bien 2");
        return res.redirect('/admin');
    }
    // if(req.user){
    //     req.session.destroy();
    // }
    console.log("\n\ntodo bien 3");
    delete req.session.userName;
    next();
    
    
}


module.exports = middlewareObj;