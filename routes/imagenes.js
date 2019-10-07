const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middleware/autenticacion');

const app =express();

// http://localhost:3000/imagen/usuarios/5d91755e73e72227ef511928-68.png
// http://localhost:3000/imagen/productos/5d91755e73e72227ef511928-68.png
app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagenAbsoluta = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    
    if(fs.existsSync(pathImagenAbsoluta)) {
        //let pathImagenAbsoluta = path.resolve(__dirname, '../uploads/no-image.jpg');  // La ruta erelativa a este archivo.
        //res.sendfile('./uploads/no-image.jpg');  // Funcion Deprecada, la ruta parte desde la raiz del proyecto.
        res.sendFile(pathImagenAbsoluta);
    } else {
        let pathImagenNoFoundAbsoluta = path.resolve(__dirname, '../uploads/no-image.jpg');
        res.sendFile(pathImagenNoFoundAbsoluta);
    }
   
});

module.exports = app;
