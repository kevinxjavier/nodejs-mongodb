const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();

app.post('/google', async (req, res) =>  {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({status: 'Failed', err});
        });

    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
        if(err)
            return res.status(500).json({status: 'Failed', err});

        if(usuarioDB) {
            if(!usuarioDB.google) {
                return res.status(400).json({status: 'Failed', err: {message: 'Usuario ya se habia registrado en nuestro site, loguese con sus credenciales.'}});
            } else {
                // Si se ha registrado con google = true, Actualizar Token
                let token = jwt.sign({usuario: usuarioDB}, process.env.SEED, {expiresIn: process.env.CADUCIDAD}); 
                return res.json({status: 'Ok', usuario: usuarioDB, token});
            }
        } else {
            // Usuario no existe lo registramos
            
            let usuario = new Usuario();
            
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if(err)
                    return res.status(500).json({status: 'Failed', err});

                let token = jwt.sign({usuario: usuarioDB}, process.env.SEED, {expiresIn: process.env.CADUCIDAD}); 
                return res.json({status: 'Ok', usuario: usuarioDB, token});
            });
        }

    });

    //res.json({usuario: googleUser});
});

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

        let token = jwt.sign({usuario: usuarioDB}, process.env.SEED, {expiresIn: process.env.CADUCIDAD});   // 60 * 60 = 1h = Expira en 1 hora
        //let token = jwt.sign({usuario: usuarioDB}, 'Mi-Clave', {expiresIn: 60 * 60 * 24 * 30});           // Expira en 1 mes

        res.json({status: 'Ok', usuario: usuarioDB, token});   // No es necesario colocar el status 200 ya va implicito
    });
});

// Config Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID that is equals to process.env.CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };

    //const userid = payload['sub'];

    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}

module.exports = app;
