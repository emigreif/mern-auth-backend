import mongoose from "mongoose";

const accesorioOV = new mongoose.Schema({
  codigo: String,
  descripcion: String,
  color: String,
  cantidad: { type: Number, min: 0 },
  unidad: { type: String, default: "u" },
  tipo: {
    type: String,
    enum: ["accesorios", "herrajes", "tornillos", "bulones", "felpas", "selladores / espuma", "otro"],
    default: "accesorios"
  }
}, { _id: false });

export default accesorioOV;
