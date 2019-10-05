require('../config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Permitir: Access-Control-Allow-Origin
app.use(require('../cors/index'));

/**
 * El body-parser se usa para que todas las peticiones contengan 
 * en el objeto req.body los datos que se llenan en un formulario
 * usando application/x-www-form-urlencoded de POSTMAN o del <form>.
 */
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Habilitar carpeta public/
// Esta linea no funcionara por estar dentro se server/ la variable __dirname = path/server../public
// app.use(express.static(__dirname + '../public'));
const path = require('path');
app.use(express.static(path.resolve(__dirname, '../public')));


// Configuracion Global de rutas
app.use(require('../routes/index'));

mongoose.connect(process.env_URLDB, {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if (err)
        throw err;
    console.log('DataBase Connected.');
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
