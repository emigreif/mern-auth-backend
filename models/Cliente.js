    const mongoose = require('mongoose');

    const clienteSchema = new mongoose.Schema({
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        apellido: {
            type: String,
            required: true,
            trim: true
        },
        empresa: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        telefono: {
            type: String,
            required: true,
            trim: true
        },
        direccion: {
            calle: {
                type: String,
                required: true,
                trim: true
            },
            ciudad: {
                type: String,
                required: true,
                trim: true
            },
            codigoPostal: {
                type: String,
                required: true,
                trim: true
            },
            pais: {
                type: String,
                required: true,
                trim: true
            }
        },
        tipoCliente: {
            type: String,
            enum: ['particular', 'empresa'],
            required: true
        },
        obras: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Obra'
        }],
        notas: {
            type: String,
            trim: true
        }
    }, { timestamps: true });

    module.exports = mongoose.model('Cliente', clienteSchema);
