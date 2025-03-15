// models/cliente.js
import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    telefono: { type: String, trim: true },
    direccion: {
      calle: { type: String, trim: true },
      ciudad: { type: String, trim: true }
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

// Índice opcional si deseas buscar por user + email
clienteSchema.index({ user: 1 });

export default mongoose.model("Cliente", clienteSchema);
