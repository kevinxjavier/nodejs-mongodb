const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if(err)
            return res.status(500).json({tatus: 'Failed', err});

        if(!usuarioDB) // Si no consiguio el usuario devuelve null
            return res.status(400).json({tatus: 'Failed', err: {message: 'Usuario o contraseña incorrectos'}});

        if(!bcrypt.compareSync(body.password, usuarioDB.password)) // Si las contrelas son distintas devuelve false
        //if(body.password !== usuarioDB.password) // Si las contrelas son distintas devuelve false
            return res.status(400).json({tatus: 'Failed', err: {message: 'Usuario o contraseña incorrectos'}});

        let token = jwt.sign({usuario: usuarioDB}, process.env.SEED, {expiresIn: process.env.CADUCIDAD});   // 60 * 60 = Expira en 1 hora
        //let token = jwt.sign({usuario: usuarioDB}, 'Mi-Clave', {expiresIn: 60 * 60 * 24 * 30});           // Expira en 1 mes

        res.json({status: 'Ok', usuario: usuarioDB, token});   // No es necesario colocar el status 200 ya va implicito
    });
});

module.exports = app;
