/* // backend/models/Plan.js
import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precioMensual: { type: Number, required: true },
    cantidadUsuarios: { type: Number, required: true },
    // Por ejemplo, para habilitar/deshabilitar planes
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", PlanSchema);
  */