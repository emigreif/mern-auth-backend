import mongoose from "mongoose";

const perfilOV = new mongoose.Schema({
  codigo: String,
  descripcion: String,
  cantidad: { type: Number, min: 0 },
  largo: { type: Number, min: 0 },
  pesoxmetro: { type: Number, min: 0 },
  color: String
}, { _id: false });

export default perfilOV;
