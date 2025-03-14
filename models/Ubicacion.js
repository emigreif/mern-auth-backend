// backend/models/Ubicacion.js
import mongoose from "mongoose";

/**
 * Cada ubicación se asocia a:
 * - user (dueño)
 * - obra (si quieres enlazar con Obra)
 * - piso
 * - identificador (por ejemplo p1u2 => "piso 1, ubicación 2")
 * - uno o varias tipologías (si quieres permitir más de una)
 *   o un solo campo "tipologia" si la relación es 1:1
 */
const ubicacionSchema = new mongoose.Schema({
  obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", required: true },
  piso: { type: String, trim: true, required: true },
  identificador: { type: String, trim: true, required: true }, // p1u1, p2u3, etc.

  // Puedes enlazar una tipología o varias
  tipologias: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Tipologia" }
  ],

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Ubicacion", ubicacionSchema);
