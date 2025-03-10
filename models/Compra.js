// backend/models/Compra.js
import mongoose from "mongoose";

// ===============================
// CONTADOR GLOBAL/por USUARIO
// (Si ya lo tenías implementado, mantenlo)
// ===============================
const CounterSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", CounterSchema);

async function getNextOrderNumber() {
  const year = new Date().getFullYear();
  const yearSuffix = year.toString().slice(-2);
  const counter = await Counter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const sequence = counter.seq.toString().padStart(4, "0");
  return `${yearSuffix}${sequence}`;
}

// =======================================
// MODELO: Compra de Perfiles de Aluminio
// =======================================
const CompraAluminioSchema = new mongoose.Schema(
  {
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true },
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", required: true },
    direccionEntrega: { type: String, required: true },
    tratamiento: { type: String, required: true },
    numeroPedido: { type: String, unique: true }, // Se asigna en pre-save
    referenciaInterna: { type: String, default: "" }, // Nuevo campo
    tipoCompra: { type: String, default: "aluminio" }, // Para identificar el tipo

    pedido: [
      {
        codigo: { type: String, required: true },
        descripcion: { type: String, required: true },
        largo: { type: Number, required: true },
        cantidad: { type: Number, required: true },
        cantidadIngresada: {
          type: Number,
          default: 0,
          validate: {
            validator: function (value) {
              return value <= this.cantidad;
            },
            message: "La cantidad ingresada no puede ser mayor que la solicitada",
          },
        },
      },
    ],
    factura: { type: String },
    remito: { type: String },
    fechaCompra: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

CompraAluminioSchema.pre("save", async function (next) {
  if (this.isNew && !this.numeroPedido) {
    try {
      this.numeroPedido = await getNextOrderNumber();
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// =======================================
// MODELO: Compra de Vidrios
// =======================================
const CompraVidriosSchema = new mongoose.Schema(
  {
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true },
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", required: true },
    lugarEntrega: { type: String, required: true },
    numeroPedido: { type: String, unique: true },
    referenciaInterna: { type: String, default: "" },
    tipoCompra: { type: String, default: "vidrios" },

    vidrios: [
      {
        descripcion: { type: String, required: true },
        cantidad: { type: Number, required: true },
        cantidadIngresada: {
          type: Number,
          default: 0,
          validate: {
            validator: function (value) {
              return value <= this.cantidad;
            },
            message: "La cantidad ingresada no puede ser mayor que la solicitada",
          },
        },
        ancho: { type: Number, required: true },
        alto: { type: Number, required: true },
        tipologia: { type: String },
        observaciones: { type: String },
      },
    ],
    factura: { type: String },
    remito: { type: String },
    fechaCompra: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

CompraVidriosSchema.pre("save", async function (next) {
  if (this.isNew && !this.numeroPedido) {
    try {
      this.numeroPedido = await getNextOrderNumber();
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// =======================================
// MODELO: Compra de Accesorios
// =======================================
const CompraAccesoriosSchema = new mongoose.Schema(
  {
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true },
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", required: true },
    lugarEntrega: { type: String, required: true },
    numeroPedido: { type: String, unique: true },
    referenciaInterna: { type: String, default: "" },
    tipoCompra: { type: String, default: "accesorios" },

    accesorios: [
      {
        codigo: { type: String, required: true },
        descripcion: { type: String, required: true },
        color: { type: String, required: true },
        cantidad: { type: Number, required: true },
        cantidadIngresada: {
          type: Number,
          default: 0,
          validate: {
            validator: function (value) {
              return value <= this.cantidad;
            },
            message: "La cantidad ingresada no puede ser mayor que la solicitada",
          },
        },
        unidad: { type: String, required: true },
        observaciones: { type: String },
      },
    ],
    factura: { type: String },
    remito: { type: String },
    fechaCompra: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

CompraAccesoriosSchema.pre("save", async function (next) {
  if (this.isNew && !this.numeroPedido) {
    try {
      this.numeroPedido = await getNextOrderNumber();
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// =======================================
// Exportar todos los modelos
// =======================================
const CompraAluminio = mongoose.model("CompraAluminio", CompraAluminioSchema);
const CompraVidrios = mongoose.model("CompraVidrios", CompraVidriosSchema);
const CompraAccesorios = mongoose.model("CompraAccesorios", CompraAccesoriosSchema);

export { CompraAluminio, CompraVidrios, CompraAccesorios };
