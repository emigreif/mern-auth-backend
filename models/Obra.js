import mongoose from "mongoose";

const ObraSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
    direccion: { type: String, required: true, trim: true },
    contacto: { type: String, required: true, trim: true },
    mapa: { type: String, trim: true },
    fechaEntrega: { type: Date }, // Ahora es opcional
    importeConFactura: { type: Number, default: 0 },
    importeSinFactura: { type: Number, default: 0 },
    importeTotal: { type: Number, default: 0 },
    indiceActualizacionSaldo: { type: Number, default: 0 },

    perfilesPresupuesto: [
      {
        codigo: { type: String },
        descripcion: { type: String },
        cantidad: { type: Number, min: 0 },
        precio: { type: Number, min: 0 },
      },
    ],
    vidriosPresupuesto: [
      {
        codigo: { type: String },
        descripcion: { type: String },
        cantidad: { type: Number, min: 0 },
        precio: { type: Number, min: 0 },
      },
    ],
    accesoriosPresupuesto: [
      {
        codigo: { type: String },
        descripcion: { type: String },
        cantidad: { type: Number, min: 0 },
        precio: { type: Number, min: 0 },
      },
    ],

    // Fechas calculadas
    fechaInicioCortePerfiles: { type: Date },
    fechaInicioArmado: { type: Date },
    fechaEnvidriado: { type: Date },
    fechaInicioMontaje: { type: Date },
    fechaMedicion: { type: Date },

    // Estado de la obra
    ordenProduccionAprobada: { type: Boolean, default: false },
    finalObra: { type: Boolean, default: false },
    estado: {
      perfiles: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
      vidrios: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
      accesorios: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
      produccion: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
      medicion: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
      aprobada: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
    },

    saldo: { type: String, enum: ["Con saldo a cobrar", "Pagada"], default: "Con saldo a cobrar" },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// 🔍 **Hook antes de guardar para calcular fechas**
ObraSchema.pre("save", function (next) {
  if (this.isModified("fechaEntrega") || this.isNew) {
    const fechaEntrega = this.fechaEntrega;

    if (fechaEntrega) {
      const fechaBase = new Date(fechaEntrega);

      this.fechaInicioCortePerfiles = new Date(fechaBase.setDate(fechaBase.getDate() - 30));
      this.fechaInicioArmado = new Date(fechaBase.setDate(fechaBase.getDate() + 5));
      this.fechaEnvidriado = new Date(fechaBase.setDate(fechaBase.getDate() + 5));
      this.fechaInicioMontaje = this.fechaInicioMontaje || fechaEntrega;
      this.fechaMedicion = new Date(fechaBase.setDate(fechaBase.getDate() - 25));
    }
  }
  next();
});

export default mongoose.model("Obra", ObraSchema);
