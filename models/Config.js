/* // backend/models/Config.js
import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roles: {
    type: [String],
    default: ["Administrador", "Producción", "Ventas"]
  },
  impuestos: [
    {
      nombre: String,
      porcentaje: Number,
    },
  ],
  indicesSaldo: { type: Number, default: 1.05 },
  costoHora: { type: Number, default: 2000 },
}, { timestamps: true });

// ➜ Eliminamos duplicaciones de `user` y añadimos índice
configSchema.index({ user: 1 });

export default mongoose.model('Config', configSchema);
 */

// backend/models/Config.js
import mongoose from "mongoose";

const impuestoSchema = new mongoose.Schema({
  codigo: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  porcentaje: { type: Number, required: true },
});

const indiceSchema = new mongoose.Schema({
  codigo: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  valorActual: { type: Number, default: 0 },
});

const configSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    // Arrays propios para cada usuario. Se precargan con valores de ejemplo
    impuestos: {
      type: [impuestoSchema],
      default: [
        { codigo: "IVA21", descripcion: "IVA al 21%", porcentaje: 21 },
        { codigo: "IVA10", descripcion: "IVA al 10,5%", porcentaje: 10.5 },
        { codigo: "IIBB", descripcion: "Ingresos Brutos", porcentaje: 3 },
      ],
    },
    indicesActualizacion: {
      type: [indiceSchema],
      default: [
        { codigo: "DOLAR_NACION", descripcion: "Dólar Nacion", valorActual: 0 },
        { codigo: "DOLAR_BLUE", descripcion: "Dólar Blue", valorActual: 0 },
        { codigo: "CAC", descripcion: "Índice CAC", valorActual: 0 },
      ],
    },
    // Puedes agregar otros campos de configuración según se requiera (por ejemplo, costoHora, roles, etc.)
  },
  { timestamps: true }
);

export default mongoose.model("Config", configSchema);
