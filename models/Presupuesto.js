// backend/models/Presupuesto.js
import mongoose from 'mongoose';

const presupuestoSchema = new mongoose.Schema({
  idObra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Obra', // Relación con la colección 'Obra'
    required: false
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'perdido'],
    default: 'pendiente'
  },
  totalBlanco: { type: Number, default: 0 },
  totalNegro: { type: Number, default: 0 },
  fechaEntrega: Date,
  descripcion: { type: String, trim: true }, // ejemplo

  // Campos de contabilidad / índices:
  indiceAjuste: { type: String, default: '' }, // CAC / dólar, etc.
  cotizacion: { type: Number, default: 1 },
  
  // ...
}, { timestamps: true });

export default mongoose.model('Presupuesto', presupuestoSchema);
