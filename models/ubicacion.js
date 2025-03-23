// models/ubicacion.js
import mongoose from "mongoose";

/**
 * Cada ubicación se asocia a:
 * - user
 * - obra
 * - piso
 * - identificador
 */
const ubicacionSchema = new mongoose.Schema({
  piso: { type: String, required: true },
  ubicacion: { type: String, required: true },
  obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", required: true }, // 🔁 Relación directa con la obra
 
},
  { timestamps: true }
);

export default mongoose.model("Ubicacion", ubicacionSchema);
