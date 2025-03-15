// models/panol.js
import mongoose from "mongoose";

// Sub-esquema para Herramientas
const herramientaSchema = new mongoose.Schema({
  marca: String,
  modelo: String,
  descripcion: String,
  numeroSerie: String,
  estado: {
    type: String,
    enum: ["en stock", "en obra", "baja"],
    default: "en stock"
  }
});

// Sub-esquema para Perfiles
const perfilSchema = new mongoose.Schema({
  codigo: String,
  descripcion: String,
  tratamiento: String,
  largo: Number,
  cantidad: Number
});

// Sub-esquema para Vidrios
const vidrioSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["simple", "dvh", "tvh", "laminado"],
    default: "simple"
  },
  codigo: String,
  descripcion: String,
  ancho: Number,
  alto: Number,
  cantidad: Number
});

// Sub-esquema para Accesorios
const accesorioSchema = new mongoose.Schema({
  codigo: String,
  descripcion: String,
  color: String,
  cantidad: Number,
  unidad: { type: String, default: "u" }
});

const panolSchema = new mongoose.Schema({
  herramientas: [herramientaSchema],
  perfiles: [perfilSchema],
  vidrios: [vidrioSchema],
  accesorios: [accesorioSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

export default mongoose.model("Panol", panolSchema);
