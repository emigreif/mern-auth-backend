// backend/models/Panol.js
import mongoose from 'mongoose';

const herramientaSchema = new mongoose.Schema({
  descripcion: { type: String, required: true, trim: true },
  marca: { type: String, required: true, trim: true },
  modelo: { type: String, required: true, trim: true },
  identificacion: { type: String, required: true, unique: true, trim: true },
  estado: {
    type: String,
    enum: ['disponible', 'en uso', 'en mantenimiento'],
    default: 'disponible',
  },
}, { timestamps: true });

const perfilSchema = new mongoose.Schema({
  codigo: { type: String, required: true, trim: true },
  cantidad: { type: Number, required: true, min: 0 },
  descripcion: { type: String, required: true, trim: true },
  largo: { type: String, required: true, trim: true },
  color: { type: String, required: true, trim: true },
}, { timestamps: true });

// Ejemplo: si quieres que 'codigo' sea globalmente único, deja unique: true.
// Si necesitas "único por usuario", hay que mover perfiles a su propia colección o buscar otra estrategia.
perfilSchema.index({ codigo: 1 }, { unique: false }); 

const accesorioSchema = new mongoose.Schema({
  codigo: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  color: { type: String, required: true, trim: true },
  cantidad: { type: Number, required: true, min: 0 },
  marca: { type: String, required: true, trim: true },
}, { timestamps: true });

const vidrioSchema = new mongoose.Schema({
  codigo: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  cantidad: { type: Number, required: true, min: 0 },
  ancho: { type: Number, required: true },
  alto: { type: Number, required: true },
}, { timestamps: true });

const panolSchema = new mongoose.Schema(
  {
    herramientas: [herramientaSchema],
    perfiles: [perfilSchema],
    accesorios: [accesorioSchema],
    vidrios: [vidrioSchema],
    // Campo user a nivel principal
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Opcional: indexar por user si haces muchas búsquedas Panol.find({ user: ... })
panolSchema.index({ user: 1 });

export default mongoose.model('Panol', panolSchema);
