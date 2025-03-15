// models/medicion.js
import mongoose from "mongoose";

/**
 * Cada medición guarda:
 *  - la ubicación (piso, identificador)
 *  - ancho/alto relevados
 *  - observaciones
 *  - user
 */
const medicionSchema = new mongoose.Schema(
  {
    ubicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ubicacion",
      required: true
    },
    anchoRelevado: { type: Number, required: true },
    altoRelevado: { type: Number, required: true },
    observaciones: { type: String, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Medicion", medicionSchema);
