// backend/models/MovimientoContable.js
import mongoose from 'mongoose';

const partidaObraSchema = new mongoose.Schema({
  obra: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra' },
  monto: { type: Number, default: 0 },
}, { _id: false });

const movimientoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: [
      // Ventas / Cobranzas
      'FACTURA_EMITIDA',
      'PAGO_RECIBIDO',       // genérico
      'EFECTIVO_RECIBIDO',
      'CHEQUE_RECIBIDO',
      'TRANSFERENCIA_RECIBIDA',
      // Compras / Pagos
      'FACTURA_RECIBIDA',
      'PAGO_EMITIDO',
      'EFECTIVO_EMITIDO',
      'CHEQUE_EMITIDO',
      'TRANSFERENCIA_EMITIDA',
    ],
    required: true
  },
  monto: { type: Number, required: true },

  // Para movimientos con/sin factura
  esConFactura: { type: Boolean, default: false },

  fecha: { type: Date, default: Date.now },           // Fecha del movimiento
  fechaAcreditacion: { type: Date },                 // Fecha en que se acredita (cheque/transfer)
  descripcion: { type: String },

  // Referencias
  idProveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor' },
  idCliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },

  // Subdividir la factura/pago en partidas de obras
  partidasObra: [partidaObraSchema],

  // Sub-índice de factura (por si se subdivide la misma)
  subIndiceFactura: { type: String },

  // DETALLES de cheque (si tipo es CHEQUE_RECIBIDO / CHEQUE_EMITIDO)
  datosCheque: {
    numeroCheque: { type: String },
    banco: { type: String },
    fechaVencimiento: { type: Date },
    endosadoA: { type: String },      // en caso de cheque emitido
    estadoCheque: {
      type: String,
      enum: ['pendiente', 'acreditado', 'devuelto', 'endosado', 'cancelado'],
      default: 'pendiente'
    }
  },

  // DETALLES de transferencia (si tipo es TRANSFERENCIA_*)
  datosTransferencia: {
    numeroComprobante: { type: String },
    bancoOrigen: { type: String },
    bancoDestino: { type: String },
  },

  // El usuario dueño de este movimiento
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

}, { timestamps: true });

export default mongoose.model('MovimientoContable', movimientoSchema);
