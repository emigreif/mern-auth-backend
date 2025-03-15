// models/compra.js
import mongoose from "mongoose";

/**
 * Discriminadores para compra de Aluminio, Vidrios y Accesorios
 */
const compraBaseSchema = new mongoose.Schema(
  {
    numeroOC: { type: Number, default: 0 },
    tipo: { type: String, required: true }, // "aluminio", "vidrios", "accesorios"
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor" },
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra" },
    fechaEstimadaEntrega: { type: Date },
    factura: { type: String, trim: true },
    remito: { type: String, trim: true },
    lugarEntrega: { type: String, trim: true },
    direccionEntrega: { type: String, trim: true },
    tratamiento: { type: String, trim: true },
    estado: { type: String, default: "pendiente" }, // "pendiente", "anulado", "completado"
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

export const CompraBase = mongoose.model("CompraBase", compraBaseSchema);

/**
 * CompraAluminio
 */
const compraAluminioSchema = new mongoose.Schema({
  pedido: [
    {
      codigo: String,
      descripcion: String,
      largo: Number,
      cantidad: Number,
      cantidadIngresada: { type: Number, default: 0 }
    }
  ]
});
export const CompraAluminio = CompraBase.discriminator(
  "aluminio",
  compraAluminioSchema
);

/**
 * CompraVidrios
 */
const compraVidriosSchema = new mongoose.Schema({
  vidrios: [
    {
      codigo: String,
      descripcion: String,
      ancho: Number,
      alto: Number,
      cantidad: Number,
      cantidadIngresada: { type: Number, default: 0 }
    }
  ]
});
export const CompraVidrios = CompraBase.discriminator(
  "vidrios",
  compraVidriosSchema
);

/**
 * CompraAccesorios
 */
const compraAccesoriosSchema = new mongoose.Schema({
  accesorios: [
    {
      codigo: String,
      descripcion: String,
      color: String,
      cantidad: Number,
      cantidadIngresada: { type: Number, default: 0 }
    }
  ]
});
export const CompraAccesorios = CompraBase.discriminator(
  "accesorios",
  compraAccesoriosSchema
);
