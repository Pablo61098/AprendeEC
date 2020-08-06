var express = require('express');
var router = express.Router();
var https = require('https');

router.get('/', function (req, res, next) {
    var busqueda = req.query.busqueda;
    if (busqueda) {
        https.get(`https://www.googleapis.com/books/v1/volumes?maxResults=1&filter=partial&q=${busqueda}`, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                console.log(JSON.parse(data).totalItems)
                if (JSON.parse(data).totalItems === 0) {
                    res.render('./stack_estudio', { show: true, busqueda: busqueda, book: "rx59RPjm0GQC" });
                } else {
                    console.log(JSON.parse(data).items[0].id);
                    res.render('./stack_estudio', { show: true, busqueda: busqueda, book: JSON.parse(data).items[0].id });
                }
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
            res.send("Error: " + err.message);
        });
    } else {
        res.render('./stack_estudio', { show: false });
    }
});

module.exports = router;
