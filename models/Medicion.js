// backend/models/Medicion.js
import mongoose from 'mongoose';

const medicionSchema = new mongoose.Schema({
  ubicacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Ubicacion', required: true },
  // Opcionalmente se puede guardar la tipología asociada (o dejarla implícita en la Ubicación)
  tipologia: { type: mongoose.Schema.Types.ObjectId, ref: 'Tipologia' },
  anchoRelevado: { type: Number, required: true },
  altoRelevado: { type: Number, required: true },
  observaciones: { type: String, trim: true },
  fechaCarga: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Medicion', medicionSchema);
