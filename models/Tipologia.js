import mongoose from "mongoose";

const tipologiaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    ancho: { type: Number, required: true },
    alto: { type: Number, required: true },
    agrupada: { type: Boolean, default: false }, // Indica si es una tipología agrupada
    origenes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tipologia" }], // Guarda las tipologías originales
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Tipologia", tipologiaSchema);
