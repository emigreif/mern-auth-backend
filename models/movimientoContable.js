// models/movimientoContable.js
import mongoose from "mongoose";

const partidaObraSchema = new mongoose.Schema(
  {
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra" },
    monto: { type: Number, default: 0 }
  },
  { _id: false }
);

const movimientoSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: [
        "FACTURA_EMITIDA",
        "PAGO_RECIBIDO",
        "EFECTIVO_RECIBIDO",
        "CHEQUE_RECIBIDO",
        "TRANSFERENCIA_RECIBIDA",
        "FACTURA_RECIBIDA",
        "PAGO_EMITIDO",
        "EFECTIVO_EMITIDO",
        "CHEQUE_EMITIDO",
        "TRANSFERENCIA_EMITIDA"
      ],
      required: true
    },
    monto: { type: Number, required: true },
    esConFactura: { type: Boolean, default: false },
    fecha: { type: Date, default: Date.now },
    fechaAcreditacion: { type: Date },
    descripcion: { type: String },
    idProveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor" },
    idCliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
    partidasObra: [partidaObraSchema],
    subIndiceFactura: { type: String },
    datosCheque: {
      numeroCheque: String,
      banco: String,
      fechaVencimiento: Date,
      endosadoA: String,
      estadoCheque: {
        type: String,
        enum: ["pendiente", "acreditado", "devuelto", "endosado", "cancelado"],
        default: "pendiente"
      }
    },
    datosTransferencia: {
      numeroComprobante: String,
      bancoOrigen: String,
      bancoDestino: String
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("MovimientoContable", movimientoSchema);
