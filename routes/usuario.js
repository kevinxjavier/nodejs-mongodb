const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middleware/autenticacion');
const app = express();

// $ curl http://localhost:3000/usuario?desde=10&limite=5   # Enviar en el header el token si esta el middleware verificaToken
app.get('/usuario', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    let condicionWhere = {estado: true}; // Sino queremos agregar un where dejar let condicionWhere = {};

    //Usuario.find({})
    Usuario.find(condicionWhere, 'nombre email estado')    // De esta forma incluimos solo los campos que queremos devolver nombre, email y estado.
        .skip(desde)    // Se salta al numero de registro que se indique en desde en este caso al registrio 10.     [OPCIONAL]
        .limit(limite)  // Devuelve solo 5 registros despues del registro 10 para este caso.                        [OPCIONAL]
        .exec((err, usuariosDB) => {
            if(err) 
                return res.status(400).json({status: 'Failed', err});
            Usuario.count(condicionWhere, (err, total) => {
                res.json({status: 'Ok', total, usuariosDB});   // No es necesario colocar el status 200 ya va implicito    
            });            
        });    
});

// Al usar body-parser req.body se carga con lo que venga en application/x-www-form-urlencoded
// req.body contendra un objeto JSON con los datos que se envien en el formulario.
// req.body tendra { nombre: 'Kevin', correo: 'Piña', password: '12456', role: 'ADMIN_ROLE' }
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;

    // No es necesario este if ya que Schema de mongoose los valida.
    if (body.nombre === undefined || body.correo === undefined) {
        let mensaje = {
            persona: {
                status: 'Failed',
                message: 'Nombre or Correo has not been sent'
            }
        }
        res.status(400).json(mensaje);
    } else {

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.correo,
            password: bcrypt.hashSync(body.password, 10),   // 10 es el numero de vueltas de encriptacion que se desea.
            role: body.role,
            estado: body.estado
        });

        usuario.save((err, usuarioDB) => {
            if(err) 
                return res.status(400).json({status: 'Failed', err});
            
            // delete usuarioDB.password; // Esto no funciona. 
            // usuarioDB.password = null; // Es valido pero muestra la propiedad password igual a null
            // La solucion en ../routes/usuario.js la linea usuarioSchema.methods.toJSON ...

            res.json({status: 'Ok', usuario: usuarioDB});   // No es necesario colocar el status 200 ya va implicito
        });        
    }
});

// $ curl http://localhost:3000/usuario/5d915d68bc96f20a7d50d5d6
// req.params.parametro por defecto trabaja asi en express sin necesidad de body-parser
app.put('/usuario/:idUsuario', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.idUsuario;

    // let body = req.body;
    // Eliminando properties que no queremos actualizar.
    // delete body.password;
    // delete body.google;
    // Mejor forma de usar el req.body de la lib body-parser y eliminar los properties 
    // que no queremos usar req.body para actualizar es usar la lib underscore.
    let body = _.pick(req.body, ['nombre', 'email', 'image', 'role', 'estado']);

    /* 
        NOTA: para que se actualizen todos los cambios como no definimos el Schema como en el POST
            tenemos que pasar el nombre de los campos tal cual se definieron en el Documento de Mongo
            req.body debera tener { nombre: 'Kevin', email: 'Piña', password: '12456', role: 'ADMIN_ROLE' }
            o crearnos un objeto JSON let usuario = {} mapeando usuario con el body que espera findByIdAndUpdate.
    */

    // id debe ser el que genera la base de datos Mongo "_id" : ObjectId("5d915d68bc96f20a7d50d5d6")
    // Usuario.findByIdAndUpdate(id, body, (err, usuarioDB) => {                // De esta forma actualiza pero devuelve el objeto como estaba antes de modificarlo.
    // Usuario.findByIdAndUpdate(id, body, {new: true}, (err, usuarioDB) => {   // De esta forma actualiza y devuelve el objeto nuevo.
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => { // Ahora ejecuta las validaciones como la de los Roles validos, el Update no valida porque no usa el esquema.
        if(err) 
            return res.status(400).json({status: 'Failed', err});
        res.json({status: 'Ok', usuario: usuarioDB});   // No es necesario colocar el status 200 ya va implicito
    });
});

app.delete('/usuario/:idUsuario', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.idUsuario;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {                             // Elimina registro
    Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, usuarioBorrado) => {  // Elimina logica Actualizacion
        if (err) 
            return res.status(400).json({status: 'Failed', err})
        if(!usuarioBorrado) 
            return res.status(400).json({status: 'Failed', err: {message: 'Usuario no existe.'}})

        res.json({status: 'Ok', usuario: usuarioBorrado});    // No es necesario colocar el status 200 ya va implicito    
    }); 
});

module.exports = app;

