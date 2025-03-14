// backend/models/Compra.js
import mongoose from "mongoose";
import { getNextOrderNumber } from "../utils/orderNumber.js";

/**
 * Estado de la compra:
 * - pendiente (creada, no ingresado todo el material)
 * - completada (ya ingresado todo)
 * - anulado (se envía correo de anulación)
 */

const BaseCompraSchema = new mongoose.Schema(
  {
    numeroOC: { type: Number, unique: true },
    tipo: { type: String, enum: ["aluminio", "vidrios", "accesorios"], required: true },
    estado: { type: String, enum: ["pendiente", "anulado", "completado"], default: "pendiente" },
    fechaCompra: { type: Date, default: Date.now },
    fechaEstimadaEntrega: { type: Date }, // para semáforo
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Proveedor
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true },
    // Obra
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", required: true },

    // Lugar de entrega
    lugarEntrega: { type: String, default: "" },

    // Remitos ingresados
    remitos: [
      {
        numeroRemito: String,
        fechaIngreso: Date,
        items: [
          {
            // itemId para identificar qué item se está ingresando
            itemId: String,
            cantidadIngresada: Number,
          },
        ],
      },
    ],

    // Info de correo
    factura: { type: String },
    // etc.
  },
  { timestamps: true, discriminatorKey: "tipo" }
);

/**
 * Al guardar por primera vez, asignar un numeroOC correlativo.
 */
BaseCompraSchema.pre("save", async function (next) {
  if (this.isNew && !this.numeroOC) {
    try {
      const nextSeq = await getNextOrderNumber();
      this.numeroOC = nextSeq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Modelo base
export const CompraBase = mongoose.model("CompraBase", BaseCompraSchema);

// Modelo Aluminio
const AluminioSchema = new mongoose.Schema({
  direccionEntrega: { type: String },
  tratamiento: { type: String },
  pedido: [
    {
      codigo: String,
      descripcion: String,
      largo: Number,
      cantidad: Number,
      cantidadIngresada: { type: Number, default: 0 },
    },
  ],
});
export const CompraAluminio = CompraBase.discriminator("aluminio", AluminioSchema);

// Modelo Vidrios
const VidriosSchema = new mongoose.Schema({
  vidrios: [
    {
      descripcion: String,
      cantidad: Number,
      cantidadIngresada: { type: Number, default: 0 },
      ancho: Number,
      alto: Number,
      observaciones: String,
    },
  ],
});
export const CompraVidrios = CompraBase.discriminator("vidrios", VidriosSchema);

// Modelo Accesorios
const AccesoriosSchema = new mongoose.Schema({
  accesorios: [
    {
      codigo: String,
      descripcion: String,
      color: String,
      cantidad: Number,
      cantidadIngresada: { type: Number, default: 0 },
      unidad: String,
      observaciones: String,
    },
  ],
});
export const CompraAccesorios = CompraBase.discriminator("accesorios", AccesoriosSchema);
