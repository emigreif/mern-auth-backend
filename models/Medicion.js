// backend/models/Medicion.js
import mongoose from 'mongoose';

const medicionSchema = new mongoose.Schema({
  ubicacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Ubicacion', required: true },
  tipologia: { type: mongoose.Schema.Types.ObjectId, ref: 'Tipologia' },
  anchoRelevado: { type: Number, required: true },
  altoRelevado: { type: Number, required: true },
  observaciones: { type: String, trim: true },
  fechaCarga: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Índice para filtrar por user
medicionSchema.index({ user: 1 });

export default mongoose.model('Medicion', medicionSchema);
