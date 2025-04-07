import mongoose from "mongoose";

const tipologiaOV = new mongoose.Schema({
  tipo: String,
  descripcion: String,
  base: { type: Number, min: 0 },
  altura: { type: Number, min: 0 },
  cantidad: { type: Number, min: 0 }
}, { _id: false });

export default tipologiaOV;
