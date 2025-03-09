import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    dni: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    telefono: { type: String, trim: true },
    direccion: { type: String, trim: true },
    puesto: { type: String, required: true, trim: true },
    salario: { type: Number, required: true },
    fechaIngreso: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", EmployeeSchema);
