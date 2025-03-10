// backend/models/Compra.js
import mongoose from "mongoose";

// ================================
// CONTADOR POR USUARIO Y AÑO
// ================================
const CounterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  year: { type: Number, required: true },
  seq: { type: Number, default: 0 },
});

// Clave compuesta para evitar duplicados de (user + year)
CounterSchema.index({ user: 1, year: 1 }, { unique: true });

const Counter = mongoose.model("Counter", CounterSchema);

async function getNextOrderNumber(userId) {
  const year = new Date().getFullYear();
  const yearSuffix = year.toString().slice(-2);

  // Buscar o crear un registro de Counter para este user + year
  const counter = await Counter.findOneAndUpdate(
    { user: userId, year },
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
    numeroPedido: { type: String }, // Se asignará en pre-save
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
      this.numeroPedido = await getNextOrderNumber(this.user);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Índice para búsquedas por usuario
CompraAluminioSchema.index({ user: 1 });

// =============================
// MODELO: Compra de Vidrios
// =============================
const CompraVidriosSchema = new mongoose.Schema(
  {
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true },
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", required: true },
    lugarEntrega: { type: String, required: true },
    numeroPedido: { type: String },
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
      this.numeroPedido = await getNextOrderNumber(this.user);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

CompraVidriosSchema.index({ user: 1 });

// =============================
// MODELO: Compra de Accesorios
// =============================
const CompraAccesoriosSchema = new mongoose.Schema(
  {
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true },
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", required: true },
    lugarEntrega: { type: String, required: true },
    numeroPedido: { type: String },
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
      this.numeroPedido = await getNextOrderNumber(this.user);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

CompraAccesoriosSchema.index({ user: 1 });

// Exportar los 3 modelos
const CompraAluminio = mongoose.model("CompraAluminio", CompraAluminioSchema);
const CompraVidrios = mongoose.model("CompraVidrios", CompraVidriosSchema);
const CompraAccesorios = mongoose.model("CompraAccesorios", CompraAccesoriosSchema);

export { CompraAluminio, CompraVidrios, CompraAccesorios };
