// models/PerfilGeneral.js
import mongoose from "mongoose";

const perfilGeneralSchema = new mongoose.Schema({
  extrusora: {
    type: String,
    enum: ["Aluar", "Hydro", "Alcemar", "Aluwind", "Flamia MDT", "Rehau", "Munchtek", "Aluplast", "Veratek", "Veka", "Otro"],
    required: true
  },
  linea: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  descripcion: { type: String, required: true },
  largo: { type: Number, required: true }, // Largo en mm
  pesoxmetro: { type: Number, required: true } // Peso en kg/m
});

const PerfilGeneral = mongoose.model("PerfilGeneral", perfilGeneralSchema);
export default PerfilGeneral;
