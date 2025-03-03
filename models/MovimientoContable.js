// backend/models/MovimientoContable.js
import mongoose from 'mongoose';

const movimientoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['FACTURA_EMITIDA', 'FACTURA_RECIBIDA', 'PAGO_RECIBIDO', 'PAGO_EMITIDO'],
    required: true
  },
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  descripcion: String,

  // Ejemplo de vinculación a Obra o Proveedor/Cliente
  idObra: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra' },
  idProveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor' },
  idCliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
}, { timestamps: true });

export default mongoose.model('MovimientoContable', movimientoSchema);
