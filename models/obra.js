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

    // OV: Material confirmado post-venta
    perfilesOV: [
      {
        codigo: String,
        descripcion: String,
        cantidad: { type: Number, min: 0 },
        color: String,
        precio: { type: Number, min: 0 }
      }
    ],
    vidriosOV: [
      {
        descripcion: String,
        ancho: Number,
        alto: Number,
        cantidad: { type: Number, min: 0 },
        tipo: { type: String },
        precio: { type: Number, min: 0 }
      }
    ],
    accesoriosOV: [
      {
        codigo: String,
        descripcion: String,
        color: String,
        cantidad: { type: Number, min: 0 },
        unidad: String,
        tipo: String,
        precio: { type: Number, min: 0 }
      }
    ],
    tipologiasOV: [
      {
        tipo: String,
        descripcion: String,
        base: Number,
        altura: Number,
        cantidad: Number
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

// Pre-save: autogenerar código y fechas relativas
ObraSchema.pre("save", async function (next) {
  if (!this.codigoObra) {
    const ultimaObra = await this.constructor
      .findOne({ user: this.user })
      .sort("-codigoObra");
    this.codigoObra = ultimaObra ? ultimaObra.codigoObra + 1 : 1;
  }

  if (this.fechaEntrega) {
    const entrega = new Date(this.fechaEntrega);
    const offsetDays = (d) => {
      const result = new Date(entrega);
      result.setDate(entrega.getDate() - d);
      return result;
    };
    this.fechaInicioCortePerfiles = offsetDays(15);
    this.fechaInicioArmado = offsetDays(10);
    this.fechaEnvidriado = offsetDays(7);
    this.fechaInicioMontaje = entrega;
    this.fechaMedicion = offsetDays(60);
  }

  next();
});

ObraSchema.index({ user: 1 });

export default mongoose.model("Obra", ObraSchema);
