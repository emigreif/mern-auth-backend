const mongoose = require('mongoose');

const obraSchema = new mongoose.Schema({
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
    contacto: {
        type: String,
        required: true,
        trim: true
    },
    mapa: {
        type: String,
        trim: true
    },
    estado: {
        perfiles: {
            type: String,
            enum: ['pendiente', 'proximo', 'cumplido'],
            default: 'pendiente'
        },
        vidrios: {
            type: String,
            enum: ['pendiente', 'proximo', 'cumplido'],
            default: 'pendiente'
        },
        accesorios: {
            type: String,
            enum: ['pendiente', 'proximo', 'cumplido'],
            default: 'pendiente'
        },
        produccion: {
            type: String,
            enum: ['pendiente', 'proximo', 'cumplido'],
            default: 'pendiente'
        },
        medicion: {
            type: String,
            enum: ['pendiente', 'proximo', 'cumplido'],
            default: 'pendiente'
        },
        aprobada: {
            type: String,
            enum: ['pendiente', 'proximo', 'cumplido'],
            default: 'pendiente'
        }
    },
    fechaEntrega: {
        type: Date,
        required: true
    },
    saldo: {
        type: String,
        enum: ['Con saldo a cobrar', 'Pagada'],
        default: 'Con saldo a cobrar'
    }
}, { timestamps: true });



module.exports = mongoose.model('Obra', obraSchema);