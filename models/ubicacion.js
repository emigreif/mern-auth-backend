// models/ubicacion.js
import mongoose from "mongoose";

/**
 * Cada ubicación se asocia a:
 * - user
 * - obra
 * - piso
 * - identificador
 * - array de tipologías
 */
const ubicacionSchema = new mongoose.Schema(
  {
    obra: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Obra",
      required: true
    },
    piso: { type: String, trim: true, required: true },
    identificador: { type: String, trim: true, required: true },
    tipologias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tipologia" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Ubicacion", ubicacionSchema);
