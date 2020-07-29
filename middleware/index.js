
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
    // console.log("0");
    console.log(req.session);
    console.log(req.session.userName);
    if(!!(req.session && req.session.userName)){
        // console.log("0.5");
        res.locals.userName = req.session.userName;
        return next();
    }
    // console.log("1");
    res.redirect('/login');
    
}

module.exports = middlewareObj;