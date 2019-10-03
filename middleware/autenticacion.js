const jwt = require('jsonwebtoken');

// Verifa Token
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) 
            return res.status(401).json({status: 'Failed', err});
            // return res.status(401).json({status: 'Failed', err: {message: 'Token no valido'}});

        req.usuario = decoded.usuario;  // Agregamos el Payload del token al req

        next();
    });
    
    // Sino ejecutamos next(); no se ejecutara lo que esta en el app.post('/path', (err, res) => { // No se ejecuta... })
    // por tanto se ejecutara solo lo de abajo.
    // res.json({token});
};

let verificaAdminRole = (req, res, next) => {

    let role = req.usuario.role;

    if (role === 'ADMIN_ROLE') 
        next();
    else // Hay que usar else de lo contrario se ejecuta el return res.status(401).json()...
        return res.status(401).json({status: 'Failed', err: {message: 'Rol no tiene permisos'}});        
};

module.exports = {
    verificaToken,
    verificaAdminRole
};
