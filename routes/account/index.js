
const express = require('express'),
      router = express.Router(),
      mysql = require('mysql'),
      middleware = require('../../middleware');



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'luis',
    password: process.env.LOCAL_MYSQL_PASSWORD,
    database: 'aprendecdb'
});

connection.connect();


router.get("/:userName/edit", middleware.isLoggedIn ,function(req, res){
    console.log("\ntss up");

    connection.query(`select * from redes where(username = '${req.params.userName}')`, function(err, results, fields){
        if(err){
            return res.send(err);
        }
        
        return res.render("./account/cuenta", {user: req.user, redes: results});

    });
});

router.put("/:userName", middleware.isLoggedIn ,function(req, res){
    console.log("\n\ntss up");
    console.log(req.body);

    let acerca = req.body.acerca;
    let redes = req.body.redes;
    
    connection.query(`update usuario set acerca = '${acerca}' where username = '${req.params.userName}'`, function(err, results, fields){
        if(err){
            return res.send(err);
        }
        connection.query(`delete from redes where username = '${req.params.userName}'`, function(err2, results2, fields2){
            if(err2){
                return res.send(err2);
            }
            try{
                console.log(redes);
                if(redes){
                    for(let i=0; i<redes.length; i++){
                        if(redes[i] != ""){
                            let red = redes[i].split('.')[1];
                            connection.query(`insert into redes values ('${req.params.userName}', '${red}', '${redes[i]}')`);
                        }
                    }
                }
            }catch(err3){
                console.log("Ha ocurrido un error");
                return res.send(err3);    
            }
        });
    });


    res.redirect(`/account/${req.params.userName}/edit`);
});

router.put("/:userName/picture", middleware.isLoggedIn,function(req, res){
    console.log("\nHa editado la foto");
    console.log(req.params);
    console.log(req.body);
    console.log(req.files);
    console.log(process.env.PWD);
    if(req.files){
        console.log("Si hay archivo");

        let foto = req.files.foto;
        let formato = req.files.foto.name.split('.')[1];
        let userName = res.locals.userName.replace(/\s/g, '');;

        foto.mv(`./public/fotos/${userName}Foto.${formato}`, function(err){
            if(err){
                return res.send(err);
            }
            connection.query(`update usuario set foto = 'http://localhost:3000/fotos/${userName}Foto.${formato}' where username = '${res.locals.userName}'`, function(err, results, fields){
                if(err){
                    return res.send(err);
                }else{
                    console.log("Se ha actualizado el valor de usuario");
                    console.log(results);
                    return res.redirect(`/account/${userName}/edit`);
                }
            });
        });

    }else{
        console.log("No ha subido ningun archivo");
    }
});


module.exports = router;