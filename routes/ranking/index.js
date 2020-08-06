const express = require('express'),
      router = express.Router(),
      mysql = require('mysql'),
      middleware = require('../../middleware');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: 'aprendecdb'
});

connection.connect();


router.get("/ranking", function(req, res){
    res.render("./ranking/rankingU");
});



module.exports = router;
    


