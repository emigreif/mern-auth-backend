import mongoose from 'mongoose';

const herramientaSchema = new mongoose.Schema({
    descripcion: { type: String, required: true, trim: true },
    marca: { type: String, required: true, trim: true },
    modelo: { type: String, required: true, trim: true },
    identificacion: { type: String, required: true, unique: true, trim: true },
    estado: {
        type: String,
        enum: ['disponible', 'en uso', 'en mantenimiento'],
        default: 'disponible'
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const perfilSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true, trim: true },
    cantidad: { type: Number, required: true, min: 0 },
    descripcion: { type: String, required: true, trim: true },
    largo: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const accesorioSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    cantidad: { type: Number, required: true, min: 0 },
    marca: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Nuevo esquema para vidrios en stock
const vidrioSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    cantidad: { type: Number, required: true, min: 0 },
    ancho: { type: Number, required: true },
    alto: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const panolSchema = new mongoose.Schema({
    herramientas: [herramientaSchema],
    perfiles: [perfilSchema],
    accesorios: [accesorioSchema],
    vidrios: [vidrioSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Panol', panolSchema);
