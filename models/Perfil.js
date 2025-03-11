// backend/models/Perfil.js
import mongoose from "mongoose";

const PerfilSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // <-- sin unique
  password: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  permisos: {
    dashboard: { type: Boolean, default: false },
    obras: { type: Boolean, default: false },
    clientes: { type: Boolean, default: false },
    presupuestos: { type: Boolean, default: false },
    proveedores: { type: Boolean, default: false },
    contabilidad: { type: Boolean, default: false },
    reportes: { type: Boolean, default: false },
    nomina: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
  },
}, { timestamps: true });

// (Opcional) índice único para (userId + nombre):
PerfilSchema.index({ userId: 1, nombre: 1 }, { unique: true });

export default mongoose.model("Perfil", PerfilSchema);