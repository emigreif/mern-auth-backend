import mongoose from "mongoose";

const tipologiaSchema = new mongoose.Schema(
  {
    tipo: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    base: { type: Number, required: true },
    altura: { type: Number, required: true },
    cantidad: { type: Number, default: 1 },
    obra: { type: mongoose.Schema.Types.ObjectId, ref: "Obra", required: true }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Tipologia", tipologiaSchema);
