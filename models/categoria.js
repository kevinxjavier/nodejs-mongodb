const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    usuario: {                
        type: Schema.Types.ObjectId, // De esta forma se guarda como un ObjectId y no un type: String, 
        ref: 'Usuario',
        required: [true, 'Es necesario el id del usuario']
    },
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripcion es necesaria']
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);
