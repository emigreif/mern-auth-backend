// backend/models/employee.js
import mongoose from "mongoose";

/**
 * Modelo de Empleado
 * Campos:
 *  - nombre, apellido, dni (obligatorios)
 *  - email, telefono, direccion (opcionales)
 *  - puesto, salario (obligatorios)
 *  - fechaIngreso (por defecto Date.now)
 *  - activo (booleano, por defecto true)
 *  - user (ref a 'User', requerido)
 *
 * Índice único: (user + dni)
 * => evita duplicar el mismo dni para un mismo usuario
 */
const EmployeeSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    dni: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    telefono: { type: String, trim: true },
    direccion: { type: String, trim: true },
    puesto: { type: String, required: true, trim: true },
    salario: { type: Number, required: true },
    fechaIngreso: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

// Índice compuesto para dni único POR usuario
EmployeeSchema.index({ user: 1, dni: 1 }, { unique: true });

export default mongoose.model("Employee", EmployeeSchema);
