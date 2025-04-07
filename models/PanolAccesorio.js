import mongoose from "mongoose";

const accesorioPanolSchema = new mongoose.Schema({
  codigo: String,
  descripcion: String,
  color: String,
  cantidad: Number,
  unidad: { type: String, default: "u" },
  tipo: {
    type: String,
    enum: ["accesorios", "herrajes", "tornillos", "bulones", "felpas", "selladores / espuma", "otro"],
    
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  }
});

const AccesorioPanol = mongoose.model("AccesorioPanol", accesorioPanolSchema);
export default AccesorioPanol;
