import mongoose from "mongoose";
import perfilOV from "./ObraPerfil.js";
import vidrioOV from "./ObraVidrio.js";
import accesorioOV from "./ObraAccesorio.js";
import tipologiaOV from "./ObraTipologia.js";

const Obra = new mongoose.Schema({
  codigoObra: { type: Number },
  nombre: { type: String, required: true, trim: true },
  cliente: {
    type: mongoose.Types.ObjectId,
    ref: "Cliente",
    required: true
  },
  direccion: { type: String, required: true, trim: true }, // Google Place description
  ubicacion: {
    lat: { type: Number, required: true }, // Coordenadas para el mapa
    lng: { type: Number, required: true }
  },
  contacto: { type: String, required: true, trim: true },
  
  fechaEntrega: { type: Date },
  importeConFactura: { type: Number, default: 0 },
  importeSinFactura: { type: Number, default: 0 },
  importeTotal: { type: Number, default: 0 },
  indiceActualizacionSaldo: { type: Number, default: 0 },

  perfilesOV: [perfilOV],
  vidriosOV: [vidrioOV],
  accesoriosOV: [accesorioOV],
  tipologiasOV: [tipologiaOV],

  fechaInicioCortePerfiles: { type: Date },
  fechaInicioArmado: { type: Date },
  fechaEnvidriado: { type: Date },
  fechaInicioMontaje: { type: Date },
  fechaMedicion: { type: Date },

  ordenProduccionAprobada: { type: Boolean, default: false },
  finalObra: { type: Boolean, default: false },
  estadoGeneral: {
    type: String,
    enum: ["Presupuestada", "En Proceso", "Finalizada"],
    default: "Presupuestada"
  },
  estado: {
    perfiles: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
    vidrios: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
    accesorios: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
    produccion: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
    medicion: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
    aprobada: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" }
  },
  saldo: {
    type: String,
    enum: ["Con saldo a cobrar", "Pagada"],
    default: "Con saldo a cobrar"
  },
  observaciones: { type: String, trim: true },

  user: { type: mongoose.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// Auto-cálculo de fechas
Obra.pre("save", async function (next) {
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

    this.fechaInicioMontaje = new Date(entrega);
    this.fechaInicioMontaje.setDate(entrega.getDate());

    this.fechaMedicion = new Date(entrega);
    this.fechaMedicion.setDate(entrega.getDate() - 60);
  }

  next();
});

Obra.index({ user: 1 });

export default mongoose.model("Obra", Obra);
