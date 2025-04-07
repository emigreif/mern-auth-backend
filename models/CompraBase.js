// models/CompraBase.js
import mongoose from "mongoose";

const compraBaseSchema = new mongoose.Schema(
  {
    numeroOC: { type: Number, default: 0 },
    tipo: { type: String, required: true },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor" },
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra" },
    fechaEstimadaEntrega: { type: Date },
    factura: { type: String, trim: true },
    remito: { type: String, trim: true },
    lugarEntrega: { type: String, trim: true },
    direccionEntrega: { type: String, trim: true },
    tratamiento: { type: String, trim: true },
    estado: { type: String, default: "pendiente" },
    remitos: [
      {
        numeroRemito: String,
        fechaIngreso: Date,
        items: [
          {
            itemId: String,
            cantidadIngresada: Number
          }
        ]
      }
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true, discriminatorKey: "tipo" }
);

const CompraBase = mongoose.model("CompraBase", compraBaseSchema);
export default CompraBase;
