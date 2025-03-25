import mongoose from "mongoose";

// Subschemas para OV
const perfilOVSchema = new mongoose.Schema({
  codigo: String,
  descripcion: String,
  cantidad: { type: Number, min: 0 },
  largo: { type: Number, min: 0 },
  pesoxmetro: { type: Number, min: 0 },
  color: String
}, { _id: false });

const vidrioOVSchema = new mongoose.Schema({
  descripcion: String,
  cantidad: { type: Number, min: 0 },
  ancho: { type: Number, min: 0 },
  alto: { type: Number, min: 0 },
  tipologias: [String] // opcional
}, { _id: false });

const accesorioOVSchema = new mongoose.Schema({
  codigo: String,
  descripcion: String,
  color: String,
  cantidad: { type: Number, min: 0 },
  unidad: { type: String, default: "u" },
  tipo: {
    type: String,
    enum: ["accesorios", "herrajes", "tornillos", "bulones", "felpas", "selladores / espuma", "otro"],
    default: "accesorios"
  }
}, { _id: false });

const tipologiaOVSchema = new mongoose.Schema({
  tipo: String,
  descripcion: String,
  base: { type: Number, min: 0 },
  altura: { type: Number, min: 0 },
  cantidad: { type: Number, min: 0 }
}, { _id: false });

const ObraSchema = new mongoose.Schema({
  codigoObra: { type: Number },
  nombre: { type: String, required: true, trim: true },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true
  },
  direccion: { type: String, required: true, trim: true },
  contacto: { type: String, required: true, trim: true },
  mapa: { type: String, trim: true },
  fechaEntrega: { type: Date },
  importeConFactura: { type: Number, default: 0 },
  importeSinFactura: { type: Number, default: 0 },
  importeTotal: { type: Number, default: 0 },
  indiceActualizacionSaldo: { type: Number, default: 0 },

  // ➕ Nuevos arrays OV (orden de venta)
  perfilesOV: [perfilOVSchema],
  vidriosOV: [vidrioOVSchema],
  accesoriosOV: [accesorioOVSchema],
  tipologiasOV: [tipologiaOVSchema],

  // Fechas calculadas
  fechaInicioCortePerfiles: { type: Date },
  fechaInicioArmado: { type: Date },
  fechaEnvidriado: { type: Date },
  fechaInicioMontaje: { type: Date },
  fechaMedicion: { type: Date },

  // Estados
  ordenProduccionAprobada: { type: Boolean, default: false },
  finalObra: { type: Boolean, default: false },
  estadoGeneral: {
    type: String,
    enum: ["Presupuestada", "En Proceso", "Finalizada"],
    default: "Presupuestada"
  },
  estado: {
    perfiles: {
      type: String,
      enum: ["pendiente", "proximo", "cumplido"],
      default: "pendiente"
    },
    vidrios: {
      type: String,
      enum: ["pendiente", "proximo", "cumplido"],
      default: "pendiente"
    },
    accesorios: {
      type: String,
      enum: ["pendiente", "proximo", "cumplido"],
      default: "pendiente"
    },
    produccion: {
      type: String,
      enum: ["pendiente", "proximo", "cumplido"],
      default: "pendiente"
    },
    medicion: {
      type: String,
      enum: ["pendiente", "proximo", "cumplido"],
      default: "pendiente"
    },
    aprobada: {
      type: String,
      enum: ["pendiente", "proximo", "cumplido"],
      default: "pendiente"
    }
  },
  saldo: {
    type: String,
    enum: ["Con saldo a cobrar", "Pagada"],
    default: "Con saldo a cobrar"
  },
  observaciones: { type: String, trim: true },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// Auto-cálculo de fechas basadas en fechaEntrega
ObraSchema.pre("save", async function (next) {
  if (!this.codigoObra) {
    const ultimaObra = await this.constructor
      .findOne({ user: this.user })
      .sort("-codigoObra");
    this.codigoObra = ultimaObra ? ultimaObra.codigoObra + 1 : 1;
  }

  if (this.fechaEntrega) {
    const entrega = new Date(this.fechaEntrega);
    this.fechaInicioCortePerfiles = new Date(entrega);
    this.fechaInicioCortePerfiles.setDate(entrega.getDate() - 15);

    this.fechaInicioArmado = new Date(entrega);
    this.fechaInicioArmado.setDate(entrega.getDate() - 10);

    this.fechaEnvidriado = new Date(entrega);
    this.fechaEnvidriado.setDate(entrega.getDate() - 7);

    this.fechaInicioMontaje = new Date(entrega); // mismo día

    this.fechaMedicion = new Date(entrega);
    this.fechaMedicion.setDate(entrega.getDate() - 60);
  }

  next();
});

ObraSchema.index({ user: 1 });

export default mongoose.model("Obra", ObraSchema);
