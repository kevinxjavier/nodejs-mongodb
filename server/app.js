require('../config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

/**
 * El body-parser se usa para que todas las peticiones contengan 
 * en el objeto req.body los datos que se llenan en un formulario
 * usando application/x-www-form-urlencoded de POSTMAN o del <form>.
 */

 // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('../routes/usuario'));

mongoose.connect(process.env_URLDB, {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if (err)
        throw err;
    console.log('DataBase Connected.');
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
