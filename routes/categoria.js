const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');

const app = express();

let Categoria = require('../models/categoria');

app.get('/categoria', verificaToken, (req, res) => {
    
    //Categoria.find({}, (err, categoriaDB) => {    // Asi no pudiera invocar otras funciones de MongoDB
    Categoria.find({})
        .populate('usuario', 'nombre email')      // Trae los datos del Schema: usuarios especificamente las propiedades nombre y email. Para que funcione el campo usuario debe guardar un ObjectId de la Collection usuarios.
        //.populate('Collection', 'property1 property2')   // Agregamos mas Schemas si queremos que se llenen y luego los campos especificos. Para que funcione el campo debe guardar un ObjectId del tipo de su Collection.
        .sort('descripcion')
        .exec((err, categoriaDB) => {
            if (err)
                return res.status(500).json({status: 'Failed', err});

            if (!categoriaDB) 
                return res.status(400).json({status: 'Failed', err: {message: 'No se encontro la categoria'}});
            
            res.json({status: 'Ok', categoria: categoriaDB});
        })
});

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    //Categoria.find({'_id': id}).exec((err, categoriaDB) => {      // Asi devuelve un array de categorias: [] pero con un solo elemento.
    Categoria.findById(id, (err, categoriaDB) => {
        if (err)
            return res.status(500).json({status: 'Failed', err});

        if (!categoriaDB) 
            return res.status(400).json({status: 'Failed', err: {message: 'No se encontro la categoria'}});
        
        res.json({status: 'Ok', categoria: categoriaDB});
    });
});

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id        // Este req.usuario._id lo llena el middleware verificaToken
    });

    categoria.save((err, categoriaDB) => {
        if (err) 
            return res.status(500).json({status: 'Failed', err});

        if (!categoriaDB)
            return res.status(400).json({status: 'Failed', err: {message: 'No se pudo guardar la categoria'}});
        
        res.status(201).json({status: 'Ok', categoria: categoriaDB});
    });
});

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descripcionCategoria = {
        descripcion: body.descripcion
    };
    Categoria.findByIdAndUpdate(id, descripcionCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {
        if (err) 
            return res.status(500).json({status: 'Failed', err});

        if (!categoriaDB)
            return res.status(400).json({status: 'Failed', err: {message: 'No se pudo guardar la categoria'}});
        
        res.json({status: 'Ok', categoria: categoriaDB});
    });
});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) 
            return res.status(500).json({status: 'Failed', err});

        if (!categoriaDB)
            return res.status(400).json({status: 'Failed', err: {message: 'No se pudo borrar la categoria'}});

        res.json({status: 'Ok', categoria: categoriaDB});
    });
});

module.exports = app;