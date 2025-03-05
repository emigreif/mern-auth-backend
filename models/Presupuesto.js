// backend/models/Presupuesto.js
import mongoose from 'mongoose';

const presupuestoSchema = new mongoose.Schema({
  idObra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Obra',
    required: false
  },
  nombreObra: { type: String, required: true, trim: true },
  cliente: { type: String, required: true, trim: true },
  estado: { type: String, enum: ['pendiente', 'aprobado', 'perdido'], default: 'pendiente' },
  // Si el presupuesto se pierde, se indicará contra qué empresa se perdió
  empresaPerdida: { type: String, default: '' },
  totalPresupuestado: { type: Number, default: 0 },
  totalConFactura: { type: Number, default: 0 },
  totalSinFactura: { type: Number, default: 0 },
  indiceCAC: { type: String, default: '' },
  direccion: { type: String, required: true, trim: true },
  fechaEntrega: { type: Date },
  descripcion: { type: String, trim: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Presupuesto', presupuestoSchema);
