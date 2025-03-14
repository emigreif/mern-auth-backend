// backend/models/Medicion.js
import mongoose from "mongoose";

/**
 * Cada medición guarda:
 * - la ubicación (piso, identificador, etc.)
 * - la tipología asociada (opcional si se guarda en la ubicación)
 * - ancho/alto relevados
 * - observaciones
 */
const medicionSchema = new mongoose.Schema({
  ubicacion: { type: mongoose.Schema.Types.ObjectId, ref: "Ubicacion", required: true },
  // O bien: tipologia: { type: mongoose.Schema.Types.ObjectId, ref: "Tipologia" },
  
  anchoRelevado: { type: Number, required: true },
  altoRelevado: { type: Number, required: true },
  observaciones: { type: String, trim: true },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Medicion", medicionSchema);
