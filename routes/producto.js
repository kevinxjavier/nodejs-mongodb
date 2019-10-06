const express =require('express');
const { verificaToken } = require('../middleware/autenticacion');

let Producto = require('../models/producto');

const app = express();

app.get('/producto', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    let condicionWhere = {disponible: true};

    Producto.find(condicionWhere)
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')   // Como categoria es un ObjectId podemos traer la descripcion de ese Documento.
        .populate('usuario', 'nombre email')    // Como usuario es un _id y es de tipo ObjectId 
                                                //podemos traer el Objecto completo y especificamente 
                                                // el nombre y email de la Coleccion usuario.
        .exec((err, productoDB) => {
            if (err)    
                return res.status(500).json({status: 'Failed',err});
            
            if (!productoDB) 
                return res.status(400).json({status: 'Failed',err: {message: 'No pudo obtener la producto'}});
            
            Producto.count(condicionWhere, (err, total) => {
                res.json({status: 'Ok', total, producto: productoDB});
            });        
        });
});

app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    //Producto.find({"_id": id}, (err, productoDB) => {     // Devuelve un arreglo de producto
    //Producto.findById(id, (err, productoDB) => {          // Devuelve un producto
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err)    
                return res.status(500).json({status: 'Failed',err});
            
            if (!productoDB) 
                return res.status(400).json({status: 'Failed',err: {message: 'No pudo obtener el producto'}});
            
            res.json({status: 'Ok', producto: productoDB});
        });
});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');   // Usamos una expresion regular sin case sensitive para Buscar.

    Producto.find({nombre: regex})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err)
                return res.status(500).json({status: 'Failed', err});
            
            // Es posible que la RegExp devuelva un arreglo vacio de productoDB = [] abria que validarlo tambien.
            // con if(!productoDB || !productoDB.length) or if(!productoDB || productoDB.length === 0)
            if (!productoDB || !productoDB.length)
                return res.status(400).json({status: 'Failed', err: {message: 'No se encontro producto'}})

            res.json({status: 'Ok', producto: productoDB})
        });
});

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.preciouni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,      // En el Post se envia el _id de la Categoria
        usuario: req.usuario._id        // Esto req.usuario._id viene del verificaToken
    });

    producto.save((err, productoDB) => {
    //producto.save(producto, (err, productoDB) => {
        if (err)
            return res.status(500).json({status: 'Failed',err});
        
        if (!productoDB) 
            return res.status(400).json({status: 'Failed',err: {message: 'No pudo guardar la producto'}});
        
        res.status(201).json({status: 'Ok', producto: productoDB});
    });
});


app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let actualizacion = {
        nombre: req.body.nombre,
        precioUni: req.body.preciouni,
        descripcion: req.body.descripcion
    };
    
    Producto.findByIdAndUpdate(id, actualizacion, {new: true, runValidators: true} ,(err, productoDB) => {
        if (err)
            return res.status(500).json({status: 'Failed',err});
        
        if (!productoDB) 
            return res.status(400).json({status: 'Failed',err: {message: 'No pudo actualizar la producto'}});
        
        res.json({status: 'Ok', producto: productoDB});
    });
});

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let actualizacion = {disponible: false};

    Producto.findByIdAndUpdate(id, actualizacion, {new: true, runValidators: true} ,(err, productoDB) => {
        if (err)
            return res.status(500).json({status: 'Failed',err});
        
        if (!productoDB) 
            return res.status(400).json({status: 'Failed',err: {message: 'No pudo eliminar el producto'}});
        
        res.json({status: 'Ok', producto: productoDB});
    });    
});

module.exports = app;
