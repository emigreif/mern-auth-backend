import mongoose from "mongoose";

const ObraSchema = new mongoose.Schema(
  {
    codigoObra: { type: Number, unique: true }, // 🔹 Código secuencial único
    nombre: { type: String, required: true, trim: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
    direccion: { type: String, required: true, trim: true },
    contacto: { type: String, required: true, trim: true },
    mapa: { type: String, trim: true },
    fechaEntrega: { type: Date }, // Opcional
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
    estadoGeneral: { type: String, enum: ["Presupuestada", "En Proceso", "Finalizada"], default: "Presupuestada" }, // 🔹 Estado general
    estado: {
      perfiles: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
      vidrios: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
      accesorios: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
      produccion: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
      medicion: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
      aprobada: { type: String, enum: ["pendiente", "proximo", "cumplido"], default: "pendiente" },
    },

    saldo: { type: String, enum: ["Con saldo a cobrar", "Pagada"], default: "Con saldo a cobrar" },
    observaciones: { type: String, trim: true }, // 🔹 Campo para agregar notas

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// 🔹 **Asignar código automático de obra**
ObraSchema.pre("save", async function (next) {
  if (!this.codigoObra) {
    const ultimaObra = await this.constructor.findOne().sort("-codigoObra");
    this.codigoObra = ultimaObra ? ultimaObra.codigoObra + 1 : 1;
  }
  next();
});

export default mongoose.model("Obra", ObraSchema);
