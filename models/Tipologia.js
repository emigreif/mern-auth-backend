// backend/models/Tipologia.js
import mongoose from "mongoose";

const tipologiaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    ancho: { type: Number, required: true },
    alto: { type: Number, required: true },
    agrupada: { type: Boolean, default: false },
    origenes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tipologia" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

// ➜ Índice compuesto para nombre único POR usuario
tipologiaSchema.index({ user: 1, nombre: 1 }, { unique: true });

export default mongoose.model("Tipologia", tipologiaSchema);
