// backend/models/Perfil.js
import mongoose from "mongoose";

const PerfilSchema = new mongoose.Schema({
  // Agregas user para que cada usuario pueda tener sus propios perfiles
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // El nombre del perfil (solo será único para ese user)
  nombre: { type: String, required: true, trim: true },

  permisos: {
    dashboard: { type: Boolean, default: false },
    obras: { type: Boolean, default: false },
    clientes: { type: Boolean, default: false },
    presupuestos: { type: Boolean, default: false },
    proveedores: { type: Boolean, default: false },
    contabilidad: { type: Boolean, default: false },
    reportes: { type: Boolean, default: false },
    nomina: { type: Boolean, default: false },
  },
});

// Índice compuesto para que el par (user + nombre) sea único, 
// pero distintos usuarios pueden tener el mismo nombre de perfil
PerfilSchema.index({ user: 1, nombre: 1 }, { unique: true });

export default mongoose.model("Perfil", PerfilSchema);
