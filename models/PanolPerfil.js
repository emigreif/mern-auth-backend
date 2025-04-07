import mongoose from "mongoose";

const perfilPanolSchema = new mongoose.Schema({
  codigo: String,
  cantidad: Number,
  descripcion: String,
  largo: Number,
  pesoxmetro: Number,
  color: String,
  
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const PerfilPanol = mongoose.model("PerfilPanol", perfilPanolSchema);
export default PerfilPanol;
