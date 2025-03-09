import mongoose from "mongoose";

const PerfilSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true }, // 🔹 Nombre del perfil (Ej: "Supervisor", "Empleado")
  permisos: {
    dashboard: { type: Boolean, default: false },
    obras: { type: Boolean, default: false },
    clientes: { type: Boolean, default: false },
    presupuestos: { type: Boolean, default: false },
    proveedores: { type: Boolean, default: false },
    contabilidad: { type: Boolean, default: false },
    reportes: { type: Boolean, default: false },
    nomina: { type: Boolean, default: false }, // 🔹 Nuevo módulo de gestión de personal
  },
});

export default mongoose.model("Perfil", PerfilSchema);
