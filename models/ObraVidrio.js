import mongoose from "mongoose";

const vidrioOV = new mongoose.Schema({
  descripcion: String,
  cantidad: { type: Number, min: 0 },
  ancho: { type: Number, min: 0 },
  alto: { type: Number, min: 0 },
  tipologias: [String]
}, { _id: false });

export default vidrioOV;
