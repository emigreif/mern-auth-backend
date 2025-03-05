// backend/models/Presupuesto.js
import mongoose from 'mongoose';

const presupuestoSchema = new mongoose.Schema({
  nombreObra: { type: String, required: true, trim: true },
  totalPresupuestado: { type: Number, default: 0 },
  totalConFactura: { type: Number, default: 0 },
  totalSinFactura: { type: Number, default: 0 },
  indiceCAC: { type: String, default: '' },
  estado: { type: String, enum: ['pendiente', 'aprobado', 'perdido'], default: 'pendiente' },
  direccion: { type: String, required: true, trim: true },
  cliente: { type: String, required: true, trim: true },
  // Solo se completa si el estado es 'perdido'
  empresaPerdida: { type: String, default: '' },
  fechaEntrega: { type: Date },
  descripcion: { type: String, trim: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Presupuesto', presupuestoSchema);
