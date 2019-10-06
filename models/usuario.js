const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol valido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    }, 
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false // Si no es obligatorio se puede obviar esta propiedad.
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Eliminando el password del objeto mongoose.model('Usuario', usuarioSchema) así no se devolvera en el print.
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

/** 
 * Sin esta linea del paquete require('mongoose-unique-validator') ya funcionaria
 * debido a la propiedad unique: true del email solo que con esto personalizamos
 * el mensaje y se mantiene la estructura del json de respuesta y se concatena en
 * message todos los errores que puedan suceder.
*/
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);
