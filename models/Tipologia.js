// backend/models/Tipologia.js
import mongoose from "mongoose";

const tipologiaSchema = new mongoose.Schema(
  {
    codigo: { type: String, trim: true }, // Campo opcional si quieres un "código" extra
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    ancho: { type: Number, required: true },
    alto: { type: Number, required: true },
    cantidad: { type: Number, default: 1 }, // Cantidad de tipologías "idénticas"
    
    // Si es una tipología agrupada
    agrupada: { type: Boolean, default: false },
    origenes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tipologia" }],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Tipologia", tipologiaSchema);
