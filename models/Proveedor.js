
const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    },
    emails: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    telefono: {
        type: String,
        trim: true
    },
    whatsapp: {
        type: String,
        trim: true
    },
    balance: {
        type: String,
        trim: true
    },
    rubro: [{
        type: String,
        enum: ['Vidrio', 'Perfiles', 'Accesorios', 'Compras Generales']
    }]
}, { timestamps: true });

module.exports = mongoose.model('Proveedor', proveedorSchema);