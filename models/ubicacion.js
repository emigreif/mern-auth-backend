// models/ubicacion.js
import mongoose from "mongoose";

const ubicacionSchema = new mongoose.Schema(
  {
    piso: { type: String, required: true },
    ubicacion: { type: String, required: true },
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Ubicacion", ubicacionSchema);
