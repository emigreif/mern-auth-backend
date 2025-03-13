// backend/models/MovimientoContable.js
import mongoose from "mongoose";

const movimientoSchema = new mongoose.Schema(
  {
    // Tipo de movimiento
    tipo: {
      type: String,
      enum: [
        "PAGO_EMITIDO",      // Egreso
        "PAGO_RECIBIDO",     // Ingreso
        "FACTURA_EMITIDA",   // Podrías usarlo si registras facturas
        "FACTURA_RECIBIDA",  // ...
      ],
      required: true,
    },

    // Monto del movimiento
    monto: { type: Number, required: true },

    // Fecha del movimiento contable
    fecha: { type: Date, default: Date.now },

    // "conFactura" / "sinFactura"
    // O podrías usar un boolean "conFactura" => true/false
    factura: {
      type: String,
      enum: ["con", "sin"],
      default: "sin",
    },

    // Campo para método de pago (efectivo, cheque, transferencia, etc.)
    metodoPago: {
      type: String,
      enum: ["efectivo", "cheque", "transferencia", "otro"],
      required: true,
    },

    // Para cheques: datos específicos
    cheque: {
      numero: { type: String, trim: true },
      banco: { type: String, trim: true },
      fechaAcreditacion: { type: Date },
      endosadoA: { type: String, trim: true }, // si es cheque emitido y se endosa
    },

    // Para transferencias: datos específicos
    transferencia: {
      nroOperacion: { type: String, trim: true },
      fechaAcreditacion: { type: Date },
    },

    // Descripción o detalle del movimiento
    descripcion: { type: String, trim: true },

    // Relación con Obra (opcional)
    // si no se asigna a ninguna, se puede usar "obra: null"
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra" },

    // Relación con Proveedor (para PAGO_EMITIDO)
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor" },

    // Relación con Cliente (para PAGO_RECIBIDO, si aplica)
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },

    // El usuario dueño de este movimiento
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("MovimientoContable", movimientoSchema);
