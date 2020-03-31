// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./src/routes/app');



// Rutas
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    // app.listen(3000, '192.168.43.11', () => {
    console.log('Backend puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});