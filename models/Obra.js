// models/obra.js
import mongoose from "mongoose";

const ObraSchema = new mongoose.Schema(
  {
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

    perfilesPresupuesto: [
      {
        codigo: String,
        descripcion: String,
        cantidad: { type: Number, min: 0 },
        precio: { type: Number, min: 0 }
      }
    ],
    vidriosPresupuesto: [
      {
        codigo: String,
        descripcion: String,
        cantidad: { type: Number, min: 0 },
        precio: { type: Number, min: 0 }
      }
    ],
    accesoriosPresupuesto: [
      {
        codigo: String,
        descripcion: String,
        cantidad: { type: Number, min: 0 },
        precio: { type: Number, min: 0 }
      }
    ],

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
  },
  { timestamps: true }
);

// pre("save"): si no existe codigoObra, buscar el último y sumarle 1
ObraSchema.pre("save", async function (next) {
  if (!this.codigoObra) {
    const ultimaObra = await this.constructor
      .findOne({ user: this.user })
      .sort("-codigoObra");
    this.codigoObra = ultimaObra ? ultimaObra.codigoObra + 1 : 1;
  }
  next();
});

// Índice para búsquedas
ObraSchema.index({ user: 1 });

export default mongoose.model("Obra", ObraSchema);
