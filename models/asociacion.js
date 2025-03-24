// models/asociacion.js
import mongoose from "mongoose";

const asociacionSchema = new mongoose.Schema(
  {
    tipologia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tipologia",
      required: true,
    },
    ubicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ubicacion",
      required: true,
      unique: true, // Una única tipología por ubicación
    },
    obra: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Obra",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Asociacion", asociacionSchema);
