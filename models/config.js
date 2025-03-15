// models/config.js
import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    impuestos: [
      {
        codigo: String,
        descripcion: String,
        porcentaje: Number
      }
    ],
    indicesActualizacion: [
      {
        codigo: String,
        descripcion: String,
        valorActual: Number
      }
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

configSchema.index({ user: 1 });

export default mongoose.model("Config", configSchema);
