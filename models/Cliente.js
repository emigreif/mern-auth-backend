// backend/models/Cliente.js
import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
  {
    tipoCliente: { type: String, enum: ["particular", "empresa"], required: true },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    empresa: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    telefono: { type: String, required: true, trim: true },
    direccion: {
      calle: { type: String, required: true, trim: true },
      ciudad: { type: String, required: true, trim: true },
    },
    obras: [{ type: mongoose.Schema.Types.ObjectId, ref: "Obra" }],
    notas: { type: String, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// ➜ Índice compuesto para que `email` sea único POR usuario (y no global)
clienteSchema.index({ user: 1, email: 1 }, { unique: true });

export default mongoose.model("Cliente", clienteSchema);
