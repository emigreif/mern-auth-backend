// backend/models/Ubicacion.js
import mongoose from 'mongoose';

const ubicacionSchema = new mongoose.Schema({
  obra: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra', required: true },
  piso: { type: String, required: true, trim: true },
  ubicacion: { type: String, required: true, trim: true },
  tipologias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tipologia' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// ➜ Índice para filtrar por user
ubicacionSchema.index({ user: 1 });

export default mongoose.model('Ubicacion', ubicacionSchema);
