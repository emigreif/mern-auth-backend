 import mongoose from "mongoose";

const tipologiaSchema =  new mongoose.Schema(
  {
    tipo: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    base: { type: Number, required: true },
    altura: { type: Number, required: true },
    cantidad: { type: Number, default: 1 },
    agrupada: { type: Boolean, default: false },
    origenes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tipologia" }],
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", required: true }, // ✅ NUEVO
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Tipologia", tipologiaSchema);
