const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const app = express();

// Middleware que hace que todos los archivos que se carguen se asignan dentro del req.files
app.use(fileUpload())

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tipoValidos = ['productos', 'usuarios'];    // Nombres hacen match con carpetas de upload/

    // Validar Tipos 
    if (tipoValidos.indexOf(tipo) < 0)
        return res.status(400).json({
            status: 'Failed', 
            err: {
                message: 'Los tipos validos son [' + tipoValidos.join(', ') + ']'
            }
        });

    // Validar que venga archivo
    if (!req.files) 
        return res.status(400).json({status: 'Failed', err: {message: 'No se ha seleccionado ningun archivo'}});

    let archivo = req.files.archivo;                                // HTML Form <input name="archivo"> form-data
    let archivoNombre = archivo.name;                               // Nombre archivo

    let fileNameArray = archivoNombre.split('.');
    let archivoExtension = fileNameArray[fileNameArray.length -1];  // Extension archivo
    
    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];                // Extensiones validas
    
    // Validar Extensiones de Archivos
    if(extensionesValidas.indexOf(archivoExtension) < 0) 
        return res.status(400).json({
            status: 'Failed', 
            err: {
                message: 'Extension de archivo no es valida [' + archivoExtension + 
                '], extensiones validas [' + extensionesValidas.join(', ') + ']'
            }
        });

	// Cambiar nombre archivo y hacerlo unico
	let nombre = `${ id }-${ new Date().getMilliseconds() }.${ archivoExtension }`;

    archivo.mv(`./uploads/${ tipo }/${ nombre }`, (err) => {
        if (err)
            return res.status(500).json({status: 'Failed', err});

		if (tipo === 'usuarios') {
			//actualizarUsuario1(id, nombre, res);	// findByIdAndUpdate()
			actualizarUsuario2(id, nombre, res);	// findById() y luego save()		Esta es mejorada ya que elimina el archivo anterior del disco.
		} else {
			actualizarProducto(id, nombre, res);
		}
    });
});

function actualizarUsuario1(id, nombre, res) {
	Usuario.findByIdAndUpdate(id, {img: nombre}, {new: true, runValidators: true}, (err, usuarioDB) => {
		if (err) 
			return res.status(500).json({status: 'Failed', err});

		if (!usuarioDB) 
			return res.status(400).json({status: 'Failed', err: {message: 'Usuario no existe'}});

		return res.json({status: 'Ok', message: 'Imagen subido correctamente'});
	});
}

function actualizarUsuario2(id, nombre, res) {
	Usuario.findById(id, (err, usuarioDB) => {
		if (err) {
			borrarArchivo('usuarios', nombre);
			return res.status(500).json({status: 'Failed', err});
		}

		if (!usuarioDB) {
			borrarArchivo('usuarios', nombre);
			return res.status(400).json({status: 'Failed', err: {message: 'Usuario no existe'}});
		}
		
		borrarArchivo('usuarios', usuarioDB.img);
		
		let imagenAnterior = usuarioDB.img;	// Imagen Anterior

		usuarioDB.img = nombre;				// Imagen Nueva
		
		usuarioDB.save((err, usuarioDBSaved) => {
			return res.json({status: 'Ok', usuario: usuarioDBSaved, imagenAnterior});
		});
		
	});
}

function actualizarProducto(id, nombre, res) {
	Producto.findById(id, (err, productoDB) => {
		if (err) {
			borrarArchivo('productos', nombre);
			return res.status(500).json({status: 'Failed', err});
		}

		if (!productoDB) {
			borrarArchivo('productos', nombre);
			return res.status(400).json({status: 'Failed', err: {message: 'Producto no existe'}});
		}

		borrarArchivo('productos', productoDB.img);

		let imagenAnterior = productoDB.img;	// Imagen Anterior

		productoDB.img = nombre;				// Imagen Nueva

		productoDB.save((err, productoDBSaved) => {
			res.json({status: 'Ok', productos: productoDBSaved, imagenAnterior});
		});
		
	});
}

function borrarArchivo(tipo, nombre) {
	let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${nombre}`);
	if(fs.existsSync(pathImagen)) 
		fs.unlinkSync(pathImagen);
}

module.exports = app;